// this plugin requires prototype javascript library to be loaded before cksource library

;(function($) {
  'use strict';

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
          jQuery('.cke_dialog_close_button').hide();
          // pass on authenticity token so file uploads work
          if (Hachiko) {
            var iframe = $("#" + this.domId)[0];
            var inputEl = iframe.contentWindow.document.getElementById('authenticity_token');
            $(inputEl).val(Hachiko.AuthenticityToken);
            inputEl = iframe.contentWindow.document.getElementById('url_form_authenticity_token');
            $(inputEl).val(Hachiko.AuthenticityToken);
          }
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onShow: function() {
            var $ourDialog = jQuery('.cke_dialog_contents_body', $(this.getElement().$));
            var minViewportWidth = 750; //same as width of editor itself.
            var desiredViewportWidth = Math.max(minViewportWidth, $(window).width() - 400);
            var desiredViewportHeight = $(window).height() - 200;

            $ourDialog.css( {
              width: desiredViewportWidth,
              height: desiredViewportHeight,
            });

            var desiredX = ((jQuery(window).width()) - desiredViewportWidth) / 2
            this.move(desiredX, 0); // Top center
          },
          onOk: function(args) {
            // HACK this is here to support using the easimage dialog in non-editor contexts, like in the XFigure panel
            if (args.sender.insertImageOnOk === false) {
              return;
            }

            var iframe = $(args.sender.parts.dialog.$).find("iframe")[0]
            var properties = iframe.contentWindow.getProperties();

            if (!properties) {
              return;
            }

            // insert new image
            if (properties){
              var image = iframe.contentWindow.createImage(editor, properties);
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
})(jQuery);

