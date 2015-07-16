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

  .controller('EventCtrl', function ($scope, $ionicPopup, $filter, $interval, $ionicScrollDelegate, $ionicLoading, DataManager, Calendar) {
  $scope.init = function () {
    $scope.showLoading();
    $scope.today = new Date();
    $scope.bold = 'bold';
    var momentToday = moment.utc();
    $scope.setDate = momentToday.date() + '-' + momentToday.month() + '-' + momentToday.year(); //new Date();
    $scope.header = momentToday.date() + '|' + Calendar.prototype.monthStrings[momentToday.month()] + '|' + momentToday.year(); //new Date();
    $scope.scrollLeft = 0;
    $scope.date = new Date();
    $scope.majors = new Array(12);
    $scope.minors = new Array(48);
    getSchedule();
    getEvents();
    $interval(function () {
      $scope.date = new Date();
    }, 10000);
  };
  
  $scope.showLoading = function () {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  
  $scope.hideLoading = function(){
    $ionicLoading.hide();
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
    var start = moment('2015-07-01T00:00:00.000Z');
    var end = moment('2015-12-31T00:00:00.000Z');
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
    var now = moment.utc();
    _.find($scope.daysInWeek, function (day) {
      if (day.date == now.date() && day.month == now.month() && day.year == now.year()) {
        $scope.scrollLeft = day.pos;
      }
    });
    $ionicScrollDelegate.$getByHandle('small').scrollTo($scope.scrollLeft, 0, true);
    $scope.hideLoading();
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
    var selected = _.find($scope.daysInWeek , function(d) { return d.isSelected == true; });
    selected ? selected.isSelected = false : '';
    day.isSelected = true;
    $scope.setDate = day.date + '-' + day.month + '-' + day.year;
    $scope.header = day.date + "|" + Calendar.prototype.monthStrings[day.month] + "|" + day.year;
  };

  var getDiffTime = function (date1, date2) {
    var diff = (date2 - date1) / 1000;
    diff = Math.abs(Math.floor(diff));

    var days = Math.floor(diff / (24 * 60 * 60));
    var leftSec = diff - days * 24 * 60 * 60;

    var hours = Math.floor(leftSec / (60 * 60));
    leftSec = leftSec - hours * 60 * 60;
    hours = hours + (days * 24); 
    hours = hours < 10 ? '0' + hours : hours;

    var minutes = Math.floor(leftSec / (60));
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    leftSec = leftSec - minutes * 60;
    leftSec = leftSec < 10 ? '0' + leftSec : leftSec;
    
    return hours + ":" + minutes + ":" + leftSec;
  };

  var countDown = function () {
    var now = new Date();
    var comingEvents = _.filter($scope.events, function (data) {
      return data.start_time > now.getTime();
    });
    $scope.nextEvent = _.min(comingEvents, function (data) { return data.start_time; });
    $scope.now = new Date().getTime();

    if (comingEvents && comingEvents.length > 0) {
      $scope.timeRemaining = getDiffTime($scope.nextEvent.start_time, new Date().getTime());
      $interval(function () {
        $scope.timeRemaining = getDiffTime($scope.nextEvent.start_time, new Date().getTime());
      }, 1000);
    }
  };

  $scope.onEventClick = function (event) {
    alert(event.artist_name);
  };

  $scope.onScroll = function (event) {
//    console.log($ionicScrollDelegate.$getByHandle('small').getScrollPosition().left);
  };

  $scope.init();

});