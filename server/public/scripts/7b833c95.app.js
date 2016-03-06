"use strict";function getUserTypes(){return["Admin","Regular"]}var app=angular.module("liteWaveApp",["liteWaveDirectives","liteWaveServices","ngCookies","ngResource","ngSanitize","ngRoute","ngGrid","ui.bootstrap"]).config(["$routeProvider","$locationProvider","$httpProvider",function(a,b,c){var d=window.config.apiURL,e=["$q","$timeout","$http","$location","$rootScope",function(a,b,c,e,f){var g=a.defer();return c.defaults.withCredentials=!0,c.get(d+"/loggedin").success(function(a){"0"!==a?(f.loggedInUser=a,f.isTeamUser="Team"==a.userType,f.isAdminUser="Admin"==a.userType,b(g.resolve,0)):(f.message="You need to log in.",f.loggedInUser=null,b(function(){g.reject()},0),e.url("/login"))}),g.promise}],f=["$q","$timeout","$http","$location","$rootScope",function(a,b,c,e,f){var g=a.defer();return c.post(d+"/logout").success(function(){f.message="Successfully logged out",b(g.resolve,0)}),g.promise}];c.interceptors.push(["$q","$location",function(a,b){return{response:function(a){return a},responseError:function(c){return 401===c.status&&b.url("/login"),a.reject(c)}}}]),a.when("/logout",{templateUrl:"views/login.html",controller:"LoginCtrl",resolve:{loggedOut:f}}).when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{loggedin:e}}).when("/events",{templateUrl:"views/events/events.html",controller:"EventsController",resolve:{loggedin:e}}).when("/stadiums",{templateUrl:"views/stadiums/stadiums.html",controller:"StadiumsController",resolve:{loggedin:e}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/users/:userId/edit",{controller:"UserEditCtrl",resolve:{loggedin:e,user:["UserLoader",function(a){return a()}]},templateUrl:"/views/users/userForm.html"}).when("/users",{controller:"UserListCtrl",resolve:{loggedin:e,users:["MultiUserLoader",function(a){return a()}]},templateUrl:"/views/users/list.html"}).when("/users/create",{controller:"UserNewCtrl",templateUrl:"/views/users/userForm.html"}).otherwise({redirectTo:"/"})}]);app.run(["$rootScope",function(a){a.message="",a.setClient=function(b){a.currentClient=b},a.logout=function(){a.message="Logged out.",$http.post(apiURL+"/logout")},a.getDayOfMonth=function(a){var b=new Date(a);return b.getDate()},a.getMonthAbbrev=function(a){var b=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],c=new Date(a);return b[c.getMonth()]}}]);var services=angular.module("liteWaveServices",[]),apiURL=window.config.apiURL;services.factory("Users",["$resource",function(a){return a(apiURL+"/users/:userId",{userId:"@_id"},{update:{method:"PUT"}})}]),services.factory("MultiUserLoader",["Users","$q",function(a,b){return function(){var c=b.defer();return a.query(function(a){c.resolve(a)},function(){c.reject("Unable to fetch users")}),c.promise}}]),services.factory("UserLoader",["Users","$route","$q",function(a,b,c){return function(){var d=c.defer();return a.get({userId:b.current.params.userId},function(a){d.resolve(a)},function(){d.reject("Unable to fetch user "+b.current.params.userId)}),d.promise}}]),services.factory("Clients",["$resource",function(a){return a(apiURL+"/clients/:clientId",{clientId:"@_id"},{update:{method:"PUT"}})}]),services.factory("UserLocations",["$resource",function(a){return a(apiURL+"/events/:eventId/user_locations",{eventId:"@_id"},{update:{method:"PUT"}})}]),services.factory("UserLocationsCount",["$resource",function(a){return a(apiURL+"/events/:eventId/user_locations/count",{eventId:"@_id"},{})}]),services.factory("UserLocationsWinner",["$resource",function(a){return a(apiURL+"/events/:eventId/user_locations/pickwinningsection/:showType",{eventId:"@_eventId",showType:"@_id"},{})}]),services.factory("Stadiums",["$resource",function(a){return a(apiURL+"/stadiums",{clientId:"@_clientId",stadiumId:"@_id"},{update:{method:"PUT",url:apiURL+"/stadiums/:stadiumId"},get:{method:"GET",url:apiURL+"/stadiums/client/:clientId"}})}]),services.factory("Levels",["$resource",function(a){return a(apiURL+"/levels/:levelId",{levelId:"@_id"},{update:{method:"PUT",url:apiURL+"/levels"}})}]),services.factory("Events",["$resource",function(a){return a(apiURL+"/clients/:clientId/events/:eventId",{clientId:"@_clientId",eventId:"@_id"},{update:{method:"PUT"},get:{method:"GET",url:apiURL+"/events/:eventId"}})}]),services.factory("Shows",["$resource",function(a){return a(apiURL+"/events/:eventId/shows/:showId",{eventId:"@_eventId",showId:"@_id"},{update:{method:"PUT"}})}]),services.factory("LogicalLayout",["$resource",function(a){return a(apiURL+"/events/:eventId/logicallayouts/:logicallayoutId",{eventId:"@_eventId",logicallayoutId:"@_id"},{update:{method:"PUT"},query:{method:"GET",isArray:!1}})}]),services.factory("ShowCommands",["$resource",function(a){return a(apiURL+"/shows/:showId/showcommands/:showCommandId",{showId:"@_showId",showCommandId:"@_id"},{update:{method:"PUT"},query:{method:"GET",isArray:!1}})}]),services.service("modalService",["$modal",function(a){var b={backdrop:!0,keyboard:!0,modalFade:!0,templateUrl:"/views/default_modal.html"},c={closeButtonText:"Close",actionButtonText:"OK",headerText:"Proceed?",bodyText:"Perform this action?"};this.showModal=function(a,b){return a||(a={}),a.backdrop="static",this.show(a,b)},this.show=function(d,e){var f={},g={};return angular.extend(f,b,d),angular.extend(g,c,e),f.controller||(f.controller=["$scope","$modalInstance",function(a,b){a.modalOptions=g,a.modalOptions.ok=function(a){b.close(a)},a.modalOptions.close=function(a){b.dismiss("cancel")}}]),a.open(f).result}}]);var mydirectives=angular.module("liteWaveDirectives",[]);mydirectives.directive("butterbar",["$rootScope",function(a){return{link:function(b,c,d){c.addClass("hide"),a.$on("$rootChangeStart",function(){c.removeClass("hide")}),a.$on("$rootChangeSuccess",function(){c.addClass("hide")})}}}]),mydirectives.directive("focus",function(){return{link:function(a,b,c){b[0].focus()}}}),angular.module("liteWaveApp").controller("MainCtrl",["$rootScope","$scope","$timeout","$interval","Clients","Events","Shows","UserLocationsCount","UserLocationsWinner","ShowCommands","LogicalLayout",function(a,b,c,d,e,f,g,h,i,j,k){a.currentArea="main",b.showStartTime=null,b.stopTime=null,b.winnerSeat="",b.winnerSection=[],b.winner=null,b.activeUsers=0,b.iPhoneUsers=0,b.androidUsers=0,b.stadiumCoverage=0,b.stadiumSize=19145,b.userCheckPromise=null,b.userPollTime=7e3,b.currentShowType=0,b.currentLayout,b.lengthOfShow=15,e.query({},function(b){a.clients=b,a.currentClient=b[0],a.setClient(a.currentClient)}),b.setShowType=function(a){b.currentShowType=a},b.getRandomNumber=function(a){return Math.floor(Math.random()*a)},b.loadLayouts=function(){return b.currentEvent&&b.currentEvent._logicalLayoutId?(b.resetWinners(),void k.query({eventId:b.currentEvent._id,logicallayoutId:b.currentEvent._logicalLayoutId},function(a){b.currentLayout=a,b.findWinningSection()})):void alert("Please select an Event")},b.findWinningSection=function(){b.currentEvent&&i.query({eventId:b.currentEvent._id,showType:b.currentShowType},function(a){a&&a.length&&b.winnerSection.push(a[0].winningsections),b.createShow()})},b.createShow=function(){if(!b.currentEvent)return void alert("Please select an Event");if(!b.currentLayout.columns||!b.currentLayout.columns.length){if(console.log("CurrentLayout.columns is null. $scope.currentLayout:"+b.currentLayout),!b.currentLayout.logicalLayout.columns)return void alert("Current Event has no logical columns. Please create an Event with logical columns.");console.log("Should be updating CurrentLayout.columns."),b.currentLayout.columns=b.currentLayout.logicalLayout.columns,b.currentLayout.logicalLayout.columns=null,b.currentLayout.$update()}if(b.activeUsers<1)return void alert("Sorry, not enough users have joined this event. Cancelling show.");var a,c,d="0,0,0",e="216,19,37",f="162,157,176",h=1,i=b.currentLayout.columns.length,k=[],l=[],m=!1,n=Math.ceil(1e3*(b.lengthOfShow-6)/i);350>n&&(n=350);for(var o=250,p=i*n,q=i*o;i>=h;)a=b.currentLayout.columns[h-1].sectionList,b.currentShowType>=1&&(m=a.indexOf(b.winnerSection.toString())>-1),(0===b.currentShowType||1===b.currentShowType)&&(h>1&&k.push({ct:"w",cl:n*(h-1)}),k.push({bg:e,cl:n,sv:!0}),k.push({ct:"w",cl:p-n*h}),h>1&&k.push({ct:"w",cl:o*(h-1)}),k.push({bg:e,cl:o,sv:!0}),k.push({ct:"w",cl:q-o*h})),b.currentShowType>=1&&(c=b.getRandomNumber(100),k.push({ct:"w",cl:c}),k.push({bg:d,cl:n}),k.push({bg:f,cl:n}),k.push({bg:e,cl:n}),k.push({bg:d,cl:n}),k.push({bg:f,cl:n}),k.push({bg:e,cl:n,sv:!0}),k.push({bg:d,cl:o}),k.push({bg:f,cl:o}),m&&k.push({bg:e,cl:o}),k.push({bg:d,cl:o}),m&&k.push({bg:f,cl:o}),k.push({bg:e,cl:o,sv:!0}),k.push({bg:d,cl:o}),k.push({bg:f,cl:o}),m&&k.push({bg:e,cl:o}),k.push({bg:d,cl:o}),m&&k.push({bg:f,cl:o}),k.push({bg:e,cl:o}),m&&(k.push({pif:"w",bg:d,cl:o}),k.push({bg:f,cl:o}),k.push({pif:"w",bg:e,cl:o}),k.push({bg:d,cl:o}),k.push({bg:f,cl:o}),k.push({pif:"w",bg:e,cl:o,sv:!0}),k.push({pif:"w",ct:"win",bg:e,cl:o}),k.push({pif:"w",bg:d,cl:o,sv:!0}),k.push({pif:"w",bg:f,cl:o}),k.push({pif:"w",bg:e,cl:o,sv:!0}),k.push({pif:"w",bg:d,cl:o}),k.push({pif:"w",bg:f,cl:o}))),l.push({id:h-1,commandList:k.slice(0)}),k=[],h++;b.cmds=l;var r=new g({_eventId:b.currentEvent._id,_winnerId:null,type:b.currentShowType,startShowOffset:0,startAt:null,winnerSections:b.winnerSection,winnerImageUrl:b.currentShow.winnerImageUrl?b.currentShow.winnerImageUrl.trim():null,winnerUrl:b.currentShow.winnerUrl?b.currentShow.winnerUrl.trim():null});b.currentShow=r,r.$save(function(a){if(console.log(a),a._id){var c=new j({_showId:a._id,commands:l,type:b.currentShowType});c.$save(function(a){console.log(a),a._id&&(r._showCommandId=a._id,r.$update())})}}),b.winnerSeat=b.formatWinnerString()},b.executeCmdA=function(a,d){if(d.length){var e="0,0,0",f="216,19,37",g="#lcol"+a.toString(),h=d[0];h.bg?h.bg==e?$(g).css("background","black"):h.bg==f?$(g).css("background","red"):$(g).css("background","white"):h.ct?$(g).css("background","transparent"):$(g).css("background","transparent"),c(function(){b.executeCmdB(a,d.slice(1))},h.cl)}},b.executeCmdB=function(a,d){if(d.length){var e="0,0,0",f="216,19,37",g="#lcol"+a.toString(),h=d[0];h.bg?h.bg==e?$(g).css("background","black"):h.bg==f?$(g).css("background","red"):$(g).css("background","white"):h.ct?$(g).css("background","transparent"):$(g).css("background","transparent"),c(function(){b.executeCmdB(a,d.slice(1))},h.cl)}},b.testCommands=function(){return null==b.currentShow?void alert("No Shows detected. Please create a show."):void j.query({showId:b.currentShow._id,showCommandId:b.currentShow._showCommandId},function(a){if(null==a||null==a.commands)return void alert("No Show Commands detected. Please create a show.");for(var c,d=a.commands,e=d.length,f=0;e>f;)c="#lcol"+f.toString(),$(c).css("background","transparent"),b.executeCmdA(f,d[f].commandList),f++})},b.changeEvent=function(a){b.currentEvent=a},b.deleteEvent=function(){b.currentEvent&&(b.currentEvent.$delete(),alert("Event successfully deleted."))},b.checkUsers=function(){b.currentEvent&&h.query({eventId:b.currentEvent._id},function(a){a&&a.length&&(b.activeUsers=a[0].usercount,b.stadiumCoverage=Math.round(b.activeUsers/b.stadiumSize*100),b.iPhoneUsers=Math.round(b.activeUsers/b.stadiumSize*100))})},null==b.userCheckPromise&&(b.userCheckPromise=d(b.checkUsers,b.userPollTime)),b.$watch("currentClient",function(a,c){a&&f.query({clientId:a._id},function(a){a&&a.length&&(b.events=a,b.liteshows=null,b.currentEvent=a[0])})}),b.$watch("currentEvent",function(a,c){a&&(b.cleanUpAfterShow(),g.query({eventId:a._id},function(a){a&&a.length&&(b.liteshows=a,b.currentShow=a[a.length-1],null==b.userCheckPromise&&(b.userCheckPromise=d(b.checkUsers,b.userPollTime)))}))}),b.resetWinners=function(){b.winnerSeat="",b.winner=null,b.winnerSection=[]},b.startShow=function(a){if(null==b.activeUsers||b.activeUsers<1)return void alert("Sorry, not enough users have joined this event. Cancelling show.");null!=b.userCheckPromise&&(d.cancel(b.userCheckPromise),b.userCheckPromise=null),c.cancel(b.promise_clock),c(b.showIsOver,100);var e=new Date,f=Math.floor(e.getTime()+1e3*a),g=Math.floor(f+1e3*b.lengthOfShow),h=new Date(f),i=new Date(g);b.currentShow.startShowOffset=a,b.showStartTimeDisplay=h.toLocaleTimeString(),b.stopTime=i.toUTCString(),b.showStopTimeDisplay=i.toLocaleTimeString(),console.log(b.currentShow.startAt),console.log(b.stopTime),b.currentShow.$update(),b.percentTimeToStart=0,b.updateTime=10*a,b.updateClock()},b.updateClock=function(){var a=new Date(Date.now());b.current_time=a.toISOString(),b.currentTimeDisplay=a.toLocaleTimeString(),console.log("UpdateCLock: current time = "+b.current_time.toString()+". showStartTime"+b.showStartTimeDisplay.toString()),b.current_time<b.showStartTime?b.promise_clock=c(b.updateClock,b.updateTime):(c(b.updateShowClock,100),c(b.testCommands,100))},b.updateShowClock=function(){var a=new Date(Date.now());b.current_time=a.toUTCString(),b.currentTimeDisplay=a.toLocaleTimeString(),console.log("UpdateShowCLock: current time = "+b.current_time.toString()+" . startAt time = "+b.stopTime.toString()),b.current_time<b.stopTime&&(b.promise_clock=c(b.updateShowClock,1e3))},b.formatWinnerString=function(){return b.winnerSection[0]},b.showIsOver=function(){b.winnerSeat||(b.winnerSeat=b.formatWinnerString())},b.cleanUpAfterShow=function(){b.percentTimeToStart=0,b.resetWinners()},b.$on("$locationChangeStart",function(){c.cancel(b.promise_clock)})}]),angular.module("liteWaveApp").controller("ShowsController",["$scope","$routeParams","$location","$timeout","Shows","Events","LiteShows","EventJoins",function(a,b,c,d,e,f,g,h){$rootScope.currentArea="shows",a.create=function(){var a=new e({name:this.name});a.$save(function(a){c.path("show/"+a._id)}),this.name=""},a.remove=function(b){b.$remove();for(var c in a.shows)a.shows[c]==b&&a.shows.splice(c,1)},a.update=function(){var b=a.show;b.updated||(b.updated=[]),b.$update(function(){c.path("/events/"+b._eventId+"/shows/"+b._id)})},a.find=function(c){c||(c={_eventId:b._eventId}),EventLiteShows.query(c,function(b){a.shows=b})},a.findOne=function(){EventLiteShows.get({_eventId:b._eventId,showId:b.showId},function(b){b.startAt||(b.startAt=new Date(Date.now())),a.show=b,f.get({_eventId:b._eventId},function(b){a.show.event=b}),g.get({liteshowId:b._liteshowId},function(b){a.show.liteshow=b}),h.query({showId:b._id},function(b){a.event_joins=b})}),a.promise_clock=d(a.updateClock,100)},a.updateClock=function(){a.current_time=new Date(Date.now()),h.query({showId:b.showId},function(b){a.event_joins=b}),a.promise_clock=d(a.updateClock,100)},a.setStartTime=function(){a.show.startAt=new Date(1e3*Math.ceil(Date.now()/1e3)+1e3*a.offset_seconds)},a.$on("$locationChangeStart",function(){d.cancel(a.promise_clock)})}]),angular.module("liteWaveApp").controller("EventsController",["$rootScope","$scope","$routeParams","$location","Clients","Events","LogicalLayout","Stadiums",function(a,b,c,d,e,f,g,h){a.currentArea="events",e.query({},function(b){a.clients=b,a.currentClient=b[0],a.setClient(a.currentClient),h.query({clientId:a.currentClient._id},function(b){b&&b.length&&(a.currentStadium=b[0])})}),b.saveEvent=function(){console.log("current Client Id"+a.currentClient._id+": Current Stadium Id"+a.currentStadium._id);var c=0,d=[{id:c++,sectionList:["101","201","301"]}];d.push({id:c++,sectionList:["102","202","302"]}),d.push({id:c++,sectionList:["103","203","204","303","304"]}),d.push({id:c++,sectionList:["104","205","305"]}),d.push({id:c++,sectionList:["1","105","206","207","306","307","308"]}),d.push({id:c++,sectionList:["2","106","208","309"]}),d.push({id:c++,sectionList:["3","107","209","310"]}),d.push({id:c++,sectionList:["4","108","210","211","311","312","313"]}),d.push({id:c++,sectionList:["109","212","314"]}),d.push({id:c++,sectionList:["110","213","214","315","316"]}),d.push({id:c++,sectionList:["111","215","317"]}),d.push({id:c++,sectionList:["112","216","318"]}),d.push({id:c++,sectionList:["113","217","319"]}),d.push({id:c++,sectionList:["114","218","219","320","321"]}),d.push({id:c++,sectionList:["115","220","322"]}),d.push({id:c++,sectionList:["5","116","221","222","323","324","325"]}),d.push({id:c++,sectionList:["6","117","223","326"]}),d.push({id:c++,sectionList:["7","118","224","327"]}),d.push({id:c++,sectionList:["8","119","225","226","328","329","330"]}),d.push({id:c++,sectionList:["120","227","331"]}),d.push({id:c++,sectionList:["122","228","229","332","333"]}),d.push({id:c++,sectionList:["123","230","334"]});var e={backgroundColor:"255,255,255",borderColor:"0,0,0",highlightColor:"222,32,50",textColor:"0,0,0",textSelectedColor:"255,255,255",retryCount:"3",logoUrl:"https://s-media-cache-ak0.pinimg.com/originals/a7/e0/5d/a7e05d588e5bdf5f4f7a4d3ea03486a2.gif"},h=new f({name:b.name,date:b.date,_clientId:a.currentClient._id,_stadiumId:a.currentStadium._id,settings:e});console.log("event name"+h.name+": date:"+h.date+":clientid:"+h._clientId+": Stadium Id:"+h._stadiumId),h.$save(function(a){if(console.log(a),a._id){var c=new g({_eventId:a._id,name:b.name,columns:d});c.$save(function(a){console.log(a),a._id&&(h._logicalLayoutId=a._id,h.$update(),alert("Event successfully created. Click the Game Day tab to see new event."))})}})}}]),angular.module("liteWaveApp").controller("StadiumsController",["$rootScope","$scope","$routeParams","$location","Clients","Stadiums","Levels",function(a,b,c,d,e,f,g){a.currentArea="stadiums",b.stadiumInfo,b.sectionFloor=[],b.sectionOne=[],b.sectionTwo=[],b.sectionThree=[],e.query({},function(b){a.clients=b,a.currentClient=b[0],a.setClient(a.currentClient)}),b.processStadiumContents=function(a){a&&(b.stadiumInfo=JSON.parse(a),b.buildSections())},b.readStadiumInfo=function(a){if(window.File&&window.FileReader&&window.FileList&&window.Blob){var c=new window.FileReader;b.fileInput="",a.files&&a.files[0]&&(c.onload=function(a){b.processStadiumContents(a.target.result)},c.readAsText(a.files[0]))}},b.getSeats=function(a){for(var b=a.START,c=a.END,d=[],e=b;c>=e;e++)d.push(e.toString());return d},b.getRows=function(a){var c=[];return c.push({name:a.ROW,seats:b.getSeats(a)}),c},b.getDummySeats=function(){var a=[];return a.push("A"),a.push("B"),a.push("C"),a.push("D"),a.push("E"),a},b.getDummyRows=function(){for(var a=[],c=1;9>c;c++)a.push({name:c.toString(),seats:b.getDummySeats()});return a},b.buildSections=function(){b.sectionFloor=[],b.sectionOne=[],b.sectionTwo=[],b.sectionThree=[];for(var a,c,d,e,f=b.stadiumInfo.length,g=[],h=0;f>h;h++)if(a=b.stadiumInfo[h],d=a.SECTION,0===h&&(c=d),d!==c){switch(e=c.charAt(0)){case"1":b.sectionOne.push({name:c,rows:g});break;case"2":b.sectionTwo.push({name:c,rows:g});break;case"3":b.sectionThree.push({name:c,rows:g})}g=[],g.push({name:a.ROW,seats:b.getSeats(a)}),c=d}else g.push({name:a.ROW,seats:b.getSeats(a)})},b.saveStadium=function(){var c=[],d=new f({name:b.name,_clientId:a.currentClient._id});d.$save(function(a){if(console.log(a),a._id){var e=new g({_stadiumId:a._id,name:"one",sections:b.sectionOne});e.$save(function(e){if(console.log(e),e._id){c.push({name:"one",_levelId:e._id});var f=new g({_stadiumId:a._id,name:"two",sections:b.sectionTwo});f.$save(function(e){if(console.log(e),e._id){c.push({name:"two",_levelId:e._id});var f=new g({_stadiumId:a._id,name:"three",sections:b.sectionThree});f.$save(function(a){console.log(a),a._id&&(c.push({name:"three",_levelId:a._id}),d.levels=c,d.$update())})}})}})}})}}]),angular.module("liteWaveApp").controller("LoginCtrl",["$scope","$rootScope","$http","$location",function(a,b,c,d){var e=window.config.apiURL;b.currentArea="login",a.user={},a.login=function(){c.post(e+"/login",{username:a.user.username,password:a.user.password}).success(function(a){b.message="Authentication successful!",d.url("/")}).error(function(){b.message="Authentication failed.",d.url("/login")})}}]);var app=angular.module("liteWaveApp");app.controller("UserListCtrl",["$rootScope","$scope","$location","$routeParams","users",function(a,b,c,d,e){a.currentArea="admin";var f='<div style="text-align:center"><a ng-href="/#/users/{{row.entity._id}}/edit"><i class="icon-edit"></i></a></div>';b.users=e,b.gridOptions={data:"users",multiSelect:!1,columnDefs:[{field:"edit",displayName:"",width:25,cellTemplate:f},{field:"name",displayName:"Name"},{field:"username",displayName:"Email/Username"},{field:"userType",displayName:"Type"}]}}]),app.controller("UserEditCtrl",["$scope","$location","user",function(a,b,c){a.user=c,a.userTypes=getUserTypes(),a.save=function(){a.user.$update(function(a){b.path("/users/")})},a.remove=function(){delete a.user,b.path("/users/")}}]),app.controller("UserNewCtrl",["$scope","$location","Users",function(a,b,c){a.user=new c,a.userTypes=getUserTypes(),a.save=function(){a.user.$save(function(a){b.path("/users/")})}}]);