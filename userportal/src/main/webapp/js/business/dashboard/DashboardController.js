/* Controllers */
//var appControllers = angular.module('userportal.controllers', []);
//appControllers.controller('DashboardCtrl', ['$scope', function($scope) {}]);
appControllers.controller('DashboardMenuCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	$scope.tenantsList = null;
	
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		$scope.tenantsList = response.tenants.tenant;		
	});
	
	$scope.currentPanel  = 'main';
	if($route.current.templateUrl.indexOf("streams")>-1)
		$scope.currentPanel  = 'streams';
	else if($route.current.templateUrl.indexOf("error-log")>-1)
		$scope.currentPanel  = 'error_log';
	else if($route.current.templateUrl.indexOf("stream")>-1)
		$scope.currentPanel  = 'stream';
} ]);

appControllers.controller('DashboardHomeCtrl', [ '$scope', "$route", 'fabricAPIservice', function($scope, $route, fabricAPIservice) {
	
	$scope.dashboard = $route.current.params.dashboard;
	$scope.tenantWithNoDashboardError = null;
	$scope.buildTimestamp = BuildInfo.timestamp;
	if(!$scope.dashboard)
		$scope.dashboard = "overview";
	
	fabricAPIservice.getTenants().success(function(response) {
		console.debug("response", response.tenants);
		$scope.tenantsList = response.tenants.tenant;		
	});
	
	freeboard.initialize(false);
	
	console.debug('url','../../ris/userportal/freeboard/"+$scope.dashboard+"-dashboard.json');
	$.ajax({
	    url: '../../ris/userportal/freeboard/'+$scope.dashboard+'-dashboard.json?'+BuildInfo.timestamp,
	    dataType: 'json',
	    success: function(json) {
		    console.log(json); 
		    freeboard.loadDashboard(json, new function(){
		    		console.debug("loadDashboard - finish", json);
			    	freeboard.showLoadingIndicator(false);
			    });
		    },
	    error: function(){
	    	$scope.tenantWithNoDashboardError = 'DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR';
	    }
	});

//	$.getJSON("js/dashboard/freeboard/"+$scope.dashboard+"-dashboard.json", function(json) {
//	    console.log(json); 
//	    freeboard.loadDashboard(json, new function(){
//	    	freeboard.showLoadingIndicator(false);
//	    });
//	});
	freeboard.showLoadingIndicator(false);
} ]);

appControllers.controller('DashboardCtrl', [ '$scope','info', 'fabricAPIservice','$translate', function($scope,info, fabricAPIservice, $translate) {
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = $translate.instant(Constants.STREAM_STATUS_INST);
	$scope.tenantCode = info.getActiveTenantCode();
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;

//	fabricAPIservice.getInfo().success(function(info){
//		if(info != null && info.user!=null && info.user.tenants !=null){
//			$scope.tenantCode = info.user.tenants[0];
//		}
	console.debug("$scope.tenantCode",$scope.tenantCode);
	fabricAPIservice.getVisibleStreams().then(function(response) {
		// Dig into the responde to get the relevant data
		$scope.showLoading = false;
		
		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);

		for (var i = 0; i < responseList.length; i++) {
			if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
				responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
			responseList[i].deploymentStatusCodeTranslated =  $translate.instant(responseList[i].deploymentStatusCode);
			console.debug("responseList[i].visibility : ",responseList[i].visibility,responseList[i].codiceTenant);
			$scope.streamsList.push(responseList[i]);					
		}
		
//		$scope.streamsList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < $scope.streamsList.length; i++) {
			$scope.streamsList[i].statusIcon = Helpers.stream.statusIcon($scope.streamsList[i]);
			if(!$scope.streamsList[i].streamIcon || $scope.streamsList[i].streamIcon == null)
				$scope.streamsList[i].streamIcon  = "img/stream-icon-default.png";
		}

		$scope.totalItems = $scope.streamsList.length;
	//	$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});
	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchTenantsFilter = function(stream) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(stream.codiceTenant);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream)|| keyword.test(stream.nomeStream);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		console.log("searchStatusFilter",keyword,stream);
		return !$scope.statusFilter || keyword.test(stream.deploymentStatusDesc) || keyword.test(stream.deploymentStatusCodeTranslated);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});


} ]);

