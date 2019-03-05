// requires prototype.js

(function() {
  'use strict';

  function IntroCommand() {
    this.name = 'toggleintroduction';
  };

  IntroCommand.prototype = {
    exec: function(editor) {
      var introDiv = editor.document.getById('intro') || editor.document.getById('formerintro');
      if (introDiv == null) {
        // insert a new div#intro
        var introDiv = CKEDITOR.dom.element.createFromHtml("<div class='wall' id='intro'><p>&nbsp;</p></div>");
        var firstChild = editor.document.getBody().getChild(0);
        introDiv.insertBefore(firstChild);
        var range = new CKEDITOR.dom.range(editor.document);
        range.moveToElementEditablePosition(introDiv, true);
        editor.getSelection().selectRanges([range]);
      }
      else {
        // toggle id
        introDiv.$.id = introDiv.$.id == 'intro' ? 'formerintro' : 'intro';
        if (introDiv.getId() == 'formerintro') {
          introDiv.removeClass('wall');
        }
        else {
          introDiv.addClass('wall');
        }
      }
    }
  };

	function onSelectionChange(evt) {
		if (evt.editor.readOnly) {
			return;
    }

		var command = evt.editor.getCommand(this.name);
		command.state = evt.editor.document.getById('intro') != null ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
		command.fire('state');
	}

	CKEDITOR.plugins.add('easintro', {
    icons: 'easintro',
    init: function(editor) {
      // add command
      var command = editor.addCommand('toggleintroduction', new IntroCommand());
      editor.on('selectionChange', CKEDITOR.tools.bind(onSelectionChange, command));

      // add button
      editor.ui.addButton('EASIntro', {
        label : 'Introduction',
        command: 'toggleintroduction',
        icon: 'easintro'
      });

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuGroup('easintro', 444);
        editor.addMenuItems({
          intro_hide: {
            label: 'Hide Intro Box',
            command: 'toggleintroduction',
            group: 'easintro'
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          //if (!element || element.isReadOnly()) {
          //  return null;
          //}

          var introAscendant = element.getAscendant('div', true);
          if (introAscendant && introAscendant.getAttribute('class') == "wall" && introAscendant.getId() == "intro") {
            return { intro_hide : CKEDITOR.TRISTATE_OFF };
          }

          return null;
        });
      }
    }
  });
})();
