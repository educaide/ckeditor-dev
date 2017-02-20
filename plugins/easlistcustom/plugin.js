'use strict';

( function() {
	CKEDITOR.plugins.add( 'easlistcustom', {
		requires: 'list,menubutton',

		init: function( editor ) {
			var menuGroup = 'easlist',
				uiMenuItems = {},
				command;
			command = editor.addCommand( 'numberlist', listCommand( 'numberlist', 'decimal' ) );
			editor.addCommand( 'upperalphalist', listCommand( 'upperalphalist', 'upper-alpha' ) );
			editor.addCommand( 'loweralphalist', listCommand( 'loweralphalist', 'lower-alpha' ) );
			editor.addCommand( 'upperromanlist', listCommand( 'upperromanlist', 'upper-roman' ) );
			editor.addCommand( 'lowerromanlist', listCommand( 'lowerromanlist', 'lower-roman' ) );
			editor.addCommand( 'bulletslist', listCommand( 'bulletslist', 'disc' ) );
			if(editor.config.easEditorType == undefined){
				editor.addCommand( 'emceelist', listCommand( 'emceelist', 'emcee' ) );
			}
			editor.addCommand( 'subpartlist', listCommand( 'subpartlist', 'subparts' ) );
			editor.addCommand( 'nolist', listCommand( 'nolist', 'none' ) );

			editor.addMenuGroup( menuGroup );

			uiMenuItems.easNumber = {
				label: '1, 2, 3, ...',
				group: menuGroup,
				command: 'numberlist'
			};

			uiMenuItems.easUpperAlpha = {
				label: 'A, B, C, ...',
				group: menuGroup,
				command: 'upperalphalist'
			};

			uiMenuItems.easLowerAlpha = {
				label: 'a, b, c, ...',
				group: menuGroup,
				command: 'loweralphalist'
			};

			uiMenuItems.easUpperRoman = {
				label: 'I, II, III, ...',
				group: menuGroup,
				command: 'upperromanlist'
			};

			uiMenuItems.easLowerRoman = {
				label: 'i, ii, iii, ...',
				group: menuGroup,
				command: 'lowerromanlist'
			};

			uiMenuItems.easBullets = {
				label: 'Bullets',
				group: menuGroup,
				command: 'bulletslist'
			};
			if(editor.config.easEditorType == undefined){
				uiMenuItems.easEmcee = {
					label: 'Multiple-Choice Block',
					group: menuGroup,
					command: 'emceelist'
				};

				uiMenuItems.easSubparts = {
					label: 'Subparts',
					group: menuGroup,
					command: 'subpartlist'
				};

			}

			uiMenuItems.easNone = {
				label: 'None',
				group: menuGroup,
				command: 'nolist'
			};

			editor.addMenuItems( uiMenuItems );

			editor.ui.add( 'EASList', CKEDITOR.UI_MENUBUTTON, {
				label: 'Lists',
				icon: 'numberedlist',
				modes: { wysiwyg: 1 },

				onRender: function() {
					// Use one of the commands to set state of this dropdown.
					command.on( 'state', function() {
						this.setState( command.state );
					}, this );
				},

				onMenu: function() {
					if(editor.config.easEditorType == "passage"){
						return {
							easNumber: CKEDITOR.TRISTATE_OFF,
							easUpperAlpha: CKEDITOR.TRISTATE_OFF,
							easLowerAlpha: CKEDITOR.TRISTATE_OFF,
							easUpperRoman: CKEDITOR.TRISTATE_OFF,
							easLowerRoman: CKEDITOR.TRISTATE_OFF,
							easBullets: CKEDITOR.TRISTATE_OFF,
							easNone: CKEDITOR.TRISTATE_OFF
						};
					}else{
						return {
							easNumber: CKEDITOR.TRISTATE_OFF,
							easUpperAlpha: CKEDITOR.TRISTATE_OFF,
							easLowerAlpha: CKEDITOR.TRISTATE_OFF,
							easUpperRoman: CKEDITOR.TRISTATE_OFF,
							easLowerRoman: CKEDITOR.TRISTATE_OFF,
							easBullets: CKEDITOR.TRISTATE_OFF,
							easEmcee: CKEDITOR.TRISTATE_OFF,
							easSubparts: CKEDITOR.TRISTATE_OFF,
							easNone: CKEDITOR.TRISTATE_OFF
						};
					}
				}
			} );

			attachHooks( editor );
		}
	} );

	function listCommand( name, style ) {
		var command = new CKEDITOR.plugins.list.command( name, 'ol' );
		command.easStyle = style;

		return command;
	}

	function attachHooks( editor ) {
		editor.on( 'easListCreate', function( evt ) {
			var listNode = evt.data.node,
				style = evt.data.command.easStyle;

			if ( style == 'emcee' || style == 'subparts' ) {
				listNode.addClass( style );
			}
			else {
				listNode.addClass( 'list' );
				listNode.addClass( style );

                                var counter_map =
                                  {
                                    "decimal"     : "1",
                                    "upper-alpha" : "A",
                                    "lower-alpha" : "a",
                                    "upper-roman" : "I",
                                    "lower-roman" : "i",
                                    "disc"        : ""
                                  }

                                listNode.setAttribute("data-eas-label","#.");

                                listNode.setAttribute("data-eas-counter",counter_map[style]);
			}
		} );

		editor.on( 'easListCreated', function( evt ) {
			editor.fire('easListChange', evt.data);
		} );

		editor.on( 'easListChange', function( evt ) {
			var listNode = evt.data.node,
				style = evt.data.command.easStyle;

			if ( style == 'emcee' ) {
				listNode.removeClass( 'subparts' );
				listNode.removeClass( 'list' );
				listNode.addClass( 'emcee' );
				listNode.removeStyle( 'list-style-type' );
			} else if ( style == 'subparts' ) {
				listNode.removeClass( 'emcee' );
				listNode.removeClass( 'list' );
				listNode.addClass( 'subparts' );
				listNode.removeStyle( 'list-style-type' );
			} else {
				listNode.$.className = "list " + style;
				listNode.removeStyle( 'list-style-type' );

                                var children = listNode.$.children;

                                var label_key = listNode.getAttribute("data-eas-label");

                                var map =
                                {
                                  "decimal"      : "1",
                                  "upper-alpha"  : "A",
                                  "lower-alpha"  : "a",
                                  "upper-roman"  : "I",
                                  "lower-roman"  : "i",
                                  "none"         : "none",
                                  "disc"         : "bullet"
                                }

                                var key = map[style];

                                if ( key == "bullet" ) {
                                	listNode.setAttribute("data-eas-label",key);
                                } else {
                                	listNode.setAttribute("data-eas-counter",key);

                                	if ( label_key == "bullet" && key != "bullet" ) {
						listNode.setAttribute("data-eas-label","#.");
						label_key = "#.";
                                	}

					if ( label_key ) {
                                		for (var i = 0; i < children.length; i++) {

							var label_map_left =
							{
  						  	  "#"      : "",
  						  	  "#."     : "",
  						  	  "#)"     : "",
  						  	  "(#)"    : "(",
  						  	  "bullet" : ""
							}

							var label_map_right =
							{
  						  	  "#"      : "",
  						  	  "#."     : ".",
  						  	  "#)"     : ")",
  						  	  "(#)"    : ")",
  						  	  "bullet" : ""
							}

                                			children[i].setAttribute("label-left", label_map_left[label_key]);
                                			children[i].setAttribute("label-right", label_map_right[label_key]);
                                		}
                                	}
				}
			}
		} );
	}
} )();