appControllers.controller('DashboardStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
                                                   function($scope, $routeParams, fabricAPIservice, webSocketService, $filter) {
	$scope.stream = null;
	$scope.wsUrl = "";
	fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).then(function(response) {
		console.debug("getStream response",response);
		$scope.stream = response.streams.stream;
		if($scope.stream.componenti == null)
			$scope.stream.componenti = new Object();
		$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);

		$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);

		if(!isNaN($scope.stream.fps)){
			var fpsNumber = parseFloat($scope.stream.fps);
			$scope.stream.fpm = 60*fpsNumber;
			if(fpsNumber!=0){
				$scope.stream.secondsBtwEvents = 1/fpsNumber;
				$scope.stream.minutesBtwEvents = 1/(fpsNumber*60);
			} else {
				$scope.stream.secondsBtwEvents = "-";
				$scope.stream.minutesBtwEvents = "-";
			}
		} else {
			$scope.stream.fpm = "-";
			$scope.stream.secondsBtwEvents = "-";
			$scope.stream.minutesBtwEvents = "-";
		}
		if(!$scope.stream.streamIcon || $scope.stream.streamIcon == null)
			$scope.stream.streamIcon  = "img/stream-icon-default.png";

		connectWS();
//		connectWSStatistic();
//		connectWSClientData();
//		connectWSClientError();
	});

	var totalError = 0;

	var maxNumWsStatisticMessages = 3;
	var maxNumWsErrorMessages = 2;
	$scope.wsStatisticMessages = [ [ "-", "-" ], [ "-", "-" ], [ "-", "-" ]];
	$scope.wsErrorMessages = [ [ "-", "-" ], [ "-", "-" ]];
	var maxNumStatisticData = 30;
	var counter = 0;
	//	$scope.wsStatisticData = [ { x : counter, y : 0 } ];
	//	for (counter = 1; counter < maxNumStatisticData; counter++)
	//		$scope.wsStatisticData.push({ x : counter, y : 0 });

	$scope.nvWsStatisticData = [{key: "Events", color: '#2980b9', values: []}, {key: "Errors",color: '#c0392b',  values: []}];
	for (counter = 1; counter < maxNumStatisticData; counter++){
		$scope.nvWsStatisticData[0]["values"].push([0,0]);
		$scope.nvWsStatisticData[1]["values"].push([0,0]);
	}

	
	var wsClient = webSocketService();
	var timeCounter = 0;
	
	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";

	var connectWS = function(){
		console.debug("++++++++++++++++++++++++++++++++connectWS");
		wsClient.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			
			var wsStatUrl = Helpers.stream.wsStatUrl($scope.stream);
			console.debug("subscribe wsStatUrl ", wsStatUrl);

			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
			console.debug("subscribe wsUrl ", $scope.wsUrl);

			//var wsErrorUrl = Helpers.stream.wsErrorUrl($scope.stream);
			//console.debug("subscribe wsErrorUrl ", wsErrorUrl);

			wsClient.subscribe(wsStatUrl, statisticCallback);
			wsClient.subscribe($scope.wsUrl, dataCallback);
			//wsClient.subscribe(wsErrorUrl, errorCallback);
			
		}, function() {
		}, '/');
	};
	
	function statisticCallback(message) {
		console.debug("message", message);
		counter++;
		console.debug("wsStatisticMessages", $scope.wsStatisticMessages);

		if ($scope.wsStatisticMessages.length >= maxNumWsStatisticMessages) 
			$scope.wsStatisticMessages.shift();
		if ($scope.wsErrorMessages.length >= maxNumWsErrorMessages) 
			$scope.wsErrorMessages.shift();
		//if ($scope.wsStatisticData.length > maxNumStatisticData) $scope.wsStatisticData.shift();

		if ($scope.nvWsStatisticData[0]["values"].length > maxNumStatisticData){
			$scope.nvWsStatisticData[0]["values"].shift();
			$scope.nvWsStatisticData[1]["values"].shift();
		}

		var numOfEvents = angular.fromJson(message.body).event.payloadData.numEventsLast30Sec;

		$scope.wsStatisticMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), numOfEvents ]);
		$scope.wsErrorMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), totalError]);

		$scope.nvWsStatisticData[0]["values"].push([timeCounter,numOfEvents]);
		$scope.nvWsStatisticData[1]["values"].push([timeCounter,totalError]);
		timeCounter +=2;

	};
	
	function dataCallback(message) {
		console.debug("data message", message);
		$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
		console.debug("$scope.wsLastMessage", $scope.wsLastMessage);

		if ($scope.wsLastMessageToShow == "")
			$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	
	
	function errorCallback(message) {
		console.debug("Error message", message);
		totalError++;
	};
	
	/*
	
	$scope.wsClientStatistics = webSocketService();

	var timeCounter = 0;
	var connectWSStatistic = function(){
		$scope.wsClientStatistics.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			var wsStatUrl = Helpers.stream.wsStatUrl($scope.stream);
			console.debug("subscribe wsStatUrl ", wsStatUrl);
			$scope.wsClientStatistics.subscribe(wsStatUrl, function(message) {
				console.debug("message", message);
				counter++;
				console.debug("wsStatisticMessages", $scope.wsStatisticMessages);

				if ($scope.wsStatisticMessages.length >= maxNumWsStatisticMessages) 
					$scope.wsStatisticMessages.shift();
				if ($scope.wsErrorMessages.length >= maxNumWsErrorMessages) 
					$scope.wsErrorMessages.shift();
				//if ($scope.wsStatisticData.length > maxNumStatisticData) $scope.wsStatisticData.shift();

				if ($scope.nvWsStatisticData[0]["values"].length > maxNumStatisticData){
					$scope.nvWsStatisticData[0]["values"].shift();
					$scope.nvWsStatisticData[1]["values"].shift();
				}


				var numOfEvents = angular.fromJson(message.body).event.payloadData.numEventsLast30Sec;

				$scope.wsStatisticMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), numOfEvents ]);
				$scope.wsErrorMessages.push([ $filter('date')(new Date(), "HH:mm:ss"), totalError]);
				//$scope.wsStatisticData.push({ x : counter*2, y : numOfEvents });

				$scope.nvWsStatisticData[0]["values"].push([timeCounter,numOfEvents]);
				//$scope.nvWsStatisticData[0]["values"].push([timeCounter,Math.floor(Math.random() * 9) + 1]);
				$scope.nvWsStatisticData[1]["values"].push([timeCounter,totalError]);
				//$scope.nvWsStatisticData[1]["values"].push([timeCounter,Math.floor(Math.random() * 6) + 1]);
				timeCounter +=2;

			});
		}, function() {
		}, '/');
	};


	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";


	$scope.wsClientData = webSocketService();
	var connectWSClientData = function(){
		$scope.wsClientData.connect(function(message) {
			//console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
			console.debug("subscribe wsUrl ", $scope.wsUrl);

			$scope.wsClientData.subscribe($scope.wsUrl, function(message) {
				console.debug("data message", message);
				$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
				console.debug("___________$scope.wsLastMessage", $scope.wsLastMessage);

				if ($scope.wsLastMessageToShow == "")
					$scope.wsLastMessageToShow = $scope.wsLastMessage;
			});

		}, function() {
		}, '/');
	};

	$scope.wsClientError = webSocketService();
	var connectWSClientError = function(){
		$scope.wsClientError.connect(function(message) {
			console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			console.debug("$scope.stream", $scope.stream); //"/topic/ten1.flussoProva.raw"
			console.debug("Helpers", Helpers); //"/topic/ten1.flussoProva.raw"

			var wsErrorUrl = Helpers.stream.wsErrorUrl($scope.stream);
			console.debug("subscribe wsErrorUrl ", wsErrorUrl);

			 $scope.wsClientError.subscribe(wsErrorUrl, function(message) {
				console.debug("Error message", message);
				totalError++;
			});

		}, function() {
		}, '/');
	};
	
	*/

	$scope.refreshLastMessage = function() {
		$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	//$scope.lineData = [ { x : 1, y : 5 }, { x : 20, y : 20 }, { x : 40, y : 10 }, { x : 60, y : 40 }, { x : 80, y : 5 }, { x : 100, y : 60 } ];
} 
]);

