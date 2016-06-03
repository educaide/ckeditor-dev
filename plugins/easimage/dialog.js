var $j = jQuery.noConflict();
(function() {
document.observe('dom:loaded', function() {
  includeTree();
  onLeafClick();
  attachListeners();
  resizeContent('browser');
  resizeContent('browser2');
});

window.onresize = function() { resizeContent('browser'); resizeContent('browser2'); }

// keys are leafIds, values are objects with a timestamp of last access (for
// cache expiring) and an array of figure objects. cache will hold up to
// 5 entries at a time
var leafCache = {};
var currentLeaf = null;
var publicThumbFolder = null;

// this needs to be a window variable so window.getProperties() can work
window.publicPreviewFolder = 'http://d241umpdvf5e0e.cloudfront.net/stock-images-print-previews/';

function includeTree(){
  var url;
  var editorWindow = window.parent.document.getElementById('editor-container')
  if( $j(editorWindow).find('#see_full_hier').prop('checked') ){
    url = '../../../stock-image-hierarchy.html'
  }else{
    $j('#root').text("Sample Images");
    url = '../../../stock-image-hierarchy-amended.html'
  }
  $j.ajax({
    url: url,
    success: function(data){
      $j(data).insertAfter($j('#root-ul') );
      setUpTree();
    }
  });
}

function attachListeners() {
  $('user').on('click', onChangeView);
  $('new').on('click', onChangeView);
  $('root').on('click', onChangeView);

  $('browser').down('.preview .multi').on('click', '.thumbnail', onThumbnailClick);
  $('browser').down('.preview .multi').on('dblclick', '.thumbnail', onImageDoubleClick);
  $('browser').down('.preview .single').on('dblclick', '.single', onImageDoubleClick);
  $('browser').down('.preview .close-preview-button').on('click', closePreview);

  $('browser2').down('.preview .multi').on('click', '.thumbnail', onThumbnailClick);
  $('browser2').down('.preview .multi').on('dblclick', '.thumbnail', onImageDoubleClick);
  $('browser2').down('.preview .single').on('dblclick', '.single', onImageDoubleClick);
  $('browser2').down('.preview .close-preview-button').on('click', closePreview);

  $('cancel-upload').on('click', onToggleUploadClick);
  $('upload-dialog').down('input[type=file]').on('change', onFileChange);
  $('upload-dialog').down('input[type=submit]').on('click', onFileSubmit);
  $('backbutton').on('click', goBack);
}

function goBack(){
  $j('.nav-selected').removeClass('nav-selected');
  $j('#browser2').find('.multi').empty();
  var visibleNode = $j('#backbutton').siblings(".node:visible");
  var toShow = visibleNode.children().first().data("parent");
  visibleNode.hide();

  if(toShow && toShow != 1){
    $j('[data-self='+toShow+']').first().parent().show();
    $j('[data-self='+toShow+']').addClass('nav-selected');
  }else{
    $j('.nav-selected').removeClass('nav-selected');
    $j('#user').addClass('nav-selected');
    $('user').show();
    $('new').show();
    $('root').show();
    $('root-ul').show();
    $('browser2').hide();
    $('backbutton').hide();
    $('browser').show();
  }
}

function setUpTree(){
  $j('.node').hide();
  $j('#root').click(function(){
    var chirrens = $j(this).data("self");
    var childLIs = $j('[data-parent='+chirrens+']');
    childLIs.first().parent().show();
    $j(this).parent().hide();
  });

  $j('.node li').click(treeNavigation);
}

function treeNavigation(event){
  var multiEl = $('browser2').down('.preview .multi');
  $j(multiEl).empty();
  var id = $j(event.target).data('self');
  if($j(this).data("container")){
    $j('.close-preview-button').hide();
    $j('.nav-selected').removeClass('nav-selected');
    $j(this).addClass('nav-selected');
    multiEl.update('Loading...');
    var contentLink = $j(this);
    contentLink.unbind('click');
    $j.ajax({
      url: '/account/image_nodes/'+id+'/stock_images',
      success: function(response){
        $j(multiEl).empty();
        if(response.length > 0){
          $j.each(response, function(i, image){
            var thumb = createThumbnail(image.stock_image, false);
            $j(multiEl).append(thumb );
          });

          var firstThumb = $('browser2').down('.preview .multi .thumbnail');
          if (firstThumb) {
            firstThumb.addClassName('selected');
          }
        }else{
          $j(multiEl).text("No graphics found.");
        }
        resizeContent('browser2');
        ensureMultiIsShown('browser2');
        contentLink.bind('click', treeNavigation);
      }
    });
  }else{
    var chirrens = $j(this).data("self");
    var childLIs = $j('[data-parent='+chirrens+']')
    childLIs.first().parent().show();
    $j(this).parent().hide();
  }
}

function onChangeView(event){
  $j('.nav-selected').removeClass('nav-selected');
  var target = event.target;
  $j(target).addClass('nav-selected');
  var target_id = target.identify();
  if(target_id == "root"){
    $('user').hide();
    $('new').hide();
    if($('browser').visible){
      $('browser').hide();
    }
    $j('#browser').find('.preview .multi .thumbnail.selected').removeClass('selected');
    if($('upload-dialog').visible){
      $('upload-dialog').hide();
    }
    $('browser2').show();
    $('backbutton').show();
  }else if(target_id == "user"){
    $('browser2').hide();
    $j('#browser2').find('.preview .multi .thumbnail.selected').removeClass('selected');
    $('upload-dialog').hide();
    $('browser').show();
  }else{
    $('browser2').hide();
    $j('#browser2').find('.preview .multi .thumbnail.selected').removeClass('selected');
    $('browser').hide();
    $j('#browser').find('.preview .multi .thumbnail.selected').removeClass('selected');
    $('upload-dialog').show();
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

function resizeContent(browser) {
  var height = document.viewport.getHeight() - 5;
  var multiEl = $(browser).down('.preview .multi');
  var viewWidth = document.viewport.getWidth();
  var navEl = $('nav-container');
  var singleEl = $(browser).down('.preview .single');
  var multiHeight = height;

  navEl.setStyle({height: multiHeight + 'px'});
  multiEl.setStyle({ height:  multiHeight + 'px'});
  singleEl.setStyle({ height: height - 10 + 'px', width: viewWidth - 190 + 'px' });
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
  //$('toggle-upload').toggle();
  resizeContent('browser');

  if (showing && !Prototype.Browser.IE) {
    $('upload-dialog').down('input[type=file]').click();
  }
}

function onImageDoubleClick(event, element) {
  var browser = $j(element).closest('table').attr('id');
  var imgEl = element.down('img');
  var close = $(browser).down('.preview .close-preview-button');
  var multiEl = $(browser).down('.preview .multi');
  var singleEl = $(browser).down('.preview .single');

  var imgFile = imgEl.readAttribute('data-filename');
  var imgId  = imgEl.readAttribute('data-id');
  var isUserImage = imgEl.readAttribute('data-is-user') == 'true'

  var src = (isUserImage ? '/account/figures/' + imgId + '?style=print_preview_thumbnail' : publicPreviewFolder + imgFile);

  singleEl.update(new Element('img', { src: src, 'data-is-user': isUserImage.toString() }));

  var height = imgEl.readAttribute('data-height');
  var width = imgEl.readAttribute('data-width');
  var dpi = imgEl.readAttribute('data-dpi');

  singleEl.insert({ bottom: createMeta(height, width, dpi, imgFile) });
  removeSpinnerOnImgLoad(singleEl);

  //if (isUserImage) {
    //var uploadDiv = $('viewport').down('.preview .uploads');
    //uploadDiv.toggle();
  //}

  close.toggle();
  singleEl.toggle();
  multiEl.toggle();
  resizeContent(browser);
}

function closePreview(event, element){
  var browser = $j(element).closest('table').attr('id');
  var multiEl = $(browser).down('.preview .multi');
  var closebutton = $(browser).down('.preview .close-preview-button');
  var singleEl = $(browser).down('.preview .single');

  singleEl.hide();
  closebutton.hide();
  multiEl.show();
}

function onThumbnailClick(event, element) {
  var currentEl = $j(element).closest('table').find('.preview .multi .selected');
  if (currentEl) {
    currentEl.removeClass('selected');
  }
  element.addClassName('selected');
}

function onLeafClick() {
  var url = '/account/figures.json';

  var multiEl = $('browser').down('.preview .multi');
  multiEl.update('Loading...');
  $j.ajax({
    url: url,
    success: function(response){
      if(response.length > 0){
        $j(multiEl).empty();
        $j.each(response, function(i, image){
          var thumb = createThumbnail(image.figure, true);
          $j(multiEl).append(thumb );
        });

        var firstThumb = $('browser').down('.preview .multi .thumbnail');
        if (firstThumb) {
          firstThumb.addClassName('selected');
        }
        resizeContent('browser');
        ensureMultiIsShown('browser');
      }else{
        $(multiEl).update("You have no images to show. To get started, click 'New...' on the left and upload an image.")
      }
    }
  });
}

function ensureMultiIsShown(browserToShow) {
  // switch out of single view
  var multiEl = $(browserToShow).down('.preview .multi');
  var singleEl = $(browserToShow).down('.preview .single');
  singleEl.hide();
  multiEl.show();
}

function getReferenceFileName(filename){
  var badFileExtension = filename.split(".").pop();
  var referenceFileName = filename.replace("." + badFileExtension, ".PNG");
  return referenceFileName;
}

function createMeta(height, width, dpi, name) {
  var metaEl = new Element('div', { 'class': 'meta' }).update(new Element('p').update(name));
  var sizeString = "#{width}in &times; #{height}in @ #{dpi}dpi".interpolate({
    width: Math.round(100 * width / dpi) / 100,
    height: Math.round(100 * height / dpi) / 100,
    dpi: dpi
  });
  metaEl.insert({ bottom: new Element('p').update(sizeString) });

  return metaEl;
}

function createThumbnail(figureObj, isUserImage) {
  var fileName;
  var divEl = new Element('div', { 'class': 'thumbnail' });
  var wrapEl = new Element('div', { 'class': 'wrapper' });
  var src;
  if(isUserImage){
    fileName = figureObj.asset_file_name;
    src  ='/account/figures/' + figureObj.id + '?style=thumb';
  }else{
    fileName = figureObj.file_name;
    src = 'http://d241umpdvf5e0e.cloudfront.net/stock-images-thumbs/' + figureObj.file_name;
  }

  var properties = {
    src             : src,
    'data-width'    : figureObj.width,
    'data-height'   : figureObj.height,
    'data-dpi'      : figureObj.dpi,
    'data-filename' : getReferenceFileName(fileName),
    'data-id'       : figureObj.id || 0,
    'data-is-user'  : isUserImage.toString()
  };

  wrapEl.insert({ bottom: new Element('img', properties) });
  divEl.insert({ bottom: wrapEl });
  divEl.insert({ bottom: createMeta(figureObj.height, figureObj.width, figureObj.dpi, fileName) });

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

})();

function getProperties(browser) {
  var selectedThumbEl = $(browser).down('.multi .thumbnail.selected');
  if (!selectedThumbEl) {
    return null;
  }

  var imgEl = selectedThumbEl.down('img');
  var imgFile = imgEl.readAttribute('data-filename');
  var imgExtension = imgFile.match(/\.[^\.]+$/)[0];
  var imgId  = imgEl.readAttribute('data-id');    var isUserImage = imgEl.readAttribute('data-is-user') == 'true'
  var previewSrc = (isUserImage ? '/account/figures/' + imgId + '?style=print_preview_thumbnail' : publicPreviewFolder + imgFile);

  return {
    filename: isUserImage ? imgId + imgExtension : imgFile,
    src: previewSrc,
    width: imgEl.readAttribute('data-width'),
    height: imgEl.readAttribute('data-height'),
    dpi: imgEl.readAttribute('data-dpi')
  };
}
