(function() {
  'use strict';

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
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

  function deleteEasBlockElem(editor, elemClassName) {
    var blockElem = getEasBlockElem(editor, elemClassName);
    if (blockElem == null)
      return;

    blockElem.remove();
  }


  var insertIconDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      // don't serialize property values equal to the defaults
      if ((properties.sizeMode == 'scale' && properties.sizeValue == 1000) ||
          (properties.sizeMode == 'fixed' && properties.sizeValue == '0.5in')) {
        delete properties.sizeMode;
        delete properties.sizeValue;
      }
      if (properties.rotation == 0) {
        delete properties.rotation;
      }
      if (properties.alignment == 'none') {
        delete properties.alignment;
      }

      if (properties.style){

      }
      // convert property values into img attributes
      var imageAttributes = {
        title: 'Icon',
        'class': 'fonticon',
        // hack! fix rendering soon.
        // src: '/thumbnails?type=icon&' + Object.toQueryString(properties),
        //src: '/images/spinner.gif',
        src: '/images/icons/' + properties.group + "_" + pad(properties.index,3) +  ".png",
        fontname: properties.group,
        iconindex: properties.index
      };
      if (properties.rotation) {
        imageAttributes['data-eas-rotate'] = properties.rotation;
      }
      if (properties.alignment) {
        imageAttributes['data-eas-align'] = properties.alignment;
      }

      var width = null;
      if (properties.sizeMode == 'scale') {
        imageAttributes['data-eas-scale'] = properties.sizeValue;
        width = properties.sizeValue + "%";
      }
      else if (properties.sizeMode == 'fixed') {
        imageAttributes['data-eas-size'] = properties.sizeValue;
        width = properties.sizeValue;
      }

      /* Implemented icon sizing in the editor. But we need range checking first.
      if (width){
        var style = "width: " + width + ";";
        imageAttributes['style'] = style;
      }*/

      var element = editor.document.createElement('img', { attributes: imageAttributes });
      editor.insertElement(element);
    }
  };

  var insertSpecialDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      var entityRef = properties.codepoint.startsWith('0x') ? properties.codepoint.substring(1) : properties.codepoint;
      editor.insertHtml('&#' + entityRef + ';');
    }
  };

  var insertSpaceDialogProperties = {
    onOk: function(args) {
      var iframe = $(args.sender.parts.dialog.$).down('iframe');
      var properties = iframe.contentWindow.getProperties();
      var editor = args.sender._.editor;

      editor.fire('updateSnapshot');
      if (properties.blank) {
        var element = editor.document.createElement('span', {
          attributes: {
            contentEditable: 'false',
            unselectable: 'on',
            'class': 'texblank ' + properties.blank
          }
        });

        // we need text inside the element (and not just spaces) so cursor
        // behaves properly around it
        element.setText('bl');
        editor.insertElement(element);
      }
      else if (properties.space || properties.paragraph) {
        var html = '';
        switch(properties.space || properties.paragraph) {
          case 'nonBreaking' : html = '&nbsp;'; break;
          case 'thin'        : html = '&#8201;'; break;
          case 'en'          : html = '&#8194;'; break;
          case 'em'          : html = '&#8195;'; break;
          case 'null'        : html = '&#8205;'; break;

          case 'leaveVMode' : html = '&#xE236;'; break;
          case 'noIndent'   : html = '&#xE237;'; break;
          case 'indent'     : html = '&#xE238;'; break;
          case 'allowBreak' : html = '&#xE234;'; break;
          case 'noBreak'    : html = '&#xE235;'; break;
        }

        if (html != '') {
          editor.insertHtml(html);
        }
      }
      else if (properties.skip) {
        var isHorizontal = properties.skip.type == 'horizontal';
        var element = editor.document.createElement(isHorizontal ? 'span' : 'div', {
          attributes: {
            contentEditable: 'false',
            unselectable: 'on',
            'class': 'texspace ' + properties.skip.type[0] + 'space',
            size: properties.skip.size,
            style: (isHorizontal ? 'width: ' : 'height: ') + properties.skip.size
          }
        });
        if (!isHorizontal) {
          element.setAttribute('data-eas-iswksp', properties.skip.collapsible);
          //element.addClass('wall');
        }

        // we need text inside the element (and not just spaces) so cursor
        // behaves properly around it
        element.setText('bl');
        editor.insertElement(element);

        // add leading/trailing paragraphs to vertical skips
        if (!isHorizontal) {
          var sibling = element.getPrevious();
          if (!sibling || sibling.$.tagName != "P") {
            CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertBefore(element);
          }
          sibling = element.getNext();
          if (!sibling || sibling.$.tagName != "P") {
            CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertAfter(element);
          }
        }
      }
    }
  };

  // register the plugin
  CKEDITOR.plugins.add('easspecials', {
    requires: 'iframedialog,menubutton',
    icons: 'easspecials',

    init: function(editor) {
      var pluginName = 'easspecials';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      var menuGroup = 'easspecials';
      editor.addMenuGroup(menuGroup);

      var uiMenuItems = {};
      uiMenuItems.space = {
        label: 'Blanks and Misc.',
        group: menuGroup,
        command: 'insertspace',
        dialog: {
          // The tabs on this page had sizing issues on IE. (wrapping to 2 lines when other browsers showed 1 line)
          // Be sure to test IE if the width is changed.
          width: 460,
          height: 320,
          onContentLoaded: null,
          properties: insertSpaceDialogProperties
        }
      };
      uiMenuItems.icon = {
        label: 'Icons',
        group: menuGroup,
        command: 'inserticon',
        dialog: {
          width: 620,
          height: 400,
          onContentLoaded: null,
          properties: insertIconDialogProperties
        }
      };
      uiMenuItems.special = {
        label: 'Special Characters',
        group: menuGroup,
        command: 'insertspecial',
        dialog: {
          width: 550,
          height: 400,
          onContentLoaded: null,
          properties: insertSpecialDialogProperties
        }
      };

      for (var key in uiMenuItems) {
        var def = uiMenuItems[key];
        var fullDialogName = def.command + '-' + dialogName;
        // This property must be added here because CKEditor is not defined when the properties are built.
        def.dialog.properties.resizable = CKEDITOR.DIALOG_RESIZE_NONE;
        CKEDITOR.dialog.addIframe(
          fullDialogName,
          def.label,
          this.path + 'dialog-' + def.command + '.html',
          def.dialog.width,
          def.dialog.height,
          def.dialog.onContentLoaded,
          def.dialog.properties
        );
        editor.addCommand(def.command, new CKEDITOR.dialogCommand(fullDialogName));
      }

      editor.addMenuItems(uiMenuItems);
      editor.ui.add('EASSpecials', CKEDITOR.UI_MENUBUTTON, {
        label: 'Insert Specials',
        icon: 'easspecials',
        modes: { wysiwyg: 1 },
        onMenu: function() {
          var returnObject = {};
          for (var key in uiMenuItems) {
            returnObject[key] = CKEDITOR.TRISTATE_OFF;
          }
          return returnObject;
        }
      });

/*
      editor.addCommand('updatecaptures', {
        canUndo: false,
        exec: function() {
          updateCaptures(editor);
        }
      });
*/
      editor.addCommand('vblankDelete', {exec: function() {deleteEasBlockElem(editor, 'vspace');}});

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuItems({
          vblank_delete: {
            label: 'Delete Vertical Blank',
            command: 'vblankDelete',
            group: menuGroup
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          //if (!element || element.isReadOnly()) {
          //  return null;
          //}

          var vblankAscendant = element.getAscendant('div', true);
          if (vblankAscendant && vblankAscendant.getAttribute('class') == "texspace vspace wall") {
            return { vblank_delete : CKEDITOR.TRISTATE_OFF };
          }

          return null;
        });
      }
    }
  });
})();
