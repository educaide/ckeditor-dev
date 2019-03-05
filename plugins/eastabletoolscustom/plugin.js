( function() {
	'use strict';

	CKEDITOR.plugins.add( 'eastabletoolscustom', {
		requires: 'table,tabletools',

		// Register menu items making use of commands exposed by the table (delete) and tabletools (all the rest) plugins.
		init: function( editor ) {
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuGroup( 'tableinsert', 107 );
				editor.addMenuGroup( 'tabledelete', 108 );

				editor.addMenuItems( {
					eas_tablerow_insertBefore: {
						label: 'Insert Row Above',
						group: 'tableinsert',
						command: 'rowInsertBefore',
						order: 1
					},

					eas_tablerow_insertAfter: {
						label: 'Insert Row Below',
						group: 'tableinsert',
						command: 'rowInsertAfter',
						order: 2
					},

					eas_tablecolumn_insertBefore: {
						label: 'Insert Column Left',
						group: 'tableinsert',
						command: 'columnInsertBefore',
						order: 3
					},

					eas_tablecolumn_insertAfter: {
						label: 'Insert Column Right',
						group: 'tableinsert',
						command: 'columnInsertAfter',
						order: 4
					},

					eas_tablerow_delete: {
						label: 'Delete Rows',
						group: 'tabledelete',
						command: 'rowDelete',
						order: 1
					},

					eas_tablecolumn_delete: {
						label: 'Delete Columns',
						group: 'tabledelete',
						command: 'columnDelete',
						order: 2
					},

					eas_table_delete: {
						label: 'Delete Table',
						group: 'tabledelete',
						command: 'tableDelete',
						order: 3
					}
				} );
			}

			// If the "contextmenu" plugin is laoded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					if ( !element || element.isReadOnly() ) {
						return null;
					}

					if ( element.hasAscendant('table', 1) ) {
						if ( element.hasAscendant('thead', 1) || element.hasAscendant('tfoot', 1) ) {
							return {
								table_delete: CKEDITOR.TRISTATE_OFF
							};
						} else {
							return {
								eas_tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
								eas_tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
								eas_tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
								eas_tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
								eas_tablerow_delete: CKEDITOR.TRISTATE_OFF,
								eas_tablecolumn_delete: CKEDITOR.TRISTATE_OFF,
								eas_table_delete: CKEDITOR.TRISTATE_OFF
							};
						}
					}

					return null;
				} );
			}
		},

		// Use afterInit to make sure that this code is executed after tabletools' init callback.
		// The fact that this plugin requires tabletools does not mean that its init callback will
		// be executed after tabletools' one.
		afterInit: function( editor ) {
			// Remove all the items that we don't want in the context menu. These are positions addeded by the
			// table and tabletools plugins.
			editor.removeMenuItem( 'table' );
			editor.removeMenuItem( 'tabledelete' );
			editor.removeMenuItem( 'tablecell' );
			editor.removeMenuItem( 'tablerow' );
			editor.removeMenuItem( 'tablecolumn' );
		}
	} );

} )();