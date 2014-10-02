'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '0.7 dev');

appServices.factory('fabricAPIservice', function($http, $q) {

	var fabricAPI = {};

	fabricAPI.getInfo = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_INFO_URL + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreams = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_LIST_URL + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreams = function(tenant_code) {
		var tenantUrl = '';
		if(tenant_code)
			tenantUrl = tenant_code + '/';
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_LIST_URL + tenantUrl  + '?callback=JSON_CALLBACK'
		});
	};

	// fabricAPI.getStream = function(id_stream) {
	fabricAPI.getStream = function(tenant_code, virtualentity_code, stream_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_TENANT_LIST_URL+ '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentities = function(tenant_code) {
		if(tenant_code && tenant_code!=null && tenant_code!="")
			tenant_code = tenant_code + '/';
		return $http({
			method : 'JSONP',
			url : Constants.API_VIRTUALENTITY_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createStream = function(tenant_code, virtualentity_code, stream) {
		// return $http({
		// method: "POST",
		// url: Constants.API_STREAM_URL + tenant_code + '/' +
		// virtualentity_code + '/' + stream.stream.codiceStream+'/' ,
		// data: stream,
		// headers : { 'Content-Type': 'application/x-www-form-urlencoded;
		// charset=UTF-8' },
		// crossDomain: true,

		// }).success(function(data) {
		// console.log("data ", data);
		// });
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Stream", stream);
		$http.post(Constants.API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream.stream.codiceStream + '/', stream, {
			crossDomain : true,
		}).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.updateStream = function(stream) {
		var deferred = $q.defer();
		var resultData = null;

		$http.put(Constants.API_STREAM_URL + stream.stream.codiceTenant + '/' + stream.stream.codiceVirtualEntity + '/' + stream.stream.codiceStream + '/', stream, {
			crossDomain : true,
		}).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.createComponents = function(stream) {
		var deferred = $q.defer();
		var resultData = null;

		var urlCalls = [];
		console.log("stream.stream.componenti", stream.stream);
		for (var int = 0; int < stream.stream.componenti.element.length; int++) {
			var component = stream.stream.componenti.element[int];
			if(!component.idComponente || component.idComponente==null){
				component.nomeAttributo = component.nome;
				component.tipoAttributo = component.tipo;
				var componentParam = {"componente": { "nomeAttributo": component.nome, "tipoAttributo": component.tipo }};
				urlCalls.push($http.post(Constants.API_STREAM_COMPONENT_URL + stream.stream.codiceTenant + '/' + stream.stream.codiceVirtualEntity + '/' + stream.stream.codiceStream + '/', componentParam));
			}
		}

		console.log("urlCalls", urlCalls);


		$q.all(urlCalls).then(
				function(responseData) {
					console.log("qui ok" , responseData);
					resultData = {status: "ok", data: responseData};
					deferred.resolve(resultData);
				},
				function(errors) {
					console.log("qui ko" , errors);
					resultData = {status: "ko", data: errors};
					deferred.reject(errors);
				},
				function(updates) {
					console.log("qui update" , updates);

					deferred.update(updates);
				}
		);
		return deferred.promise;
	};


	fabricAPI.getVirtualentityCategories = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_VIRTUALENTITY_CATEGORIES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentityTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_VIRTUALENTITY_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_TAGS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_DOMAINS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamPhenomenom = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_PHENOMENOM_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamUnitOfMesaurement = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_UNIT_OF_MESAUREMENT_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamDataType = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_STREAM_DATATYPE_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};


	fabricAPI.getVirtualentity = function(tenant_code, virtualentity_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createVirtualentity = function(tenant_code, virtualentity_code, virtualentity) {
		var deferred = $q.defer();
		var resultData = null;

		$http.post(Constants.API_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/', virtualentity).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.updateVirtualentity = function(virtualentity) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("updateVirtualEntity url", Constants.API_STREAM_URL + virtualentity.virtualEntity.codiceTenant + '/' + virtualentity.virtualEntity.codeVirtualEntity + '/');
		$http.put(Constants.API_VIRTUALENTITY_URL + virtualentity.virtualEntity.codiceTenant + '/' + virtualentity.virtualEntity.codeVirtualEntity + '/', virtualentity, {
			crossDomain : true,
		}).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};


	fabricAPI.lifecycleStream = function(action, stream) {
		var deferred = $q.defer();
		var resultData = null;
		var urlAction = null;

		var lifecyclerequest = {"lifecyclerequest": 
		{
			"codTenant":stream.codiceTenant,
			"codVirtualEntity":stream.codiceVirtualEntity,
			"codStream":stream.codiceStream,
		}
		};

		if(action == Constants.LIFECYCLE_STREAM_REQ_INST)
			urlAction = Constants.API_LIFECYCLE_STREAM_REQ_INST;
		else if(action == Constants.LIFECYCLE_STREAM_NEW_VERSION)
			urlAction = Constants.API_LIFECYCLE_STREAM_NEW_VERSION;
		else if(action == Constants.LIFECYCLE_STREAM_REQ_UNINST)
			urlAction = Constants.API_LIFECYCLE_STREAM_REQ_UNINST;

		$http.post(urlAction, lifecyclerequest).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;

	};


	return fabricAPI;
});


appServices.factory('webSocketService', function($rootScope, WEB_SOCKET_BASE_URL, WEB_SOCKET_USER, WEB_SOCKET_SECRET) {
	var stompClient = {};	
//	var self = this;
	var root = $rootScope;
	var connectedFlag = false;
	var SingletonClient = null;
	
	var SubscriptedElementsList = [];


	var CancelAllSubscriptions = function(){
		for(var i =0; i< SubscriptedElementsList.length ; i++){
			var widget = SubscriptedElementsList[i];
			console.debug(':::: Unsubscribe for ::::', widget);
			widget.unsubscribe();      				  
		}
		SubscriptedElementsList = [];
	};


	function ConnectTheSocket(on_connect, on_error, vhost,count,updateStatus){
		var user = WEB_SOCKET_USER;
		var password = WEB_SOCKET_SECRET;
		
		CancelAllSubscriptions();

		/*
		 * Fai la disconnect
		 */

		if(connectedFlag){
			stompClient.disconnect(function(){
				connectedFlag=false;
			});
		}

		stompClient = Stomp.client(WEB_SOCKET_BASE_URL);
		
		stompClient.connect(user, password, function(frame) {
			connectedFlag=true;
			updateStatus("Connected");
			root.$apply(function() {
				on_connect.apply(stompClient, frame);
			});
		}, function(frame) {			 
			updateStatus("Connection Error, attempt to reconnect nr:"+count);
			if (count<5) {
				console.debug("Tentativo di riconnessione numero : ",count);
				setTimeout(function(){ new ConnectTheSocket(on_connect, on_error, vhost,++count,updateStatus);},count*1000);
				console.debug("awake.. ");		         	       
			} else{
				updateStatus("Can't Connect");
				root.$apply(function() {
					console.log(" on_error frame: ", frame);
					on_error.apply(frame);
				});
			}			
		}, vhost);
	};


	function NGStomp() {
		console.debug("Stomp",Stomp);
		this.count=1;
	}

	NGStomp.prototype.subscribe = function(queue, callback) {
		var subscribedClient = stompClient.subscribe(queue, function() {
			var args = arguments;
			$rootScope.$apply(function() {
				console.debug("args[0]",args[0]);
				callback(args[0]);
			});
		});

		SubscriptedElementsList.push(subscribedClient);

		return subscribedClient;
	};

	NGStomp.prototype.getStatusConnection = function() {
		return StatusConnection;
	};

	NGStomp.prototype.send = function(queue, headers, data) {
		stompClient.send(queue, headers, data);
	};


	NGStomp.prototype.connect = function(on_connect, on_error, vhost,updateStatus) {
		this.count=1;
		if(!updateStatus)
			updateStatus = function(sms){
				console.debug(sms);
		};
		updateStatus("Connecting..");
		new ConnectTheSocket(on_connect, on_error, vhost,this.count,updateStatus);

	};

	NGStomp.prototype.unsubscribeAll = function(){
		CancelAllSubscriptions();
	};


	NGStomp.prototype.disconnect = function(callback) {
		stompClient.disconnect(function() {
			var args = arguments;
			$rootScope.$apply(function() {
				callback.apply(args);
			});
		});
	};

	return function(url,updateStatus) {
		if(!SingletonClient){
			if(!updateStatus){ 
				updateStatus=function(sms){
					console.debug(sms);
				};
			}
			SingletonClient = new NGStomp(url,updateStatus);
		}
		return SingletonClient;
	};
});

var WebsocketStompSingleton= (function() {    
	var clientInstance; //private variable to hold the
	//only instance of client that will exits.


	var SubscriptionList = [];
	var SubscriptedElementsList = [];
	var connectedClient = false;


	var CancelAllSubscriptions = function(){
		for(var i =0; i< SubscriptedElementsList.length ; i++){
			var widget = SubscriptedElementsList[i];
			console.debug(':::: Unsubscribe for ::::', widget);
			widget.unsubscribe();      				  
		}
		SubscriptionList = [];
		SubscriptedElementsList = [];
	};

	var createClient = function(settings,count,updateStatus){ 
		var intSettings = settings;	                    
		var client = Stomp.client(intSettings.ws_url);
		client.connect(intSettings.ws_user,intSettings.ws_pwd,
				function(frame) { //success Callback
			updateStatus("Connected.");
			for(var i =0; i< SubscriptionList.length ; i++){
				var widget = SubscriptionList[i];
				console.debug(':::: subscribe for ::::', widget);
				SubscriptedElementsList.push( client.subscribe(widget.keyTopic,widget.keyCallback));

			}
			console.debug(':::: Finish with the subscribe:::::');
			connectedClient=true;
		},
		function(frame) //error Callback
		{
			
			if (count<5) {
				updateStatus("Riconnecting!");
				console.debug("createClient count ::::::::::::: ",count);    						       
				setTimeout(function(){createClient(intSettings,++count);},count*1000);
				console.debug("awake.. ");		         	       
			} else{
				updateStatus("Not Connected!");
				console.debug(':::: Impossibile connettersi::::');
			}	
		});


		return {
			getWebClient: function(){               		 

				return client;
			},
			addSubscription : function(topic,callback){
				if(connectedClient){
					console.debug(':::: addSubscription Client connesso::::');
					SubscriptionList.push({
						keyTopic:topic,
						keyCallback:callback
					});
					client.subscribe(topic,callback);
				}else{
					console.debug(':::: addSubscription Client NON connesso Add to SubscriptionList::::');
					SubscriptionList.push({
						keyTopic:topic,
						keyCallback:callback
					});
				}
			},
			cancelAllSubscriptions:CancelAllSubscriptions
		};                         
	};

	return {
		getInstance: function(settings,updateStatus){
			if(clientInstance) return clientInstance; //se gia creato lo ritorna

			if(!settings)	  return null; // se non e' creato e non ci sono le settings ritorna null; 

			if(!clientInstance){
				console.debug("::::  New Stomp Client Created ::::");
				if(!updateStatus){ 
					updateStatus=function(sms){
						console.debug(sms);
					};
				}
				updateStatus("Connecting..");
				clientInstance = createClient(settings,1,updateStatus);              	  
			}
			return clientInstance;
		}
	};
})();


