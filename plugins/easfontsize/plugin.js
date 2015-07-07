// requires prototype.js

(function() {
  'use strict';

  var fontSizes = [
    {label: 'Normal',     size: 'medium'},
    {label: 'Large',      size: 'large'},
    {label: 'Very Large', size: 'x-large'},
    {label: 'Small',      size: 'small'},
    {label: 'Very Small', size: 'x-small'}
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
      fontSizes.each(function(sizeObject) {
        var camelizedCommand = sizeObject.label.toLowerCase().gsub(/\s+/, '-').camelize() + 'FontSize';
        editor.addCommand(camelizedCommand, new FontSizeCommand(sizeObject));
      });

      // define menubutton commands
			var menuGroup = 'easfontsize';
			var uiMenuItems = {};
      fontSizes.each(function(sizeObject) {
        var camelizedCommand = sizeObject.label.toLowerCase().gsub(/\s+/, '-').camelize() + 'FontSize';
        uiMenuItems[camelizedCommand] = {
          label: sizeObject.label,
          group: menuGroup,
          command: camelizedCommand
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

          fontSizes.each(function(sizeObject) {
            var camelizedCommand = sizeObject.label.toLowerCase().gsub(/\s+/, '-').camelize() + 'FontSize';
            returnObject[camelizedCommand] = CKEDITOR.TRISTATE_OFF;
          });
          return returnObject;
        }
      });
    }
  } );
})();
