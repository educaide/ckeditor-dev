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
    editableMathSpan.mathquill('editable');
  }

  CKEDITOR.plugins.easmathquill = {
    init: function (editor) {
      editor.on('instanceReady', function() {
        var scriptsToLoad = [
          'https://code.jquery.com/jquery-1.11.3.min.js',
          'http://mathquill.com/mathquill/mathquill.js'
        ];

        CKEDITOR.scriptLoader.load( scriptsToLoad, function (success, failed){
          if (failed.length){
            console.log("scripts did not load");
          }else{
            console.log("scripts loaded");
            // I'm assuming here that the rest of the plugin code follows only
            // once the scripts are loaded
            // However, I am running into JS errors after the scripts load,
            // probably due to our continued use of Prototype, but I am not
            // positive.
            editor.addCommand('easmathquill', {
              exec: function(editor) {
                insertMathQuillSpan(editor);
              }
            });
            editor.ui.addButton('EASMathQuill', {
              label: 'Insert Inline Math',
              command: 'easmathquill',
              icon: 'easmathquill',
            });
          }
        });
      });
    }
  };

  CKEDITOR.plugins.add('easmathquill', CKEDITOR.plugins.easmathquill);
})();