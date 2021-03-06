(function() {
  'use strict';
  function onChange(evt) {
  }

  // resize selections that end at the beginning of a new element so that they instead at the end
  // of the sibling element. this prevents accidental manipulation of seemingly unselected elements
  // (e.g., deleting a paragraph also deletes the blank paragraph following it)
  // returns true if selection was tweaked, false otherwise
  function correctTrickySelectionRange(selection) {
    var wasTweaked = false;
    var range = selection.getRanges()[0];
    if (range.startContainer.$ == range.endContainer.$) {
      // no need to manipulate selections that begin and end within the same node
      return wasTweaked;
    }

    var boundaryNodes = range.getBoundaryNodes();
    if (range.endContainer.$ != boundaryNodes.endNode.$ &&
        range.endOffset == 0 &&
        !range.endContainer.getPrevious() ||
        (range.endContainer.getPrevious() && range.endContainer.getPrevious().$ == boundaryNodes.endNode.$)) {
      wasTweaked = true;
      if (range.endContainer.getNext()) {
        range.setEndAt(range.endContainer, CKEDITOR.POSITION_BEFORE_END);
      }
      else {
        range.setEndAt(boundaryNodes.endNode, CKEDITOR.POSITION_BEFORE_END);
      }
      selection.selectRanges([range]);
    }

    return wasTweaked;
  }

  // returns the next sibling of node (if it has one), or the next sibling
  // of an ascendant node if the ascendant node isn't at the end of a block
  //
  // e.g.:
  //   <p>This is some <b>text</b></p><div>AscendantNext</div>
  //
  // calling getAscendantNext for the bold element would return the div
  // (whereas calling getNext for the bold element would return null)
  function getAscendantNext(node) {
    var nextNode;
    do {
      nextNode = node.getNext();
      node = node.getParent();
    } while (nextNode == null && node.getName() != 'body')

    return nextNode;
  }

  // returns the previous sibling of node (if it has one), or the previous sibling
  // of an ascendant node if the ascendant node isn't at the beginning of a block
  //
  // e.g.:
  //   <div>AscendantPrevious</div><p><b>This</b> is some text</p>
  //
  // calling getAscendantNext for the bold element would return the div
  // (whereas calling getNext for the bold element would return null)
  function getAscendantPrevious(node) {
    var prevNode;
    do {
      prevNode = node.getPrevious();
      node = node.getParent();
    } while (prevNode == null && node.getName() != 'body')

    return prevNode;
  }

  // cancel common keyboard events that would lead to content crossing div 'walls'
  // e.g.: hitting backspace into a div#intro, deleting from the end of a div#parbox, etc.
  function onKey(evt) {
    if (evt.editor.readOnly) {
      return;
    }

    // process backspace/delete keypresses while a selection is active
    var selection = evt.editor.getSelection();
    if (correctTrickySelectionRange(selection) &&
        (evt.data.keyCode >= CKEDITOR.SHIFT + 33 &&  // covers shift + (pageup, pagedown, home, end, and 4 arrows)
        evt.data.keyCode <= CKEDITOR.SHIFT + 40)) {
      // cancel effect of keyboard manipulation of selection if selection was
      // already tweaked
      evt.cancel();
      return;
    }

    // ignore keystrokes that aren't backspace or delete or ctrl+x
    if (evt.data.keyCode != 8 && evt.data.keyCode != 46 && evt.data.keyCode != (CKEDITOR.CTRL + 88) && evt.data.keyCode != 13) {
      return;
    }

    var range = selection.getRanges()[0];
    if (range.startContainer.$ != range.endContainer.$) {
      var boundaryNodes = range.getBoundaryNodes();

      var elementBeforeSelection = getAscendantPrevious(boundaryNodes.startNode);
      var precedingWall = null;
      if (elementBeforeSelection && elementBeforeSelection.type == CKEDITOR.NODE_ELEMENT && elementBeforeSelection.hasClass('wall')) {
        precedingWall = elementBeforeSelection;
      }

      var elementAfterSelection = getAscendantNext(boundaryNodes.endNode);
      var followingWall = null;
      if (elementAfterSelection && elementAfterSelection.type == CKEDITOR.NODE_ELEMENT && elementAfterSelection.hasClass('wall')) {
        followingWall = elementAfterSelection;
      }

      var shouldNotDelete = (followingWall && !elementBeforeSelection) ||
                            (precedingWall && !elementAfterSelection);
      if (shouldNotDelete) {
        evt.cancel();
      }
      return;
    }

    // at this point, we're only interested in backspace/delete keypresses where nothing is selected
    if (!range.collapsed) {
      return;
    }

    var startElement = selection.getStartElement();
    if (evt.data.keyCode == 8 && range.checkStartOfBlock()) { // backspace
      var prevElem = startElement.getPreviousSourceNode(true, CKEDITOR.NODE_ELEMENT);
      if (prevElem && prevElem.hasClass('wall')) {
        // cancel backspace keypresses when cursor is outside the end of a .wall...
        evt.cancel();
      }
      else {
        // ...or inside the beginning of a .wall
        var elemPath = new CKEDITOR.dom.elementPath(startElement);
        _.each(elemPath.elements, function(element) {
          if (element.hasClass('wall') && element.getFirst().equals(elemPath.block || elemPath.blockLimit)) {
            evt.cancel();
          }
        });
      }
    }
    else if (evt.data.keyCode == 46 && range.checkEndOfBlock()) { // delete
      // HACK sometimes calls to checkEndOfBlock (specifically the line that calls this.trim())
      // ends up deselecting what's currently selected. undo this.
      selection.selectRanges([range]);
      var nextElem = startElement.getNextSourceNode(true, CKEDITOR.NODE_ELEMENT);
      if (nextElem && nextElem.hasClass('wall')) {
        // cancel delete keypresses when cursor is outside of beginning of a .wall...
        evt.cancel();
      }
      else {
        // or inside at end of a .wall...
        var elemPath = new CKEDITOR.dom.elementPath(startElement);
        _.each(elemPath.elements, function(element) {
          if (element.hasClass('wall') && element.getLast().equals(elemPath.block || elemPath.blockLimit)) {
            evt.cancel();
          }
        });
      }
    }
  }

  CKEDITOR.plugins.add('easbehaviors', {
    init: function(editor) {
       var type;
      if(typeof editor.config.easEditorType != 'undefined'){
        type = editor.config.easEditorType;
      }else{
        type = "problem";
      }

      editor.on('key', CKEDITOR.tools.bind(onKey, this));
      editor.on('change', CKEDITOR.tools.bind(onChange, this));
    }
  });
})();
