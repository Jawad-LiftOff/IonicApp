angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
})

.controller('EventCtrl', function ($scope, $ionicPopup) {  
  
  $scope.init = function () {
    $scope.today = new Date();
    $scope.bold = 'bold';
    $scope.getWeek();
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
  
  $scope.getWeek = function () {
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var thisDay = $scope.today.getDay() == 0 ? 7 : $scope.today.getDay();
    var daysToReduce = thisDay - 1;
    var startDay = new Date(new Date().setDate($scope.today.getDate() - daysToReduce));    
    $scope.daysInWeek = [];  
    for (var i = 0; i < 7; i++) {
      var day = new Date(new Date().setDate(startDay.getDate() + i)); 
      day.day = days[i];     
      $scope.daysInWeek.push(day);
    }
  };
  
  $scope.init();

});
