$(function() {
  var BP_MEDIUM, page_width_on_load;
  BP_MEDIUM = 52;
  page_width_on_load = BreakpointDetection.getPageWidth();
  $('#header .latest a').click(function(event) {
    var $latest;
    event.preventDefault();
    $latest = $($(this).attr('href'));
    return $('html, body').animate({
      scrollTop: $latest.offset().top - 20
    });
  });
  return (function() {
    var current_congfig, expand_enabled;
    current_congfig = '';
    if (page_width_on_load >= BP_MEDIUM) {
      $('article.week').not(':last-of-type').week_toggle({
        hidden_selectors: '.text'
      });
      current_congfig = 'desktop';
    } else {
      $('article.week').not(':last-of-type').week_toggle({
        hidden_selectors: '.steve, .gordon',
        speed: 800
      });
      expand_enabled = true;
      current_congfig = 'mobile';
    }
    return BreakpointDetection.addCallback(function(page_width) {
      if ((page_width >= BP_MEDIUM) && (current_congfig !== 'desktop')) {
        $('article.week').not(':last-of-type').week_toggle('destroy');
        $('article.week').not(':last-of-type').week_toggle({
          hidden_selectors: '.text'
        });
        current_congfig = 'desktop';
      }
      if ((page_width < BP_MEDIUM) && (current_congfig !== 'mobile')) {
        $('article.week').not(':last-of-type').week_toggle('destroy');
        $('article.week').not(':last-of-type').week_toggle({
          hidden_selectors: '.steve, .gordon',
          speed: 800
        });
        return current_congfig = 'mobile';
      }
    });
  })();
});
