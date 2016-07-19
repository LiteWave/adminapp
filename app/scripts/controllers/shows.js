'use strict';
var app = angular.module('liteWaveApp');
angular.module('liteWaveApp').controller('ShowsController',
        ['$rootScope', '$scope', '$routeParams', 'Clients', 'Stadiums', 'LogicalLayout',
  function ($rootScope, $scope, $routeParams, Clients, Stadiums, LogicalLayout)
  {
    $rootScope.currentArea = "shows";
    $scope.stadiumMap = $("#MapContainer");
    $scope.currentSections;
    $scope.currentGroupNumber = 0;
    $scope.myData = [];
    $scope.gridGroupOptions = {
                              data: 'myData',
                              multiSelect: false,
                              columnDefs: [
                              { field: 'id', displayName: 'Group' },
                              { field: 'sectionList', displayName: 'Sections' }
                              ]
    };

    $scope.createGroup = function ()
    {
      $scope.currentSections = $scope.stadiumMap.tuMap("GetSelectedSections", {});
      $scope.myData.push({ "id": $scope.currentGroupNumber, "sectionList" : $scope.currentSections });
      $scope.currentGroupNumber++;

      // Unset the current sections
      var length = $scope.currentSections.length;
      for (var i = 0; i < length; i++)
      {
        $scope.stadiumMap.tuMap("ToggleSelection", $scope.currentSections[i]);
      }
    };

    $scope.changeLayout = function (stadiumLayout)
    {
      $scope.myData = stadiumLayout.columns;
    };

    Stadiums.query({ clientId: $rootScope.currentClient._id }, function (stadium)
    {
      if (stadium && stadium.length)
      {
        $rootScope.currentStadium = stadium[0];

        LogicalLayout.query({ stadiumId: $rootScope.currentStadium._id }, function (layouts)
        {
          $scope.stadiumLayouts = layouts;
        });
      }
    });

    if ($rootScope.currentClient.externalStadiumId)
    {
      /************************************************************
      Initialize Ticket Utils Interactive Map
      ************************************************************/
      $scope.stadiumMap.tuMap({
        //MapId: "24d98d09-37e1-437f-87c5-eae845692e6c"
        MapId: $rootScope.currentClient.externalStadiumId
            , MapType: "Interactive"
            , ControlsPosition: "Inside"
        /*Failover Map: Replace this with a URL of the static chart from alternate datasource(when available)*/
			      , FailoverMapUrl: "http://static.ticketutils.com/Charts/No-Seating-Chart.jpg"
			      , Tickets: Data.Tickets
			      , AutoSwitchToStatic: false
			      , PreferredFirst: false
			      , TicketsListContainer: "#InventoryContainer"
			      , GroupsContainer: "#GroupsContainer"
			      , OnError: function (e, Error)
			      {
			        if (Error.Code == 0)
			        {
			          var Message = "<div style=\"padding:10px;\">";
			          Message += "<span style=\"color:red;font-weight:bold;\">This Sample is Configured to run under host 'localhost'</span>";
			          Message += "<br />";
			          Message += "Please configure IIS/Apache or Compatible Web Server to point 'demo' folder in order to view the Sample. If you intend to Run it under different Domain, please contact TicketUtils Support for Activation";
			          Message += "</div>";
			          $("#MapContainer").html(Message);
			        }
			      },
        OnBeforeListRender: function ()
        {
          var Height = $("#TuMap").outerHeight();
          $("#InventoryContainer").height(Height);
        },
        OnInit: function (e, MapType)
        {
        },
        OnClick: function (e, Section)
        {
        },
        OnGroupClick: function (e, Group)
        {
        }
      });
    }

    $scope.saveLayout = function ()
    {
      var layout = new LogicalLayout({
                                      _stadiumId: $rootScope.currentStadium._id,
                                      name: $scope.name,
                                      columns: $scope.myData
                                    });

      // Save the layout.
      layout.$save(function (response)
      {
        if (response._id)
        {
          alert("Layout successfully created.");
        }            
      });
    };

    // update stadiums, layouts, etc. when the client changes
    /*$scope.$watch('currentClient', function (newVal, oldVal)
    {
      if (newVal)
      {

      }
    });*/

  }]);