'use strict';

angular.module('liteWaveApp')
.controller('StadiumsController', ['$rootScope', '$scope', '$routeParams', '$location', 'Clients', 'Stadiums', 'Levels',
  function ($rootScope, $scope, $routeParams, $location, Clients, Stadiums, Levels)
  {
    $rootScope.currentArea = "stadiums";

    Clients.query({}, function (clients)
    {
      $rootScope.clients = clients;
      $rootScope.currentClient = clients[0];
      $rootScope.setClient($rootScope.currentClient);
    });

    $scope.getSeats = function ()
    {
      var seatArray = [];
      seatArray.push("A");
      seatArray.push("B");
      seatArray.push("C");
      seatArray.push("D");
      seatArray.push("E");
      seatArray.push("F");
      seatArray.push("G");
      seatArray.push("H");
      seatArray.push("I");
      seatArray.push("J");

      return seatArray;
    }

    $scope.getRows = function ()
    {
      var rowArray = [];
      rowArray.push({ "nm": "1", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "2", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "3", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "4", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "5", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "6", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "7", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "8", "sts": $scope.getSeats() });
      rowArray.push({ "nm": "9", "sts": $scope.getSeats() });

      return rowArray;
    }

    $scope.getSections = function (level)
    {
      var sectionArray = [];

      if (level === "floor")
      {
        sectionArray.push({ "nm": "1", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "2", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "3", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "4", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "5", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "6", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "7", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "8", "rws": $scope.getRows() });
      }
      else if (level === "one")
      {
        sectionArray.push({ "nm": "101", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "102", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "103", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "104", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "105", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "106", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "107", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "108", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "109", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "111", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "112", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "113", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "114", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "116", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "117", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "118", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "119", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "120", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "122", "rws": $scope.getRows() });
        sectionArray.push({ "nm": "123", "rws": $scope.getRows() });
      }
      else if (level === "two")
      {
        sectionArray.push({ "nm": "201" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "202" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "203" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "204" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "205" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "206" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "207" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "208" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "209" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "211" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "212" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "213" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "214" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "216" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "217" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "218" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "219" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "220" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "221" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "222" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "223" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "224" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "225" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "226" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "227" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "228" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "229" , "rws": $scope.getRows()});
        sectionArray.push({ "nm": "230" , "rws": $scope.getRows()});
      }

      sectionArray.push({ "nm": "301" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "302" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "303" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "304" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "305" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "306" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "307" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "308" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "309" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "311" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "312" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "313" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "314" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "316" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "317" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "318" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "319" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "320" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "321" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "322" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "323" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "324" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "325" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "326" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "327" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "328" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "329" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "330" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "331" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "332" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "333" , "rws": $scope.getRows()});
      sectionArray.push({ "nm": "334" , "rws": $scope.getRows()});

      return sectionArray;
    }

    $scope.saveStadium = function ()
    {
      // Create Section for each floor, save them, get id, then save 

      /* var LevelSchema = new Schema({
        _stadiumId: { type: Schema.ObjectId, ref: 'Stadium' },  // The Stadium associated with this Section.
        nm: { type: String, trim: true },  // e.g. 100, 200, etc. 
        sections: [SectionSchema]
      });*/
      var levelInfo = [];

      var stadium = new Stadiums({
        name: $scope.name,
        _clientId: $rootScope.currentClient._id
      });

      stadium.$save(function (response0)
      {
        console.log(response0);

        if (response0._id)
        {
          var level1 = new Levels({
            _stadiumId: response0._id,
            nm: "floor",
            sctns: $scope.getSections("floor")
          });

          level1.$save(function (response1)
          {
            console.log(response1);

            if (response1._id)
            {
              levelInfo.push({ "nm": "floor", "_levelId": response1._id });

              var level2 = new Levels({
                _stadiumId: response0._id,
                nm: "one",
                sctns: $scope.getSections("one")
              });

              level2.$save(function (response2)
              {
                console.log(response2);

                if (response2._id)
                {
                  levelInfo.push({ "nm": "one", "_levelId": response2._id });

                  var level3 = new Levels({
                    _stadiumId: response0._id,
                    nm: "two",
                    sctns: $scope.getSections("two")
                  });

                  level3.$save(function (response3)
                  {
                    console.log(response3);

                    if (response3._id)
                    {
                      levelInfo.push({ "nm": "two", "_levelId": response3._id });

                      var level4 = new Levels({
                        _stadiumId: response0._id,
                        nm: "three",
                        sctns: $scope.getSections("three")
                      });

                      level4.$save(function (response4)
                      {
                        console.log(response4);

                        if (response4._id)
                        {
                          levelInfo.push({ "nm": "three", "_levelId": response4._id });

                          stadium.levels = levelInfo;
                          stadium.$update();
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    };

    /*$scope.remove = function (event) {
      event.$remove();

        for (var i in $scope.shows) {
          if ($scope.shows[i] == show) {
                $scope.shows.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var show = $scope.show;
        if (!show.updated) {
            show.updated = [];
        }

        show.$update(function() {
            $location.path('/events/' + show._eventId + '/shows/' + show._id);
        });
    };
   */

  }]);