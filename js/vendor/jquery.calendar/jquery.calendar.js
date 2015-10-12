/*
	jQuery Verbose Calendar
	http://johnpatrickgiven.com
	https://github.com/iamjpg/jQuery-Verbose-Calendar/

	MIT License

	Copyright (C) 2012 John Patrick Given

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($, window, document) {

  //
  // Globals
  var pluginName = 'calendar',
    pl = null,
    d = new Date();

  //
  // Defaults
  var defaults = {
    d: d,
    year: d.getFullYear(),
    today: d.getDate(),
    month: d.getMonth(),
    current_year: d.getFullYear(),
    tipsy_gravity: 's',
    scroll_to_date: true
  };

  month_array = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Augosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  month_days = [
    '31', // jan
    '28', // feb
    '31', // mar
    '30', // apr
    '31', // may
    '30', // june
    '31', // july
    '31', // aug
    '30', // sept
    '31', // oct
    '30', // nov
    '31' // dec
  ];

  //
  // Main Plugin Object
  function Calendar(element, options) {
    pl = this;
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;


    //
    // Begin
    this.init();
  }


  $.extend(Calendar.prototype, {
    init: function() {
			//
	    // Call print - who knows, maybe more will be added to the init function...
	    this.print();

      this.highlight_dates();
		},
		print: function(year) {
			//
	    // Pass in any year you damn like.
	    var the_year = (year) ? parseInt(year) : parseInt(pl.options.year);

	    //
	    // First, clear the element
	    $(this.element).empty();

	    $('.label').css({
	      display: 'none'
	    });

	    //
	    // Append parent div to the element
	    $(this.element).append('<div id=\"calendar\"></div>');

	    //
	    // Set reference for calendar DOM object
	    var $_calendar = $('#calendar');

	    //
	    // Let's append the year
	    pl.print_year( the_year, $_calendar )

	    //
	    // Navigation arrows
	    pl.print_navigation( $_calendar )

	    //
	    // Add a clear for the floated elements
	    pl.print_clear_float( $_calendar )

	    //
	    // Loop over the month arrays, loop over the characters in teh string, and apply to divs.
	    $.each(month_array, function(i, o) {

	      //
	      // Create a scrollto marker
	      $_calendar.append("<div id='" + o + "'></div>");

        //
        // Let's append the month name
        pl.print_month( month_array[i], $_calendar )

	      //
	      // Add a clear for the floated elements
	      pl.print_clear_float( $_calendar )

	      //
	      // Check for leap year
	      if (o === 'Fevereiro') {
          month_days[i] = pl.fix_leap_year( the_year )
        }

	      for (j = 1; j <= parseInt(month_days[i]); j++) {

	        //
	        // Check for today
	        var today = '';
	        if (i === pl.options.month && the_year === d.getFullYear()) {
	          if (j === pl.options.today) {
	            today = 'today';
	          }
	        }

	        //
	        // Looping over numbers, apply them to divs
	        $_calendar.append("<div data-date='" + (parseInt(i) + 1) + '/' + j + '/' + the_year + "' class='label day " + today + "'>" + j + '</div>');
	      }

	      //
	      // Add a clear for the floated elements
	      pl.print_clear_float( $_calendar )
	    });

	    //
	    // Loop over the elements and show them one by one.
	    for (k = 0; k < $('.label').length; k++) {
	      (function(j) {
	        setTimeout(function() {

	          //
	          // Fade the labels in
	          $($('.label')[j]).fadeIn('fast', function() {

	            //
	            // Set titles for tipsy once in DOM
	            $(this).attr('original-title', pl.returnFormattedDate($(this).attr('data-date')));

	            $(this).on('click', function() {
	              if (typeof pl.options.click_callback == 'function') {
	                var d = $(this).attr('data-date').split("/");
	                var dObj = {}
	                dObj.day = d[1];
	                dObj.month = d[0];
	                dObj.year = d[2];
	                pl.options.click_callback.call(this, dObj);
	              }
	            });
	          });

	        }, (k * 3));
	      })(k);
	    }

	    //
	    // Scroll to month
	    if (the_year === pl.options.current_year && pl.options.scroll_to_date) {
	      var print_finished = false;
	      var print_check = setInterval(function() {
	        print_finished = true;
	        $.each($(".label"), function() {
	          if ($(this).css("display") === "none") {
	            print_finished = false;
	          }
	        });
	        if (print_finished) {
	          clearInterval(print_check);
	          $(window).scrollTo($('#' + month_array[pl.options.month]), 800);
	        }
	      }, 200);
	    }

	    //
	    // Tipsy
	    $('.label').tipsy({
	      gravity: pl.options.tipsy_gravity
	    });
		},
    highlight_dates: function() {
      if (typeof pl.options.dates_list_callback == 'function') {

        var dates = pl.options.dates_list_callback.call();

        for (var i = 0; i < dates.length; i++) {
          // day   = dates[i].getDate()
          // month = dates[i].getMonth() + 1
          // year  = dates[i].getFullYear()
          //
          // date = month + '/' + day + '/' + year

          date = dates[i]

          console.log( date )

          $('[data-date="' + date + '"]').addClass('shinrei')
        }


        // console.log(dates)
      }
    },
		isLeap: function(year) {
			var leap = 0;
	    leap = new Date(year, 1, 29).getMonth() == 1;
	    return leap;
		},
    fix_leap_year: function( the_year ) {
      if (this.isLeap(the_year)) {
        return 29;
      } else {
        return 28;
      }
    },
		returnFormattedDate: function(date) {
			var returned_date;
	    var d = new Date(date);
	    var da = d.getDay();

	    if (da === 1) {
	      returned_date = 'Monday';
	    } else if (da === 2) {
	      returned_date = 'Tuesday';
	    } else if (da === 3) {
	      returned_date = 'Wednesday';
	    } else if (da === 4) {
	      returned_date = 'Thursday';
	    } else if (da === 5) {
	      returned_date = 'Friday';
	    } else if (da === 6) {
	      returned_date = 'Saturday';
	    } else if (da === 0) {
	      returned_date = 'Sunday';
	    }

	    return returned_date;
		},
    print_year: function( the_year, $_container ) {
      $.each(the_year.toString().split(''), function(i, o) {
	      $_container.append('<div class=\"year\">' + o + '</div>');
	    });
    },
    print_navigation: function( $_container ) {
      //
      // Navigation arrows
      $_container.append('<div id=\"arrows\"></div>');

      //
      // DOM object reference for arrows
      $_arrows = $('#arrows');
      $_arrows.append('<div class=\"next\"></div>');
      $_arrows.append('<div class=\"prev\"></div>');
    },
    print_clear_float: function( $_container ) {
      //
	    // Add a clear for the floated elements
	    $_container.append('<div class=\"clear\"></div>');
    },
    print_month: function( month, $_container ) {
      $.each(month.split(''), function(i, o) {

        //
        // Looping over characters, apply them to divs
        $_container.append('<div class=\"label bold\">' + o + '</div>');

      });
    }
  });

  //
  // Previous / Next Year on click events
  $(document).on('click', '.next', function() {
    pl.options.year = parseInt(pl.options.year) + 1;

    pl.print(pl.options.year);
  });

  $(document).on('click', '.prev', function() {
    pl.options.year = parseInt(pl.options.year) - 1;

    pl.print(pl.options.year);
  });


  //
  // Plugin Instantiation
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Calendar(this, options));
      }
    });
  };

})(jQuery, window, document);
