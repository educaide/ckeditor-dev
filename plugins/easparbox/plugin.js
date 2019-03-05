// requires prototype.js

(function() {
  'use strict';

  function IntroCommand() {
    this.name = 'insertparbox';
  };

  IntroCommand.prototype = {
    exec: function(editor) {
      // make sure all DOM changes are treated as one chunk
      editor.fire('updateSnapshot');

      var parboxDiv = CKEDITOR.dom.element.createFromHtml("<div class='wall parbox'><p>&nbsp;</p></div>");
      editor.insertElement(parboxDiv);

      // add leading/trailing paragraphs to parboxDiv if necessary
      var sibling = parboxDiv.getPrevious();
      if (!sibling || sibling.$.tagName != "P") {
        CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertBefore(parboxDiv);
      }
      var sibling = parboxDiv.getNext();
      if (!sibling || sibling.$.tagName != "P") {
        CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertAfter(parboxDiv);
      }

      // make sure cursor is in new parbox
      var range = new CKEDITOR.dom.range(editor.document);
      range.moveToElementEditablePosition(parboxDiv);
      range.select();
    }
  };

	CKEDITOR.plugins.add('easparbox', {
    icons: 'easparbox',

    init: function(editor) {
      // add command
      var command = editor.addCommand('insertparbox', new IntroCommand());

      // add button
      editor.ui.addButton('EASParBox', {
        label : 'Paragraph Box',
        command: 'insertparbox',
        icon: 'easparbox'
      });
    }
  });
})();
