document.observe('dom:loaded', function() {
  attachListeners();
});

function attachListeners() {
  $('scaling').on('keyup', refreshSizeDisplay);
  $('alignment').on('change', refreshAlignDisplay);
}

function refreshAlignDisplay() {
  var alignment = $('alignment').value;
  var imageEl = $('dialog').down('.preview .image');
  properties.alignment = alignment;

  if (alignment == 'none' || alignment == 'bottom') {
    imageEl.setStyle({
      verticalAlign: 'inherit'
    });
  }
  else if (alignment == 'center') {
    imageEl.setStyle({
      verticalAlign: 'middle'
    });
  }
  else if (alignment == 'top') {
    imageEl.setStyle({
      verticalAlign: 'top'
    });
  }
}

function refreshSizeDisplay(event) {
  var scaleEl = $('scaling');
  if (event) {
    scaleEl.value = scaleEl.value.replace(/[^\d]/, '');
  }

  var oldSizeEl = $('dialog').down('.old-size');
  var newSizeEl = $('dialog').down('.new-size');

  oldSizeEl.update("#{width}in &times; #{height}in @ #{dpi} dpi".interpolate({
    width: Math.round(100 * properties.width / properties.dpi) / 100,
    height: Math.round(100 * properties.height / properties.dpi) / 100,
    dpi: properties.dpi
  }));

  newSizeEl.update("#{width}in &times; #{height}in".interpolate({
    width: Math.round(scaleEl.value * properties.width / properties.dpi) / 100,
    height: Math.round(scaleEl.value * properties.height / properties.dpi) / 100
  }));

  properties.scaling = scaleEl.value;
}

var properties = {};

function setProperties(props) {
  properties = props;
  $('scaling').value = properties.scaling;
  $('alignment').value = properties.alignment;

  refreshAlignDisplay();
  refreshSizeDisplay();
}

function getProperties() {
  properties.scaling = Math.min(200, properties.scaling);
  return properties;
}
