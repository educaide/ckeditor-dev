// requires prototype.js

(function() {
  'use strict';

  var fontSizes = [
    {label: 'Normal',     size: 'medium', command: "normalFontSize"},
    {label: 'Large',      size: 'large', command: "largeFontSize"},
    {label: 'Very Large', size: 'x-large', command: "veryLargeFontSize"},
    {label: 'Small',      size: 'small', command: "smallFontSize"},
    {label: 'Very Small', size: 'x-small', command: "verySmallFontSize"}
  ];

  function FontSizeCommand(sizeObject) {
    this.sizeObject = sizeObject;
  }

  FontSizeCommand.prototype = {
    exec: function(editor) {
      editor.focus();
      editor.fire( 'saveSnapshot' );

      var styleDefinition = {
		    element   : 'span',
        styles    : {'font-size' : this.sizeObject.size},
        overrides : [{element : 'font', attributes : {'size' : null}}]
      };

      // OPT remove font-size style when setting font-size to normal
      var ckStyle = new CKEDITOR.style(styleDefinition);
      editor.applyStyle(ckStyle);

      editor.fire( 'saveSnapshot' );
    }
  };

  CKEDITOR.plugins.add('easfontsize', {
    requires: 'menubutton',
    icons: 'easfontsize',

    init: function(editor) {
      // register editor commands (normalFontSize, veryLargeFontSize, etc)
      _.each(fontSizes, function(sizeObject) {
        editor.addCommand(sizeObject.command, new FontSizeCommand(sizeObject));
      });

      // define menubutton commands
			var menuGroup = 'easfontsize';
			var uiMenuItems = {};
      _.each(fontSizes, function(sizeObject) {
        uiMenuItems[sizeObject.command] = {
          label: sizeObject.label,
          group: menuGroup,
          command: sizeObject.command
        };
      });

			editor.addMenuGroup(menuGroup);
			editor.addMenuItems(uiMenuItems);

      // add menubutton
      editor.ui.add('EASFontSize', CKEDITOR.UI_MENUBUTTON, {
        label : 'Font Size',
        icon : 'easfontsize',
        modes : { wysiwyg : 1 },
        onMenu : function() {
          var returnObject = {};

          _.each(fontSizes, function(sizeObject) {
            returnObject[sizeObject.command] = CKEDITOR.TRISTATE_OFF;
          });
          return returnObject;
        }
      });
    }
  } );
})();
