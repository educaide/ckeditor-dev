String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function setMath(math, src){
  if (!math || math.length == 0)
    return;

  $("mathtex").value = math;

  var imgElem = $('thumbnail');
  imgElem.writeAttribute("src", src); 
  $('clear').enable();
}

function getJimCarrey(el) {
  if (el.selectionStart) {
    return el.selectionStart;
  }
  else if (document.selection) {
    el.focus();
    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }
    var re = el.createTextRange(),
        rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length;
  }
  return 0;
}

function setJimCarrey(el, caretPos) {
  if (el != null) {
    if (el.createTextRange) {
      var range = el.createTextRange();
      range.move('character', caretPos);
      range.select();
    }
    else {
      if (el.selectionStart != undefined) {
        el.focus();
        el.setSelectionRange(caretPos, caretPos);
      }
      else
        el.focus();
    }
  }
}

function insertTex(tex){
  var texInput = $('mathtex');
  
  // hack! fix IE later: http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
  var insertLocation = getJimCarrey(texInput);//.selectionStart;

  var insertTeX = tex;
  // don't insert an initial space if we're inserting against nothing. This behavior may cause problems if insertTex is used for anything other than our palette, which is currently the only use.
  if (insertLocation == 0)
    insertTeX = tex.trimLeft();

  texInput.value = texInput.value.splice(insertLocation, 0, insertTeX);

  var newCaret = insertLocation + tex.length;
  setJimCarrey(texInput, newCaret);

  invalidatePreview();
}

(function () {

  document.observe('dom:loaded', function() {
    attachListeners();
  });

  function attachListeners() {
    $('update').on('click', updatePreview);
    $('clear').on('click', clearTeX);
    $('mathtex').on('keyup', invalidatePreview);
    $('mathtex').on('paste', invalidatePreview);
    setupPalette(); // from dialog-palette-data.js
  }

  function easmathDialog(editor) {
    var generalLabel = editor.lang.common.generalTab;
    return {
      title: 'Math',
      minWidth: 300,
      minHeight: 200,
      contents: [{
        id: 'info',
        label: generalLabel,
        title: generalLabel,
        elements: [{
          id: 'text',
          type: 'textarea',
          inputStyle: 'font-family: monospace; font-size: 10pt',
          rows: 11,
          label: 'Math TeX',
          'default': '',
          setup: function (buttonElement) {
            var textAreaElems = buttonElement.getElementsByTag('textarea');
            if (textAreaElems.count() != 0) {
              this.setValue(textAreaElems.getItem(0).getText());
            }
          },
          commit: function (buttonElement) {
            CKEDITOR.plugins.easmath.updateMathButton(buttonElement, this.getValue());
          }
        }]
      }],
      onShow: function () {
        this._element = CKEDITOR.plugins.easmath.getSelectedMath(editor);
        this.setupContent(this._element);
      },
      onOk: function () {
        this.commitContent(this._element);
        delete this._element;
      }
    };
  }

})();

function invalidatePreview(){
  $('thumbnail').setAttribute("dirty", "true");

  var tex = $('mathtex').value;
  if (!tex || tex.length == 0) {
    $('clear').disable();      
  }
  else {
    $('clear').enable();
  }
} 

function getProperties() {

  var mathTeX = $('mathtex').value;
  if (!mathTeX){
    return null;
  }
  
  var imgElem = $('thumbnail');
  if (!imgElem || imgElem.getAttribute('dirty')){
    updatePreview(true);
    return null;
  }

  var thumbnailUrl = imgElem.src
  var style = imgElem.getAttribute("style");

  if (!thumbnailUrl) {
    return null;
  }
  
  return {
    mathTeX: mathTeX,
    src: thumbnailUrl,
    style: style,
  };
}

function displayError(errorMsg) {
  $('error').innerText = errorMsg;
};

function clearTeX() {
  $('mathtex').value = '';
  invalidatePreview();
}

var previewRetryCount = 0;

