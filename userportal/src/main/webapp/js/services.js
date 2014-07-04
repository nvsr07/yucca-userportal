'use strict';

/* Services */

var appServices = angular.module('userportal.services', []);

appServices.value('version', '0.1');

appServices.factory('fabricAPIservice', function($http) {

	var fabricAPI = {};

	fabricAPI.getStreams = function() {
		return $http({
			method : 'JSONP',
			url : 'http://dev-www.dati.piemonte.it/demo/sdp/streamsList.php?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStream = function(id_stream) {
		return $http({
			method : 'JSONP',
			url : 'http://dev-www.dati.piemonte.it/demo/sdp/stream.php?callback=JSON_CALLBACK&id_stream=' + id_stream
		});
	};

	return fabricAPI;
});

appServices.factory('webSocketService', function($rootScope) {
	var stompClient = {};

	function NGStomp() {
		this.stompClient = Stomp.client('ws://tst-sdnet-esbin1.sdp.csi.it/ws2/');
		//this.stompClient = Stomp.client('ws://localhost:8005/stats');
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
		var user = 'system';
		var password = 'manager'; 
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
