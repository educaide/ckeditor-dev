'use strict';

function specialStyle(style) {
	return ( style == 'emcee' || style == 'subparts' || style == 'emcee-multi-list' || style == 'dragdroplist' || style == 'orderinglist' );
}

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
				editor.addCommand( 'emceemultilist', listCommand( 'emceelist', 'emcee-multi-list' ) );
        editor.addCommand( 'dragdroplist', listCommand( 'dragdroplist', 'dragdroplist' ) );
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

			if(editor.config.easEditorType == undefined && /stem/.test(editor.element.getId())){
				uiMenuItems.easEmcee = {
					label: 'Multiple-Choice Block',
					group: menuGroup,
					command: 'emceelist'
				};

				uiMenuItems.easMultiEmcee = {
					label: 'Multi-Select Block',
					group: menuGroup,
					command: 'emceemultilist'
				};

				uiMenuItems.easDragDrop = {
					label: 'Drag-and-Drop Items',
					group: menuGroup,
					command: 'dragdroplist'
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
							easMultiEmcee: CKEDITOR.TRISTATE_OFF,
							easDragDrop: CKEDITOR.TRISTATE_OFF,
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

			if (specialStyle(style)) {
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

			if (specialStyle(style)) {
        if ($(listNode.$).hasClass("emcee-multi-list") && style == 'emcee') {
          /* then we're converting from multi back to a normal list */
          $(listNode.$).find("li.correct").removeClass("correct")
        }

        $(listNode.$)
          .removeClass()
          .addClass(style)
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
  						  	  "bullet" : "",
  						  	  "none"   : ""
							}

							var label_map_right =
							{
  						  	  "#"      : "",
  						  	  "#."     : ".",
  						  	  "#)"     : ")",
  						  	  "(#)"    : ")",
  						  	  "bullet" : "",
  						  	  "none"   : ""
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
