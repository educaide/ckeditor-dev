document.observe('dom:loaded', populateGroupList);
document.observe('dom:loaded', attachListeners);

// returns the character object for the selected char, with an additional 'group' attribute, e.g.:
// properties = { group: 'Geometry', text: 'segment', codepoint: '0xE110' }
function getProperties() {
  var selectedChar = $('characters').down('.selected');
  return {
    group: $('groups').value,
    text: selectedChar.readAttribute('data-text'),
    codepoint: selectedChar.readAttribute('data-codepoint')
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

  charDiv.update();
  data[index].characters.each(function(charObj) {
    var attributes = { 'class': 'char', 'data-text': charObj.text, 'data-codepoint': charObj.codepoint};
    if ('type' in charObj)
      attributes['data-type'] = charObj.type;

    var charElem = new Element('div', attributes);
    var entityRef = charObj.codepoint.startsWith('0x') ? charObj.codepoint.substring(1) : charObj.codepoint;
    charElem.update('&#' + entityRef + ';');
    charDiv.insert({ bottom: charElem });
  });

  charDiv.firstDescendant().addClassName('selected');
}

function onClickChar(event, charElem) {
  var curSelection = $('characters').down('.selected');
  curSelection.removeClassName('selected');
  charElem.addClassName('selected');
}

function attachListeners(event) {
  $('groups').on('change', function(changeEvent) {
    selectGroup($('groups').selectedIndex);
  });

  $('characters').on('click', '.char', onClickChar);
}