function updatePreview(closeAfter){
  var url = "/thumbnails";
  var tex = $('mathtex').value;
  previewRetryCount = 5;

  if (!tex || tex.length == 0)
  {
    // the preview of no tex is no image.
    var imgElem = $('thumbnail');
    imgElem.setOpacity(0);
    return;
  }

  var errorSpan =  $('error');
  //"\alpha, \Alpha, \beta, \Beta, \gamma, \Gamma, \pi, \Pi, \phi, \varphi, \Phi";

  // disablePreviewButton

  new Ajax.Request(url, {
    method: 'get',
    parameters: { mathtex: tex },
    onCreate: function() {
      // show 'please wait' ?
      //errorSpan.innerText = 'Loading...';
      errorSpan.innerText = '';
    },

    onFailure: function(response) {
      // show error message
      errorSpan.innerText = "Couldn't render this math. Please check your math for errors and try again.";
    },

    on0: function() {
      // show 'abort' message
      errorSpan.innerText = "Aborted rendering. Please check your math for errors and try again.";
    },

    onSuccess: function(response) {
      // TODO when moved to a real server, data can be assigned with:
      // var data = response.responseJSON
      var requestedLeafId = response.request.parameters.leafId;
      var data = eval("(" + response.responseText + ")");

      showLoading();
      waitForPreview(data.math_id, data.thumb, closeAfter);
    },

    onComplete: function(response) {
      errorSpan.innerText = '';
    }
  });
};

function waitForPreview(mathID, thumb, closeAfter){
  window.setTimeout(function() {
     checkForPreviewReady(mathID, thumb, closeAfter);
    }, 2000);
};

function showLoading(){
  setSpinner(true);

  var imgElem = $('thumbnail');
  imgElem.setOpacity(0);
}

function setSpinner(onOff) {
  if (onOff) {
    previewButton = $('update');
    if (previewButton)
      previewButton.disabled = true;
 
    if( $$('div.spinner').length == 0 ){
      // show spinner and disable buttons while server generates new thumbnail
      var spinnerElem = new Element('div', { 'class': 'spinner' } )
      spinnerElem.update(new Element('img', { src: '/images/spinner.gif' }));
     $('previewarea').insert({ top: spinnerElem });
    }

  } else {
    var spinnerElems = $$('div.spinner');

    for (var i = 0; i < spinnerElems.length; i++){
      spinnerElems[i].remove();
    }

    previewButton = $('update');
    if (previewButton)
      previewButton.disabled = false;

  }

}

function showPreviewImage(newAddress, style){
  if (style != null){
    style = "vertical-align: " + style + "pt;";
  }
  else {
    style = '';
  }

  var imgElem = $('thumbnail');
  if (imgElem) {
    imgElem.setOpacity(1.5);
    imgElem.writeAttribute('src', newAddress);
    imgElem.removeAttribute('dirty');
    imgElem.writeAttribute('style', style);
  }

  setSpinner(false);
}

function checkForPreviewReady(mathId, thumb, closeAfter){
  var url = "/thumbnails";
  var errorSpan =  $('error');
  //"\alpha, \Alpha, \beta, \Beta, \gamma, \Gamma, \pi, \Pi, \phi, \varphi, \Phi";

  // disablePreviewButton

  new Ajax.Request(url, {
    method: 'get',
    parameters: { thumbnail_check: true, math_id: mathId, thumbnail: thumb},
    onCreate: function() {
      // show 'please wait' ?
      //errorSpan.innerText = 'Loading...';
    },

    onFailure: function(response) {
      // show error message
      errorSpan.innerText = "Couldn't render this math. Please check your math for errors and try again.";
    },

    on0: function() {
      // show 'abort' message
      errorSpan.innerText = "Aborted rendering. Please check your math for errors and try again.";
    },

    onSuccess: function(response) {
      // TODO when moved to a real server, data can be assigned with:
      // var data = response.responseJSON
      var data = eval("(" + response.responseText + ")");

      if (data.thumbnail_status == "success"){
        showPreviewImage(thumb, data.style);
        if (closeAfter){
         // cleverly close here. somehow... 
        }
      } else if (data.thumbnail_status == "pending") {
        if (previewRetryCount > 0)
        {
          waitForPreview(mathId, thumb, closeAfter);
        } else {
          errorSpan.innerText = "Math preview render timed out. Please wait a moment and try again.";
          setSpinner(false);
        }
        previewRetryCount -= 1;

      // error
      } else {
        errorSpan.innerText = "Couldn't render this math. Please check your math for errors and try again.";
        setSpinner(false);
      }
    },

    onComplete: function(response) {
      //errorSpan.innerText = '';
    }
  });
}
