// this plugin requires prototype javascript library to be loaded before cksource library

(function() {
  'use strict';

  function createImage(editor, properties) {

    // Setting the width and height directly is necessary becuase otherwise the browser displays 1px of our low quality thumbnail = 1px on the screen, which we do not want.
    var inch_width  = properties.width  / properties.dpi;
    var inch_height = properties.height / properties.dpi;
    var style = "";
    style += "width:  " + inch_width  + "in;";
    style += "height: " + inch_height + "in;";

    var imgElem = editor.document.createElement('img');
    imgElem.setAttribute('src', properties.src);
    imgElem.setAttribute('alt', properties.filename);
    imgElem.setAttribute('hasProperties', true);
    imgElem.setAttribute('style', style);
    imgElem.data('width', properties.width);
    imgElem.data('height', properties.height);
    imgElem.data('dpi', properties.dpi);

    return imgElem;
  }

  CKEDITOR.plugins.add('easimage', {
    requires: 'iframedialog',
    icons: 'easimage',

    init : function( editor )  {
      var pluginName = 'easimage';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName, "Image Browser", this.path + 'dialog.html', 950, 600,
        // onContentLoad
        function() {
          // pass on authenticity token so file uploads work
          if (Hachiko) {
            var iframe = $(this.domId);
            var inputEl = iframe.contentWindow.document.getElementById('authenticity_token');
            $(inputEl).value = Hachiko.AuthenticityToken;
          }
          else {
            console.log("8ko not detected");
          }
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            // HACK this is here to support using the easimage dialog in non-editor contexts, like in the XFigure panel
            if (args.sender.insertImageOnOk === false) {
              return;
            }

            var iframe = $(args.sender.parts.dialog.$).down('iframe');
            var properties = iframe.contentWindow.getProperties('browser');
            var properties2 = iframe.contentWindow.getProperties('browser2');

            if (!properties && !properties2) {
              return;
            }

            // insert new image
            if (properties){
              var image = createImage(editor, properties);
              editor.insertElement(image);
            }else if(properties2){
              var image = createImage(editor, properties2);
              editor.insertElement(image);
            }
          }
        }
      );

      // Register the command.
      var command = editor.addCommand(pluginName, {exec: function() { editor.openDialog(dialogName); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = false;

      editor.ui.addButton('EASImage', {
        label: 'Image',
        icon: pluginName,
        command: pluginName
      });
    }
  });
})();



