// requires prototype.js

(function() {
  'use strict';

  var wordStyles = [
    {label: 'None',      className: 'word-none'},
    {label: 'Emphasis',  className: 'word-emph'},
    {label: 'Vocab',     className: 'word-vocab'}
  ];

  function WordStyleCommand(styleObject) {
    this.styleObject = styleObject;
  };

  function removeFormatFilter(ckElement) {
    var attrVal = ckElement.$.getAttribute('eas-class');
    if (attrVal != null) {
      var found = false;
      wordStyles.each(function(e) {
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
    editor._.removeFormatFilters.each(function(func) {
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
        attributes: { 'eas-class': this.styleObject.className},
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

  function onSelectionChange(event) {
    if (event.editor.readOnly) {
      return;
    }

    // TODO this code doesn't appear to do anything. look into it.
    // highlight toolbar button if cursor is inside a word-styled span
    var command = event.editor.getCommand('noneWordStyle');
    var pathElements = event.data.path.elements;
    var i;
    for (i = 0; i < pathElements.length; i++) {
      var element = pathElements[i].$;
      var easClass = element.getAttribute('eas-class');
      if (/^word\-/.match(easClass) && !/\-none$/.match(easClass)) {
        command.setState(CKEDITOR.TRISTATE_ON);
        return;
      }
    }

    command.setState(CKEDITOR.TRISTATE_OFF);
  }

  CKEDITOR.plugins.add('easwordstyle', {
    requires: 'menubutton,removeformat',
    icons: 'easwordstyle',

    init: function(editor) {
      // register editor commands (vocabWordStyle, emphWordStyle, etc)
      // and define menubutton commands
      var menuGroup = 'easwordstyle';
      var uiMenuItems = {};

      wordStyles.each(function(styleObject) {
        var camelizedCommand = styleObject.label.toLowerCase().gsub(/\s+/, '-').camelize() + 'WordStyle';
        editor.addCommand(camelizedCommand, new WordStyleCommand(styleObject));
        uiMenuItems[camelizedCommand] = {
          label: styleObject.label,
          group: menuGroup,
          command: camelizedCommand
        };
      });

      editor.addMenuGroup(menuGroup);
      editor.addMenuItems(uiMenuItems);

      // add menubutton
      editor.ui.add('EASWordStyle', CKEDITOR.UI_MENUBUTTON, {
        label : "Word Style",
        icon : 'easwordstyle',
        modes : { wysiwyg : 1 },
        onRender: function() {
          var command = editor.getCommand('noneWordStyle');
          command.on('state', function() {
            this.setState(command.state);
          }, this);
        },
        onMenu: function() {
          var returnObject = {};
          wordStyles.each(function(styleObject) {
          var camelizedCommand = styleObject.label.toLowerCase().gsub(/\s+/, '-').camelize() + 'WordStyle';
          returnObject[camelizedCommand] = CKEDITOR.TRISTATE_OFF;
          });
          return returnObject;
        }
      });

      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, this));
    }
  });
})();
