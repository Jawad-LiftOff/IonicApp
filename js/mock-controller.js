var app = angular.module('clock', []);

app.controller("ClockController", function($scope, $timeout) {
  $scope.date = new Date();
  $scope.majors = new Array(12);
  $scope.minors = new Array(48);

  var tick = function() {
    $scope.date = new Date();
    $timeout(tick, 1000);
  };
  $timeout(tick, 1000);
});