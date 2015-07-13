angular.module('dials.controllers', ['dials.services'])

  .controller('AppCtrl', function ($scope) {
  var views = ['templates/event.html', 'templates/eventlist.html'];
  var view = 0;
  $scope.contentFilePath = views[view];
  $scope.toggleView = function () {
    view ^= 1;
    $scope.contentFilePath = views[view];
  };
})

  .controller('EventCtrl', function ($scope, $ionicPopup, $filter, $interval, $timeout, DataManager) {

  $scope.init = function () {
    $scope.today = new Date();
    $scope.bold = 'bold';
    $scope.setDate = new Date();
    getSchedule();
    getEvents();
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
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var thisDay = $scope.today.getDay() == 0 ? 7 : $scope.today.getDay();
    var weekStartDate = $scope.today.getDate() - (thisDay - 1);
    var weekStart = new Date(new Date().setDate(weekStartDate));

    $scope.daysInWeek = [];
    _.each(days, function (d, i) {
      var day = new Date(new Date().setDate(weekStart.getDate() + i));
      day.day = d;
      var date = (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear();
      var schedules = _.find($scope.schedule, function (data) {
        return new Date(data.date).toDateString() == new Date(date).toDateString()
      });
      day.hasEvent = schedules;
      $scope.daysInWeek.push(day);
    });

  };

  var getSchedule = function () {
    DataManager.schedule(function (res) {
      $scope.schedule = res;
      $scope.getWeekData();
    });
  };

  var getAngle = function (h, m) {
    h = h >= 12 ? 12 - h : h;
    var hAngle = 0.5 * (h * 60 + m);
    var mAngle = 6 * m;
    var angle = Math.abs(hAngle - mAngle);
    angle = Math.min(angle, 360 - angle);
    return angle;
  };

  var getEvents = function () {
    DataManager.events(function (res) {
      _.each(res, function (data) {
        var date = new Date(data.start_time);
        data.date = new Date(data.start_time).getDate();
        data.hour = date.getHours()  >= 12 ? date.getHours() - 12: date.getHours();
        data.min = date.getMinutes();
        //data.angle = getAngle(date.getHours(), date.getMinutes());
      });     
      $scope.events = res;
      countDown();
    });
  };

  $scope.resetDate = function (day) {
    $scope.setDate = day;
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
      $interval(function () {
        $scope.timeRemaining = getDiffTime($scope.nextEvent.start_time - new Date().getTime());
      }, 1000);
    }

  };

  $scope.date = new Date();
  $scope.majors = new Array(12);
  $scope.minors = new Array(48);
  $interval(function () {
    $scope.date = new Date();
  }, 10000);
  $scope.init();

})

  .directive('ngCustAttr', function () {
  return function (scope, element, attrs) {
    element.attr('transform', attrs.ngX);
  };
});