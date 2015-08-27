/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.plugins = [
		'wysiwygarea',
		'clipboard',
		'undo',
		'enterkey',
		'toolbar',
		'elementspath',
		'contextmenu',
		'htmlwriter',
		'entities',
		'basicstyles',
		'justify',
		'list',
		'indentlist',

		'easbehaviors',
		'easfontsize',
		'easimage',
		'easimagestyle',
		'easintro',
		'easlistcustom',
		'easliststyle',
		'easmath',
		'easmathimages',
		'easparbox',
		'easproperties',
		'easspecials',
		'eastable',
		'eastabletoolscustom',
		'easwordstyle'
	].join( ',' );

	config.toolbar = [
		[ 'Undo', 'Redo' ],
		[ 'Bold','Italic','Underline', '-', 'Subscript', 'Superscript' ],
		[ 'EASWordStyle' ],
		[ 'EASFontSize' ],
		[ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', 'Indent', 'Outdent' ],
		[ 'EASList' ],
		[ 'EASTable', 'EASImage', 'EASSpecials', '-', 'EASIntro', 'EASParBox', 'EASMathImages' ]
	];

	config.skin = 'kama';

	config.allowedContent = true;
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
