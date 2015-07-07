(function() {
  'use strict';

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function getEasBlockElem(editor, elemClassName)
  {
    if (elemClassName == null)
      return null;

    var selection = editor.getSelection(),
      startElement = selection && selection.getStartElement(),
      blockElem = startElement && startElement.getAscendant('div', 1);

    var elementIs = blockElem && blockElem.getAttribute('class').indexOf(elemClassName) !== -1;

    if (elementIs)
      return blockElem;

    return null;
  }

  function deleteEasBlockElem(editor, elemClassName) {
    var blockElem = getEasBlockElem(editor, elemClassName);
    if (blockElem == null)
      return;

    blockElem.remove();
  }


  var insertIconDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      // don't serialize property values equal to the defaults
      if ((properties.sizeMode == 'scale' && properties.sizeValue == 1000) ||
          (properties.sizeMode == 'fixed' && properties.sizeValue == '0.5in')) {
        delete properties.sizeMode;
        delete properties.sizeValue;
      }
      if (properties.rotation == 0) {
        delete properties.rotation;
      }
      if (properties.alignment == 'none') {
        delete properties.alignment;
      }

      if (properties.style){

      }
      // convert property values into img attributes
      var imageAttributes = {
        title: 'Icon',
        'class': 'fonticon',
        // hack! fix rendering soon.
        // src: '/thumbnails?type=icon&' + Object.toQueryString(properties),
        //src: '/images/spinner.gif',
        src: '/images/icons/' + properties.group + "_" + pad(properties.index,3) +  ".png",
        fontname: properties.group,
        iconindex: properties.index
      };
      if (properties.rotation) {
        imageAttributes['data-eas-rotate'] = properties.rotation;
      }
      if (properties.alignment) {
        imageAttributes['data-eas-align'] = properties.alignment;
      }

      var width = null;
      if (properties.sizeMode == 'scale') {
        imageAttributes['data-eas-scale'] = properties.sizeValue;
        width = properties.sizeValue + "%";
      }
      else if (properties.sizeMode == 'fixed') {
        imageAttributes['data-eas-size'] = properties.sizeValue;
        width = properties.sizeValue;
      }

      /* Implemented icon sizing in the editor. But we need range checking first.
      if (width){
        var style = "width: " + width + ";";
        imageAttributes['style'] = style;
      }*/

      var element = editor.document.createElement('img', { attributes: imageAttributes });
      editor.insertElement(element);
    }
  };

  var insertSpecialDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      var entityRef = properties.codepoint.startsWith('0x') ? properties.codepoint.substring(1) : properties.codepoint;
      editor.insertHtml('&#' + entityRef + ';');
    }
  };

  var insertSpaceDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      editor.fire('updateSnapshot');
      if (properties.blank) {
        var element = editor.document.createElement('span', {
          attributes: {
            contentEditable: 'false',
            unselectable: 'on',
            'class': 'texblank ' + properties.blank
          }
        });

        // we need text inside the element (and not just spaces) so cursor
        // behaves properly around it
        element.setText('bl');
        editor.insertElement(element);
      }
      else if (properties.space || properties.paragraph) {
        var html = '';
        switch(properties.space || properties.paragraph) {
          case 'nonBreaking' : html = '&nbsp;'; break;
          case 'thin'        : html = '&#8201;'; break;
          case 'en'          : html = '&#8194;'; break;
          case 'em'          : html = '&#8195;'; break;
          case 'null'        : html = '&#8205;'; break;

          case 'leaveVMode' : html = '&#xE236;'; break;
          case 'noIndent'   : html = '&#xE237;'; break;
          case 'indent'     : html = '&#xE238;'; break;
          case 'allowBreak' : html = '&#xE234;'; break;
          case 'noBreak'    : html = '&#xE235;'; break;
        }

        if (html != '') {
          editor.insertHtml(html);
        }
      }
      else if (properties.skip) {
        var isHorizontal = properties.skip.type == 'horizontal';
        var element = editor.document.createElement(isHorizontal ? 'span' : 'div', {
          attributes: {
            contentEditable: 'false',
            unselectable: 'on',
            'class': 'texspace ' + properties.skip.type[0] + 'space',
            size: properties.skip.size,
            style: (isHorizontal ? 'width: ' : 'height: ') + properties.skip.size
          }
        });
        if (!isHorizontal) {
          element.setAttribute('data-eas-iswksp', properties.skip.collapsible);
          //element.addClass('wall');
        }

        // we need text inside the element (and not just spaces) so cursor
        // behaves properly around it
        element.setText('bl');
        editor.insertElement(element);

        // add leading/trailing paragraphs to vertical skips
        if (!isHorizontal) {
          var sibling = element.getPrevious();
          if (!sibling || sibling.$.tagName != "P") {
            CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertBefore(element);
          }
          sibling = element.getNext();
          if (!sibling || sibling.$.tagName != "P") {
            CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertAfter(element);
          }
        }
      }
    }
  };

  // Override Image.equals method so that an undo snapshot isn't generated for
  // changes related to geom character capturing
  function onInstanceReady(editor) {
    var pattern = /<span class="capture">(.*?)<\/span>/gi;

    editor.on('getSnapshot', function(evt) {
      if (evt.data.match(pattern)) {
        console.log('undo tweaking');
      }

      evt.data = evt.data.replace(pattern, '$1');
    });
  }

  // originally from http://snipplr.com/view/19815/walking-the-dom/
  var walkTheDom = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
      // save nextSibling in case func ends up modifying/removing node
      var nextSibling = node.nextSibling;
      walk(node, func);
      node = nextSibling;
    }
  };

  // deletes any capture spans within bodyElement.
  // returns object { capturesDelete: bool, newRange: translated selection range }
  function deleteExistingCaptures(editor, bodyElement, currentSelection) {
    var capturesDeleted = false;
    var ranges = null
    if (currentSelection)
      ranges = currentSelection.getRanges();

    var newRange = ranges != null && ranges.length != 0 ? ranges[0].clone() : null;
    if (newRange == null) {
      newRange = new CKEDITOR.dom.range(editor.document);
      newRange.selectNodeContents( editor.document.getBody() );
    }

    walkTheDom(bodyElement, function(node) {
      if (!(node.nodeType == CKEDITOR.NODE_ELEMENT && node.nodeName.toLowerCase() == 'span' &&
           node.attributes && node.attributes['class'] && node.attributes['class'].value.match(/\bcapture\b/))) {
        return;
      }

      capturesDeleted = true;
      while (node.firstChild) {
        node.parentNode.insertBefore(node.firstChild, node);
      }
      node.parentNode.removeChild(node);
    });

    if (capturesDeleted && newRange != null) {
      // update selection range to take into account DOM manipulation from deleting captures
      console.log('restoring selection (after clearing)');
      while (newRange.startContainer.$.previousSibling && newRange.startContainer.$.previousSibling.nodeType == CKEDITOR.NODE_TEXT) {
        newRange.startContainer = newRange.startContainer.getPrevious();
        newRange.startOffset += newRange.startContainer.$.textContent.length;
      }

      while (newRange.endContainer.$.previousSibling && newRange.endContainer.$.previousSibling.nodeType == CKEDITOR.NODE_TEXT) {
        newRange.endContainer = newRange.endContainer.getPrevious();
        newRange.endOffset += newRange.endContainer.$.textContent.length;
      }
    }
    bodyElement.normalize();

    return { capturesDeleted: capturesDeleted, newRange: newRange };
  }

  function updateCaptures(editor) {
    var bodyElement = editor.document.getBody().$;
    var selection = editor.getSelection();
    var deleteInfo = deleteExistingCaptures(editor, bodyElement, selection);
    var newRange = deleteInfo.newRange;

    if (newRange == null) {
      newRange = new CKEDITOR.dom.range(editor.document);
      newRange.selectNodeContents( editor.document.getBody() );
    }

    // scan all text nodes and capture eligible letters next to geom characters
    var capturesCreated = false;
    walkTheDom(bodyElement, function(node) {
      if (node.nodeType != CKEDITOR.NODE_TEXT) {
        return;
      }

      var nodeContainsSelectionStart = node == newRange.startContainer.$;
      var nodeContainsSelectionEnd = node == newRange.endContainer.$;

      var captureEntities = ['\uE110','\uE111','\uE112','\uE113',
                             '\uE120','\uE121','\uE122','\uE123',
                             '\uE130','\uE131','\uE132','\uE133',
                             '\uE140','\uE141','\uE142','\uE143','\uE144','\uE145'
                            ]
      // break up this text node into a series:
      // [  blah blah ENTITYfoo blah ENTITYbar blah]
      // becomes
      // [  blah blah ENTITY][<s>foo</s>][ blah ENTITY][<s>bar</s>][ blah]
      //    (leading)         (capture)    (leading)     (capture)   (trailing)
      var pattern = new RegExp("(" + captureEntities.join("|") + ")(([A-Z]'?)+)", 'g');

      // old pattern without resizing, BUG also does not recognize A'B', only AB'.
      //var pattern = new RegExp("(\uE110|\uE111|\uE112|\uE113)([A-Z]+'?)", 'g');
      var replacementNodes = new Array();

      var start = 0;
      var match = pattern.exec(node.textContent);
      while (match) {
        capturesCreated = true;

        var capturedText = match[2];
        var size = getCapturedSize(capturedText);

        var leadingString = node.textContent.substring(start, match.index + 1);
        var entity = leadingString.substring(leadingString.length - 1);
        leadingString = leadingString.substring(0, leadingString.length - 1) + getEntityForSize(entity, size);

        var leadingTextNode = editor.document.$.createTextNode(leadingString);
        replacementNodes.push(leadingTextNode);

        var capturedSpan = editor.document.$.createElement('span');
        capturedSpan.setAttribute('class', 'capture');
        capturedSpan.textContent = capturedText;
        replacementNodes.push(capturedSpan);

        start = pattern.lastIndex;
        match = pattern.exec(node.textContent);
      }

      if (replacementNodes.length > 0) {
        var trailingText = editor.document.$.createTextNode(node.textContent.substring(start));
        replacementNodes.push(trailingText);

        // calculate new selection endpoints amongst replacement nodes
        var currentIndex = 0;
        var newStartFound = false;
        var newEndFound = false;
        if (nodeContainsSelectionStart || nodeContainsSelectionEnd) {
          console.log('searching for selection endpoints inside replacement nodes...');
          for (var i = 0; i < replacementNodes.length; i++) {
            // at this point, replacementNodes contains only text nodes OR span nodes with a child text node.
            // make sure we're dealing with the text nodes, only.
            var replacementNode = replacementNodes[i];
            var textNode = replacementNode.nodeType == CKEDITOR.NODE_TEXT ? replacementNode : replacementNode.childNodes[0];
            if (nodeContainsSelectionStart && !newStartFound && currentIndex + textNode.textContent.length >= newRange.startOffset) {
              console.log('  start selection found');
              newRange.setStart(new CKEDITOR.dom.node(textNode), newRange.startOffset - currentIndex);
              newStartFound = true;
            }
            if (nodeContainsSelectionEnd && !newEndFound && currentIndex + textNode.textContent.length >= newRange.endOffset) {
              console.log('  end selection found');
              newRange.setEnd(new CKEDITOR.dom.node(textNode), newRange.endOffset - currentIndex);
              newEndFound = true;
            }
            currentIndex += textNode.textContent.length;
          }
        }

        // replace this text node with the series of nodes built above
        for (var i = 0; i < replacementNodes.length; i++) {
          node.parentNode.insertBefore(replacementNodes[i], node);
        }
        node.parentNode.removeChild(node);
      }
    });

    if (deleteInfo.capturesDeleted || capturesCreated) {
      // HACK CKEditor sprinkles in zero-width spaces as placeholders. it messes with
      // our custom selection restoration code. this works around it.
      if (newRange.collapsed && newRange.startContainer.type == CKEDITOR.NODE_TEXT &&
          newRange.startContainer.$.textContent.match(/\u200b/)) {
        console.log('selection tweak');
        newRange.startOffset = Math.max(0, newRange.startContainer.$.textContent.length - 1);
        newRange.endOffset = newRange.startOffset;
      }

      // This shit don't work motherfucker
      //newRange.select();
    }
  }

  var segSizes = ['\uE110','\uE111','\uE112','\uE113'];
  var raySizes = ['\uE120','\uE121','\uE122','\uE123'];
  var linSizes = ['\uE130','\uE131','\uE132','\uE133'];
  var arcSizes = ['\uE140','\uE141','\uE142','\uE143','\uE144','\uE145'];

  var sizedEntities = [segSizes, raySizes, linSizes, arcSizes];
  var charSizes = {};
  charSizes['\''] = 0.333;
  charSizes['A']  = 0.611;
  charSizes['B']  = 0.611;
  charSizes['C']  = 0.667;
  charSizes['D']  = 0.722;
  charSizes['E']  = 0.604;
  charSizes['F']  = 0.611;
  charSizes['G']  = 0.722;
  charSizes['H']  = 0.722;
  charSizes['I']  = 0.339;
  charSizes['J']  = 0.444;
  charSizes['K']  = 0.652;
  charSizes['L']  = 0.556;
  charSizes['M']  = 0.828;
  charSizes['N']  = 0.657;
  charSizes['O']  = 0.722;
  charSizes['P']  = 0.603;
  charSizes['Q']  = 0.722;
  charSizes['R']  = 0.616;
  charSizes['S']  = 0.5;
  charSizes['T']  = 0.556;
  charSizes['U']  = 0.722;
  charSizes['V']  = 0.611;
  charSizes['W']  = 0.833;
  charSizes['X']  = 0.611;
  charSizes['Y']  = 0.556;
  charSizes['Z']  = 0.556;

  var entitySizeRanges = buildEntityCaptureRanges();

  function buildEntityCaptureRanges() {
    var min = charSizes['I'] * 2;
    var max = charSizes['W'] * 3;
    var step = (max - min) / 6;
    var sizeRanges = [];
    for(var i = 0; i < 6; i ++)
      sizeRanges.push(min + (step * (i+0.5)));

    return sizeRanges;
  }

  function getCapturedSize(text) {
    if (text == null)
      return 0;

    var total = 0;
    for(var i = 0; i < text.length; i++)
    {
      var character = text.charAt(i);
      if (charSizes.hasOwnProperty(character.toString()))
      {
        //alert("char weight found for: " + character)
        total += charSizes[character];
      }
      else
        total += 0.616;
    }

    return total;
  }

  function getEntityForSize(entity, size) {
    var curSizes = getSizesForEntity(entity);
    if (curSizes == null)
      return entity;

    for(var i = 0; i < curSizes.length; i++)
    {
      if (size < entitySizeRanges[i])
      {
        // alert(curSizes[i]);
        return curSizes[i];
      }
    }

    return curSizes[curSizes.length-1];
  }

  function getSizesForEntity(entity) {
      for(var i = 0; i < sizedEntities.length; i++)
      {
        var sizes = sizedEntities[i];
        for(var j = 0; j < sizes.length; j++)
        {
          if (sizes[j] == entity)
            return sizes;
        }
      }

      return null;
  }

  // register the plugin
  CKEDITOR.plugins.add('easspecials', {
    requires: 'iframedialog,menubutton',
    icons: 'easspecials',

    init: function(editor) {
      var pluginName = 'easspecials';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      var menuGroup = 'easspecials';
      editor.addMenuGroup(menuGroup);

      var uiMenuItems = {};
      uiMenuItems.space = {
        label: 'Blanks and Misc.',
        group: menuGroup,
        command: 'insertspace',
        dialog: {
          // The tabs on this page had sizing issues on IE. (wrapping to 2 lines when other browsers showed 1 line)
          // Be sure to test IE if the width is changed.
          width: 460,
          height: 320,
          onContentLoaded: null,
          properties: insertSpaceDialogProperties
        }
      };
      uiMenuItems.icon = {
        label: 'Icons',
        group: menuGroup,
        command: 'inserticon',
        dialog: {
          width: 620,
          height: 400,
          onContentLoaded: null,
          properties: insertIconDialogProperties
        }
      };
      uiMenuItems.special = {
        label: 'Special Characters',
        group: menuGroup,
        command: 'insertspecial',
        dialog: {
          width: 550,
          height: 400,
          onContentLoaded: null,
          properties: insertSpecialDialogProperties
        }
      };

      for (var key in uiMenuItems) {
        var def = uiMenuItems[key];
        var fullDialogName = def.command + '-' + dialogName;
        // This property must be added here because CKEditor is not defined when the properties are built.
        def.dialog.properties.resizable = CKEDITOR.DIALOG_RESIZE_NONE;
        CKEDITOR.dialog.addIframe(
          fullDialogName,
          def.label,
          this.path + 'dialog-' + def.command + '.html',
          def.dialog.width,
          def.dialog.height,
          def.dialog.onContentLoaded,
          def.dialog.properties
        );
        editor.addCommand(def.command, new CKEDITOR.dialogCommand(fullDialogName));
      }

      editor.addMenuItems(uiMenuItems);
      editor.ui.add('EASSpecials', CKEDITOR.UI_MENUBUTTON, {
        label: 'Insert Specials',
        icon: 'easspecials',
        modes: { wysiwyg: 1 },
        onMenu: function() {
          var returnObject = {};
          for (var key in uiMenuItems) {
            returnObject[key] = CKEDITOR.TRISTATE_OFF;
          }
          return returnObject;
        }
      });

/*
      editor.addCommand('updatecaptures', {
        canUndo: false,
        exec: function() {
          updateCaptures(editor);
        }
      });
*/
      editor.on('change', function() {
        updateCaptures(editor);
      });

      editor.on('instanceReady', function() {
        onInstanceReady(editor);
      });

      editor.addCommand('vblankDelete', {exec: function() {deleteEasBlockElem(editor, 'vspace');}});

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuItems({
          vblank_delete: {
            label: 'Delete Vertical Blank',
            command: 'vblankDelete',
            group: menuGroup
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          //if (!element || element.isReadOnly()) {
          //  return null;
          //}

          var vblankAscendant = element.getAscendant('div', true);
          if (vblankAscendant && vblankAscendant.getAttribute('class') == "texspace vspace wall") {
            return { vblank_delete : CKEDITOR.TRISTATE_OFF };
          }

          return null;
        });
      }
    }
  });
})();
