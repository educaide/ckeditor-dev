CKEDITOR.plugins.add('easinteractive', {
  requires: ['easlistcustom', 'easwordstyle']
  init: function (editor) {
    var items = {
      multiplechoiceoption: {
        label: "Multiple Choice Block",
        group: 'interactive_group',
        command: 'multiplechoiceoption',
        order: 1
      },
      multiselectoption: {
        label: "Multi Select Block",
        group: 'interactive_group',
        command: 'multiselectoption',
        order: 2
      },
      dropdownoption: {
        label: "Dropdown",
        group: 'interactive_group',
        command: 'dropdownoption',
        order: 3
      }
    };

    editor.addMenuGroup('easinteractive_group');
    editor.addMenuItems(items);

    editor.ui.add('EASInteractiveGroup', CKEDITOR.UI_MENUBUTTON, {
      label: 'Interactive Group',
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
