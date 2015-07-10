angular.module('dials.controllers', ['dials.services'])

  .controller('AppCtrl', function ($scope) {
})

  .controller('EventCtrl', function ($scope, $ionicPopup, $filter, $timeout, DataManager) {

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
      var date = (day.getUTCMonth() + 1) + '/' + day.getUTCDate() + '/' + day.getUTCFullYear();
      var schedules = _.find($scope.schedule, function (data) { return new Date(data.date).toDateString() == new Date(date).toDateString() });
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

  var getEvents = function () {
    DataManager.events(function (res) {
      _.each(res, function (data) {
        data.date = new Date(data.start_time).getUTCDate();
      });
      $scope.events = res;
    });
  };

  $scope.resetDate = function (day) {
    $scope.setDate = day;
  };

  $scope.init();

});
