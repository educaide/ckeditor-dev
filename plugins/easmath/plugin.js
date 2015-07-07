/*
 * based off CKEditor's placeholder plugin
 */

(function () {
  'use strict';

  var DefaultMathText = '(insert math)';

  // returns span.math with given text
  // returns null if text is empty
  function createMathSpan(document, text) {
    if (!text || text.length == 0) {
      return null;
    }

    var mathSpan = document.createElement('span', {
      attributes: {
        'data-easmath': 1,
        'class': 'math'
      }
    });
    mathSpan.appendText(text);
    return mathSpan;
  }

  function ToggleMathCommand() {
    this.name = 'toggleMath';
  }

  ToggleMathCommand.prototype = {
    exec: function(editor) {
      // ignore toggles if user has selected stuff out-of-bounds of a math span.
      // gotta do the ignore here, since we can't enable/disable math button
      // on selection change.
      // TODO consider writing a plugin that updates command enable states
      // every half second or so, similar to Acces.
      var selection = editor.getSelection();
      var range = selection.getRanges()[0];
      if (range.startContainer.$ != range.endContainer.$ && selectionContainsElement(selection, 'span', 'math')) {
        console.log('cannot toggle math: selection spans math element');
        return;
      }

      var existingMath = CKEDITOR.plugins.easmath.getSelectedMath(editor);
      editor.fire('saveSnapshot');
      if (existingMath) {
        removeMath(editor, existingMath);
      }
      else {
        insertMath(editor, selection, range);
      }
      editor.fire('saveSnapshot');
    }
  };

  function insertMath(editor, selection, range) {
    if (range.collapsed) {
      // nothing selected; insert default math span, with trailing space if necessary
      var isAtEnd = range.checkEndOfBlock();
      var element = createMathSpan(editor.document, DefaultMathText);
      editor.insertElement(element);
      if (isAtEnd) {
        editor.insertText(' ');
      }
    }
    else if (/(\r|\n)/.test(selection.getSelectedText())) {
      // multi-line selection; replace with math button
      insertMathButton(editor, selection, range);
    }
    else {
      // inline selection; replace with math span
      var element = createMathSpan(editor.document, selection.getSelectedText());
      editor.insertElement(element);
    }
  }

  function insertMathButton(editor, selection, range) {
    var tex = selection.getSelectedText();
    var previewString = getMathPreview(tex);
    var mathButton = getButtonElement(editor.document, previewString, tex, 'mathbutton');
    editor.insertElement(mathButton);
  }

  // TODO this is probably useful enough to be moved to a utilities namespace
  // accessible by other plugins
  function getButtonElement(document, previewString, tex, buttonClass) {
    if (!buttonClass || buttonClass.length == 0) {
      buttonClass = 'unknown';
    }

    var html = '<span class="' + buttonClass.toLowerCase() + '" contenteditable="false" unselectable="on" data-easmath="1">' +
                 '<span class="button" contenteditable="false" unselectable="on">' + previewString + '</span>' +
                 '<textarea class="hidden">' + tex + '</textarea>' +
               '</span>';

    return CKEDITOR.dom.element.createFromHtml(html, document);
  }

  function getMathPreview(tex) {
    var preview = tex;
    if (!tex || tex.length == 0) {
      preview = DefaultMathText;
    }

    var newlineIndex = preview.indexOf('\n');
    if (newlineIndex == -1) {
      newlineIndex = preview.indexOf('\r');
    }
    if (newlineIndex >= 0) {
      preview = preview.substring(0, Math.min(60, newlineIndex));
    }

    if (preview.length > 60) {
      preview = preview.substring(0, 60);
    }

    return preview + '...';
  }

  function removeMath(editor, existingMath) {
    var selection = editor.getSelection();
    var range = selection.getRanges()[0];
    var existingMathTeX = existingMath.getText();

    if (existingMathTeX == DefaultMathText) {
      // user hasn't changed default text
      existingMath.remove();
    }
    else if (range.collapsed) {
      // nothing is selected; unmathify the entire span
      var unmathElement = CKEDITOR.dom.element.createFromHtml(existingMath.getHtml());
      unmathElement.replace(existingMath);

      // TODO test on IE and see if a simple replace call isn't enough.
      // if it isn't, then use the following code (this prolly applies to
      // the DOM manipulation in the 'partial unmathify' block as well
      /*
      if (CKEDITOR.env.ie) {
        unmathElement.insertAfter(existingMath);
        // Some time is required for IE before the element is removed.
        setTimeout(function() {
          existingMath.remove();
          unmathElement.focus();
        }, 10);
      }
      else {
        unmathElement.replace(existingMath);
      }
      */
    }
    else {
      // break up selected text into three things:
      //   leading math span
      //   seleted text (NOT math formatted)
      //   trailing math span
      var leadingText  = existingMathTeX.substring(0, range.startOffset);
      var selectedText = existingMathTeX.substring(range.startOffset, range.endOffset);
      var trailingText = existingMathTeX.substring(range.endOffset, existingMathTeX.length);
      console.log("[" + leadingText + "][" + selectedText + "][" + trailingText + "]");

      var leadingMath = createMathSpan(editor.document, leadingText);
      var trailingMath = createMathSpan(editor.document, trailingText);
      selectedText = new CKEDITOR.dom.text(selectedText);

      if (leadingMath) {
        leadingMath.replace(existingMath);
        selectedText.insertAfter(leadingMath);
      }
      else {
        selectedText.replace(existingMath);
      }
      if (trailingMath) {
        trailingMath.insertAfter(selectedText);
      }
    }
  }

  // detect when user presses enter within an inline math span. move cursor to outside
  // of span, inserting a space if necessary.
  function onKey(event) {
    if (event.data.keyCode != 13) {
      return;
    }

    var mathNode = CKEDITOR.plugins.easmath.getSelectedMath(event.editor);
    if (mathNode == null) {
      return;
    }

    event.cancel();
    if (!mathNode.getNext()) {
      var spaceText = new CKEDITOR.dom.text(' ');
      spaceText.insertAfter(mathNode);
      console.log('added space');
    }

    // move cursor to outside of math span
    // BUG things seem to work fine on firefox, but on chrome the cursor acts a little weird.
    // cursor is moved outside, user can type, but when user presses left arrow, cursor jumps
    // back to end of math span instead of one character to the left.
    var range = new CKEDITOR.dom.range(event.editor);
    range.moveToPosition(mathNode.getNext(), CKEDITOR.POSITION_AFTER_START);
    var selection = new CKEDITOR.dom.selection(event.editor.document);
    selection.selectRanges([range]);
    console.log('moved selection');
  }

  function onSelectionChange(event) {
    var command = event.editor.getCommand('toggleMath');
    var selectedMath = CKEDITOR.plugins.easmath.getSelectedMath(event.editor);
    command.setState(selectedMath ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);

    // ideally, at this point we would check to see if the selection contains
    // a math span. if it does, disable the toggleMath button, else enable it.
    // but we can't rely on selectionChange to be fired everytime the selection
    // is manipulated either by mouse or shift-arrows (see http://dev.ckeditor.com/ticket/6443)
    // so instead, we do the check in toggleMathCommand.exec.
  }

  // TODO this is probably useful enough to be moved to a utilities namespace
  // accessible by other plugins
  function selectionContainsElement(selection, tagName, className) {
    console.log('check selection contains math');
    var range = selection.getRanges()[0];
    if (range.collapsed) {
      console.log('  collapsed');
      return false;
    }

    // extract doc fragment of range, insert it into a temp div, then
    // do a regex search on the innerHTML of the temp div

    // the upcoming call to cloneContents can end up altering the current selection.
    // preserve it and reselect after testing is done.
    var originalRange = range.clone();

    var classPattern = "[^c>]*class=[\\\"\']?" + className + "[\\\"\']?";
    var fullPattern = new RegExp('<' + tagName + classPattern, 'i');
    var tempDiv = new CKEDITOR.dom.element('div');
    range.cloneContents().appendTo(tempDiv);
    var match = fullPattern.test(tempDiv.$.innerHTML);
    tempDiv.remove();

    selection.selectRanges([originalRange]);

    return match;
  }

  CKEDITOR.plugins.add('easmath', {
    requires: 'dialog',
    icons: 'easmath',

    init: function (editor) {
      editor.addCommand('toggleMath', new ToggleMathCommand());
      editor.addCommand('editMultiLineMath', new CKEDITOR.dialogCommand('editMultiLineMath'));

      editor.ui.addButton('EASMath', {
        label: 'Insert Math',
        command: 'toggleMath',
        icon: 'easmath',
        onRender: function() {
          var command = editor.getCommand('toggleMath');
          command.on('state', function() { this.setState(command.state); }, this);
        }
      });

      editor.on('doubleclick', function (evt) {
        var mathElem = CKEDITOR.plugins.easmath.getSelectedMath(editor);
        if (mathElem && mathElem.hasClass('mathbutton')) {
          evt.data.dialog = 'editMultiLineMath';
        }
      });

      editor.on('key', CKEDITOR.tools.bind(onKey, this));
      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, this));

      /* necessary? add a data-resizable attribute set to true, handle everything in easbehaviors
      editor.on('contentDom', function () {
        editor.document.getBody().on('resizestart', function (evt) {
          if (editor.getSelection().getSelectedElement().data('easmath')) evt.data.preventDefault();
        });
      });
      */

      CKEDITOR.dialog.add('editMultiLineMath', this.path + 'dialog.js');
    }
  });

  CKEDITOR.plugins.easmath = {
    getSelectedMath: function (editor) {
      var range = editor.getSelection().getRanges()[0];
      range.shrink(CKEDITOR.SHRINK_TEXT);
      var node = range.startContainer;
      while (node && !(node.type == CKEDITOR.NODE_ELEMENT && node.data('easmath'))) {
        node = node.getParent();
      }
      if (node == null) {
        console.log('NO selected math');
      }
      return node;
    },

    updateMathButton: function (buttonElement, mathTeX) {
      mathTeX = mathTeX.trim();

      if (mathTeX.length == 0) {
        // empty TeX; delete math element
        buttonElement.remove();
      }
      else if (mathTeX.indexOf('\r') == -1 && mathTeX.indexOf('\n') == -1) {
        // single-line TeX; replace with inline span
        var inlineMath = createMathSpan(buttonElement.getDocument(), mathTeX);
        inlineMath.replace(buttonElement);
      }
      else {
        // update preview text, textarea text
        var previewString = getMathPreview(mathTeX);
        buttonElement.getElementsByTag('span').getItem(0).setText(previewString);

        var textareaElem = buttonElement.getElementsByTag('textarea').getItem(0);
        // cannot call textAreaElem.setText because it converts linebreaks into <br/>
        // tags, which are useless inside a textarea element. instead, rely
        // on manipulating native js DOM element.
        textareaElem.$.textContent = mathTeX;
      }
    }
  };


})();

