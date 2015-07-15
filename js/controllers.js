angular.module('dials.controllers', ['dials.services'])

  .controller('AppCtrl', function ($scope, $location) {
  var views = ['templates/event.html', 'templates/eventlist.html'];
  var view = 0;
  $scope.contentFilePath = views[view];

  $scope.setHeaders = function () {
    $scope.showInfoButton = true;
    $scope.showMenuButton = true;
    $location.path('/app/event');
  };

  $scope.toggleView = function () {
    view ^= 1;
    $scope.contentFilePath = views[view];
  };

  $scope.gotToAbout = function () {
    $scope.showInfoButton = false;
    $scope.showMenuButton = false;
    $location.path('/app/about');
  };

  $scope.setHeaders();
})

  .controller('EventCtrl', function ($scope, $ionicPopup, $filter, $interval, DataManager, Calendar) {
  $scope.init = function () {
    $scope.today = new Date();
    $scope.bold = 'bold';    
    var momentToday = moment.utc();
    $scope.setDate = momentToday.date() + '-' + momentToday.month() + '-' + momentToday.year(); //new Date();
    $scope.header = momentToday.date() + '|' + moment.months(momentToday.month()) + '|' + momentToday.year(); //new Date();    
    $scope.date = new Date();
    $scope.majors = new Array(12);
    $scope.minors = new Array(48);
    getSchedule();
    getEvents();
    $interval(function () {
      $scope.date = new Date();
    }, 10000);
  };

  $scope.showPopup = function () {
    document.getElementsByTagName('ion-nav-view')[0].classList.add("doBlur");
    $scope.myPopup = $ionicPopup.show({
      template: '<img src="img/promo.png" class="full-image"><span class="close-popup" ng-click="closePopup()">Close</span>',
      scope: $scope
    });
  };

  $scope.closePopup = function () {
    document.getElementsByTagName('ion-nav-view')[0].classList.remove("doBlur");
    $scope.myPopup.close();
  };

  $scope.getWeekData = function () {
    var dates = _.map($scope.schedule, function (data) { return moment(data.date) });    
    var start = _.min(dates);
    var end = _.max(dates); 
    $scope.data = []; 
    $scope.daysInWeek = [];
    while (start.month() <= end.month() && start.year() <= end.year()) {
      var calendar = new Calendar(start.year(), start.month(), dates);
      var cal = calendar.generate();
      var arr = [];      
      $scope.data.push(arr.concat.apply(arr, cal));
      start.add(1, 'month');      
    }
    $scope.daysInWeek = $scope.data.concat.apply($scope.daysInWeek, $scope.data);
  };

  var getSchedule = function () {
    DataManager.schedule(function (res) {
      $scope.schedule = res;
      $scope.getWeekData();
    });
  };

  var getEvents = function () {
    DataManager.events(function (res) {
      _.each(res, function (data) {
        var date = new Date(data.start_time);
        var momentDate = moment(data.start_time);
        data.date = momentDate.date() + '-' + momentDate.month() + '-' + momentDate.year();//new Date(data.start_time).getDate();
        data.hour = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        data.min = date.getMinutes();
      });
      $scope.events = res;      
      countDown();
    });
  };

  $scope.resetDate = function (day) {    
    $scope.setDate = day.date + '-' + day.month + '-' + day.year;    
    $scope.header = day.date + "|" + moment.months(day.month) + "|" + day.year; 
  };

  var getDiffTime = function (ms) {
    var daysms = ms % (24 * 60 * 60 * 1000);
    var hours = Math.floor((daysms) / (60 * 60 * 1000));
    hours = hours < 10 ? '0' + hours : hours;
    var hoursms = ms % (60 * 60 * 1000);
    var minutes = Math.floor((hoursms) / (60 * 1000));
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var minutesms = ms % (60 * 1000);
    var sec = Math.floor((minutesms) / (1000));
    sec = sec < 10 ? '0' + sec : sec;
    return hours + ":" + minutes + ":" + sec;
  };

  var countDown = function () {
    var now = new Date();
    var comingEvents = _.filter($scope.events, function (data) {
      return data.start_time > now.getTime();
    });
    $scope.nextEvent = _.min(comingEvents, function (data) { return data.start_time; });
    $scope.now = new Date().getTime();

    if (comingEvents && comingEvents.length > 0) {
      $scope.timeRemaining = getDiffTime($scope.nextEvent.start_time - new Date().getTime());
      $interval(function () {
        $scope.timeRemaining = getDiffTime($scope.nextEvent.start_time - new Date().getTime());
      }, 1000);
    }

  };

  $scope.onEventClick = function (event) {
    alert(event.date);
  };

  $scope.init();

});