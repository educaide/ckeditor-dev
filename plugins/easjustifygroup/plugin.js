CKEDITOR.plugins.add('easjustifygroup', {
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
      icon: 'JustifyLeft',
      // Disable in source mode.
      modes: {
        wysiwyg: 1
      },
      onMenu: function () {
        var activeItems = {};

        // Make all items active.
        for (var prop in items) {
          activeItems[prop] = editor.getCommand(items[prop].command).state;
        }

        return activeItems;
      }
    });
  }
});
