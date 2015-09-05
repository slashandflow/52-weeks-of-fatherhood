class BreakpointDetectionSubject

  CALLBACKS: []
  PAGE_WIDTH: 0

  constructor: () ->

  addPageWidth: (page_width) ->
    @PAGE_WIDTH = page_width

  getPageWidth: ->
    @PAGE_WIDTH

  addCallback: (callback) ->
    @CALLBACKS.push callback

  notify: (page_width) ->
    @PAGE_WIDTH = page_width
    callback(@PAGE_WIDTH) for callback in @CALLBACKS

BreakpointDetection = new BreakpointDetectionSubject()

$(document).ready ->

  # Add breakpoint element to body
  $breakpoint_element = $('<div id="breakpoint_element"></div>')
  $('body').append $breakpoint_element

  # What is initial breakpoint
  breakpointValue = breakpointValuePrev = $breakpoint_element.css('z-index')
  BreakpointDetection.addPageWidth breakpointValue

  # Detect if matchMedia is enabled
  #  If so then us this as the notify event
  #  Otherwise use the window resize event as a fallback
  $(window).resize ->

    breakpointValue = $breakpoint_element.css('z-index')

    if breakpointValuePrev isnt breakpointValue
      breakpointValuePrev = breakpointValue
      BreakpointDetection.notify(breakpointValue)
