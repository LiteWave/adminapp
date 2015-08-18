angular.module('liteWaveApp').controller('ShowsController',
        ['$scope', '$routeParams', '$location', '$timeout', 'Shows', 'Events', 'LiteShows', 'EventJoins',
  function ($scope, $routeParams, $location, $timeout, Shows, Events, LiteShows, EventJoins)
  {
    $rootScope.currentArea = "shows";

    $scope.create = function ()
    {
      var show = new Shows({
        name: this.name
      });
      show.$save(function (response)
      {
        $location.path("show/" + response._id);
      });

      this.name = "";
    };

    $scope.remove = function (show)
    {
      show.$remove();

      for (var i in $scope.shows)
      {
        if ($scope.shows[i] == show)
        {
          $scope.shows.splice(i, 1);
        }
      }
    };

    $scope.update = function ()
    {
      var show = $scope.show;
      if (!show.updated)
      {
        show.updated = [];
      }

      show.$update(function ()
      {
        $location.path('/events/' + show._eventId + '/shows/' + show._id);
      });
    };


    $scope.find = function (query)
    {
      if (!query)
      {
        query = { _eventId: $routeParams._eventId };
      }
      EventLiteShows.query(query, function (shows)
      {
        $scope.shows = shows;
      });
    };

    $scope.findOne = function ()
    {
      EventLiteShows.get({
        _eventId: $routeParams._eventId,
        showId: $routeParams.showId
      }, function (show)
      {
        if (!show.start_at)
        {
          show.start_at = new Date(Date.now()); //.format('yyyy-MM-dd HH:mm:ss Z');
        }
        $scope.show = show;
        Events.get({
          _eventId: show._eventId
        }, function (event)
        {
          $scope.show.event = event;
        });
        LiteShows.get({
          liteshowId: show._liteshowId
        }, function (liteshow)
        {
          $scope.show.liteshow = liteshow;
        });
        EventJoins.query({
          showId: show._id
        }, function (event_joins)
        {
          $scope.event_joins = event_joins;
        });
      });
      // $scope.offset_seconds = 20;
      $scope.promise_clock = $timeout($scope.updateClock, 100);

    };



    $scope.updateClock = function ()
    {
      $scope.current_time = new Date(Date.now());
      EventJoins.query({
        showId: $routeParams.showId
      }, function (event_joins)
      {
        $scope.event_joins = event_joins;
      });
      $scope.promise_clock = $timeout($scope.updateClock, 100);
    };

    $scope.setStartTime = function ()
    {
      $scope.show.start_at = new Date((Math.ceil(Date.now() / 1000) * 1000) + ($scope.offset_seconds * 1000));
    };

    $scope.$on('$locationChangeStart', function ()
    {
      $timeout.cancel($scope.promise_clock);
    });

  }]);