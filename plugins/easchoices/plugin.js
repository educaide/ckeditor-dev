(function() {
  'use strict';

  var wordStyles = [
    {label: 'Dropdown',  className: 'menu-dropdown', command: "dropdownWordStyle"},
    {label: 'None',      className: 'menu-none', command: "dropdownNoneWordStyle"},
  ];

  var easListBasedChoices = [
    {label: 'Multiple-Choice Block',  command: "emceelist", style: "emcee"},
    {label: 'Multi-Select Block',  command: "emcee-multi-list", style: "emcee-multi-list"},
    {label: 'Re-order items',  command: "orderinglist", style: "orderinglist"},
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
      if (this.styleObject.className === "menu-none" && _.some(editor.elementPath().elements, function(e) {
        return isEASList(e.$);
      })) {
        // HAAAAAACK. We know this is supposed to be used for clearing text. Instead we're going to manually set
        // the list style to nolist.
        //
        // Please don't come running after me with pitchforks
        editor.execCommand("nolist")
      } else {
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
      }
  };

  /*
   * Copied wholesale from the easlistplugin for the moment
   *
   */
	function listCommand( name, style ) {
		var command = new CKEDITOR.plugins.list.command( name, 'ol' );
		command.easStyle = style;

		return command;
	}

  function isEASList(element) {
    if (element.nodeName !== "OL") { return false }

    var easClasses = _.map(easListBasedChoices, _.property("style"));

    return _.includes(easClasses, element.className);
  }

  function onSelectionChange(event) {
    // needs to do a whole lot more now
    if (event.editor.readOnly) {
      return;
    }

    // turn everything off
    _.each(_.concat(easListBasedChoices, wordStyles), function(obj) {
      var command = event.editor.getCommand(obj.command);
        command.setState(CKEDITOR.TRISTATE_DISABLED);
    });

    // this code is ugly, currently we just use the dropdownNoneWordStyle as a _proxy_ for the entire
    // menu. If this is set to active, then the parent "dropdown" will appear active.

    var noneCommand = event.editor.getCommand('dropdownNoneWordStyle');
    var pathElements = event.data.path.elements;

    var isEASListElement = _.some(pathElements, function(element){
      return isEASList(element.$)
    });

    var isEASDropdownElement = _.some(pathElements, function(element){
      var easClass = element.getAttribute('eas-class');
      return easClass === "menu-dropdown";
    });

    if (isEASListElement) {
      _.each(_.concat(easListBasedChoices), function(obj) {
        var command = event.editor.getCommand(obj.command);
          command.setState(CKEDITOR.TRISTATE_ON);
      });
      noneCommand.setState(CKEDITOR.TRISTATE_ON);
      return;

    } else if (isEASDropdownElement) {
      _.each(_.concat(wordStyles), function(obj) {
        var command = event.editor.getCommand(obj.command);
          command.setState(CKEDITOR.TRISTATE_ON);
      });
      return;
    } else {
      _.each(_.concat(easListBasedChoices, wordStyles), function(obj) {
        var command = event.editor.getCommand(obj.command);
          command.setState(CKEDITOR.TRISTATE_OFF);
      });
      noneCommand.setState(CKEDITOR.TRISTATE_OFF);
      return;
    }
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
        editor.addCommand(listObject.command, listCommand(listObject.command, listObject.style));

        uiMenuItems[listObject.command] = {
          label: listObject.label,
          group: menuGroup,
          command: listObject.command
        };
      });

      editor.addMenuGroup(menuGroup);
      editor.addMenuItems(uiMenuItems);

      // add menubutton
      editor.ui.add('EASChoices', CKEDITOR.UI_MENUBUTTON, {
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
          _.each(_.concat(easListBasedChoices, wordStyles), function(obj) {
            returnObject[obj.command] = CKEDITOR.TRISTATE_OFF;
          });

          return returnObject;
        }
      });

      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, this));
    }
  });
})();
