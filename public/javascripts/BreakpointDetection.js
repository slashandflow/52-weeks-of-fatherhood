var BreakpointDetection, BreakpointDetectionSubject;

BreakpointDetectionSubject = (function() {
  BreakpointDetectionSubject.prototype.CALLBACKS = [];

  BreakpointDetectionSubject.prototype.PAGE_WIDTH = 0;

  function BreakpointDetectionSubject() {}

  BreakpointDetectionSubject.prototype.addPageWidth = function(page_width) {
    return this.PAGE_WIDTH = page_width;
  };

  BreakpointDetectionSubject.prototype.getPageWidth = function() {
    return this.PAGE_WIDTH;
  };

  BreakpointDetectionSubject.prototype.addCallback = function(callback) {
    return this.CALLBACKS.push(callback);
  };

  BreakpointDetectionSubject.prototype.notify = function(page_width) {
    var callback, _i, _len, _ref, _results;
    this.PAGE_WIDTH = page_width;
    _ref = this.CALLBACKS;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      _results.push(callback(this.PAGE_WIDTH));
    }
    return _results;
  };

  return BreakpointDetectionSubject;

})();

BreakpointDetection = new BreakpointDetectionSubject();

$(document).ready(function() {
  var $breakpoint_element, breakpointValue, breakpointValuePrev;
  $breakpoint_element = $('<div id="breakpoint_element"></div>');
  $('body').append($breakpoint_element);
  breakpointValue = breakpointValuePrev = $breakpoint_element.css('z-index');
  BreakpointDetection.addPageWidth(breakpointValue);
  return $(window).resize(function() {
    breakpointValue = $breakpoint_element.css('z-index');
    if (breakpointValuePrev !== breakpointValue) {
      breakpointValuePrev = breakpointValue;
      return BreakpointDetection.notify(breakpointValue);
    }
  });
});
