'use strict';

angular.module('liteWaveApp')
.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$timeout','FeedService','Clients','LWEvents', 'EventLiteShows', 
  function ($rootScope, $scope, $http, $timeout, FeedService, Clients, LWEvents, EventLiteShows) {

    $rootScope.currentArea = "main";
    $scope.winnerSeat = "";
    $scope.activeUsers = 0;
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
        });
      }
    });
    
    $scope.startShow = function(seconds) {
      $scope.winnerSeat = ""
      $timeout.cancel($scope.promise_clock);
      $scope.activeUsers = 0;
      
      $scope.currentEventLiteShow.start_at = new Date((Math.ceil(Date.now()/1000)*1000) + (seconds * 1000));
      $scope.percentTimeToStart = 0;
      /*if ($scope.showStarted())
      {
          alert("started");
      }*/
      $scope.updateTime = seconds * 10;
      $scope.updateClock();
    };

    $scope.updateClock = function() {
        $scope.current_time = new Date(Date.now());
      $scope.percentTimeToStart += 1;
      $scope.activeUsers += Math.floor((Math.random() * 50) + 1);
  //    EventJoins.query({
   //     event_liteshowId: $routeParams.event_liteshowId
   //   }, function(event_joins) {
   //     $scope.event_joins = event_joins;
   //   });
      //if ($scope.current_time < $scope.currentEventLiteShow.start_at) {
      if ($scope.currentEventLiteShow.winnerSeat == undefined) {
        $scope.promise_clock = $timeout($scope.updateClock,$scope.updateTime);
      } else {
        $timeout($scope.showIsOver, 10000);
      }
    };
    
    $scope.showStarted = function() {
        if ($scope.current_time > $scope.currentEventLiteShow.start_at) {
            debugger;
        return true;
      } else {
        return false;
      }
    }
    
    $scope.showIsOver = function() {
        //$scope.winnerSeat = "Section 101, Row 10, Seat 14"; 
        $scope.winnerSeat = $scope.currentEventLiteShow.winnerSeat;
        
    };
    
    $scope.$on('$locationChangeStart', function() {
      $timeout.cancel($scope.promise_clock);
    });
    
    
  }]);

