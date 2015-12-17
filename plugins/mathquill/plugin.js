/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* global jQuery */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'mathquill', {
		requires: 'widget',
		icons: 'mathquill',
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			var path = this.path,
				mathQuillPath = path + 'lib/mathquill/';
				//mathQuillPath = 'http://mathquill.com/mathquill/';

			if ( editor.addContentsCss ) {
				editor.addContentsCss( mathQuillPath + 'mathquill.css' );
			}

			CKEDITOR.scriptLoader.load( mathQuillPath + 'mathquill.js', function( result ) {
				if ( !result ) {
					console.error( 'Could not fetch MathQuill script.' );
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
						$jqElement.mathquill( 'editable' );
						// Store the initial source. Take it from MathQuill so it is normalized.
						that.setData( 'source', $jqElement.mathquill( 'latex' ) );

						var textarea = that.element.findOne( '.textarea > textarea' );

						editor.focusManager.add( textarea );

						textarea.on( 'focus', function() {
							// Lock undo manager completely during editing an equation.
							editor.fire( 'lockSnapshot' );
						} );

						textarea.on( 'blur', function() {
							// Update source so we can copy&paste, undo&redo, etc.
							that.setData( 'source', $jqElement.mathquill( 'latex' ) );
							editor.fire( 'unlockSnapshot' );
						} );

						textarea.on( 'keydown', function( evt ) {
							if ( evt.data.getKeystroke() === CKEDITOR.CTRL + 77 ) { // CTRL + M
								// Move back focus to the widget wrapper within the editor's editable element.
								that.focus();
								// Cancel the event, so it won't be handled by any further code.
								evt.cancel();
							}
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

					instance.once( 'edit', function( evt ) {
						editor.widgets.finalizeCreation( temp );
					}, null, null, 999 );

					instance.edit();
					// And now focusing the mathquill editable.
					editor.getSelection().selectElement( instance.element );
					instance.element.findOne( '.textarea > textarea' ).focus();
				},

				upcast: function( el ) {
					return el.name == 'span' && el.hasClass( 'mathquill-widget' );
				},

				downcast: function() {
					var text = new CKEDITOR.htmlParser.text( jQuery( this.element.$ ).mathquill( 'latex' ) ),
						span = new CKEDITOR.htmlParser.element( 'span' );

					span.attributes[ 'class' ] = 'mathquill-widget';
					span.add( text );

					return span;
				}
			} );

			// Register keystrokes.
			editor.setKeystroke( CKEDITOR.CTRL + 77, 'mathQuill' ); // CTRL + M
		}
	} );

} )();
