/**********************************************************************
 * Login controller
 **********************************************************************/
angular.module('liteWaveApp').controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 
  function($scope, $rootScope, $http, $location) {

  $rootScope.currentArea = "login";  // this will turn off the main menus
 
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    
    $http.post('/api/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
}]);
