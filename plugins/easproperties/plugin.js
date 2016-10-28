// this plugin requires prototype javascript library to be loaded before cksource library

(function() {
  'use strict';

  function getElem(editor, elemTag, elemClassName) {
    if (elemTag == null)
      return null;

    var selection = editor.getSelection(),
      startElement = selection && selection.getStartElement(),
      foundElem = startElement && startElement.getAscendant(elemTag, 1);

    if (elemClassName == null)
      return foundElem;

    var elementIs = foundElem && ( foundElem.hasClass(elemClassName) || (elemClassName == "intro" && foundElem.getAttribute("id") == "intro" ) ); //not sure why intro element has intro as id instead of class

    if (elementIs)
      return foundElem;

    return null;
  }

  function getIntro(editor) {
    return getElem(editor, "div", "intro");
  }

  function getParbox(editor) {
    return getElem(editor, "div", "parbox");
  }

  function getEmcee(editor) {
    return getElem(editor, "ol", "emcee");
  }

  function getPlainFigure(editor) {
    var elem = getElem(editor, "img", null);
    if (elem == null) { return null; }
    if (elem.getAttribute('alt') == null) { return null; }
    if (elem.hasClass('maththumb')) { return null; }
    return elem;
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

  function deleteEasBlockElem(editor, elemClassName)
  {
    var blockElem = getEasBlockElem(editor, elemClassName);
    if (blockElem == null)
      return;

    var node = blockElem.$;

    while (node.firstChild) {
          node.parentNode.insertBefore(node.firstChild, node);
    }
    node.parentNode.removeChild(node);
  }

  function introDelete(editor) {
    deleteEasBlockElem(editor, "intro");
  }

  function parboxDelete(editor) {
    deleteEasBlockElem(editor, "parbox");
  }

  function loadProperties(iframe,element) {
    if (element) {
      iframe.contentWindow.setProperties(element);
    } else {
      console.log("Error loading element properties");
    }
  }

  function setupInputs(iframe,element) {
    if (element) {
      iframe.contentWindow.setupInputs(element);
    } else {
      console.log("Error setting up element inputs");
    }
  }

  function saveProperties(args,element) {
    var iframe = $(args.sender.parts.dialog.$).down('iframe');

    if (element){
      var properties = iframe.contentWindow.savePropertiesToElement(element, args);
    }
  }

  CKEDITOR.plugins.add('easproperties', {
    requires: 'iframedialog',

    init : function( editor )  {
      var pluginName = 'easproperties';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName + "parbox", "Parbox Advanced", this.path + 'parbox.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          setupInputs(iframe,getParbox(editor));
          loadProperties(iframe,getParbox(editor));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getParbox(editor));
          }
        }
      );

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName + "emcee", "Multiple Choice Advanced", this.path + 'emcee.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          setupInputs(iframe,getEmcee(editor));
          loadProperties(iframe,getEmcee(editor));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getEmcee(editor));
          }
        }
      );

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName + "table", "Table Advanced", this.path + 'table.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          setupInputs(iframe,getElem(editor, "table", null));
          loadProperties(iframe,getElem(editor, "table", null));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getElem(editor, "table", null));
          }
        }
      );

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName + "figure", "Image Advanced", this.path + 'figure.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          setupInputs(iframe,getPlainFigure(editor));
          loadProperties(iframe,getPlainFigure(editor));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getPlainFigure(editor));
          }
        }
      );

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName + "intro", "Intro Advanced", this.path + 'intro.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          setupInputs(iframe,getIntro(editor));
          loadProperties(iframe,getIntro(editor));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getIntro(editor));
          }
        }
      );


      // Register the command.
      var command = editor.addCommand("parboxProperties", {exec: function() { editor.openDialog(dialogName +  "parbox"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      var command = editor.addCommand("emceeProperties", {exec: function() { editor.openDialog(dialogName +  "emcee"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      var command = editor.addCommand("easTableProperties", {exec: function() { editor.openDialog(dialogName +  "table"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      var command = editor.addCommand("figureProperties", {exec: function() { editor.openDialog(dialogName +  "figure"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      var command = editor.addCommand("introProperties", {exec: function() { editor.openDialog(dialogName +  "intro"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      editor.addCommand('parboxDelete', {exec: function() {parboxDelete(editor);}});

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuGroup(pluginName, 110);
        editor.addMenuItems({
          emceeProperties: {
            label:   "Multiple Choice Advanced...",
            command: "emceeProperties",
            group:   pluginName,
            order:   1
          },
          easTableProperties: {
            label:   "Table Advanced...",
            command: "easTableProperties",
            group:   pluginName,
            order:   1
          },
          parboxProperties: {
            label:   'Parbox Advanced...',
            command: "parboxProperties",
            group:   pluginName,
            order:   2
          },
          figureProperties: {
            label:    'Image Advanced...',
            command:  "figureProperties",
            group:    pluginName
          },
          introProperties: {
            label: 'Intro Advanced...',
            command: 'introProperties',
            group: pluginName
          },
          parboxDelete: {
            label:   'Remove Paragraph Box',
            command: 'parboxDelete',
            group:   pluginName,
            order:   1
          }
        });
      }

      if ( editor.addMenuItems ) {
        editor.addMenuGroup('easintro', 444);
        editor.addMenuItems({
        });
      };

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {

          var properties = {};

          if (getParbox(editor)) {
            properties.parboxProperties = CKEDITOR.TRISTATE_OFF;
            properties.parboxDelete = CKEDITOR.TRISTATE_OFF;
          }

          if (getEmcee(editor)) {
            properties.emceeProperties = CKEDITOR.TRISTATE_OFF;
          }

          if (getElem(editor,"table", null)) {
            properties.easTableProperties = CKEDITOR.TRISTATE_OFF;
          }

          if (getPlainFigure(editor)) {
            properties.figureProperties = CKEDITOR.TRISTATE_OFF;
          }

          if (getIntro(editor)) {
            properties.introProperties = CKEDITOR.TRISTATE_OFF;
          }

          if ( Object.keys(properties).length > 0 ) {
            return properties;
          }

          return null;
        });
      }
    }
  });
})();
