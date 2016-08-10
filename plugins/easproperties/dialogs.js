String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

var easPrefix = "data-eas-";

function setupProperties(){
  var insertLocation = $('propertiesbuild');
  if (!insertLocation)
    return;

  for (var i = 0; i < texGroups.length; i++) {
    var propsGroup = texGroups[i];
    var groupDiv = new Element('div', {className: 'propertiesGroup properties'});
    insertLocation.insert(groupDiv);

    var props = propsGroup.props;
    for (var p = 0; p < props.length; p++) {
      var prop = props[p];
      var row = new Element('div');
      groupDiv.insert(row);
      var texKey = prop;
      var htmlKey = easPrefix + texKey;

      var propLabel = new Element('label').update(texKey);
      propLabel.setAttribute("for", htmlKey);
      propLabel.setAttribute("id", htmlKey + "-label");
      row.insert(propLabel);
    }
  }
}

function setupInput(element, texProp){
  var dataType = texProp[0];

  var key = texProp[1];

  var elemId = easPrefix + key + "-input"

  if (dataType == "Dimension") {

    var dimenId = easPrefix + key + "-dimen"

    var elem = new Element('input', {id: elemId, type: "textbox"});

    elem.setStyle({
      "width" : "4.5em"
    });

    var select = new Element('select', {id: dimenId});

    select.setStyle({
      "width" : "3em",
      "margin-left" : "5px"
    });

    var inDimen = new Element('option', {value: 'in'});
    inDimen.insert("in");
    var cmDimen = new Element('option', {value: 'cm'});
    cmDimen.insert("cm");
    var ptDimen = new Element('option', {value: 'pt'});
    ptDimen.insert("pt");
    var emDimen = new Element('option', {value: 'em'});
    emDimen.insert("em");
    var exDimen = new Element('option', {value: 'ex'});
    exDimen.insert("ex");

    select.insert(inDimen);
    select.insert(cmDimen);
    select.insert(ptDimen);
    select.insert(emDimen);
    select.insert(exDimen);

    $(easPrefix + key + "-label").up().insert(elem);
    $(easPrefix + key + "-label").up().insert(select);

  } else if (dataType == "bool?") {
    var elem = new Element('select', {id: elemId});

    var opt_none = new Element('option', {value: ''});
    var opt_true = new Element('option', {value: 'true'});
    opt_true.insert("True");
    var opt_false = new Element('option', {value: 'false'});
    opt_false.insert("False");

    elem.insert(opt_none);
    elem.insert(opt_true);
    elem.insert(opt_false);

    $(easPrefix + key + "-label").up().insert(elem);
  } else if (dataType == "choice") {
    var elem = new Element('select', {id: elemId});

    var temp = new Element('option', {value: ''});
    elem.insert(temp);

    for (var i=0; i < texChoices[key].length; i++) {
      temp = new Element('option', {value: texChoices[key][i]});
      temp.insert(texChoices[key][i]);
      elem.insert(temp);
    }

    $(easPrefix + key + "-label").up().insert(elem);
  } else {
    var elem = new Element('input', {id: elemId, type: "textbox"});
    $(easPrefix + key + "-label").up().insert(elem);
  }

}

function setPropertyTextbox(element, texProp){

  var key = texProp[1];

  if (!element)
    return;

  var value = element.getAttribute(easPrefix + key)

  if (!value)
    return;

  //separate value and dimension if we're restoring a dimension value

  if ( $(easPrefix + key + "-dimen") )
    var dimen = value.replace( /[0-9]/g, '');
    value = value.replace( /\D/g, '');

    $(easPrefix + key + "-dimen").value = dimen;

  $(easPrefix + key + "-input").value = value;
}

function setWidthAndDimens(element, key){
  if (!element)
    return;

  var value = element.getAttribute(easPrefix + key);

  var dimens = /^((\d|\.)+)\s?(em|in|pt|ex|%|cm)/;
  var tokens = null;
  if (value){
    tokens = dimens.exec(value)
  }

  if (!value || !tokens){
    $(easPrefix + key).value = '';
    $(easPrefix + key + '-dimension').value = 'in';
  } else {
    $(easPrefix + key).value = tokens[1];
    $(easPrefix + key + '-dimension').value = tokens[3];
  }

}

var guiSetProps = ["border", 'pos', 'width'];

function setProperties(element){
  if (!element)
    return;

  for (var i = 0; i < texProperties.length; i++) {
    var p = texProperties[i];
    setPropertyTextbox(element, p);
  }
}

function setupInputs(element){
  if (!element)
    return;

  for (var i = 0; i < texProperties.length; i++) {
    var p = texProperties[i];
    setupInput(element,p);
  }
}

function saveProperty(element, key){
  var input = $(easPrefix + key + "-input");
  var value = null;

  var dimen = $(easPrefix + key + "-dimen");

  if (input)
    value = input.value;

  if (value){

    if (dimen)
      value = String(value) + String(dimen.value);

    element.setAttribute(easPrefix + key, value);

  } else {
    element.removeAttribute(easPrefix + key);
  }
}

function savePropertiesToElement(element){

  var parbox = texCommand == "parbox";

  var styleClasses = [texCommand];
  if (parbox) {
    styleClasses.push("wall");
  }

  for (var i = 0; i < texProperties.length; i++){
    var prop = texProperties[i];
    var key = prop[1];
    var type = prop[0];
    saveProperty(element, key);
  }
}

function insertTex(tex){
  var texInput = $('mathtex');

  // hack! fix IE later: http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
  var insertLocation = texInput.selectionStart;

  texInput.value = texInput.value.splice(insertLocation, 0, tex);
}

(function () {

  document.observe('dom:loaded', function() {
    attachListeners();
  });

  function attachListeners() {
    setupProperties();
  }
})();

