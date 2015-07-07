document.observe('dom:loaded', initColumnWidthOptions);
document.observe('dom:loaded', attachListeners);

// note: options stay persistent while resizing table's columns
var columnWidthOptions = [];

/* properties object
 * properties = {
 *   layout: {
 *     rows: 123
 *     cols: 123
 *     position: left | center | right | indent | none
 *   },
 *   columns: [
 *     {
 *       align: left | center | right | decimal
 *       width: natural | <dimension|percentage string>
 *     }
 *   ],
 *   borders: {
 *     outside: none | single | double | shadow | thick
 *     horizontal: none | first | inner | all
 *     vertical: none | first | inner | all
 *   },
 *   headers:
 *     display: none | left | top | both
 *     fontStyle: normal | bold | italic | alternate
 *     fontSize: normal | small | verySmall | large | veryLarge
 *   },
 *   labels: {
 *     includeTitle: true | false
 *     titleFirst: true | false
 *     includeCaption: true | false
 *     captionLast: true | false
 *   }
 * }
 */

function setProperties(properties) {
  $('rows').disabled = $('cols').disabled = true;
  $('rows').value = properties.layout.rows;
  $('cols').value = properties.layout.cols;
  $('position').value = properties.layout.position;

  columnWidthOptions = properties.columns;

  $('outsideBorder').value = properties.borders.outside;
  $('horizontalBorder').value = properties.borders.horizontal;
  $('verticalBorder').value = properties.borders.vertical;

  if (properties.headers) {
    if (properties.headers.display) {
      $('header' + properties.headers.display.capitalize()).checked = true;
    }

    $('headerFontStyle').value = properties.headers.fontStyle;
    $('headerFontSize').value = properties.headers.fontSize;
    $('headerShading').checked = properties.headers.shading;
  }

  $('includeTitle').checked   = properties.labels.includeTitle;
  $('includeCaption').checked = properties.labels.includeCaption;
  $('titleFirst').checked     = properties.labels.titleFirst;
  $('captionLast').checked    = properties.labels.captionLast;

  updateColumnsSection();
  updateBorderPreview();
  updateLabelCheckboxes();
  updateFontSelections();
}

function getProperties() {
  var properties = {
    layout: {
      rows: $('rows').value,
      cols: $('cols').value,
      position: $('position').value
    },
    columns: columnWidthOptions.findAll(function(o, index) { return index < $('cols').value }),
    borders: {
      outside: $('outsideBorder').value,
      horizontal: $('horizontalBorder').value,
      vertical: $('verticalBorder').value
    },
    headers: {
      display: $('headers').select('input[name="header"]').find(function(e) { return e.checked }).value,
      fontStyle: $('headerFontStyle').value,
      fontSize: $('headerFontSize').value,
      shading: $('headerShading').checked
    },
    labels: {
      includeTitle: $('includeTitle').checked,
      titleFirst: $('titleFirst').checked,
      includeCaption: $('includeCaption').checked,
      captionLast: $('captionLast').checked
    }
  };

  return properties;
}

function initColumnWidthOptions() {
  for (var i = 0; i < parseInt($('cols').value); i++) {
    columnWidthOptions.push({'align': 'left', 'width': 'natural'});
  }
}

function clampRowColElem(elem) {
  var val = elem.value;
  var newVal = ''
  if (elem.id == 'cols') {
    newVal = Math.max(1, parseInt(val)).toString();
    newVal = Math.min(20, parseInt(newVal)).toString();
    if (newVal == 'NaN')
      elem.value = '1';
    else if (newVal != val)
      elem.value = newVal;
  }
  else if (elem.id == 'rows') {
    newVal = Math.max(1, parseInt(val)).toString();
    newVal = Math.min(20, parseInt(newVal)).toString();
    if (newVal == 'NaN')
      elem.value = '1';
    else if (newVal != val)
      elem.value = newVal;
  }
} 

function attachListeners(event) {
  $('rows', 'cols').each(function(sizeElem) {
    sizeElem.on('change', function(e) {
      clampRowColElem(sizeElem);
      updateBorderPreview();
      if (sizeElem.id == 'cols') {
        updateColumnsSection();
      }
    });
  });

  // because change events don't bubble up in IE8, we have to resort
  // to listening to individual widgets instead of listening on their
  // containing divs
  $('columns').select('select, input[type=text]').invoke('on', 'change', onColumnWidgetChange);
  $('columns').select('input[type=radio]').invoke('on', 'click', onColumnWidgetChange);
  $('borders').select('select').invoke('on', 'change', 'select', updateBorderPreview);
  $('headers').select('input[type=radio]').invoke('on', 'change', updateFontSelections);
  $('labels').select('input[type=checkbox]').invoke('on', 'change', updateLabelCheckboxes);

  updateColumnsSection();
  updateBorderPreview();
  updateLabelCheckboxes();
  updateFontSelections();
}

function onColumnWidgetChange(event) {
  updateColumnsSection(event.element().id != 'editColumn' ? event.element() : null);
  updateWidthEnabled();
}

function updateFontSelections() {
  $('headerFontStyle', 'headerFontSize', 'headerShading').each(function(selectElem) {
    selectElem.disabled = $('headerNone').checked;
  });
}

function updateWidthEnabled() {
  var decimalAlign = $('alignmentDecimal').checked;
  $('decimalPadding').disabled = !decimalAlign;
  
  var widthEnabled = !decimalAlign;
  $('natural', 'fixed').each(function(elem) {
    elem.disabled = !widthEnabled
  });
  
  var dimensionEnabled = widthEnabled && $('fixed').checked;
  $('width', 'dimension').each(function(elem) {
    elem.disabled = !dimensionEnabled
  });
}

