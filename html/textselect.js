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

      // validate that selected element is child of container
      if (!container.contains(range.commonAncestorContainer)) {
        fail();
        return;
      }

      var rect = {
        // min-max props for ranges
        // we are using 40k starting point cos its abysmally complicated
        // to get real document width/height
        top: 40000,
        left: 40000,
        bottom: 0,
        right: 0,

        // final width and height that will be computed
        width: 0,
        height: 0
      };

      // iterate rects that have selections
      var rects = range.getClientRects();
      for (var i = 0; i < rects.length; i ++) {
        var r = rects[i];

        if (r.top < rect.top) rect.top = r.top;
        if (r.left < rect.left) rect.left = r.left;
        if (r.bottom > rect.bottom) rect.bottom = r.bottom;
        if (r.right > rect.right) rect.right = r.right;
      }

      // compute final width and height for bounding box
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;

      // correct the top and left position with the scroll
      var doc = document.documentElement;
      rect.left += (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      rect.top += (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

      // see if selection is greater than 5 px
      // we are doing this because rects positions are floats, not integers
      // so we can't expect rect dimensions to be zero
      if (rect.width > 5 && rect.height > 5) {
        bounding.style.top = rect.top + 'px';
        bounding.style.left = rect.left + 'px';
        bounding.style.width = rect.width + 'px';
        bounding.style.height = rect.height + 'px';

        bounding.style.display = 'block';
        showTooltip(rect);
      } else {
        fail();
      }
    } else {
      fail();
    }
  };

};
