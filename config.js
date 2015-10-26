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
		'lineutils',
		'indentlist',
		'indentblock',
		'widget',

		'easbehaviors',
		'easfontsize',
		'easimage',
		'easimagestyle',
		'easintro',
		'easlistcustom',
		'easliststyle',
		'easmath',
		'easmathquill',
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
		[ 'EASList'],
		[ 'EASMathQuill'],
		[ 'EASTable', 'EASImage', 'EASSpecials', '-', 'EASIntro', 'EASParBox', 'EASMathImages' ]
	];

	config.skin = 'kama';
	config.allowedContent = true;
	//allow mathquill styling
	config.contentsCss = '/stylesheets/mathquill.css';
	config.height = 400;
    	config.minimumChangeMilliseconds = 500;
    	config.disableObjectResizing = true;
};