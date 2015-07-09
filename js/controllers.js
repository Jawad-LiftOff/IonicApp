angular.module('dials.controllers', ['dials.services'])

.controller('AppCtrl', function ($scope) {
})

.controller('EventCtrl', function ($scope, $ionicPopup, EventsManager) {  
  
  $scope.init = function () {
    $scope.today = new Date();
    $scope.bold = 'bold';
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
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var thisDay = $scope.today.getDay() == 0 ? 7 : $scope.today.getDay();    
    var weekStartDate = $scope.today.getDate() - (thisDay - 1);
    var weekStart = new Date(new Date().setDate(weekStartDate));

    $scope.daysInWeek = [];  
    for (var i = 0; i < 7; i++) {
      var day = new Date(new Date().setDate(weekStart.getDate() + i)); 
      day.day = days[i];  
      day.hasEvent = $scope.eventDates.indexOf(day.getDate()) >= 0;   
      $scope.daysInWeek.push(day);
    }
  };

  var getEvents = function () {    
    EventsManager.events(function (res) {      
      $scope.events = res;
      $scope.eventDates = [];
      for (var i = 0; i < res.length; i++) {        
        var startDate = new Date(res[i].eventStartTime);        
        $scope.eventDates.push(startDate.getUTCDate());  
      }      
      $scope.getWeekData();
    });
  };
  
  $scope.init();

});
