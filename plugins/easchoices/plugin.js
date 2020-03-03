(function() {
  'use strict';

  var wordStyles = [
    {label: 'Dropdown',  className: 'menu-dropdown', command: "dropdownWordStyle"},
    {label: 'None',      className: 'menu-none', command: "dropdownNoneWordStyle"},
  ];

  var easListBasedChoices = [
    {label: 'Re-order items',  command: "orderinglist"},
  ];

  function WordStyleCommand(styleObject) {
    this.styleObject = styleObject;
  };

  function removeFormatFilter(ckElement) {
    var attrVal = ckElement.$.getAttribute('eas-class');
    if (attrVal != null) {
      var found = false;
      _.each(wordStyles, function(e) {
        if (e.className == attrVal)
          found = true;
      });

      return found;
    }
    return false;
  }

  function removeFormatFilterFunction(editor) {
    if (!editor._.removeFormatFilters)
      return;

    var newList = [];
    _.each(editor._.removeFormatFilters, function(func) {
      if (func != removeFormatFilter)
        newList.push(func);
    });
    editor._.removeFormatFilters = newList;
  }

  function addFormatFilter(editor) {
    removeFormatFilterFunction(editor);
    editor.addRemoveFormatFilter(removeFormatFilter);
  }

  WordStyleCommand.prototype = {
    exec: function(editor) {
      editor.focus();
      editor.fire( 'saveSnapshot' );

      // TODO CKEDITOR doesn't seem to like override definitions with attributes of 'class'.
      // using eas-class as an attribute works around this, but we still end up
      // with attribute-less spans that need to be stripped out:
      //   <span eas-class="word-none"><span>blah</span></span>
      var styleDefinition = {
        element:    'span',
        attributes: {
          'eas-class': this.styleObject.className
        },
        overrides:  [{ element: 'span', attributes : { 'eas-class' : /^word\-/ } }]
      };

      addFormatFilter(editor);
      // MRL: Mostly solves empty span issue
      editor.execCommand('removeFormat', editor.selection);
      removeFormatFilterFunction(editor);

      // OPT remove span or class name if setting word style to 'none'
      var ckStyle = new CKEDITOR.style(styleDefinition);
      editor.applyStyle(ckStyle);

      editor.fire( 'saveSnapshot' );
    }
  };

  /*
   * Copied wholesale from the easlistplugin for the moment
   *
   */
	function listCommand(name) {
		var command = new CKEDITOR.plugins.list.command( name, 'ol' );
		command.easStyle = name;

		return command;
	}

  function onSelectionChange(event) {
    // needs to do a whole lot more now
    if (event.editor.readOnly) {
      return;
    }

    // TODO this code doesn't appear to do anything. look into it.
    // highlight toolbar button if cursor is inside a word-styled span
    var command = event.editor.getCommand('dropdownNoneWordStyle');
    var pathElements = event.data.path.elements;
    var i;
    for (i = 0; i < pathElements.length; i++) {
      var element = pathElements[i].$;
      var easClass = element.getAttribute('eas-class');
      if (/^menu\-/.test(easClass) && !/\-none$/.test(easClass)) {
        command.setState(CKEDITOR.TRISTATE_ON);
        return;
      }
    }

    command.setState(CKEDITOR.TRISTATE_OFF);
  }

  CKEDITOR.plugins.add('easchoices', {
    requires: 'menubutton,removeformat,list',
    icons: 'easdropdown',

    init: function(editor) {
      // register editor commands (vocabWordStyle, emphWordStyle, etc)
      // and define menubutton commands
      var menuGroup = 'easchoices';
      var uiMenuItems = {};

      _.each(wordStyles, function(styleObject) {
        editor.addCommand(styleObject.command, new WordStyleCommand(styleObject));
        uiMenuItems[styleObject.command] = {
          label: styleObject.label,
          group: menuGroup,
          command: styleObject.command
        };
      });

      _.each(easListBasedChoices, function(listObject) {
        editor.addCommand(listObject.command, listCommand(listObject.command));

        uiMenuItems[listObject.command] = {
          label: listObject.label,
          group: menuGroup,
          command: listObject.command
        };
      });

      editor.addMenuGroup(menuGroup);
      editor.addMenuItems(uiMenuItems);

      // add menubutton
      editor.ui.add('EASDropdown', CKEDITOR.UI_MENUBUTTON, {
        label : "Choices",
        icon : 'easdropdown',
        modes : { wysiwyg : 1 },
        onRender: function() {
          var command = editor.getCommand('dropdownNoneWordStyle');
          command.on('state', function() {
            this.setState(command.state);
          }, this);
        },
        onMenu: function() {
          var returnObject = {};
          _.each(_.concat(wordStyles, easListBasedChoices), function(obj) {
            returnObject[obj.command] = CKEDITOR.TRISTATE_OFF;
          });

          return returnObject;
        }
      });

      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, this));
    }
  });
})();
