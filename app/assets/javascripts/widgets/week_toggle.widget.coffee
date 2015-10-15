$ ->

  $.widget 'primate.week_toggle', {

    options:
      js_enabled: 'js_enabled'
      hidden_selectors: '.text'
      speed: 400

    $container: null
    $hiddenParts: null
    $openLink: null
    weekVisible: false
    weekNumber: 1


    ##
    # PUBLIC METHODS
    ##
    _init: () ->

      that = this
      options = this.options
      this.$container = $container = $(this.element)

      $container.addClass options.js_enabled

      # Hide the text within Steve's and Gordon's blocks
      $hiddenParts = this.$hiddenParts = $(options.hidden_selectors, $container)
      $hiddenParts.hide()

      # Determine the week number
      this.weekNumber = $container.attr 'data-week-number'

      # Add 'open' link
      this._addOpenLink()


    _destroy: () ->

      this.$container.removeClass this.options.js_enabled

      this.$hiddenParts.show()

      this.$openLink.remove()

    _addOpenLink: () ->

      that = this

      $openLink = this.$openLink = $("<div class='read_more'><a href='#'>Read week #{this.weekNumber}</a></div>")

      $('a', $openLink).click (event) ->
        event.preventDefault()
        if that.weekVisible then that._hideWeek() else that._showWeek()

      this.$container.append $openLink

    _showWeek: () ->

      options = this.options

      this.$hiddenParts.slideToggle(options.speed)

      $('html, body').animate
        scrollTop: ( this.$container.offset().top - 20 )

      $('a', this.$openLink).html "Hide week #{this.weekNumber}"

      this.weekVisible = true

    _hideWeek: () ->

      options = this.options

      this.$hiddenParts.slideToggle(options.speed)

      $('a', this.$openLink).html "Show week #{this.weekNumber}"

      this.weekVisible = false


  }

(jQuery)
