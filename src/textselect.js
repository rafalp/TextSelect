var TextSelect = function(container) {

  // setup bounding box
  var bounding = document.createElement('div');
  bounding.id = 'text-select-bounding';
  document.body.appendChild(bounding);


  // setup tooltip box
  var tooltip = document.createElement('div');
  tooltip.id = 'text-select-tooltip';
  document.body.appendChild(tooltip);

  var tooltipBody = document.createElement('div');
  tooltipBody.id = 'text-select-tooltip-body';
  tooltip.appendChild(tooltipBody);

  var tooltipArrow = document.createElement('div');
  tooltipArrow.id = 'text-select-tooltip-arrow';
  tooltip.appendChild(tooltipArrow);

  var hideTooltip = function() {
    tooltip.style.top = '-1000px';
  };

  var showTooltip = function(rect) {
    tooltipBody.innerHTML = Math.ceil(rect.width) + 'px x ' + Math.ceil(rect.height) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight + 'px';

    // compute left offset to center of selection
    var left = rect.left - (tooltip.offsetWidth / 2);
    // offset it to the right so arrow points to center of selection
    left += rect.width / 2;

    // position tooltip
    tooltip.style.left = left + 'px';
  };


  // shorthand for fail
  var fail = function() {
    bounding.style.display = null;
    hideTooltip();
  };


  // check for selection handling on mouse up
  document.onmouseup = function(e) {
    var selection = window.getSelection();
    if(selection) {
      var range = selection.getRangeAt(0);

      // don't handle collapsed selections
      if (range.collapsed) {
        fail();
        return;
      }

      // validate that selected element is child of container
      if (!container.contains(range.commonAncestorContainer)) {
        fail();
        return;
      }

      // get selection rectage
      var src = range.getBoundingClientRect();
      var rect = {
        top: src.top,
        left: src.left,

        width: src.width,
        height: src.height
      };

      // correct the top and left position with the scroll
      var doc = document.documentElement;
      rect.left += (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      rect.top += (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

      // finally show selection
      bounding.style.top = rect.top + 'px';
      bounding.style.left = rect.left + 'px';
      bounding.style.width = rect.width + 'px';
      bounding.style.height = rect.height + 'px';

      bounding.style.display = 'block';
      showTooltip(rect);
    } else {
      fail();
    }
  };

};
