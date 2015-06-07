'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$timeout','$interval','FeedService','Clients','LWEvents', 'EventLiteShows', 'UserLocations',
function ($rootScope, $scope, $http, $timeout, $interval, FeedService, Clients, LWEvents, EventLiteShows, UserLocations) {

    $rootScope.currentArea = "main";
    $scope.winnerSeat = "";
    $scope.winner = null;
    $scope.activeUsers = 0;
    $scope.iPhoneUsers = 20;
    $scope.androidUsers = 0;
    $scope.stadiumCoverage = 0;
    $scope.stadiumSize = 20;
    $scope.userCheckPromise = null;
    
    Clients.query({}, function(clients) {
        $rootScope.clients = clients;
        $rootScope.currentClient = clients[0];
    });
    
    $scope.feedSrc = 'http://www.nba.com/blazers/news/rss.html';
    FeedService.parseFeed($scope.feedSrc).then(function(res){
       // $scope.feedText=angular.element(e.target).text();
    //    $scope.feeds=res.data.responseData.feed.entries;
    });
    
    $scope.loadFeed=function() {        
        FeedService.parseFeed($scope.feedSrc).then(function(res){
           // $scope.feedText=angular.element(e.target).text();
            $scope.feeds=res.data.responseData.feed.entries;
        });
    };
    
    $scope.changeEvent = function(event) {
      $scope.currentLWEvent = event;
    };

    // check for new users every second.
    $scope.checkUsers = function () {
        UserLocations.query({ lw_eventId: $scope.currentEventLiteShow._lw_eventId }, function (userLocations) {
            $scope.userLocations = userLocations;
            $scope.activeUsers = userLocations.length;
            //if ($scope.activeUsers > 0) {
                $scope.stadiumCoverage = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
                $scope.iPhoneUsers = Math.round($scope.activeUsers / $scope.stadiumSize * 100);
            //}
        });
    }

    if ($scope.userCheckPromise == null) {
        $scope.userCheckPromise = $interval($scope.checkUsers, 2000);
    }
    
    // update list of lw_events when the client changes
    $scope.$watch('currentClient', function(newVal, oldVal) {
      if(newVal) {
        LWEvents.query({clientId: newVal._id}, function(lw_events) {
          $scope.lw_events = lw_events;
          $scope.liteshows = null;
          $scope.currentLWEvent = lw_events[0];
        });
      }
    });
    
    // update list of lite_shows when the lw_event changes
    $scope.$watch('currentLWEvent', function(newVal, oldVal) {
      if(newVal) {
        EventLiteShows.query({lw_eventId: newVal._id}, function(liteshows) {
          $scope.liteshows = liteshows;
          $scope.currentEventLiteShow = liteshows[0];

          // Reset winners

          // Start checking for new users
          if ($scope.userCheckPromise == null) {
              $scope.userCheckPromise = $interval($scope.checkUsers, 1000);
          }
        });
      }
    });

    $scope.resetWinners = function () {
        $scope.winnerSeat = "";
        $scope.winner = null;
    }

    $scope.startShow = function (seconds) {

        if ($scope.userLocations.length < 4) {
            alert("Sorry, not enough users have joined this event. Cancelling show.");
            return;
        }

        // stop checking for any new users:
        if ($scope.userCheckPromise != null) {
            $interval.cancel($scope.userCheckPromise);
        }

        $timeout.cancel($scope.promise_clock);
      
        $scope.currentEventLiteShow.start_at = new Date((Math.ceil(Date.now() / 1000) * 1000) + (seconds * 1000));
        $scope.winner = $scope.userLocations[3];
        $scope.currentEventLiteShow._winnerId = $scope.winner._id;
        
        //    EventJoins.query({
        //     event_liteshowId: $routeParams.event_liteshowId
        //   }, function(event_joins) {
        //     $scope.event_joins = event_joins;
        //   });

        $scope.currentEventLiteShow.$update();

        // Not included yet. How to call\include separate Controller?
        // EventLiteShows.$setStartTime();

        $scope.percentTimeToStart = 0;
        $scope.updateTime = seconds * 10;
        $scope.updateClock();
    };

    $scope.updateClock = function() {
        $scope.current_time = new Date(Date.now());
        $scope.percentTimeToStart += 1;

        if ($scope.current_time < $scope.currentEventLiteShow.start_at) {
            $scope.promise_clock = $timeout($scope.updateClock,$scope.updateTime);
        } else {
            $timeout($scope.showIsOver, 10000);
        }
    };
    
    $scope.showStarted = function() {
        if ($scope.current_time > $scope.currentEventLiteShow.start_at) {
        return true;
      } else {
        return false;
      }
    }
    
    $scope.showIsOver = function () {
        if ($scope.winner == null) {
            alert("Sorry!  Couldn't pick a winning seat. Please pick a random seat.");
            return;
        }

        // stupid. Need to add string.format
        $scope.winnerSeat = "Section " + $scope.winner.user_seat.section + ", Row " + $scope.winner.user_seat.row + ", Seat " + $scope.winner.user_seat.seat_number;
    };
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });
    
    
  }]);

