(function() {
  'use strict';
  var COMMANDS = ['justifyleft', 'justifycenter', 'justifyright', 'justifyblock'];

  function onSelectionChange(event) {
    if (event.editor.readOnly) {
      return;
    }
    // turn them all off.
    _.each(COMMANDS, function(command) {
      var c = event.editor.getCommand(command);
      c.setState(CKEDITOR.TRISTATE_OFF)
    })

    var pathElements = event.data.path.elements;
    var i;
    for (i = 0; i < pathElements.length; i++) {
      var element = pathElements[i].$;
      if (element.nodeName === "P") {
        if (element.style.getPropertyValue('text-align') === "center") {
          var command = event.editor.getCommand('justifycenter');
          command.setState(CKEDITOR.TRISTATE_ON)
          var command = event.editor.getCommand('justifyleft');
          command.setState(CKEDITOR.TRISTATE_ON)
          return
        } else if (element.style.getPropertyValue('text-align') === "right") {
          var command = event.editor.getCommand('justifyright');
          command.setState(CKEDITOR.TRISTATE_ON)
          var command = event.editor.getCommand('justifyleft');
          command.setState(CKEDITOR.TRISTATE_ON)
          return
        } else if (element.style.getPropertyValue('text-align') === "justify") {
          var command = event.editor.getCommand('justifyblock');
          command.setState(CKEDITOR.TRISTATE_ON)
          var command = event.editor.getCommand('justifyleft');
          command.setState(CKEDITOR.TRISTATE_ON)
          return
        }
      }
      var command = event.editor.getCommand('justifyleft');
      command.setState(CKEDITOR.TRISTATE_OFF)
    }
    // debugger
    // command.setState(CKEDITOR.TRISTATE_ON);
    // if (event.editor.readOnly) {
    //   return;
    // }

    // // TODO this code doesn't appear to do anything. look into it.
    // // highlight toolbar button if cursor is inside a word-styled span
    // var command = event.editor.getCommand('dropdownNoneWordStyle');
    // var pathElements = event.data.path.elements;
    // var i;
    // for (i = 0; i < pathElements.length; i++) {
    //   var element = pathElements[i].$;
    //   var easClass = element.getAttribute('eas-class');
    //   if (/^menu\-/.test(easClass) && !/\-none$/.test(easClass)) {
    //     command.setState(CKEDITOR.TRISTATE_ON);
    //     return;
    //   }
    // }

    // command.setState(CKEDITOR.TRISTATE_OFF);
  }

  CKEDITOR.plugins.add('easjustifygroup', {
    icons: 'wibble',
    requires: ['justify'],
    init: function (editor) {
      var items = {
        justifyleft: {
          label: editor.lang.justify.left,
          group: 'justify_group',
          command: 'justifyleft',
          // icon: CKEDITOR.getUrl(this.path + 'icons/icon.png'),
          order: 1
        },
        justifycenter: {
          label: editor.lang.justify.center,
          group: 'justify_group',
          command: 'justifycenter',
          order: 2
        },
        justifyright: {
          label: editor.lang.justify.right,
          group: 'justify_group',
          command: 'justifyright',
          order: 3
        },
        justifyblock: {
          label: editor.lang.justify.block,
          group: 'justify_group',
          command: 'justifyblock',
          order: 4
        }
      };

      editor.addMenuGroup('justify_group');
      editor.addMenuItems(items);

      editor.ui.add('JustifyGroup', CKEDITOR.UI_MENUBUTTON, {
        label: 'Justify Group',
        icon: 'wibble',
        // Disable in source mode.
        modes: {
          wysiwyg: 1
        },
        onRender: function() {
          console.log("in onrender")
          var command = editor.getCommand('justifyleft');
          command.on('state', function() {
            this.setState(command.state);
          }, this);
        },
        onMenu: function () {
          console.log("in onmenu")
          var activeItems = {};

          // Make all items active.
          for (var prop in items) {
            activeItems[prop] = editor.getCommand(items[prop].command).state;
          }

          return activeItems;
        }
      });
      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, this));
    }
  });
})();
