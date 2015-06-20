'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$timeout','$interval','FeedService','Clients','LWEvents', 'EventLiteShows', 'UserLocations',
function ($rootScope, $scope, $http, $timeout, $interval, FeedService, Clients, LWEvents, EventLiteShows, UserLocations) {

    $rootScope.currentArea = "main";
    // DEMO ONLY, hardcode winner.
    $scope.demowinner = 0;
    $scope.showLength = 15;
    $scope.showStartTime = null;
    $scope.stopTime = null;
    $scope.winnerSeat = "";
    $scope.winner = null;
    $scope.activeUsers = 0;
    $scope.iPhoneUsers = 20;
    $scope.androidUsers = 0;
    $scope.stadiumCoverage = 0;
    $scope.stadiumSize = 20;
    $scope.userCheckPromise = null;
    $scope.userPollTime = 3000;
    
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
        $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
    }
    
    // update list of lw_events when the client changes
    $scope.$watch('currentClient', function(newVal, oldVal) {
        if (newVal) {
        LWEvents.query({clientId: newVal._id}, function(lw_events) {
          $scope.lw_events = lw_events;
          $scope.liteshows = null;
          $scope.currentLWEvent = lw_events[0];
        });
      }
    });
    
    // update list of lite_shows when the lw_event changes
    $scope.$watch('currentLWEvent', function(newVal, oldVal) {
        if (newVal) {
            $scope.cleanUpAfterShow();
        EventLiteShows.query({lw_eventId: newVal._id}, function(liteshows) {
          $scope.liteshows = liteshows;
          $scope.currentEventLiteShow = liteshows[0];

          // Reset winners

          // Start checking for new users
          if ($scope.userCheckPromise == null) {
              $scope.userCheckPromise = $interval($scope.checkUsers, $scope.userPollTime);
          }
        });
      }
    });

    $scope.resetWinners = function () {
        $scope.winnerSeat = "";
        $scope.winner = null;
    }

    $scope.startShow = function (seconds) {

        if ($scope.userLocations.length < 1) {
            alert("Sorry, not enough users have joined this event. Cancelling show.");
            return;
        }

        // stop checking for any new users:
        if ($scope.userCheckPromise != null) {
            $interval.cancel($scope.userCheckPromise);
            $scope.userCheckPromise = null;
        }

        $timeout.cancel($scope.promise_clock);

        var now = Date.now();
        var startTime = now + (1000 * seconds);
        var stopTime = startTime + (1000 * $scope.showLength);

        // Set showStartTime for UI. Different format than just getting Date.now()
        $scope.currentEventLiteShow.start_at = $scope.showStartTime = new Date(startTime).toISOString();
        $scope.stopTime = new Date(stopTime).toISOString();

        // only picking between 1 and 10. Need better algo. pick random winner from list of current users
        // For easier debugging, making first user the winner.
        $scope.winner = $scope.userLocations[$scope.demowinner];
        /*var ranNum = Math.floor((Math.random() * 10) + 1);
        if (ranNum <= $scope.userLocations.length) {
            $scope.winner = $scope.userLocations[ranNum];
        }
        else {
            ranNum = Math.floor((Math.random() * 10) + 1);
            if (ranNum <= $scope.userLocations.length) {
                $scope.winner = $scope.userLocations[$scope.demowinner];
            }
        }*/
        
        $scope.currentEventLiteShow._winnerId = $scope.winner._id;
        $scope.currentEventLiteShow.$update();

        // Not included yet. How to call\include separate Controller? or do we need to?
        // EventLiteShows.$setStartTime();

        $scope.percentTimeToStart = 0;
        $scope.updateTime = seconds * 10;
        $scope.updateClock();
    };

    $scope.updateClock = function() {
        $scope.current_time = new Date(Date.now()).toISOString();

        console.log('UpdateCLock: current time = ' + $scope.current_time.toString() + '. showStartTime' + $scope.showStartTime.toString());

        if ($scope.current_time < $scope.showStartTime) {
            //$scope.promise_clock = $timeout($scope.updateClock,$scope.updateTime);
            $scope.promise_clock = $timeout($scope.updateClock, 100);
        } else {
            $timeout($scope.updateShowClock, 100);
        }
    };

    $scope.updateShowClock = function () {
        $scope.current_time = new Date(Date.now()).toISOString();

        // TODO figure out what to add by deviding length of show by 100?
        $scope.percentTimeToStart += 1;

        console.log('UpdateShowCLock: current time = ' + $scope.current_time.toString() + ' . start_at time = ' + $scope.stopTime.toString());

        if ($scope.current_time < $scope.stopTime) {
            $scope.promise_clock = $timeout($scope.updateShowClock, 1000);
        } else {
            $timeout($scope.showIsOver, 100);
        }
    };
    
    /*$scope.showStarted = function () {
        if ($scope.current_time > $scope.currentEventLiteShow.start_at) {
        return true;
      } else {
        return false;
      }
    }*/
    
    $scope.showIsOver = function () {
        if ($scope.winner == null) {
            alert("Sorry!  Couldn't pick a winning seat. Please pick a random seat.");
            return;
        }

        // stupid. Need to add string.format
        $scope.winnerSeat = "Section " + $scope.winner.user_seat.section + ", Row " + $scope.winner.user_seat.row + ", Seat " + $scope.winner.user_seat.seat_number;
    };

    $scope.cleanUpAfterShow = function () {
        $scope.percentTimeToStart = 0;
        $scope.winnerSeat = "";
        $scope.winner = null;
    }
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });
    
    
  }]);

