'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '0.1');

appServices.factory('fabricAPIservice', function($http, $q, DASHBOARD_API_STREAM_LIST_URL, DASHBOARD_API_STREAM_URL, DASHBOARD_API_TENANT_LIST_URL,
		DASHBOARD_API_VIRTUALENTITY_LIST_URL, DASHBOARD_API_VIRTUALENTITY_URL , DASHBOARD_API_VIRTUALENTITY_CATEGORIES_URL,
		DASHBOARD_API_VIRTUALENTITY_TYPES_URL, DASHBOARD_API_STREAM_TAGS_URL, DASHBOARD_API_STREAM_DOMAINS_URL) {

	var fabricAPI = {};
	console.log("DASHBOARD_API_STREAM_LIST_URL", DASHBOARD_API_STREAM_LIST_URL);

	fabricAPI.getStreams = function() {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_LIST_URL + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreams = function(tenant_code) {
		var tenantUrl = '';
		if(tenant_code)
			tenantUrl = tenant_code + '/';
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_LIST_URL + tenantUrl  + '?callback=JSON_CALLBACK'
		});
	};

	// fabricAPI.getStream = function(id_stream) {
	fabricAPI.getStream = function(tenant_code, virtualentity_code, stream_code) {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getTenants = function() {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_TENANT_LIST_URL+ '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentities = function(tenant_code) {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_VIRTUALENTITY_LIST_URL + tenant_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createStream = function(tenant_code, virtualentity_code, stream) {
		// return $http({
		// method: "POST",
		// url: DASHBOARD_API_STREAM_URL + tenant_code + '/' +
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
		
		$http.post(DASHBOARD_API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream.stream.codiceStream + '/', stream, {
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

	fabricAPI.updateStream = function(tenant_code, virtualentity_code, stream) {
		var deferred = $q.defer();
		var resultData = null;
		
		$http.put(DASHBOARD_API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream.stream.codiceStream + '/', stream, {
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

	fabricAPI.getVirtualentityCategories = function() {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_VIRTUALENTITY_CATEGORIES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentityTypes = function() {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_VIRTUALENTITY_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};
	
	fabricAPI.getStreamTags = function() {
		//FIXME return real method when API will be ready
		return ['AGRICULTURE','ENERGY','ENVIRONMENT','HEALTH','SCHOOL','SECURITY','TRANSPORT'];
		/*return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_TAGS_URL + '/' + '?callback=JSON_CALLBACK'
		});*/
	};

	fabricAPI.getStreamDomains = function() {
		//FIXME return real method when API will be ready
		return ['AIR','CARBON','CONSUMPTION','DIOXIDE','FIRE','FOREST','GLACIER','INDOOR','LAKE','LANDSLIDE','MONOXIDE','NITROGEN','OZONE','POLLUTION','RAIN','RIVER','SNOW','WATER'];
		/* return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_DOMAINS_URL + '/' + '?callback=JSON_CALLBACK'
		});*/
	};
	
	fabricAPI.getVirtualentity = function(tenant_code, virtualentity_code) {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createVirtualentity = function(tenant_code, virtualentity_code, virtualentity) {
		var deferred = $q.defer();
		var resultData = null;
		
		$http.post(DASHBOARD_API_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/', virtualentity).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
	          resultData = {status: "ko - "+responseStatus, data: responseData};
	          deferred.reject(resultData);
	    });
		return deferred.promise;
	};

	fabricAPI.updateVirtualentity = function(tenant_code, virtualentity_code, virtualentity) {
		var deferred = $q.defer();
		var resultData = null;
		
		$http.put(DASHBOARD_API_STREAM_URL + tenant_code + '/' + virtualentity_code + '/', virtualentity, {
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
	
	
	
	
	return fabricAPI;
});

appServices.factory('webSocketService', function($rootScope, WEB_SOCKET_BASE_URL, WEB_SOCKET_USER, WEB_SOCKET_SECRET) {
	var stompClient = {};

	function NGStomp() {
		this.stompClient = Stomp.client(WEB_SOCKET_BASE_URL);
	}

	NGStomp.prototype.subscribe = function(queue, callback) {
		this.stompClient.subscribe(queue, function() {
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
			$rootScope.$apply(function() {
				callback.apply(args);
			});
		});
	};

	return function(url) {
		return new NGStomp(url);
	};
});

