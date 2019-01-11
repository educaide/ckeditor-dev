// this plugin requires prototype javascript library to be loaded before cksource library

;(function($) {
  'use strict';

  function createColGroup(editor, columnsArray) {
    var colGroupElem = editor.document.createElement('colgroup');
    _.each(columnsArray, function(colObject) {
      var colElem = editor.document.createElement('col');
      colElem.setAttribute('align', colObject.align);

      if (colObject.decimal){
        colElem.setAttribute('decimal', colObject.decimal);
      } else {
        if (colObject.width == 'natural') {
          colElem.addClass('natural');
        }
        else {
          // TODO handle 'en' widths
          colElem.setAttribute('style', 'width: ' + colObject.width.replace(/ /g, ""));
        }
      }

      colGroupElem.append(colElem);
    });

    return colGroupElem;
  }

  function clampProperties(properties) {
    properties.layout.cols = Math.max(1, parseInt(properties.layout.cols));
    properties.layout.rows = Math.max(1, parseInt(properties.layout.rows));
    properties.layout.cols = Math.min(20, parseInt(properties.layout.cols));
    properties.layout.rows = Math.min(20, parseInt(properties.layout.rows));

    if (isNaN(properties.layout.cols))
      properties.layout.cols = 1;
    if (isNaN(properties.layout.rows))
      properties.layout.rows = 1;

    return properties
  }

  function createTable(editor, properties) {
    var tableElem = editor.document.createElement('table');
    tableElem.addClass('wall');
    tableElem.append(createColGroup(editor, properties.columns));

    for ( var key in properties ) {
      if ( key != "columns" && key != "layout" && key != "labels" ) {
        tableElem.data('eas-' + key, properties[key]);
      }
    }

    // For styling of tables in editor
    var hasHead = false, hasFoot = false;

    if (properties.labels.includeTitle) {
      var theadElem = editor.document.createElement('thead');
      var trElem = editor.document.createElement('tr');
      var tdElem = editor.document.createElement('td', { 'colspan': properties.layout.cols });
      tdElem.setAttribute('colspan', properties.layout.cols);
      if (properties.labels.titleFirst) {
        tdElem.data('eas-first', 'true');
      }
      tdElem.setText('(table title)');

      tableElem.append(theadElem);
      theadElem.append(trElem);
      trElem.append(tdElem);

      hasHead = true;
    }

    var tbodyElem = editor.document.createElement('tbody');
    tableElem.append(tbodyElem);

    for (var i = 0; i < properties.layout.rows; i++) {
      var rowElem = editor.document.createElement('tr');
      rowElem.appendTo(tbodyElem);
      if (i == (properties.layout.rows - 1))
        rowElem.setAttribute("last_row", "true");

      for (var j = 0; j < properties.layout.cols; j++) {
        var cellElem = editor.document.createElement('td');
        cellElem.appendTo(rowElem);
        cellElem.setHtml('&zwnj;');
        if (j == (properties.layout.cols - 1))
          cellElem.setAttribute("last_col", "true");
      }
    }

    if (properties.labels.includeCaption) {
      var tfootElem = editor.document.createElement('tfoot');
      var trElem = editor.document.createElement('tr');
      var tdElem = editor.document.createElement('td');
      tdElem.setAttribute('colspan', properties.layout.cols);
      if (properties.labels.captionLast) {
        tdElem.data('eas-last', 'true');
      }
      tdElem.setText('(table caption)');

      tableElem.append(tfootElem);
      tfootElem.append(trElem);
      trElem.append(tdElem);

      hasFoot = true;
    }

    // For editor style
    tableElem.setAttribute("has_head", hasHead.toString());
    tableElem.setAttribute("has_foot", hasFoot.toString());
    tableElem.setAttribute("row_cnt", properties.layout.rows.toString());
    tableElem.setAttribute("cols", properties.layout.rows.toString());

    return tableElem;
  }

  function readCustomAttributes(element, prefix) {
    var properties = {};
    var customAttributes = _.filter(element.$.attributes, function(att) {
      return att.nodeName.startsWith('data-' + prefix);
    });

    _.each(customAttributes, function(att) {
      var key = att.nodeName.substring(('data-' + prefix + '-').length).camelize();
      properties[key] = att.nodeValue;
    })

    return properties;
  }

  function readColAttributes(tableElem) {
    var columns = [];
    var $cols = $(tableElem.$).find("colgroup col");
    _.each($cols, function(colElement){
      var colObject = {
        align: colElement.getAttribute('align') || 'left',
        width: 'natural'
      };

      if (colElement.getAttribute('decimal')){
        colObject.decimal = colElement.getAttribute('decimal');
      } else if (colElement.getAttribute('class') != 'natural') {
        // TODO handle 'en' widths
        var matches = colElement.getAttribute('style').match(/width: ([\d\.]+)(%|pt|in|cm|em)/);
        if (matches) {
          colObject.width = matches[1] + ' ' + matches[2];
        }
      }

      columns.push(colObject);
    });

    return columns;
  }

  function readLabelAttributes(tableElem) {
    var titleElem = $(tableElem.$).find("thead td");
    var captionElem = $(tableElem.$).find("tfoot td");

    var labels = {
      includeTitle:   titleElem.length > 0,
      titleFirst:     titleElem.length > 0 && titleElem[0].getAttribute('data-eas-first') == 'true',
      includeCaption: captionElem.length > 0,
      captionLast:    captionElem.length > 0 && captionElem[0].getAttribute('data-eas-last') == 'true'
    };

    return labels;
  }

  function getTableProperties(tableElem) {
    var $tableElement = $(tableElem.$);
    var numRows = $tableElement.find("tbody tr").length;
    var numCols = 0;
    var styledCols = $tableElement.find("colgroup col").length;

    if (numCols == 0 || numCols == null) {
      numCols = 0;
      var headRowSize = $tableElement.find("thead tr td").length
      var footRowSize = $tableElement.find("tfoot tr td").length
      if (headRowSize > 0) {
        numCols = $tableElement.find("thead tr td")[0].getAttribute("colspan")
      }
      else if (footRowSize > 0) {
        numCols = $tableElement.find("tfoot tr td")[0].getAttribute("colspan")
      }

      if (numCols == 0) {
        numCols = $tableElement.find("tbody tr:first-child td").length
      }

      var colGroup = $tableElement.find("colgroup")
      if (colGroup.length !== 0) {
        colGroup[0].innerHtml = "<col align='center' class='natural'/>";
      }
    }

    var properties = {};
    properties.layout = {
      rows: numRows,
      cols: numCols,
    };

    properties.pos             = tableElem.getAttribute('data-eas-pos');
    properties.columns         = readColAttributes(tableElem);
    properties.border          = tableElem.getAttribute('data-eas-border');
    properties.hrule           = tableElem.getAttribute('data-eas-hrule');
    properties.vrule           = tableElem.getAttribute('data-eas-vrule');
    properties.header          = tableElem.getAttribute('data-eas-header');
    properties.headerfontstyle = tableElem.getAttribute('data-eas-headerfontstyle');
    properties.headerfontstep  = tableElem.getAttribute('data-eas-headerfontstep');
    properties.headershading   = tableElem.getAttribute('data-eas-headershading');
    properties.dropzone        = tableElem.getAttribute('data-eas-dropzone');
    properties.labels          = readLabelAttributes(tableElem);

    return properties;
  }

  CKEDITOR.plugins.add('eastable', {
    requires: 'iframedialog',
    icons: 'eastable',

    init : function( editor )  {
      var pluginName = 'eastable';
      // this variable is used to ensure that the appropriate dialog is called for the appropriate instance of editor
      var dialogName = pluginName + '-' + editor.name;

      // Register the dialog.
      CKEDITOR.dialog.addIframe(dialogName, "Table Properties", this.path + 'dialog.html', 480, 490,
        // onContentLoad
        function() {
          // set data in dialog to currently selected table's properties, if possible
          var selection = editor.getSelection(),
            startElement = selection && selection.getStartElement(),
            table = startElement && startElement.getAscendant('table', 1);

          if (!table) {
            return;
          }

          var iframe = $("#" + this.domId)[0];
          var tableProperties = getTableProperties(table);

          iframe.contentWindow.setProperties(tableProperties);
        },
        {
          resizable: CKEDITOR.DIALOG_RESIZE_NONE,
          onOk: function(args) {
            // read data back from dialog and either update existing table or create new table
            var iframe = $(args.sender.parts.dialog.$).find("iframe")[0]
            var properties = clampProperties(iframe.contentWindow.getProperties());

            var selection = editor.getSelection(),
              startElement = selection && selection.getStartElement(),
              existingTable = startElement && startElement.getAscendant('table', 1);

            if (!existingTable) {
              // insert new table
              // TODO put cursor in upper-left cell
              var table = createTable(editor, properties);
              editor.insertElement(table);

              // add leading/trailing paragraphs if necessary
              var sibling = table.getPrevious();
              if (!sibling || sibling.$.tagName != "P") {
                CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertBefore(table);
              }
              var sibling = table.getNext();
              if (!sibling || sibling.$.tagName != "P") {
                CKEDITOR.dom.element.createFromHtml("<p>&nbsp;</p>").insertAfter(table);
              }
            }
            else {
              // make sure all DOM changes are treated as one chunk
              editor.fire('updateSnapshot');

              // modify existing table
              var newTable = createTable(editor, properties);

              var newBody = newTable.getFirst(function(childElem) {
                return childElem.getName() == 'tbody';
              })
              var newHead = newTable.getFirst(function(childElem) {
                return childElem.getName() == 'thead';
              })
              var newFoot = newTable.getFirst(function(childElem) {
                return childElem.getName() == 'tfoot';
              })

              var existingBody = existingTable.getFirst(function(childElem) {
                return childElem.getName() == 'tbody';
              })
              var existingHead = existingTable.getFirst(function(childElem) {
                return childElem.getName() == 'thead';
              })
              var existingFoot = existingTable.getFirst(function(childElem) {
                return childElem.getName() == 'tfoot';
              })

              if (properties.labels.includeTitle && existingHead) {
                existingHead.replace(newHead);
              }
              if (properties.labels.includeCaption && existingFoot) {
                existingFoot.replace(newFoot);
              }
              existingBody.replace(newBody);
              newTable.replace(existingTable);
            }
          }
        }
      );

      // Register the command.
      var command = editor.addCommand(pluginName, {exec: function() { editor.openDialog(dialogName); }});
      command.modes = { wysiwyg:1, source:0 };
      command.canUndo = false;

      editor.ui.addButton('EASTable', {
        label: 'Table',
        icon: pluginName,
        command: pluginName
      });

      // If the "menu" plugin is loaded, register the menu items.
      if ( editor.addMenuItems ) {
        editor.addMenuGroup('eastable', 109);
        editor.addMenuItems({
          eastable : {
            label : 'Table Properties...',
            command : pluginName,
            group : 'eastable'
          }
        });
      }

      // If the "contextmenu" plugin is loaded, register the listeners.
      if (editor.contextMenu) {
        editor.contextMenu.addListener(function(element, selection) {
          if (!element || element.isReadOnly()) {
            return null;
          }

          if (element.hasAscendant('table', 1)) {
            return { eastable : CKEDITOR.TRISTATE_OFF };
          }

          return null;
        });
      }

    }
  });
})(jQuery);
