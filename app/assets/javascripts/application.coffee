$ ->

  BP_MEDIUM = 52;

  page_width_on_load = BreakpointDetection.getPageWidth()

  # $('article.week').not(':first-of-type').week_toggle()

  # ****************************************************
  # VIEW LATEST LINK
  # ****************************************************  
  $('#header .latest a').click (event) ->
      
      event.preventDefault()
      
      $latest = $($(this).attr('href'));
      
      $('html, body').animate
        scrollTop: ( $latest.offset().top - 20 )

  # ****************************************************
  # WEEK TOGGLE
  # ****************************************************
  (() ->

    current_congfig = '';

    if page_width_on_load >= BP_MEDIUM
      $('article.week').not(':last-of-type').week_toggle
        hidden_selectors: '.text, .statistics, .header h3'
      current_congfig = 'desktop'
    else
      $('article.week').not(':last-of-type').week_toggle
        hidden_selectors: '.steve, .gordon, .statistics'
        speed: 800
      expand_enabled = true
      current_congfig = 'mobile'


    BreakpointDetection.addCallback (page_width) ->

      if (page_width >= BP_MEDIUM) and (current_congfig != 'desktop')

        # First destroy the current config
        $('article.week').not(':last-of-type').week_toggle 'destroy'
        
        # The re-instate the desktop config
        $('article.week').not(':last-of-type').week_toggle
          hidden_selectors: '.text, .statistics'
        current_congfig = 'desktop'


      if (page_width < BP_MEDIUM) and (current_congfig != 'mobile')

        # First destroy the current config
        $('article.week').not(':last-of-type').week_toggle 'destroy'
        
        # The re-instate the desktop config
        $('article.week').not(':last-of-type').week_toggle
          hidden_selectors: '.steve, .gordon, .statistics'
          speed: 800
        current_congfig = 'mobile'

  )()

