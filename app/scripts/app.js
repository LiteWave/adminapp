'use strict';

var app = angular.module('liteWaveApp', [
  'liteWaveDirectives',
  'liteWaveServices',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid',
  'ui.bootstrap'
])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', 
    function ($routeProvider, $locationProvider, $httpProvider) {
    
    var apiURL = window.config.apiURL;
    
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = ['$q', '$timeout', '$http', '$location', '$rootScope', function ($q, $timeout, $http, $location, $rootScope)
    {
      /*if ($rootScope.loggedInUser)
      {
        return;
      }*/

      // Initialize a new promise
      var deferred = $q.defer();

      $http.defaults.withCredentials = true;
      // Make an AJAX call to check if the user is logged in
      $http.get(apiURL+'/loggedin').success(function(user){

        // Authenticated
        if (user !== '0') {
          $rootScope.loggedInUser = user;
          $rootScope.isTeamUser = (user.userType == 'Team');
          $rootScope.isAdminUser = (user.userType == 'Admin');

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
      $http.post(apiURL+'/logout').success(function() {
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
      .when('/events', {
        templateUrl: 'views/events/events.html',
        controller: 'EventsController',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/shows', {
        templateUrl: 'views/shows/shows.html',
        controller: 'ShowsController',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/clients', {
        controller: 'ClientListCtrl',
        templateUrl:'/views/clients/list.html',
        resolve: {
          loggedin: checkLoggedin,
          clients: ["MultiClientLoader", function(MultiClientLoader) {
           return MultiClientLoader();
          }]
        }        
      })
      .when('/clients/:clientId/edit', {
        controller: 'ClientEditCtrl',
        resolve: {
          loggedin: checkLoggedin,
          client: ["ClientLoader", function(ClientLoader) {
            return ClientLoader();
          }]
        },
        templateUrl:'/views/clients/clientForm.html'
      })
      .when('/clients/create', {
        controller: 'ClientNewCtrl',
        templateUrl: '/views/clients/clientForm.html'
      })
      .when('/stadiums', {
        controller: 'StadiumListCtrl',
        resolve: {
          loggedin: checkLoggedin,
          stadiums: ["MultiStadiumLoader", function(MultiStadiumLoader) {
           return MultiStadiumLoader();
          }]
        },
        templateUrl:'/views/stadiums/list.html'
      })
      .when('/stadiums/:stadiumId/edit', {
        controller: 'StadiumEditCtrl',
        resolve: {
          loggedin: checkLoggedin,
          stadium: ["StadiumLoader", function(StadiumLoader) {
            return StadiumLoader();
          }]
        },
        templateUrl:'/views/stadiums/stadiums.html'
      })
      .when('/stadiums/create', {
        controller: 'StadiumNewCtrl',
        templateUrl: '/views/stadiums/stadiums.html'
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
  
app.run(['$rootScope',  function ($rootScope) {
  $rootScope.message = '';
  $rootScope.currentClient = null;
  $rootScope.clients = null;
  $rootScope.isAdminUser = false;
  $rootScope.stadiumLayouts = [];
  
  $rootScope.setClient = function (client)
  {
    $rootScope.currentClient = client;
  };

  // Logout function is available in any pages
  $rootScope.logout = function(){
    $rootScope.message = 'Logged out.';
    $http.post(apiURL+'/logout');
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
