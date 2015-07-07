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

    //var titleSpan = new Element('span', {className: 'title'});
    //titleSpan.update(propsGroup.groupName);
    //groupDiv.insert(titleSpan);

    var props = propsGroup.props;
    for (var p = 0; p < props.length; p++) {
      var prop = props[p];
      var row = new Element('div');
      groupDiv.insert(row);
      var texKey = prop;
      var htmlKey = easPrefix + texKey;

      var propLabel = new Element('label').update(texKey);
      propLabel.setAttribute("for", htmlKey);
      row.insert(propLabel);

      var propInput = new Element('input', {id: htmlKey, type: "textbox"});
      row.insert(propInput);
    }
  }
}

function setPropertySelect(element, key){
  if (!element)
    return;
    
  var value =  element.getAttribute(easPrefix + key)

  if (!value)
    return;
    
  var options = $(easPrefix + key).children
  for(var i = 0; i < options.length; i++){
    options[i].selected = options[i].value == value;
  }
}

function setPropertyTextbox(element, key){
  if (!element)
    return;
    
  var value =  element.getAttribute(easPrefix + key)

  if (!value)
    return;
    
  $(easPrefix + key).value = value;
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
  
  var parbox = texCommand == "parbox";
  if (parbox) {
    setPropertySelect(element, 'border');
    setPropertySelect(element, 'pos');
    setWidthAndDimens(element, 'width');
  }

  for (var i = 0; i < texProperties.length; i++) {
    var p = texProperties[i];
    setPropertyTextbox(element, p[1]);
  }
}

function saveProperty(element, key){
  var input = $(easPrefix + key);
  var value = null;
  
  if (input)
    value = input.value;
  
  if (value){
    element.setAttribute(easPrefix + key, value);
    // IE does not like using normal attributes for style.
    // we are building classes to use to set styles in IE of the form:
    // "parbox-pos-indent
    return "parbox-" + key + "-" + value;
  } else {
    element.removeAttribute(easPrefix + key);
    return null;
  }
}

function savePropertiesToElement(element){

  var parbox = texCommand == "parbox";

  var styleClasses = [texCommand];
  if (parbox)
    styleClasses.push("wall");

  //var keys = ['border', 'pos'];
  for (var i = 0; i < texProperties.length; i++){
    var prop = texProperties[i];
    var key = prop[1];
    var styleClass = saveProperty(element, key);
    if (styleClass)
      styleClasses.push(styleClass);
  }
  
  if (parbox) {
    if ($(easPrefix + 'width').value){
      var width = $(easPrefix + 'width').value + $(easPrefix + 'width-dimension').value;
      element.setAttribute(easPrefix + 'width', width);
      element.setAttribute('style', "width: " + width + ";");
    }
    else {
      element.removeAttribute(easPrefix + 'width');
      element.removeAttribute('style');
    }
  }
  
  if (texCommand != 'figure')
    element.setAttribute("class", styleClasses.join(" "));
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
