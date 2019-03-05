/*
 * Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function () {
  function easmathDialog(editor) {

    var generalLabel = editor.lang.common.generalTab;
    return {
      title: 'Math',
      minWidth: 300,
      minHeight: 200,
      contents: [{
        id: 'info',
        label: generalLabel,
        title: generalLabel,
        elements: [{
          id: 'text',
          type: 'textarea',
          inputStyle: 'font-family: monospace; font-size: 10pt',
          rows: 11,
          label: 'Math TeX',
          'default': '',
          setup: function (buttonElement) {
            var textAreaElems = buttonElement.getElementsByTag('textarea');
            if (textAreaElems.count() != 0) {
              this.setValue(textAreaElems.getItem(0).getText());
            }
          },
          commit: function (buttonElement) {
            CKEDITOR.plugins.easmath.updateMathButton(buttonElement, this.getValue());
          }
        }]
      }],
      onShow: function () {
        this._element = CKEDITOR.plugins.easmath.getSelectedMath(editor);
        this.setupContent(this._element);
      },
      onOk: function () {
        this.commitContent(this._element);
        delete this._element;
      }
    };
  }

  CKEDITOR.dialog.add('editMultiLineMath', function (editor) {
    return easmathDialog(editor);
  });
})();

