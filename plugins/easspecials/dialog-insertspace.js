document.observe('dom:loaded', attachListeners);

/* properties object
 *   contents dependent on the type of blank/space the user selected.
 *
 *   for blanks:
 *     properties = {
 *       blank: small | medium | veryLarge | large | line | fill
 *     }
 *
 *   for extra space:
 *     properties = {
 *       skip: {
 *         type: horizontal | vertical
 *         collapsible: true | false (only valid for 'vertical' type)
 *         size: <number><dimension unit> (e.g. 1.5in, 2pt, 1cm, etc.)
 *       }
 *     }
 *
 *    for characters:
 *       properties = {
 *         space: nonBreaking | thin | en | em | null
 *       }
 *
 *    for paragraphs:
 *       properties = {
 *         paragraph: leaveVMode | noIndent | indent | allowBreak | noBreak
 *       }
 */

function getProperties() {
  var selectedTab = $$('.tabbertab').find(function(tabElem) {
    return !tabElem.hasClassName('tabbertabhide');
  });

  var findCheckedElement = function(e) { return e.checked };

  if (selectedTab.hasClassName('blanks')) {
    return { blank: $$('input[name=blank]').find(findCheckedElement).value }
  }
  else if (selectedTab.hasClassName('characters')) {
    return { space: $$('input[name=space]').find(findCheckedElement).value }
  }
  else if (selectedTab.hasClassName('paragraphs')) {
    return { paragraph: $$('input[name=para]').find(findCheckedElement).value }
  }
  else if (selectedTab.hasClassName('spaces')) {
    return {
      skip: {
        type: $$('input[name=skip]').find(findCheckedElement).value,
        collapsible: $('collapseWorkspace').checked,
        size: $F('width') + $F('dimension')
      }
    }
  }
}

function attachListeners(event) {
  var spacesTab = $$('.tabbertab.spaces')[0];
  $(spacesTab).select('input[type=radio]').invoke('on', 'change', updateWorkspaceCheckbox);

  updateWorkspaceCheckbox();
}

function updateWorkspaceCheckbox() {
  var checkbox = $('collapseWorkspace');
  var radio = $('skipVertical');

  checkbox.disabled = !radio.checked;
}
