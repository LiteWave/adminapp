var services = angular.module('liteWaveServices', []);

// to deal with Users

services.factory('Users', ['$resource', function($resource) {
  return $resource('/api/users/:userId', {
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
    return $resource('/api/clients/:clientId', {
        clientId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// service used for LWEvents REST endpoint
services.factory("LWEvents", ['$resource', function($resource) {
    return $resource('/api/clients/:clientId/lw_events/:lw_eventId', {
      clientId: '@_clientId', lw_eventId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        get: {
          method: 'GET',
          url: '/api/lw_events/:lw_eventId'
        }
    });
}]);

// service used for event_liteshows REST endpoint
services.factory("EventLiteShows", ['$resource', function($resource) {
    return $resource('/api/lw_events/:lw_eventId/event_liteshows/:event_liteshowId', {
        lw_eventId: '@_lw_eventId', event_liteshowId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

services.factory('FeedService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    }
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