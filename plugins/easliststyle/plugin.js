/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {

  function listCommand( name ) {
    this.name = name;
  }

  listCommand.prototype = {
    exec : function( editor ) {
      editor.focus();

      var doc = editor.document,
      selection = editor.getSelection(),
      ranges = selection && selection.getRanges( true );

      // There should be at least one selected range.
      if ( !ranges || ranges.length < 1 )
        return;

      // find root OL
      var liElem = selection.getStartElement();
      var olElem = new CKEDITOR.dom.element( liElem.$.parentNode );
      if ( liElem.$.tagName != "LI" || olElem.$.tagName != "OL" )
        return;

      if ( this.name == 'markcorrectanswer' ) {
        // clear any existing 'correct' markers
        for ( var i = 0; i < olElem.$.childNodes.length; i++ ) {
          new CKEDITOR.dom.element( olElem.$.childNodes[i] ).removeClass( 'correct' );
        }

        // mark selected LI as correct
        liElem.addClass( 'correct' );
      }
      else if ( this.name == 'listproperties' ) {
        alert('to be implemented');
      }
    }
  };

  CKEDITOR.plugins.easliststyle = {
    init : function( editor ) {
      editor.addCommand( 'markcorrectanswer', new listCommand( 'markcorrectanswer' ) );
//      editor.addCommand( 'listproperties', new listCommand( 'listproperties' ) );

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        //Register map group;
	editor.addMenuGroup("list", 108);
	editor.addMenuItems({
          markcorrectanswer :
          {
            label : 'Mark Correct Answer',
            group : 'list',
            command: 'markcorrectanswer'
          }
//          ,listproperties :
//          {
//            label : 'List Properties...',
//            group : 'list',
//            command: 'listproperties'
//          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if ( editor.contextMenu ) {
	editor.contextMenu.addListener( function( element, selection ) {
          if ( !element || element.isReadOnly() )
            return null;

          // TODO consider requiring Prototype and using its helpers to do this kind of stuff
          // find parent OL of element
          while ( element ) {
            var name = element.getName();
            if ( name == 'ol' ) {
              // TODO cross-browser way to detect this
              var isMultiItemSelection = false;
              if ( element.hasClass( 'emcee' ) )
                return { markcorrectanswer: isMultiItemSelection ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF,
                         listproperties: CKEDITOR.TRISTATE_OFF };
              else if ( !element.hasClass( 'emcee' ) )
                return { listproperties: CKEDITOR.TRISTATE_OFF };
            }

            element = element.getParent();
          }
          return null;
        });
      }
    }
  };

  CKEDITOR.plugins.add( 'easliststyle', CKEDITOR.plugins.easliststyle );
})();
