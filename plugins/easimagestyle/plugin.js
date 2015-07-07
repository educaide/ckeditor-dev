// this plugin requires prototype javascript library to be loaded before cksource library

(function() {
  'use strict';

  function getImageProperties(image) {
    return {
      name: image.getAttribute('alt'),
      width: image.data('width'),
      height: image.data('height'),
      dpi: image.data('dpi'),
      scaling: image.data('scaling') || '100',
      alignment: image.data('alignment') || 'none'
    }
  }

  function createImage(editor, properties) {
    var imgElem = editor.document.createElement('img');
    imgElem.setAttribute('src', properties.src);
    imgElem.setAttribute('alt', properties.name);
    imgElem.setAttribute('hasProperties', true);

    $w('width height dpi scaling alignment').each(function(attr) {
      imgElem.data(attr, properties[attr]);
    });

    var scaling = properties.scaling / 100.0;
    var previewScaling = 100.0 / properties.dpi;
    imgElem.setStyles({
      'width'  : (properties.width  * scaling * previewScaling) + 'px',
      'height' : (properties.height * scaling * previewScaling) + 'px'
    })

    return imgElem;
  }

  CKEDITOR.plugins.add('easimagestyle', {
    requires: 'iframedialog',

    init : function( editor )  {
      var pluginName = 'easimagestyle';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName, "Image Properties", this.path + 'dialog.html', 370, 365,
        // onContentLoad
        function() {
          // initialize dialog with properties of the currently-selected image
          var selection = editor.getSelection(),
            startElement = selection && selection.getStartElement(),
            image = startElement && startElement.getAscendant('img', 1);

          if (!image || !image.getAttribute('hasProperties')) {
            return;
          }

          var iframe = $(this.domId);
          var imageProperties = getImageProperties(image);

          iframe.contentWindow.setProperties(imageProperties);
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            // read data back from dialog and either update existing table or create new table
            var iframe = $(args.sender.parts.dialog.$).down('iframe');
            var properties = iframe.contentWindow.getProperties();
            console.log(properties)

            var selection = editor.getSelection(),
              startElement = selection && selection.getStartElement(),
              existingImage = startElement && startElement.getAscendant('img', 1);

            // insert new image
            properties.src = existingImage.getAttribute('src');
            var newImage = createImage(editor, properties);
            newImage.replace(existingImage);
          }
        }
      );

      // Register the command.
      var command = editor.addCommand(pluginName, {exec: function() { editor.openDialog(dialogName); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = false;

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuGroup(pluginName, 109);
        editor.addMenuItems({
          easimagestyle: {
            label:   'Image Properties...',
            command: pluginName,
            group:   pluginName
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          if (!element || element.isReadOnly()) {
            return null;
          }

          var imageAscendant = element.getAscendant('img', true);
          if (imageAscendant) {
            var imageClass = imageAscendant.getAttribute('class');
            if (imageAscendant && imageAscendant.getAttribute('hasProperties') && imageClass != 'maththumb' && imageClass != 'fonticon') {
              return { easimagestyle : CKEDITOR.TRISTATE_OFF };
            }
          }

          return null;
        });
      }

    }
  });
})();



