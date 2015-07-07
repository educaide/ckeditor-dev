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

    var elementIs = foundElem && foundElem.hasClass(elemClassName);

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

  function saveProperties(args,element) {
    var iframe = $(args.sender.parts.dialog.$).down('iframe');

    if (element){
      var properties = iframe.contentWindow.savePropertiesToElement(element);
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
      CKEDITOR.dialog.addIframe(dialogName + "figure", "Figure Advanced", this.path + 'figure.html', 300, 400,
        // onContentLoad
        function() {
          var iframe = $(this.domId);
          loadProperties(iframe,getPlainFigure(editor));
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            saveProperties(args,getPlainFigure(editor));
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

      var command = editor.addCommand("tableProperties", {exec: function() { editor.openDialog(dialogName +  "table"); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = true;

      var command = editor.addCommand("figureProperties", {exec: function() { editor.openDialog(dialogName +  "figure"); }});
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
          tableProperties: {
            label:   "Table Advanced...",
            command: "tableProperties",
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
          parboxDelete: {
            label:   'Remove Paragraph Box',
            command: 'parboxDelete',
            group:   pluginName,
            order:   1
          }
        });
      }
      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          //if (!element || element.isReadOnly()) {
          //  return null;
          //}

          var parbox = getParbox(editor);
          if (parbox) {
            return { parboxProperties : CKEDITOR.TRISTATE_OFF, parboxDelete : CKEDITOR.TRISTATE_OFF };
          }

          var emcee = getEmcee(editor);
          if (emcee)
            return {emceeProperties: CKEDITOR.TRISTATE_OFF };

          var table = getElem(editor,"table", null);
          if (table)
            return {tableProperties: CKEDITOR.TRISTATE_OFF };

          var figure = getPlainFigure(editor);
          if (figure)
            return {figureProperties: CKEDITOR.TRISTATE_OFF };

          return null;
        });
      }
    }
  });
})();