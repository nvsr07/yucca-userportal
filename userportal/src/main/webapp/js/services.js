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
		console.log("url", Constants.API_VIRTUALENTITY_LIST_URL + tenant_code );
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
	function NGStomp() {
		this.stompClient = Stomp.client(WEB_SOCKET_BASE_URL);
	}
	
	NGStomp.prototype.subscribe = function(queue, callback) {
		return this.stompClient.subscribe(queue, function() {
			var args = arguments;
			$rootScope.$apply(function() {
				callback(args[0]);
			});
		});
	};
	
	NGStomp.prototype.send = function(queue, headers, data) {
		this.stompClient.send(queue, headers, data);
	};
	
	NGStomp.prototype.connect = function(on_connect, on_error, vhost) {
		var user = WEB_SOCKET_USER;
		var password = WEB_SOCKET_SECRET;
		this.stompClient.connect(user, password, function(frame) {
			console.log("frame: ", frame);
			$rootScope.$apply(function() {
				on_connect.apply(stompClient, frame);
			});
		}, function(frame) {
			$rootScope.$apply(function() {
				on_error.apply(stompClient, frame);
			});
		}, vhost);
	};
	
	NGStomp.prototype.disconnect = function(callback) {
		this.stompClient.disconnect(function() {
			var args = arguments;
			console.debug("arguments : ",arguments);
			$rootScope.$apply(function() {
				callback.apply(args);
			});
		});
	};
	
	return function(url) {
		return new NGStomp(url);
	};
});