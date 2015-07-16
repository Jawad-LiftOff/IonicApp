angular.module('dials.services', ['ngResource'])

  .factory('DataManager', function ($resource) {

  var url = "http://private-fd322-oddball.apiary-mock.com";
  var service = $resource(url + "/:action/",
    { action: '@action', id: '@id' },
    {
      'events': { method: 'GET', isArray: true, params: { action: 'events' } },
      'schedule': { method: 'GET', isArray: true, params: { action: 'schedule' } }
    });

  return service;
})

  .factory('Calendar', function () {
  var index = 0;
  var Calendar = (function () {
    function Calendar(year, month, dates) {  
      this.eventDates = dates;    
      this.moment = moment();
      if (year) {
        this.moment.year(year);
      }
      if (month) {
        if ("number" === typeof month) {
          month--; // to offset moment cause moment "0" = Jan.
        }
        this.moment.month(month+1);
      }
      // set to the beginning of the month;
      this.moment.date(1);
    }

    Calendar.prototype.daysOfWeekStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    Calendar.prototype.monthStrings = ["Jan", "Feb", "Apr", "Mar", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    Calendar.prototype.createDay = function (date) {    
      var today = moment.utc();
      return {
        month: date.month(), // [0, 11]
        monthName: this.monthStrings[date.month()],
        date: date.date(),
        day: this.daysOfWeekStrings[date.day()],
        year: date.year(),
        hasEvent: _.find(this.eventDates, function(evt) { 
          if(evt.date() == date.date() && evt.month() == date.month() && evt.year() == date.year()){            
            return true;
          } }),
        isCurrentDate: (date.date() == today.date() && date.month() == today.month() && date.year() == today.year()),
        pos: 45 * index++
      };
    };

    Calendar.prototype.generate = function (opts) {
      var m; // reused variable for moment()
      var w; // reused variable as a "week"
      // defaults
      opts = _.defaults(opts || {}, {
        withOtherMonthDays: false
      });
      // we will fill in this array
      var weeks = [];

      w = [];
      m = moment(this.moment);
      var daysInMonth = this.moment.daysInMonth();
      var d = 1;
      while (d <= daysInMonth) {
        // finish and close off the week
        if (m.day() === 0 && w.length) {
          weeks.push(w);
          w = [];
        }
        // add the day to the week
        w.push(this.createDay(m));
        // advance one day
        m.add(1, 'days');
        d++;
      }
      // add the last week
      if (w.length) {
        weeks.push(w);
      }
      // we will associate other days to the first
      // and last weeks if applicable.
      if (opts.withOtherMonthDays) {
        w = weeks[0];
        m = moment(this.moment).subtract(1, 'days');
        while (w.length < 7) {
          w.unshift(this.createDay(m));
          m.subtract(1, 'days');
        }
        weeks[0] = w;

        w = weeks[weeks.length - 1];
        m = moment(this.moment).add(1, 'months');
        while (w.length < 7) {
          w.push(this.createDay(m));
          m.add(1, 'day');
        }
        weeks[weeks.length - 1] = w;
      }
      return weeks;
    };
    return Calendar;
  })();

  return Calendar;

});