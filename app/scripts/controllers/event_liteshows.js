angular.module('liteWaveApp').controller('EventLiteShowsController', 
        ['$scope', '$routeParams', '$location', '$timeout', 'Global', 'EventLiteShows', 'LWEvents', 'LiteShows', 'EventJoins',
  function ($scope, $routeParams, $location, $timeout, Global, EventLiteShows, LWEvents, LiteShows, EventJoins) {
    $scope.global = Global;

    $scope.create = function() {
        var event_liteshow = new EventLiteShows({
            name: this.name
        });
        event_liteshow.$save(function(response) {
            $location.path("event_liteshows/" + response._id);
        });

        this.name = "";
    };
    
    $scope.remove = function(event_liteshow) {
        event_liteshow.$remove();  

        for (var i in $scope.event_liteshows) {
            if ($scope.event_liteshows[i] == event_liteshow) {
                $scope.event_liteshows.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var event_liteshow = $scope.event_liteshow;
        if (!event_liteshow.updated) {
            event_liteshow.updated = [];
        }

        event_liteshow.$update(function() {
            $location.path('/lw_events/' + event_liteshow._lw_eventId + '/event_liteshows/' + event_liteshow._id);
        });
    };
    
    
    $scope.find = function(query) {
      if (!query) {
        query = {lw_eventId: $routeParams.lw_eventId};
      }
        EventLiteShows.query(query, function(event_liteshows) {
            $scope.event_liteshows = event_liteshows;
        });
    };
    
    $scope.findOne = function() {
        EventLiteShows.get({
            lw_eventId: $routeParams.lw_eventId,
            event_liteshowId: $routeParams.event_liteshowId
        }, function(event_liteshow) {
            if (!event_liteshow.start_at) {
              event_liteshow.start_at = new Date(Date.now()); //.format('yyyy-MM-dd HH:mm:ss Z');
            }
            $scope.event_liteshow = event_liteshow;
            LWEvents.get({
              lw_eventId: event_liteshow._lw_eventId
            }, function(lw_event) {
                  $scope.event_liteshow.lw_event = lw_event;
            });
            LiteShows.get({
              liteshowId: event_liteshow._liteshowId
            }, function(liteshow) {
                  $scope.event_liteshow.liteshow = liteshow;
            });
            EventJoins.query({
              event_liteshowId: event_liteshow._id
            }, function(event_joins) {
              $scope.event_joins = event_joins;
            });
        });
       // $scope.offset_seconds = 20;
       $scope.promise_clock = $timeout($scope.updateClock, 100);
        
    };
    


    $scope.updateClock = function() {
      $scope.current_time = new Date(Date.now());
      EventJoins.query({
        event_liteshowId: $routeParams.event_liteshowId
      }, function(event_joins) {
        $scope.event_joins = event_joins;
      });
      $scope.promise_clock = $timeout($scope.updateClock,100);
    };
    
    $scope.setStartTime = function() {
      $scope.event_liteshow.start_at = new Date((Math.ceil(Date.now()/1000)*1000) + ($scope.offset_seconds * 1000));
    };
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });

}]);