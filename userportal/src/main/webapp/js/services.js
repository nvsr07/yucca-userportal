'use strict';

/* Services */

var appServices = angular.module('userportal.services', ['userportal.config']);

appServices.value('version', '0.1');



appServices.factory('fabricAPIservice', function($http,DASHBOARD_API_STREAM_LIST_URL,DASHBOARD_API_STREAM_URL) {

	var fabricAPI = {};

	fabricAPI.getStreams = function() {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_LIST_URL
		});
	};

	fabricAPI.getStream = function(id_stream) {
		return $http({
			method : 'JSONP',
			url : DASHBOARD_API_STREAM_URL + id_stream
		});
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
			console.log("frame: " , frame);
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
