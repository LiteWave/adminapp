'use strict';

var app = angular.module('liteWaveApp', [
  'liteWaveDirectives',
  'liteWaveServices',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid',
  'ui.bootstrap',
  'google-maps'

])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', 
    function ($routeProvider, $locationProvider, $httpProvider) {
    
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = ['$q', '$timeout', '$http', '$location', '$rootScope', function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user){

        // Authenticated
        if (user !== '0') {
          $rootScope.loggedInUser = user;
          $rootScope.isTeamUser = (user.user_type == 'Team');
          $rootScope.isAdminUser = (user.user_type == 'Admin');
          $timeout(deferred.resolve, 0);
        }
        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          $rootScope.loggedInUser = null;
          $timeout(function(){deferred.reject();}, 0);
          $location.url('/login');
        }
      });

      return deferred.promise;
    }];
    
    var sendlogOut = ['$q', '$timeout', '$http', '$location', '$rootScope', function($q, $timeout, $http, $location, $rootScope) {
      var deferred = $q.defer();
      $http.post('/api/logout').success(function() {
        $rootScope.message = 'Successfully logged out';
        $timeout(deferred.resolve, 0);
      });
      return deferred.promise;
    }];
    
 
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'response' : function(response) {
          return response;
        },
        
        'responseError' : function( rejection) {
          if(rejection.status === 401) {
            $location.url('/login');
          }
          return $q.reject(rejection);
        }
      };
    }]);
    
    
    //================================================

    $routeProvider
      .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          loggedOut: sendlogOut
        }
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/users/:userId/edit', {
        controller: 'UserEditCtrl',
        resolve: {
          loggedin: checkLoggedin,
          user: ["UserLoader", function(UserLoader) {
            return UserLoader();
          }]
        },
        templateUrl:'/views/users/userForm.html'
      })
      .when('/users', {
        controller: 'UserListCtrl',
        resolve: {
          loggedin: checkLoggedin,
          users: ["MultiUserLoader", function(MultiUserLoader) {
           return MultiUserLoader();
          }]
        },
        templateUrl:'/views/users/list.html'
      })
      .when('/users/create', {
        controller: 'UserNewCtrl',
        templateUrl: '/views/users/userForm.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
  
app.run(['$rootScope', function ($rootScope) {
  $rootScope.message = '';
  
  $rootScope.setClient = function(client) {
    $rootScope.currentClient = client;
  };
  // Logout function is available in any pages
  $rootScope.logout = function(){
    $rootScope.message = 'Logged out.';
    $http.post('/api/logout');
  };
  
  $rootScope.getDayOfMonth = function(d) {
    var date = new Date(d);
    return( date.getDate());
  };
  
  $rootScope.getMonthAbbrev = function(d) {
    var monthAbbrevs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = new Date(d);
    return( monthAbbrevs[date.getMonth()]);
  };
  
}]);
