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
    opt_true.insert("true");
    var opt_false = new Element('option', {value: 'false'});
    opt_false.insert("false");

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
  } else if (dataType == "color" ) {
    var elem = new Element('select', {id: elemId});

    var colors = [
      "black",
      "white",
      "gray",
      "red",
      "green",
      "blue",
      "cyan",
      "magenta",
      "yellow",
      "purple",
      "orange",
      "aqua",
      "fuchsia",
      "teal",
      "maroon",
      "navy",
      "olive",
      // dark
      "dkblue",
      "dkcyan",
      "dkgray",
      "dkgreen",
      "dkmagenta",
      "dkred",
      "dkyellow",
      // medium dark
      "mdblue",
      "mdcyan",
      "mdgray",
      "mdgreen",
      "mdmagenta",
      "mdred",
      "mdyellow"
    ];

    var opt_none = new Element('option', {value: ''});
    elem.insert(opt_none);

    for ( var i=0; i < colors.length; i++ ) {
      var opt = new Element('option', {value: colors[i]});
      opt.insert(colors[i]);
      elem.insert(opt);
    }

    $(easPrefix + key + "-label").up().insert(elem);
  } else if (dataType == "color_background" ) {
    var elem = new Element('select', {id: elemId});

    var colors_background = [
      // extra light
      "xlblue",
      "xlcyan",
      "xlgray",
      "xlgreen",
      "xlmagenta",
      "xlred",
      "xlyellow",
      /// light
      "ltblue",
      "ltcyan",
      "ltgray",
      "ltgreen",
      "ltmagenta",
      "ltred",
      "ltyellow",
      // medium light
      "mlblue",
      "mlcyan",
      "mlgray",
      "mlgreen",
      "mlmagenta",
      "mlred",
      "mlyellow",
    ];

    var opt_none = new Element('option', {value: ''});
    elem.insert(opt_none);

    for ( var i=0; i < colors_background.length; i++ ) {
      var opt = new Element('option', {value: colors_background[i]});
      opt.insert(colors_background[i]);
      elem.insert(opt);
    }

    $(easPrefix + key + "-label").up().insert(elem);

  } else {
    var elem = new Element('input', {id: elemId, type: "textbox"});
    $(easPrefix + key + "-label").up().insert(elem);
  }

  // remove curly braces, if entered
  elem.observe("keyup", function(){
    $(this).setValue($(this).getValue().replace(/[{}]/g, ""));
  });
}

function setPropertyTextbox(element, texProp){

  var key = texProp[1];

  if (!element)
    return;

  var value = element.getAttribute(easPrefix + key)

  if (!value)
    return;

  //separate value and dimension if we're restoring a dimension value

  if ( $(easPrefix + key + "-dimen") ) {
    var dimen = value.replace( /[0-9]/g, '');
    value = value.replace( /\D/g, '');

    $(easPrefix + key + "-dimen").value = dimen;
  }

  $(easPrefix + key + "-input").value = value;
}

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

function saveProperty(element, key, type){
  var input = $(easPrefix + key + "-input");
  var value = null;

  var dimen = $(easPrefix + key + "-dimen");

  if (input)
    value = input.value;

  if (value){

    if (type == "Dimension") {
      if ( isNaN(value) ) {
        return false;
      }
      value = String(value) + String(dimen.value); //append dimension
    } else if (type == "uint?") {
      if ( isNaN(value) || value.indexOf('.') > -1 || value < 0 ) {
        return false;
      }

    } else if (type == "int?") {
      if ( isNaN(value) || value.indexOf('.') > -1 ) {
        return false;
      }
    }

    element.setAttribute(easPrefix + key, value);
    return true;
  } else {
    element.removeAttribute(easPrefix + key);
    return true;
  }
}

function savePropertiesToElement(element, args){

  failedKeys = {};

  keyLookup = {
    "uint?": "natural number",
    "int?":  "integer",
    "Dimension": "integer or decimal number",
  }

  for (var i = 0; i < texProperties.length; i++){
    var prop = texProperties[i];
    var key = prop[1];
    var type = prop[0];

    if ( !saveProperty(element, key, type) ) {
      failedKeys[key] = type;
    }

  }

  if ( Object.keys(failedKeys).length > 0 ) {
    var errorMessage = "";

    for ( var key in failedKeys ) {
      errorMessage += "\"" + key + "\" must be a " + keyLookup[failedKeys[key]] + ".\n";
    }

    alert(errorMessage);

    args.data.hide = false;
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

