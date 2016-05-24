var $j = jQuery.noConflict();
(function() {

document.observe('dom:loaded', function() {
  includeTree();
  attachListeners();
  resizeContent();
  setUpTree();
});

window.onresize = function() { resizeContent(); }

// keys are leafIds, values are objects with a timestamp of last access (for
// cache expiring) and an array of figure objects. cache will hold up to
// 5 entries at a time
var leafCache = {};
var currentLeaf = null;
var publicThumbFolder = null;

// this needs to be a window variable so window.getProperties() can work
window.publicPreviewFolder = null;

function includeTree(){
  /*
  */
  $j.ajax({
    url: '../../../stock-image-hierarchy.html',
    success: function(data){
      $j(data).insertAfter($j('#root-ul') );
      $j('.node').hide();
    }
  });
}

function attachListeners() {
  $('user').on('click', onChangeView);
  $('new').on('click', onChangeView);
  $('root').on('click', onChangeView);
  $('browser').down('.list ul').on('click', '.leaf', onLeafClick);
  $('browser').down('.preview .multi').on('click', '.thumbnail', onThumbailClick);
  $('browser').down('.preview .multi').on('dblclick', '.thumbnail', onImageDoubleClick);
  $('browser').down('.preview .single').on('dblclick', '.single', onImageDoubleClick);

  $('toggle-upload').on('click', onToggleUploadClick);
  $('cancel-upload').on('click', onToggleUploadClick);
  $('upload-dialog').down('input[type=file]').on('change', onFileChange);
  $('upload-dialog').down('input[type=submit]').on('click', onFileSubmit);
  $('backbutton').on('click', goBack);
}

function goBack(){
  $j('#stock-image-browser').empty();
  var visibleNode = $j('#backbutton').siblings(".node:visible");
  var toShow = visibleNode.children().first().data("parent");

  if(toShow){
    visibleNode.hide();
    $j('[data-self='+toShow+']').first().parent().show();
  }else{
    $('user').show();
    $('new').show();
    $('stock-image-browser').hide();
    $('backbutton').hide();
  }
}

function setUpTree(){
  $j('#root').click(function(){
    var chirrens = $j(this).data("self");
    var childLIs = $j('[data-parent='+chirrens+']');
    childLIs.first().parent().show();
    $j(this).parent().hide();
  });

  $j('.node li').click(function(event){
    var id = $j(event.target).data('self');
    if($j(this).data("container")){
      $j.ajax({
        url: '/account/image_nodes/'+id+'/stock_images',
        success: function(response){
          var multiEl = $('browser2').down('.preview .multi');
          multiEl.empty();
          $j.each(response, function(i, image){
            console.log(image.stock_image.file_name);
            var thumb = createStockThumbnail(image.stock_image);
            $j(multiEl).append(thumb );
          });

          var firstThumb = $('browser2').down('.preview .multi .thumbnail');
          if (firstThumb) {
            firstThumb.addClassName('selected');
          }

          resizeContent();
           ensureMultiIsShown();
        }
      });
    }else{
      var chirrens = $j(this).data("self");
      var childLIs = $j('[data-parent='+chirrens+']')
      childLIs.first().parent().show();
      $j(this).parent().hide();
    }
  });
}

function onChangeView(event){
  var target_id = event.target.identify();
  if(target_id == "root"){
    $('user').hide();
    $('new').hide();
    if($('browser').visible){
      $('browser').hide();
    }
    if($('upload-dialog-container').visible){
      $('upload-dialog-container').hide();
    }
    $('stock-image-browser').show();
    $('backbutton').show();
  }else if(target_id == "user"){
    $('stock-image-browser').hide();
    $('upload-dialog-container').hide();
    loadListHierarchy();
    $('browser').show();
  }else{
    $('stock-image-browser').hide();
    $('browser').hide();
    $('upload-dialog-container').show();
  }
}

function removeSpinnerOnImgLoad(parentElem) {
  var imgElem = parentElem.down('img');
  if (imgElem) {
    imgElem.observe('load',function(e) {
      imgElem.setStyle({background: 'none'});
    });
  }
}

function resizeContent() {
  var height = document.viewport.getHeight() - 5;
  var multiEl = $('browser').down('.preview .multi');
  var viewWidth = document.viewport.getWidth();
  var singleEl = $('browser').down('.preview .single');
  var uploadDiv = $('viewport').down('.uploads');
  var multiHeight = height - (uploadDiv.visible() ? uploadDiv.getHeight() : 0);

  $('browser').down('.list .container').setStyle({ height: height + 'px'});
  multiEl.setStyle({ height:  multiHeight + 'px'});
  singleEl.setStyle({ height: height + 'px', width: viewWidth - 205 + 'px' });
  // TODO set maxWidth style on singleEl's img if we want to scale to fit in window
}

function onFileChange(event) {
  $('upload-dialog').down('input[type=submit]').enable();
}

function onFileSubmit(event) {
  $('upload-dialog').down('form').hide();
  $('upload-dialog').down('.wait').show();

  /* why does altering state of form controls causes invalid data to be posted?
  $('upload-dialog').select('button').invoke('disable');
  $('upload-dialog').select('input').invoke('disable');
  $('upload-dialog').down('input[type=submit]').value = "Uploading...";
  */
}

function onToggleUploadClick(event) {
  event.stop();
  var showing = true;
  // reset file input after hiding
  if ($('upload-dialog').visible()) {
    showing = false;
    var fileEl = $('upload-dialog').down('input[type=file]');
    fileEl.replace('<input type="file" name="figure[asset]" />');
    // need to delay so DOM gets a chance to update before re-attaching onchange
    // listener. would rather listen to form's onchange listener (so that this step
    // isn't needed), but IE doesn't bubble up change events.
    window.setTimeout(function() {
      $('upload-dialog').down('input[type=file]').on('change', onFileChange);
    }, 1000);

    $('upload-dialog').down('input[type=submit]').disable();
  }

  $('upload-dialog').toggle();
  $('toggle-upload').toggle();
  resizeContent();

  if (showing && !Prototype.Browser.IE) {
    $('upload-dialog').down('input[type=file]').click();
  }
}

function onImageDoubleClick(event, element) {
  var imgEl = element.down('img');
  var multiEl = $('browser').down('.preview .multi');
  var singleEl = $('browser').down('.preview .single');

  var imgFile = imgEl.readAttribute('data-filename');
  var imgId  = imgEl.readAttribute('data-id');
  var isUserImage = imgEl.readAttribute('data-is-user') == 'true'

  var src = (isUserImage ? '/account/figures/' + imgId + '?style=print_preview_thumbnail' : publicPreviewFolder + imgFile);

  singleEl.update(new Element('img', { src: src, 'data-is-user': isUserImage.toString() }));
  var imageProperties = {
    asset_file_name: imgFile,
    width: imgEl.readAttribute('data-width'),
    height: imgEl.readAttribute('data-height'),
    dpi: imgEl.readAttribute('data-dpi')
  };
  singleEl.insert({ bottom: createMeta(imageProperties) });
  removeSpinnerOnImgLoad(singleEl);

  //if (isUserImage) {
    //var uploadDiv = $('viewport').down('.preview .uploads');
    //uploadDiv.toggle();
  //}
  singleEl.toggle();
  multiEl.toggle();
  resizeContent();
}

function onThumbailClick(event, element) {
  var currentEl = $('browser').down('.preview .multi .selected');
  if (currentEl) {
    currentEl.removeClassName('selected');
  }
  element.addClassName('selected');
}

function onLeafClick(event, element) {
  var leafId = element.readAttribute('data-leaf-id');
  if (currentLeaf === leafId) {
    return;
  }

  currentLeaf = leafId;
  var cachedLeaf = leafCache[leafId];
  var url = 'account/figures/' + leafId + '.json';
  if (leafId === 'user_images') {
    cachedLeaf = null;  // don't cache user leaf data since it's likely to be modified
    url = '/account/figures.json'
  }

  var multiEl = $('browser').down('.preview .multi');
  if (!cachedLeaf) {
    new Ajax.Request(url, {
      method: 'get',
      parameters: { leafId: leafId },
      onCreate: function() {
        // show 'please wait'
        //$('viewport').down('.preview .uploads').hide();
        multiEl.update('Loading...');
      },
      onFailure: function(response) {
        // show error message
        var requestedLeafId = response.request.parameters.leafId;
        if (requestedLeafId != currentLeaf) {
          // don't show error message if user has clicked on another leaf while the
          // original leaf was loading
          return;
        }

        multiEl.update("Couldn't load images for this section.");
        ensureMultiIsShown();
        currentLeaf = null;
      },
      on0: function() {
        // show 'abort' message
        multiEl.update("Request aborted.");
        ensureMultiIsShown();
        currentLeaf = null;
      },
      onSuccess: function(response) {
        // update DOM with returned data
        // TODO when moved to a real server, data can be assigned with:
        // var data = response.responseJSON
        var requestedLeafId = response.request.parameters.leafId;
        var data = eval("(" + response.responseText + ")");
        cachedLeaf = { id: requestedLeafId, figures: data };
        leafCache[requestedLeafId] = cachedLeaf;
        showThumbsFor(cachedLeaf);

        if (document.location.hash.startsWith('#user_images')) {
          if (document.location.hash.endsWith('/success')) {
            var multiEl = $('browser').down('.preview .multi');
            multiEl.scrollTop = multiEl.scrollHeight;
            onThumbailClick(null, multiEl.select('.thumbnail').last());
          }
          else if (document.location.hash.endsWith('/error')) {
            alert('An error occurred while uploading your image. Make sure your image is a valid PNG or JPG file and is smaller than 1MB.');
          }
          document.location.hash = "";
        }
      },
      onComplete: function(response) {
        // restore any items disabled in onCreate, clear any loading messages
        var requestedLeafId = response.request.parameters.leafId;
        if (requestedLeafId == 'user_images') {
          //$('viewport').down('.preview .uploads').show();
          resizeContent();
        }
      }
    });
  }
  else {
    showThumbsFor(cachedLeaf);
  }

  var oldSelectedLeaf = $('browser').down('.list .selected.leaf');
  if (oldSelectedLeaf) {
    oldSelectedLeaf.removeClassName('selected');
  }
  element.addClassName('selected');
}

function ensureMultiIsShown() {
  // switch out of single view
  var multiEl = $('browser').down('.preview .multi');
  var singleEl = $('browser').down('.preview .single');
  singleEl.hide();
  multiEl.show();
}

function showThumbsFor(cachedLeaf) {
  var multiEl = $('browser').down('.preview .multi');
  multiEl.update();
  $(cachedLeaf.figures).each(function(figureWrapper) {
    multiEl.insert({ bottom: createThumbnail(figureWrapper.figure, cachedLeaf.id == 'user_images') });
  });

  var firstThumb = $('browser').down('.preview .multi .thumbnail');
  if (firstThumb) {
    firstThumb.addClassName('selected');
  }

  resizeContent();
  ensureMultiIsShown();
}

function getReferenceFileName(figureObj){
  var badFileExtension = figureObj.asset_file_name.split(".").pop();
  var referenceFileName = figureObj.asset_file_name.replace("." + badFileExtension, ".PNG");
  return referenceFileName;
}

function createMeta(figureObj) {
  var metaEl = new Element('div', { 'class': 'meta' }).update(new Element('p').update(figureObj.asset_file_name));
  var sizeString = "#{width}in &times; #{height}in @ #{dpi}dpi".interpolate({
    width: Math.round(100 * figureObj.width / figureObj.dpi) / 100,
    height: Math.round(100 * figureObj.height / figureObj.dpi) / 100,
    dpi: figureObj.dpi
  });
  metaEl.insert({ bottom: new Element('p').update(sizeString) });

  return metaEl;
}
function createStockThumbnail(figureObj) {
  var divEl = new Element('div', { 'class': 'thumbnail' });
  var wrapEl = new Element('div', { 'class': 'wrapper' });
  var src = 'http://d182r4aj4ojgdn.cloudfront.net/stock-images-thumbs/' + figureObj.file_name;

  var properties = {
    src             : src,
  };

  wrapEl.insert({ bottom: new Element('img', properties) });
  divEl.insert({ bottom: wrapEl });
  divEl.insert({ bottom: createMeta(figureObj) });

  removeSpinnerOnImgLoad(divEl);
  return divEl;
}

function createThumbnail(figureObj, isUserImage) {
  var divEl = new Element('div', { 'class': 'thumbnail' });
  var wrapEl = new Element('div', { 'class': 'wrapper' });
  var src = (isUserImage ? '/account/figures/' + figureObj.id + '?style=thumb' : publicThumbFolder + figureObj.asset_file_name);

  var properties = {
    src             : src,
    'data-width'    : figureObj.width,
    'data-height'   : figureObj.height,
    'data-dpi'      : figureObj.dpi,
    'data-filename' : getReferenceFileName(figureObj),
    'data-id'       : figureObj.id || 0,
    'data-is-user'  : isUserImage.toString()
  };

  wrapEl.insert({ bottom: new Element('img', properties) });
  divEl.insert({ bottom: wrapEl });
  divEl.insert({ bottom: createMeta(figureObj) });

  removeSpinnerOnImgLoad(divEl);
  return divEl;
}

function createBranchLi(node) {
  var liEl = new Element('li').update(new Element('div').update(node.name));
  if (node.children && node.children.length > 0) {
    var ulEl = new Element('ul');
    liEl.insert({ bottom: ulEl });
    $A(node.children).each(function(childNode) {
      ulEl.insert({ bottom: createBranchLi(childNode) });
    });
  }
  else {
    liEl.addClassName('leaf');
    liEl.writeAttribute('data-leaf-id', node.leafId);
  }

  return liEl;
}

function loadListHierarchy() {
  new Ajax.Request('account/figures.json', {
    method: 'get',
    onCreate: function() {
      // show 'please wait'
    },
    onFailure: function() {
      // show error message
    },
    on0: function() {
      // show 'abort' message
    },
    onSuccess: function(response) {
      // update DOM with returned data
      // TODO when moved to a real server, data can be assigned with:
      // var data = response.responseJSON
      var data = eval("(" + response.responseText + ")");
      publicThumbFolder = data.publicThumbFolder;
      publicPreviewFolder = data.publicPreviewFolder;

      var ulEl = $('browser').down('.list ul');
      $A(data.hierarchy).each(function(rootNode) {
        ulEl.insert({ bottom: createBranchLi(rootNode) });
      });
    },
    onComplete: function(response) {
      // restore any items disabled in onCreate, clear any loading messages
      $('browser').select('td .loading').each(function(el) {
        el.hide();
      });

      // load the user image folder
      var ulEl = $('browser').down('.list ul');
      var userNode = {name: 'My Images', leafId: 'user_images'};
      ulEl.insert({ bottom: createBranchLi(userNode) });
      if (document.location.hash.startsWith('#user_images')) {
        // HACK instead of calling the event handler, we should be calling something like "selectLeaf"
        onLeafClick(null, $('browser').down('.list').down('li[data-leaf-id=user_images]'));
      }
      else {
        // select the first leaf by simulating a click on it
        onLeafClick(null, ulEl.down('.leaf'));
      }
    }
  });
}

})();

function getProperties() {
  var selectedThumbEl = $('browser').down('.multi .thumbnail.selected');
  if (!selectedThumbEl) {
    return null;
  }

  var imgEl = selectedThumbEl.down('img');
  var imgFile = imgEl.readAttribute('data-filename');
  var imgExtension = imgFile.match(/\.[^\.]+$/)[0];
  var imgId  = imgEl.readAttribute('data-id');
  var isUserImage = imgEl.readAttribute('data-is-user') == 'true'
  var previewSrc = (isUserImage ? '/account/figures/' + imgId + '?style=print_preview_thumbnail' : publicPreviewFolder + imgFile);

  return {
    filename: isUserImage ? imgId + imgExtension : imgFile,
    src: previewSrc,
    width: imgEl.readAttribute('data-width'),
    height: imgEl.readAttribute('data-height'),
    dpi: imgEl.readAttribute('data-dpi')
  };
}
