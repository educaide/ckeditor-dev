'use strict';

( function() {

  function listCommand( name ) {
    this.name = name;
  }

  listCommand.prototype = {
    exec : function( editor ) {
      editor.focus();

      var doc = editor.document,
        selection = editor.getSelection(),
        ranges = selection && selection.getRanges();

      // There should be at least one selected range.
      if ( !ranges || ranges.length < 1 )
        return;

      // Find root OL.
      var liElem = selection.getStartElement().getAscendant( 'li', true );
      var olElem = liElem.getParent();

      if ( !liElem || !olElem.is( 'ol' ) )
        return;

      if ( this.name == 'markcorrectanswer' ) {
        // Clear any existing 'correct' markers
        for ( var i = 0; i < olElem.getChildCount(); i++ ) {
          olElem.getChild( i ).removeClass( 'correct' );
        }

        // Mark selected LI as correct.
        liElem.addClass( 'correct' );
      } else if (this.name == 'addmulticorrectanswer') {
        liElem.addClass( 'correct' );
      } else if (this.name == 'clearmultianswer') {
        liElem.removeClass( 'correct' );
      }
    }
  };

  CKEDITOR.plugins.easliststyle = {
    init : function( editor ) {
      editor.addCommand( 'markcorrectanswer', new listCommand( 'markcorrectanswer' ) );
      editor.addCommand( 'addmulticorrectanswer', new listCommand( 'addmulticorrectanswer' ) );
      editor.addCommand( 'clearmultianswer', new listCommand( 'clearmultianswer' ) );

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        //Register map group;
        editor.addMenuGroup("list", 108);
        editor.addMenuItems({
          markcorrectanswer:
          {
            label : 'Mark Correct Answer',
            group : 'list',
            command: 'markcorrectanswer'
          },
          addmulticorrectanswer:
          {
            label : 'Mark Correct Answer',
            group : 'list',
            command: 'addmulticorrectanswer'
          },
          clearmultianswer:
          {
            label : 'Clear Correct Answer',
            group : 'list',
            command: 'clearmultianswer'
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if ( editor.contextMenu ) {
        editor.contextMenu.addListener( function( element ) {
          if ( !element || element.isReadOnly() )
            return null;

          var list = element.getAscendant( 'ol', true );

          if ( !list ) {
            return null;
          }

          if ( list.hasClass( 'emcee' ) ) {
            return {
              markcorrectanswer: CKEDITOR.TRISTATE_OFF
            };
          } else if (list.hasClass('emcee-multi-list')) {
            return {
              addmulticorrectanswer: CKEDITOR.TRISTATE_OFF,
              clearmultianswer: CKEDITOR.TRISTATE_OFF
            };
          }
        } );
      }
    }
  };

  CKEDITOR.plugins.add( 'easliststyle', CKEDITOR.plugins.easliststyle );
} )();
