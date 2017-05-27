var services = angular.module('liteWaveServices', []);
var apiURL = window.config.apiURL;

// to deal with Users

services.factory('Users', ['$resource', function($resource) {
  return $resource(apiURL+'/users/:userId', {
    userId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);

services.factory('MultiUserLoader', ['Users', '$q',
    function(Users, $q) {
  return function() {
    var delay = $q.defer();
    Users.query(function(users) {
      delay.resolve(users);
    }, function() {
      delay.reject('Unable to fetch users');
    });
    return delay.promise;
  };
}]);

services.factory('UserLoader', ['Users', '$route', '$q',
    function(Users, $route, $q) {
  return function() {
    var delay = $q.defer();
    Users.get({userId: $route.current.params.userId}, function(user) {
      delay.resolve(user);
    }, function() {
      delay.reject('Unable to fetch user '  + $route.current.params.userId);
    });
    return delay.promise;
  };
}]);

//Clients service used for clients REST endpoint
services.factory("Clients", ['$resource', function($resource) {
    return $resource(apiURL+'/clients/:clientId', {
        clientId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

services.factory('MultiClientLoader', ['Clients', '$q',
    function(Clients, $q) {
  return function() {
    var delay = $q.defer();
    Clients.query(function(clients) {
      delay.resolve(clients);
    }, function() {
      delay.reject('Unable to fetch clients');
    });
    return delay.promise;
  };
}]);

services.factory('ClientLoader', ['Clients', '$route', '$q',
    function(Clients, $route, $q) {
  return function() {
    var delay = $q.defer();
    Clients.get({ clientId: $route.current.params.clientId }, function(client) {
      delay.resolve(client);
    }, function() {
      delay.reject('Unable to fetch client ' + $route.current.params.clientId);
    });
    return delay.promise;
  };
}]);

// UserLocations service used for client REST endpoint.
services.factory('UserLocations', ['$resource', function ($resource) {
    return $resource(apiURL+'/events/:eventId/user_locations', {
        eventId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// UserLocations service used for client REST endpoint.
services.factory('UserLocationsCount', ['$resource', function ($resource) {
    return $resource(apiURL+'/events/:eventId/user_locations/count', {
        eventId: '@_id'
    }, { });
}]);

// UserLocations service used for client REST endpoint.
services.factory('UserLocationsWinner', ['$resource', function ($resource) {
    return $resource(apiURL+'/events/:eventId/user_locations/pickwinningsection/:showType', {
        eventId: '@_eventId', showType: '@_id'
    }, { });
}]);

// service used for Stadiums REST endpoint
services.factory("Stadiums", ['$resource', function ($resource) {
  return $resource(apiURL+'/stadiums/:stadiumId', {
    stadiumId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);

services.factory('MultiStadiumLoader', ['Stadiums', '$q',
    function(Stadiums, $q) {
  return function() {
    var delay = $q.defer();
    Stadiums.query(function(stadiums) {
      delay.resolve(stadiums);
    }, function() {
      delay.reject('Unable to fetch stadiums');
    });
    return delay.promise;
  };
}]);

services.factory('StadiumLoader', ['Stadiums', '$route', '$q',
    function(Stadiums, $route, $q) {
  return function() {
    var delay = $q.defer();
    Stadiums.get({stadiumId: $route.current.params.stadiumId}, function(stadium) {
      delay.resolve(stadium);
    }, function() {
      delay.reject('Unable to fetch Stadium ' + $route.current.params.stadiumId);
    });
    return delay.promise;
  };
}]);

// service used for Levels REST endpoint
services.factory("Levels", ['$resource', function ($resource)
{
  return $resource(apiURL+'/levels/:levelId', {
    levelId: '@_id'
  }, {
    update: {
      method: 'PUT',
      url: apiURL+'/levels'
    }
  });
}]);

// service used for Events REST endpoint
services.factory("Events", ['$resource', function($resource) {
    return $resource(apiURL+'/clients/:clientId/events/:eventId', {
      clientId: '@_clientId', eventId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        get: {
          method: 'GET',
          url: apiURL+'/events/:eventId'
        }
    });
}]);

// service used for Shows REST endpoint
services.factory("Shows", ['$resource', function($resource) {
    return $resource(apiURL+'/events/:eventId/shows/:showId', {
        eventId: '@_eventId', showId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
    });
}]);

// service used for Shows REST endpoint
services.factory("Shows2", ['$resource', function($resource) {
    return $resource(apiURL+'/shows/:showId', {
        showId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
    });
}]);

// service used for Logical Layout REST endpoint
services.factory("LogicalLayout", ['$resource', function ($resource)
{
  return $resource(apiURL+'/logicallayouts/:logicallayoutId', {
    logicallayoutId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    query: {
      method: 'GET',
      isArray: true
    }
  });
}]);

// service used for Logical Layout REST endpoint
services.factory("LogicalLayout2", ['$resource', function ($resource)
{
  return $resource(apiURL+'/stadiums/:stadiumId/logicallayouts', {
    stadiumId: '@_stadiumId'
  }, {
    update: {
      method: 'PUT'
    },
    query: {
      method: 'GET',
      isArray: true
    }
  });
}]);

// ShowCommands service used for showcommands REST endpoint
services.factory("ShowCommands", ['$resource', function ($resource) {
  return $resource(apiURL+'/shows/:showId/showcommands/:showCommandId', {
    showId: '@_showId', showCommandId: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    query: {
      method: 'GET',
      isArray: false
    }
  });
}]);

services.service('modalService', ['$modal',
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/views/default_modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }];
            }

            return $modal.open(tempModalDefaults).result;
        }

    }]);