appControllers.controller('DashboardDataStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'webSocketService', 'odataAPIservice', 'dataDiscoveryService',  "$filter", '$interval',
                                                   function($scope, $routeParams, fabricAPIservice, webSocketService, odataAPIservice, dataDiscoveryService, $filter,$interval) {
	$scope.stream = null;
	$scope.wsUrl = "";
	$scope.chartComponentNames = [];
	$scope.chartData = [];
	$scope.tweetData = [];
	$scope.clientConnection=Constants.WEBSOCKET_NOT_CONNECTED;
	// this var is in an object because it will used inside $interval 
	$scope.statisticTimeInterval={ interval:30};
	$scope.samplingFrequency = {value:2} ;
	$scope.samplingFrequencyMin = 1;
	$scope.samplingFrequencyMax = 30;

	$scope.statisticTimeIntervalMin = 1;
	$scope.statisticTimeIntervalMax = 600;
	
	$scope.maxDataResult={ value:120};
	$scope.maxDataResultMin=1;
	$scope.maxDataResultMax=1000;

	var maxNumTweet = 6;

	$scope.chartWidth = angular.element( document.querySelector( '#chart-container' )).width()-6;
	
	$scope.isTwitter = false;
	var tenantsTokens = "";
	fabricAPIservice.getInfo().success(function(info){
		if(info != null && info.user!=null && info.user.tenants !=null){
			tenantsTokens = info.user.tenantsTokens;
		}
	});

	fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).then(function(response) {
		console.debug("getStream response",response);
		$scope.stream = response.streams.stream;
		
		if($scope.stream.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.isTwitter = true;
		}
		
		if($scope.stream.componenti == null)
			$scope.stream.componenti = new Object();
		
		$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);

		$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);

		if(!isNaN($scope.stream.fps)){
			var fpsNumber = parseFloat($scope.stream.fps);
			$scope.stream.fpm = 60*fpsNumber;
			if(fpsNumber!=0){
				$scope.stream.secondsBtwEvents = 1/fpsNumber;
				$scope.stream.minutesBtwEvents = 1/(fpsNumber*60);
			} else {
				$scope.stream.secondsBtwEvents = "-";
				$scope.stream.minutesBtwEvents = "-";
			}
		} else {
			$scope.stream.fpm = "-";
			$scope.stream.secondsBtwEvents = "-";
			$scope.stream.minutesBtwEvents = "-";
		}
		
		var colorCounter = 0;
		var view = false;
		var foundFirstToDisplay = false;
		for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
			var dataType = $scope.stream.componenti.element[int].dataType;
			var isEnabled = false;
			var color = "#ccc";
			var display = "none";
			if( "int" == dataType || "long" == dataType || "double" == dataType || "float" == dataType || "longitude" == dataType || "latitude" == dataType){
				isEnabled = true;
				display = "normal";
				if(!foundFirstToDisplay){
					view = true;
					foundFirstToDisplay = true;
				} else
					view = false;
				color = Constants.LINE_CHART_COLORS[colorCounter];
				colorCounter++;
				if(colorCounter>= Constants.LINE_CHART_COLORS.length)
					colorCounter = 0;
			}
			$scope.chartComponentNames.push({name:$scope.stream.componenti.element[int].nome, view: view, enabled: isEnabled, display: display, color: color, dataType: $scope.stream.componenti.element[int].dataType });
		}
		if(!$scope.stream.streamIcon || $scope.stream.streamIcon == null)
			$scope.stream.streamIcon  = "img/stream-icon-default.png";

		if($scope.stream.idTipoVe == Constants.VIRTUALENTITY_TYPE_TWITTER_ID && $scope.stream.twtMaxStreamsOfVE){
			$scope.twitterPollingInterval  = $scope.stream.twtMaxStreamsOfVE*5+1;
		}

		loadPastData();
		var codiceTenant = "";
		var keepGoing = true;
		angular.forEach($scope.stream.tenantssharing.tenantsharing, function(value) {
			if (keepGoing){
				angular.forEach(tenantsTokens, function(ttValue, ttKey) {
					if ((ttKey == value.tenantCode) && (keepGoing)){
						codiceTenant = ttKey;
						keepGoing = false;
					}
				});
			}
		});
		wsClient.updateStreamTenant(codiceTenant);
		connectWS();
	});

	
    $scope.xAxisTickFormatFunction = function(){
        return function(d) {
        	return  d3.time.format("%d/%m/%Y-%H:%M")(new Date(d));
          };
    };
    
    $scope.colorFunction = function() {
    	return function(d, i) {
    		var index = i- Math.floor(i/Constants.LINE_CHART_COLORS.length)*Constants.LINE_CHART_COLORS.length;
    		return Constants.LINE_CHART_COLORS[index];
    	};
    };
    
    $scope.toolTipContentFunction = function(){
    	return function(key, x, y, e, graph) {
    		var tooltipContent  ="";
    		console.log(' key',key);
    		
    		var point = allData[e.pointIndex];
    		tooltipContent += '<h3>' + d3.time.format("%d-%m %H:%M:%S")(new Date(point.datetime)) +'</h3>';
			for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
				var name = $scope.chartComponentNames[componentIndex].name;
				tooltipContent += '<p><strong>' + name + ': </strong> '+point.data[name]+'</p>';
			}
        	return  tooltipContent;
    	};
    };
    
	//var maxNumData = 30;
	var allData = [];
	$scope.lastMessageNotReceivedHint = 'DASHBOARD_STREAM_WS_LASTMESSAGE_NOT_RECEIVED';
	var loadPastData = function(){

		// call discovery service to retrieve  the apiCode
		dataDiscoveryService.loadStreamDetail($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
			var discoveryResultList = response.d.results;
			if(discoveryResultList.length >0){
				var apiCode  = discoveryResultList[0].Dataset.datasetCode;
				// call oData service to retrieve  the last 30 data
				var collection = 'Measures';
				if($scope.isTwitter){
					collection = 'SocialFeeds';
				}
				odataAPIservice.getStreamDataMultiToken(apiCode, null, 0, $scope.maxDataResult.value, 'time%20desc',collection, discoveryResultList[0].Dataset.tenantCode, discoveryResultList[0].Dataset.tenantsharing).success(function(response) {
					console.log("odataAPIservice.getStreamData",response, collection);
					var oDataResultList = response.d.results;
					if(oDataResultList.length >0){
						for (var oDataIndex = 0; oDataIndex < oDataResultList.length; oDataIndex++) {
							var oDataResult = oDataResultList[oDataIndex];
							//var time = new Date(parseInt(oDataResult.time.replace("/Date(", "").replace(")/",""), 10));
							//time.setHours(time.getHours() + time.getTimezoneOffset() / 60);
							var time = Helpers.mongo.date2millis(oDataResult.time);
							var values = {};
							for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
								values[$scope.chartComponentNames[componentIndex].name] = oDataResult[$scope.chartComponentNames[componentIndex].name];
							}
							allData.push({datetime: time, data: values});
						}
						$scope.wsLastMessageToShow = allData[0];
						allData.reverse();
						$scope.updateChart();
						if($scope.isTwitter){
							for (var tweetIndex = 0; tweetIndex  < maxNumTweet; tweetIndex++) {
								if(tweetIndex < allData.length){
									var tweet  = {};
									tweet.components = allData[allData.length-tweetIndex-1].data;
									tweet.components.createdAt = Helpers.mongo.date2string(tweet.components.createdAt);
									$scope.tweetData.push(tweet);
								}
							}
							console.log("$scope.tweetData", $scope.tweetData);
						}		
					}
				});
			}
		});
	};
	
	$scope.reloadData = function(){
		allData = [];
		loadPastData();
	};

	$scope.updateChart = function() {		
		$scope.chartData = [];
		var colorCounter = 0;
		for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
			var component = $scope.chartComponentNames[componentIndex];
			if(component.view){
				var data = [];
				for (var int = 0; int < allData.length; int++) {
					
					var singleData  = allData[int].data[component.name];
					if(component.dataType == "int" || component.dataType == "long" || 
					   component.dataType == "double" || component.dataType == "float" || 
					   component.dataType == "longitude" || component.dataType == "latitude")
						singleData = Number(singleData);
					
					data.push([allData[int].datetime, singleData]);
				}
				$scope.chartData.push({"key" : component.name , "values": data, "color": Constants.LINE_CHART_COLORS[colorCounter]});
			}
			if(component.enabled){
				colorCounter++;
				if(colorCounter>= Constants.LINE_CHART_COLORS.length)
					colorCounter = 0;
			}
		}
	};
	
	
	
	$scope.tweetDetail = null;
	$scope.updateTweet = function(lastTweet){
		if($scope.isTwitter){
			console.log("updateTweet lastTweet",lastTweet);
			//lastTweet.messagePretty = Helpers.render.prettifyTwitterMessage(lastTweet.components.getText);
			//$scope.tweetDetail = lastTweet;
			$scope.tweetData.push(lastTweet);
			if($scope.tweetData.length>maxNumTweet)
				$scope.tweetData.shift();
		}
	};
	
	$scope.showTweetDetail = function(tweet){
		$scope.tweetDetail = tweet;
	};
	
	var wsClient = webSocketService();
	

	$scope.nvWsStatisticData = [{key: "Events", color: '#2980b9', values: []}];
	$scope.nvWsStatisticData[0]["values"].push([0,0]);

	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";

	$scope.connectionCallback=function(sms){		
		$scope.clientConnection=sms;
		if(sms==Constants.WEBSOCKET_CONNECTING){
			$scope.clientConnectionClass="clientConnecting";
		}else if(sms==Constants.WEBSOCKET_NOT_CONNECTED){
			$scope.clientConnectionClass="clientNotConnected";
		}else if(sms==Constants.WEBSOCKET_CONNECTED){
			$scope.clientConnectionClass="clientConnected";
		}
	};
	
	var connectWS = function(){

		wsClient.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			
			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
			console.debug("subscribe wsUrl ", $scope.wsUrl);
			console.debug("subscribe stream ", $scope.stream);
			console.log("======> tenantStream", $scope.stream.nomeTenant);
			wsClient.subscribe($scope.wsUrl, dataCallback, $scope.stream.nomeTenant);
		

			$interval(function(){updateStatistics(); }, 2000);
					
		}, function() {
		}, '/',$scope.connectionCallback);
	};
	
	var allTime = [];
	
	var dataCounter = 0;
		
	function dataCallback(message) {
		console.debug("data message", message);
		var messageBody = JSON.parse(message.body);
		console.debug("messageBody", messageBody);
		
		
		for(var int = 0; int <messageBody.values.length; int++){
			var singleData = messageBody.values[int];
			var time = new Date(singleData.time);
			var values = singleData.components;
			if(allData.length >= $scope.maxDataResult.value)
				allData.shift();
			allData.push({datetime: time, data: values});
		}
		
		allTime.push(new Date().getTime());
		dataCounter++;
		
		$scope.updateChart();
		$scope.updateTweet(messageBody.values[0]);
		
		$scope.wsLastMessage = JSON.stringify(messageBody, null, "\t");

		$scope.lastMessageNotReceivedHint = "";
		$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	
	$scope.nvWsStatisticForceY = 1;
		
	var updateStatistics  =function(){
		console.log("updateStatistics");
		var now = new Date().getTime();
		//var minTime = now-$scope.statisticTimeInterval.interval*1000;
		$scope.nvWsStatisticData[0]["values"] = [];
		var dataCounter = 0;
		var sampling = $scope.samplingFrequency.value;
		for(var timeCounter = 0; timeCounter>-($scope.statisticTimeInterval.interval-1)/sampling; timeCounter --){
			for (var timeIndex = 0; timeIndex < allTime.length; timeIndex++) {
				var time = allTime[timeIndex];
				var elapsed = now-time;
				if(-elapsed >(timeCounter-1)*sampling*1000 && -elapsed <(timeCounter)*sampling*1000){
					dataCounter++;
				}
			}
			$scope.nvWsStatisticData[0]["values"].push([timeCounter*sampling, dataCounter]);
			dataCounter = 0;
		}
		console.log("data",$scope.nvWsStatisticData);

	};
	
} 
]);


