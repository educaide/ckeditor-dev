/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* global jQuery */

( function() {
	'use strict';

	// A list of commands that should be blocked when MathQuill widget is focused.
	var blockedCommands = [
		'indent',
		'outdent'
	];

	// A list of key codes that should be blocked when MathQuill widget is focused.
	// Note that keys will be blocked at CKEditor editor's object handling level, so earlier
	// listeners will still be executed (e.g. MathQuill internal listeners).
	var blockedKeys = [
		8, // Backspace
		9 // Tab
	];

	CKEDITOR.plugins.add( 'mathquill', {
		requires: 'widget',
		icons: 'mathquill',
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			var path = this.path,
				mathQuillPath = path + '../../../mathquill/',
				MATHQUILL_KEYSTROKE = CKEDITOR.CTRL + 77; // CTRL + M

			if ( editor.addContentsCss ) {
				editor.addContentsCss( mathQuillPath + 'mathquill.css' );
			}

			CKEDITOR.scriptLoader.load( mathQuillPath + 'mathquill.min.js', function( result ) {
				if ( !result ) {
					console.error( 'Could not fetch MathQuill script.' );
				}
			} );

			function checkIfWidgetIsFocused( editor ) {
				var currentActive = editor.document.getActive();

				// editor.widgets.focused can't be used as focus is inside widget's textarea,
				// not widget itself.
				return currentActive && currentActive.getAscendant( function( el ) {
					return el.type == CKEDITOR.NODE_ELEMENT && el.hasClass( 'mathquill-widget' );
				}, 1 );
			}

			function moveSelectionAfterElement( editor, element ) {
				var range = editor.createRange();
				range.moveToPosition( element, CKEDITOR.POSITION_AFTER_END );
				editor.getSelection().selectRanges( [ range ] );
			}

			editor.on( 'key', function( evt ) {
				if ( evt.data.domEvent.getKeystroke() == MATHQUILL_KEYSTROKE ) {
					var widgetEl = checkIfWidgetIsFocused( editor );

					if ( widgetEl ) {
						moveSelectionAfterElement( editor, widgetEl.getParent() );

						if ( CKEDITOR.env.gecko ) {
							editor.focus();
						}
					} else {
						editor.execCommand( 'mathQuill' );
					}

					evt.cancel();
				}
			} );

			// This fix prevents custom backspace handlers (like the one from #13771 or list backspace handler)
			// from triggering.
			editor.on( 'key', function( evt ) {
				var keyCode = evt.data.domEvent.getKey();

				if ( CKEDITOR.tools.indexOf( blockedKeys, keyCode ) !== -1 && checkIfWidgetIsFocused( evt.editor ) ) {
					evt.cancel();
				}
			}, null, null, 1 );

			// Some commands might need to be blocked while the MathQuill widget is focused, e.g. list indentation.
			editor.on( 'beforeCommandExec', function( evt ) {
				if ( !checkIfWidgetIsFocused( evt.editor ) ) {
					// We want to cancel certian commands only if the MathQuill widget is focused.
					return;
				}

				if ( CKEDITOR.tools.indexOf( blockedCommands, evt.data.name ) !== -1 ) {
					evt.cancel();
				}
			} );

			editor.widgets.add( 'mathQuill', {
				allowedContent: 'span(!mathquill-widget)',
				button: 'Insert Equation',
				template: '<span class="mathquill-widget"></span>',
				draggable: false, // Widget should not feature drag hanlder.

				init: function() {
					var $jqElement = jQuery( this.element.$ ),
						that = this;

					// All this is somehow ugly. It should be possible to update the source using setData().
					// There should be an easy way to get the source. MathQuill shouldn't touch widget.element,
					// so we need another one.
					this.once( 'ready', function() {
						if ( that.data.source ) {
							// Replace all the HTML that MathQuill had created with just the source.
							// This reverts the element to the initial state.
							that.element.setText( that.data.source );
						}

						// Enable editable MathQuill.
						var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
						var field = MQ.MathField($jqElement[0]);

						// Store the initial source. Take it from MathQuill so it is normalized.
						that.setData( 'source', field.latex() );

						var textarea = that.element.findOne( '.mq-textarea > textarea' );

						editor.focusManager.add( textarea );

						textarea.on( 'focus', function() {
							// Lock undo manager completely during editing an equation.
							editor.fire( 'lockSnapshot' );
						} );

						textarea.on( 'blur', function() {
							// Update source so we can copy&paste, undo&redo, etc.
							that.setData( 'source', field.latex() );
							editor.fire( 'unlockSnapshot' );
						} );
					} );
				},

				// We must overwrite this method to correctly manage focus after widget's insertion.
				insert: function() {
					// Default insertion proccess for widgets.
					var element = CKEDITOR.dom.element.createFromHtml( this.template.output() ),
						instance,
						wrapper = editor.widgets.wrapElement( element, this.name ),
						temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

					temp.append( wrapper );
					instance = editor.widgets.initOn( element, this );

					instance.once( 'edit', function() {
						editor.widgets.finalizeCreation( temp );
					}, null, null, 999 );

					instance.edit();
					// And now focusing the mathquill editable.
					editor.getSelection().selectElement( instance.element );

					var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
					var mathQuillTextarea = MQ(instance.element.$);

					if ( mathQuillTextarea ) {
						mathQuillTextarea.focus();
					}
				},

				edit: function() {
					// Widget edit action should simply focus MathQuill internal part.
					var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
					var mathQuillTextarea = MQ(this.element.$);

					if ( mathQuillTextarea ) {
						mathQuillTextarea.focus();
					}
				},

				upcast: function( el ) {
					return el.name == 'span' && el.hasClass( 'mathquill-widget' );
				},

				downcast: function() {
					var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
					var field = MQ.MathField(jQuery(this.element.$)[0]);
					var text = new CKEDITOR.htmlParser.text( field.latex() ),
						span = new CKEDITOR.htmlParser.element( 'span' );

					span.attributes[ 'class' ] = 'mathquill-widget';
					span.add( text );

					return span;
				}
			} );
		}
	} );

} )();
