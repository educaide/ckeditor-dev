// this plugin requires prototype javascript library to be loaded before cksource library

(function() {
  'use strict';

  function createImage(editor, properties) {
    // Setting the width and height directly is necessary becuase otherwise the browser displays 1px of our low quality thumbnail = 1px on the screen, which we do not want.
    inch_width  = properties.width  / properties.dpi;
    inch_height = properties.height / properties.dpi;
    var style = "";
    if (properties.style)
      style = properties.style;
    style += "width:  " + inch_width  + "in;";
    style += "height: " + inch_height + "in;";

    var imgElem = editor.document.createElement('img');
    imgElem.setAttribute('class', 'maththumb');

    imgElem.setAttribute('src', properties.src);
    // we can set to spinner if we are inserting and don't have the render yet.
    // currently we do not intend to do that.

    //imgElem.setAttribute('src', '/images/spinner.gif');
    imgElem.setAttribute('alt', properties.mathTeX);
    imgElem.setAttribute('hasProperties', true);
    imgElem.setAttribute('style', style);
    imgElem.data('width', properties.width);
    imgElem.data('height', properties.height);
    imgElem.data('dpi', properties.dpi);

    return imgElem;
  }

  var startedEmpty = false;

  CKEDITOR.plugins.add('easmathimages', {
    requires: 'iframedialog',
    icons: 'easmathimages',

    init : function( editor )  {
      var pluginName = 'easmathimages';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName, "Math Editor", this.path + 'dialog.html', 820, 420,
        // onContentLoad
        function() {
          //load existing math if editing/
          var selection = editor.getSelection(),
            startElement = selection && selection.getStartElement(),
            math = startElement && startElement.getAscendant('img', 1);

          startedEmpty = true;
          if (math && math.getAttribute('class') == "maththumb" && math.getAttribute("alt") && math.getAttribute("src")) {
            var iframe = $(this.domId);
            iframe.contentWindow.setMath(math.getAttribute("alt"), math.getAttribute("src"));
            startedEmpty = false;
          }

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
              iframe.contentWindow.displayError("Please type some math!")
              return false;
            }

            var iframe = $(args.sender.parts.dialog.$).down('iframe');
            var properties = iframe.contentWindow.getProperties();
            // IE8 errors here. if you want the console back, guard it.
            //console.log(properties);
            if (!properties) {
              if (startedEmpty && iframe.contentWindow.$('mathtex').value == '') {
                return true;
              }

              //iframe.contentWindow.displayError("Preview before pressing ok.");
              iframe.contentWindow.updatePreview();
              return false;
            }
            else {
              // insert new image
              var image = createImage(editor, properties);
              editor.insertElement(image);
            }
          }
        }
      );


      // Register the command.
      var command = editor.addCommand(pluginName, {exec: function() { editor.openDialog(dialogName); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = false;

      editor.ui.addButton('EASMathImages', {
        label: 'Insert Math',
        icon: pluginName,
        command: pluginName
      });

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuGroup(pluginName, 110);
        editor.addMenuItems({
          easmathimages: {
            label:   'Edit Math...',
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
          var isMathThumb = imageAscendant && imageAscendant.hasClass('maththumb') && imageAscendant.getAttribute('alt');
          if (isMathThumb) {
            return { easmathimages : CKEDITOR.TRISTATE_OFF };
          }

          return null;
        });
      }
    }
  });
})();
