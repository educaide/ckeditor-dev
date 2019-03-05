/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/* exported CKBUILDER_CONFIG */

var CKBUILDER_CONFIG = {
	skin: 'kama',
	ignore: [
		'bender.js',
		'.bender',
		'bender-err.log',
		'bender-out.log',
		'dev',
		'docs',
		'.DS_Store',
		'.editorconfig',
		'.gitignore',
		'.gitattributes',
		'gruntfile.js',
		'.idea',
		'.jscsrc',
		'.jshintignore',
		'.jshintrc',
		'less',
		'.mailmap',
		'node_modules',
		'package.json',
		'README.md',
		'tests'
	],
	plugins: {
		wysiwygarea: 1,
		clipboard: 1,
		undo: 1,
		enterkey: 1,
		toolbar: 1,
		elementspath: 1,
		contextmenu: 1,
		htmlwriter: 1,
		entities: 1,
		basicstyles: 1,
		justify: 1,
		list: 1,
		indentlist: 1,
		indentblock: 1,

		easbehaviors: 1,
		easfontsize: 1,
		easimage: 1,
		easimagestyle: 1,
		easintro: 1,
		easlistcustom: 1,
		easliststyle: 1,
		easmath: 1,
		easmathimages: 1,
		easparbox: 1,
		easproperties: 1,
		easspecials: 1,
		eastable: 1,
		eastabletoolscustom: 1,
		easwordstyle: 1
	}
};
