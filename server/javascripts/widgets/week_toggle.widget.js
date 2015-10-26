$(function() {
  return $.widget('primate.week_toggle', {
    options: {
      js_enabled: 'js_enabled',
      hidden_selectors: '.text',
      speed: 400
    },
    $container: null,
    $hiddenParts: null,
    $openLink: null,
    weekVisible: false,
    weekNumber: 1,
    _init: function() {
      var $container, $hiddenParts, options, that;
      that = this;
      options = this.options;
      this.$container = $container = $(this.element);
      $container.addClass(options.js_enabled);
      $hiddenParts = this.$hiddenParts = $(options.hidden_selectors, $container);
      $hiddenParts.hide();
      this.weekNumber = $container.attr('data-week-number');
      return this._addOpenLink();
    },
    _destroy: function() {
      this.$container.removeClass(this.options.js_enabled);
      this.$hiddenParts.show();
      return this.$openLink.remove();
    },
    _addOpenLink: function() {
      var $openLink, that;
      that = this;
      $openLink = this.$openLink = $("<div class='read_more'><a href='#'>Read week " + this.weekNumber + "</a></div>");
      $('a', $openLink).click(function(event) {
        event.preventDefault();
        if (that.weekVisible) {
          return that._hideWeek();
        } else {
          return that._showWeek();
        }
      });
      return this.$container.append($openLink);
    },
    _showWeek: function() {
      var options;
      options = this.options;
      this.$hiddenParts.slideToggle(options.speed);
      $('html, body').animate({
        scrollTop: this.$container.offset().top - 20
      });
      $('a', this.$openLink).html("Hide week " + this.weekNumber);
      return this.weekVisible = true;
    },
    _hideWeek: function() {
      var options;
      options = this.options;
      this.$hiddenParts.slideToggle(options.speed);
      $('a', this.$openLink).html("Show week " + this.weekNumber);
      return this.weekVisible = false;
    }
  });
});

jQuery;
