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

  var value = element.getAttribute(easPrefix + key);

  if (!value)
    return;

  //separate value and dimension if we're restoring a dimension value

  if ( $(easPrefix + key + "-dimen") ) {
    //grab last two characters of attribute, which should be dimension abbreviation.
    var dimen = value.substr(value.length -2);
    // replace all letters, as we need to leave decimals alone. Still not perfect, but according to Dan
    // we let people enter garbage, and TeX does the validation.
    // Still, it should be noted that in the savePropertiesToElement function below
    // we do some validation. Since this happens in an iFrame it might not make it through, however.
    value = value.replace( /[a-zA-Z]/g, '');

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
        return ["error", -1];
      }
      value = String(value) + String(dimen.value); //append dimension
    } else if (type == "uint?") {
      if ( isNaN(value) || value.indexOf('.') > -1 || value < 0 ) {
        return ["error",-1];
      }

    } else if (type == "int?") {
      if ( isNaN(value) || value.indexOf('.') > -1 ) {
        return ["error",-1];
      }
    }

    element.setAttribute(easPrefix + key, value);

    return [key, value];
  } else {
    element.removeAttribute(easPrefix + key);
    return ["ok",0];
  }
}

function savePropertiesToElement(element, args){
  failedKeys = {};

  keyLookup = {
    "uint?": "natural number",
    "int?":  "integer",
    "Dimension": "integer or decimal number",
  }

  var counter_type = null;
  var label_type = null;

  if ( element.$.classList.contains("list") ) {
    saveListKeys( element, texProperties, failedKeys );
  } else if ( element.$.tagName == "IMG" ) {
    saveImageKeys( element, texProperties, failedKeys );
  } else {
    for (var i = 0; i < texProperties.length; i++){
      var prop = texProperties[i];
      var key = prop[1];
      var type = prop[0];

      saveprop_return = saveProperty(element, key, type);

      if ( saveprop_return[0] == "error" ) {
        failedKeys[key] = type;
      }
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

function saveListKeys( element, texProperties, failedKeys ) {
  var counter_type = null;
  var label_type = null;

  for (var i = 0; i < texProperties.length; i++){
    var prop = texProperties[i];
    var key = prop[1];
    var type = prop[0];

    saveprop_return = saveProperty(element, key, type);

    if ( saveprop_return[0] == "label" ) {
      label_type = saveprop_return[1];
    }

    if ( saveprop_return[0] == "counter" ) {
      counter_type = saveprop_return[1];
    }

    if ( saveprop_return[0] == "error" ) {
      failedKeys[key] = type;
    }
  }

  if ( label_type == "bullet" ) {
    element.$.className = "list disc";
  } else if ( label_type == "none" ) {
    element.$.className = "list none";
  } else if ( counter_type && label_type ) {
    var counter_map =
      {
        "1"          : "decimal",
        "A"          : "upper-alpha",
        "a"          : "lower-alpha",
        "I"          : "upper-roman",
        "i"          : "lower-roman"
      }


    var list_type = counter_map[counter_type];
    element.$.className = "list " + list_type;

    var label_map_left =
    {
      "#"      : "",
      "#."     : "",
      "#)"     : "",
      "(#)"    : "(",
      "bullet" : ""
    }

    var label_map_right =
    {
      "#"      : "",
      "#."     : ".",
      "#)"     : ")",
      "(#)"    : ")",
      "bullet" : ""
    }

    var children = element.$.children;

    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute("label-left", label_map_left[label_type]);
      children[i].setAttribute("label-right", label_map_right[label_type]);
    }
  }
}

function saveImageKeys( elem, texProperties, failedKeys ) {
  var scale = 1000;

  for (var i = 0; i < texProperties.length; i++){
    var prop = texProperties[i];
    var key = prop[1];
    var type = prop[0];


    saveprop_return = saveProperty(elem, key, type);

    if ( saveprop_return[0] == "scale" ) {
      scale = Number(saveprop_return[1]);
    } else if ( saveprop_return[0] == "error" ) {
      failedKeys[key] = type;
    }
  }

  var align_map_dom =
  {
    "top"    : "top",
    "bottom" : "bottom",
    "normal" : "bottom",
    "none"   : "bottom",
    "center" : "middle"
  }

  var align_map_properties =
  {
    "top"    : "top",
    "bottom" : "bottom",
    "center" : "center",
    "normal" : "none"
  }

  var height = elem.$.getAttribute("data-height");
  var width  = elem.$.getAttribute("data-width");
  var dpi    = elem.$.getAttribute("data-dpi");

  var width_str = String(width * scale / (10*dpi)) + "px";
  var height_str = String(height * scale / (10*dpi)) + "px";
  elem.$.style.width         = width_str;
  elem.$.style.height        = height_str;

  elem.$.setAttribute("data-scaling", scale/10);

  var temp_align = elem.$.getAttribute("data-eas-align");

  if ( temp_align ) {
    elem.$.setAttribute("data-alignment", align_map_properties[temp_align]);
    var align  = align_map_dom[elem.$.getAttribute("data-eas-align")];
    elem.$.style.verticalAlign = align;
  } else {
    elem.$.setAttribute("data-alignment", "none");
    elem.$.style.verticalAlign = "bottom";
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