function updateColumnsSection(element) {
  if (element) {
    // an alignment or width option has changed
    var options = columnWidthOptions[$('editColumn').options.selectedIndex];
    var alignRadio = $('columns').select('input[name=alignment]').find(function(r) { return r.checked; });
    options.align = alignRadio.value;
    
    if (options.align == 'decimal'){
      options.align = 'right';
      options.decimal = $('decimalPadding').value;
    } else {
      options.decimal = null;
    }
    
    var widthRadio = $('columns').select('input[name=width]').find(function(r) { return r.checked; });
    if (widthRadio.value == 'natural') {
      options.width = 'natural';
    }
    else {
      options.width = $('width').value + ' ' + $('dimension').value;
    }
  }
  else {
    // just a request to refresh the controls based on the currently-selected column
    var numCols = parseInt($('cols').value);

    // make sure editColumn selector has the correct number of entries
    if (numCols != $('editColumn').options.length) {
      $('editColumn').childElements().invoke('remove');
      for (var i = 0; i < numCols; i++) {
        var child = new Element('option', { 'value': i + 1 }).update(i + 1);
        $('editColumn').insert({ bottom: child });
      }

      $('editColumn').options.selectedIndex = 0;
    }

    // resize columnWidthOptions object if necessary
    if (columnWidthOptions.length < numCols) {
      var extraNeeded = numCols - columnWidthOptions.length;
      for (var i = 0; i < extraNeeded; i++) {
        columnWidthOptions.push({'align': 'center', 'width': 'natural'});
      }
    }

    // show alignment/width options for currently-selected column
    var options = columnWidthOptions[$('editColumn').options.selectedIndex];
   
    var alignment = options.align.capitalize();
    if (options.decimal){
      alignment = "Decimal"; // note this should be capitalized to find alignmentDecimal
      $('decimalPadding').value = options.decimal;
    } else {
      $('decimalPadding').value = 2;
    }

    $('alignment' + alignment).checked = true;
    if (options.width == 'natural') {
      $('natural').checked = true;
      $('width').value = '0.0';
      $('dimension').value = 'in';
    }
    else {
      $('fixed').checked = true;
      var tokens = options.width.split(' ');
      $('width').value = tokens[0];
      $('dimension').value = tokens[1];
    }
  }

  updateWidthEnabled();
}

function updateBorderPreview() {
  var numCols = Math.min(10, parseInt($('cols').value));
  var numRows = Math.min(10, parseInt($('rows').value));

  var tableElem = $('borderPreview');
  tableElem.update('');
  var styleObject = {};
  switch ($('outsideBorder').value) {
    case 'none':
      styleObject.border = '1px dotted lightgray';
      break;
    case 'single':
      styleObject.border = '1px solid black';
      break;
    case 'double':
      styleObject.border = '3px double black';
      break;
    case 'shadow':
      styleObject.border = '1px solid black';
      styleObject.borderRight = '2px solid black';
      styleObject.borderBottom = '2px solid black';
      break;
    case 'thick':
      styleObject.border = '3px solid black';
      break;
  }
  tableElem.setStyle(styleObject);


  for (var i = 0; i < numRows; i++) {
    var rowElem = new Element('tr');
    tableElem.insert({ bottom: rowElem });

    for (var j = 0; j < numCols; j++) {
      var colElem = new Element('td');
      rowElem.insert({ bottom: colElem });

      var styleObject = {};
      switch ($('verticalBorder').value) {
        case 'none':
          styleObject.borderLeft = '1px dotted lightgray';
          styleObject.borderRight = '1px dotted lightgray';
          break;
        case 'first':
          if (j == 0) {
            styleObject.borderRight = '1px solid black';
          }
          break;
        case 'inner':
          if (j == 0) {
            styleObject.borderRight = '1px solid black';
          }
          else if (j == numCols - 1) {
            styleObject.borderLeft = '1px solid black';
          }
          else {
            styleObject.borderRight = '1px solid black';
            styleObject.borderLeft = '1px solid black';
          }
          break;
        case 'all':
          styleObject.borderRight = '1px solid black';
          styleObject.borderLeft = '1px solid black';
          break;
      }
      switch ($('horizontalBorder').value) {
        case 'none':
          styleObject.borderTop = '1px dotted lightgray';
          styleObject.borderBottom = '1px dotted lightgray';
          break;
        case 'first':
          if (i == 0) {
            styleObject.borderBottom = '1px solid black';
          }
          break;
        case 'inner':
          if (i == 0) {
            styleObject.borderBottom = '1px solid black';
          }
          else if (i == numRows - 1) {
            styleObject.borderTop = '1px solid black';
          }
          else {
            styleObject.borderBottom = '1px solid black';
            styleObject.borderTop = '1px solid black';
          }
          break;
        case 'all':
          styleObject.borderBottom = '1px solid black';
          styleObject.borderTop = '1px solid black';
          break;
      }
      colElem.setStyle(styleObject);
    }
  }
}

function updateLabelCheckboxes() {
  $('labels').select('input[type="checkbox"]').each(function(checkElem) {
    if (checkElem.id.startsWith('include')) {
      var associatedCheckBox = checkElem.up().next().down(); // TODO fragile association
      associatedCheckBox.disabled = !checkElem.checked;
    }
  });
}
