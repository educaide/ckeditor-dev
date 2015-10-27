/*easmathquill for inline latex math */
(function () {
  'use strict';

  function createMathQuillspan(document) {
    var mathQuillSpan = document.createElement('span', {
      attributes: {
        'class': 'mathquill-editable'
      }
    });
    return mathQuillSpan;
  }

  function insertMathQuillSpan(editor) {
    var editableMathSpan = createMathQuillspan(editor.document);
    editor.insertElement(editableMathSpan);
    // since the span is created dynamically, we must use the mathquill
    // jquery plugin after inserting the element into the visibile DOM
    jQuery(editableMathSpan.$).mathquill('editable');

    // it would be also nice to focus it's textarea, so youser can type
    // without using pointing device
  }

  CKEDITOR.plugins.easmathquill = {
    icons: 'easmathquill',
    hidpi: false, // %REMOVE_LINE_CORE%
    init: function (editor) {
      function reportError() {
        console.log('Error: could not load MathQuill dependency.');
      }

      // loading jQuery. Note if jQuery is already defined it will override it!
      CKEDITOR.scriptLoader.load('https://code.jquery.com/jquery-1.11.3.min.js', function (success) {
        if (!success) {
          reportError();
          return;
        }

        // once jQuery is loaded, we can load MathQuill itself
        CKEDITOR.scriptLoader.load('http://mathquill.com/mathquill/mathquill.js', function (success, failed) {
          if (!success) {
            reportError();
            return;
          }
        });
      });

      editor.addCommand('easmathquill', {
        exec: function(editor) {
          insertMathQuillSpan(editor);
        }
      });

      editor.ui.addButton('EASMathQuill', {
        label: 'Insert Inline Math',
        command: 'easmathquill'
      });

      // set keystroke handler
      editor.setKeystroke(CKEDITOR.CTRL + 77, 'easmathquill');
    }
  };

  CKEDITOR.plugins.add('easmathquill', CKEDITOR.plugins.easmathquill);
})();