appControllers.controller('DashboardErrorLogCtrl', [ '$scope','info', '$routeParams', 'fabricAPIservice', 'webSocketService', "$filter",
                                                     function($scope,info, $routeParams, fabricAPIservice, webSocketService, $filter) {
	$scope.tenant_sel = null;
	$scope.tenant_sel_code = "*";
	$scope.tenantsList = [];
	$scope.errorList = [];
	$scope.accordionOpenError = [];
	$scope.openedIndex = true;
	$scope.closeIndex = false;
	$scope.wsClientSubsctiption = null;
	$scope.clientConnection=Constants.WEBSOCKET_NOT_CONNECTED;
	$scope.clientConnectionClass="clientConnecting";
	$scope.connectionCallback=function(sms){		
		$scope.clientConnection=sms;
		if(sms==Constants.WEBSOCKET_CONNECTING){
			$scope.clientConnectionClass="clientConnecting";
		}else if(sms==Constants.WEBSOCKET_NOT_CONNECTED){
			$scope.clientConnectionClass="clientNotConnected";
		}else if(sms==Constants.WEBSOCKET_CONNECTED){
			$scope.clientConnectionClass="clientConnected";
		}
	};
	
	$scope.wsClientError = webSocketService();
	
	var connectWSClientError = function(){
		console.debug("connectWSClientError");
		$scope.wsClientError.connect(function(message) {
			console.debug("message", message); //"/topic/ten1.flussoProva.raw"
			console.debug("$scope.stream", $scope.tenant_sel_code); //"/topic/ten1.flussoProva.raw"
			console.debug("Helpers", Helpers); //"/topic/ten1.flussoProva.raw"
			$scope.errorList = [];
			$scope.accordionOpenError = [];
			subscribeWSClientError();
		}, function(message) {
			console.debug("Can't Connect on WebSocket");
		}, '/',$scope.connectionCallback);
	};
	
	
	var subscribeWSClientError = function(){
	
		var wsErrorUrl = Helpers.errors.wsErrorUrl($scope.tenant_sel_code);
		console.debug("subscribe wsErrorUrl ", wsErrorUrl);

		$scope.wsClientSubsctiption = $scope.wsClientError.subscribe(wsErrorUrl, function(message) {
			$scope.wsLastMessage = JSON.stringify(JSON.parse(message.body), null, "\t");
			$scope.errorList.unshift(JSON.parse(message.body));
			$scope.accordionOpenError.unshift($scope.closeIndex);
			
			$scope.errorList= $scope.errorList.slice(0,Constants.MAX_NR_ERROR_LOGS); 
			$scope.accordionOpenError=$scope.accordionOpenError.slice(0,Constants.MAX_NR_ERROR_LOGS);
			console.debug("Error $scope.errorList : ", $scope.errorList);				
		});
	};
	
	$scope.oneAtATime = true;

	$scope.selectTenant = function(tenant){
		console.debug("tenant", tenant);
		$scope.tenant_sel_code = tenant;

		$scope.errorList = [];
		$scope.accordionOpenError = [];
		console.debug("$scope.wsClientSubsctiption",$scope.wsClientSubsctiption);
		$scope.wsClientSubsctiption.unsubscribe();
		subscribeWSClientError();
	};
	
	//TODO remove other tenants let only the current
//	fabricAPIservice.getTenants().success(function(response) {
//		console.debug("response", response.tenants);
		
	
	fabricAPIservice.getInfo().success(function(info){
		if(info != null && info.user!=null && info.user.tenants !=null){
			$scope.tenantsList = info.user.tenants;
			console.debug("$scope.tenantsList ",$scope.tenantsList);
		}
	});
	
	//prendo tutti gli errori, se non ho selezionato un tenant
	connectWSClientError();

} 
]);
