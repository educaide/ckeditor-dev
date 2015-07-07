document.observe('dom:loaded', populateGroupList);
document.observe('dom:loaded', attachListeners);

function getProperties() {
  var selectedChar = $('characters').down('.selected');
  var sizeMode = $$('input[name=size]').select(function(e) { return e.checked; }).first().value;
  if (sizeMode == 'fixed') {
    var sizeValue = $('width').value + $('dimension').value;
  }
  else {
    var sizeValue = $('percentage').value * 10;
  }

  return {
    group:     $('groups').value,
    index:     selectedChar.readAttribute('data-index'),
    sizeMode:  sizeMode,
    sizeValue: sizeValue,
    rotation:  $('rotate').value,
    alignment: $('align').value
  };
}

function populateGroupList(event) {
  data.each(function(groupObj) {
    $('groups').options.add(new Option(groupObj.name, groupObj.name));
  });

  selectGroup(0);
}

function selectGroup(index) {
  $('groups').selectedIndex = index;
  var charDiv = $('characters');
  var iconFont = data[index];

  charDiv.update();
  // skip index 0, which is always an EAS logo
  for (var i = 1; i < iconFont.size; i++) {
    var charElem = new Element('div', { 'class': 'char', 'data-index': i });
    var styleRule = "width: #{width}px; height: #{height}px; background-image:url('/images/icons/#{name}.png'); ".interpolate(iconFont);
    styleRule += "background-position: -#{offset}px 0px".interpolate({ offset: i*iconFont.width });
    charElem.writeAttribute('style', styleRule);
    charDiv.insert({ bottom: charElem });
  }

  charDiv.firstDescendant().addClassName('selected');
}

function onClickChar(event, charElem) {
  var curSelection = $('characters').down('.selected');
  curSelection.removeClassName('selected');
  charElem.addClassName('selected');
}

function enableScaleWidgets(isScaleChecked) {
  if (isScaleChecked) {
    $('percentage').enable();
    $('width').disable();
    $('dimension').disable();
  }
  else {
    $('percentage').disable();
    $('width').enable();
    $('dimension').enable();
  }
}

function attachListeners(event) {
  $('groups').on('change', function(changeEvent) {
    selectGroup($('groups').selectedIndex);
  });

  $('percentage').on('blur', function(blurEvent) {
    var intValue = parseInt(blurEvent.element().value);
    if (isNaN(intValue)) {
      intValue = 100;
    }
    else if (intValue < 10) {
      intValue = 10;
    }
    else if (intValue > 200) {
      intValue = 200;
    }

    blurEvent.element().value = intValue;
  });

  $('width').on('blur', function(blurEvent) {
    var floatValue = parseFloat(blurEvent.element().value);
    if (isNaN(floatValue)) {
      floatValue = 0.5;
    }
    else if (floatValue < 0) {
      floatValue = 0.0;
    }
    else if (floatValue > 100) {
      floatValue = 100.0;
    }

    blurEvent.element().value = floatValue;
  });

  $('scale', 'fixed').each(function(radioElem) {
    radioElem.on('change', function(e) {
      enableScaleWidgets($('scale').checked);
    });
  });
  enableScaleWidgets($('scale').checked);

  $('characters').on('click', '.char', onClickChar);
}

