﻿CKEDITOR.editorConfig = function( config ) {
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
		'lineutils',
		'indentlist',
		'indentblock',
		'widget',
		'richcombo',
		'floatpanel',
		'listblock',
		'panel',
		'button',
		'format',

		'easbehaviors',
		'easfontsize',
		'easimage',
		'easimagestyle',
		'easintro',
		'easlistcustom',
		'easliststyle',
		'easmath',
		'easmathimages',
		'mathquill',
		'easparbox',
		'easproperties',
		'easspecials',
		'eastable',
		'eastabletoolscustom',
		'easwordstyle',
    'easdropdown'
	].join( ',' );

	config.toolbar = [
		[ 'Undo', 'Redo' ],
		[ 'Bold','Italic','Underline', '-', 'Subscript', 'Superscript' ],
		[ 'EASWordStyle' ],
		[ 'EASDropdown' ],
		[ 'EASFontSize' ],
		[ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock', 'Indent', 'Outdent' ],
		[ 'EASList'],
		[ 'EASTable', 'EASImage', 'EASSpecials', '-', 'EASIntro', 'EASParBox', 'EASMathImages' ],
	];

	config.skin = 'kama';
	config.allowedContent = true;
	config.height = 400;
	config.minimumChangeMilliseconds = 500;
	config.disableObjectResizing = true;
	config.disableNativeSpellChecker = false;
	config.browserContextMenuOnCtrl = true;
	config.pasteFilter = 'plain-text';
};
