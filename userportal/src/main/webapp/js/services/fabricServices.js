appServices.factory('fabricAPIservice',["$http","$q","info", function($http, $q,info) {

	var fabricAPI = {};

	fabricAPI.getInfo = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_INFO_URL + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getInfoChangActiveTenant = function(activeTenant) {

		var changeTenantUrl = Constants.API_INFO_URL + '?callback=JSON_CALLBACK';

		if(typeof activeTenant!=undefined)
			changeTenantUrl = changeTenantUrl+"&activeTenant="+activeTenant.tenantCode;

		return $http({
			method : 'JSONP',
			url : changeTenantUrl
		});
	};
	
	fabricAPI.acceptTermConditionForTenant = function(tenantCode) {

		var acceptUrl = Constants.API_AUTH_TERMCONDITION_URL + '?tenantcode=' + tenantCode +'&callback=JSON_CALLBACK';
		console.log("acceptTermConditionForTenant",acceptUrl);

		return $http({
			method : 'JSONP',
			url : acceptUrl
		});
	};
	
	fabricAPI.saveStoreTokenInSession = function(storeToken) {

		var updateUserInfoUrl = Constants.API_AUTH_UPDATE_USER_INFO_URL + '?storeToken=' + storeToken;
		console.log("updateUserInfoUrl",updateUserInfoUrl);

		return $http({
			method : 'GET',
			url : updateUserInfoUrl
		});
	};
	
	

	fabricAPI.validateSiddhi = function(toValidate) {
		return $http({
			method : 'POST',
			data:toValidate,
			url : Constants.API_VALIDATE_SIDDHI
		});
	};

	fabricAPI.getStreams = function(tenant_code) {
		var tenantUrl = '';
		if(tenant_code)
			tenantUrl = tenant_code + '/';
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_URL + tenantUrl  + '?callback=JSON_CALLBACK'
		});
	};

	
	fabricAPI.getStreamsByVirtualentity = function(tenant_code, virtualentity_code) {
		console.log("getStreamsByVirtualentity",tenant_code, virtualentity_code);
		var deferred = $q.defer();
		fabricAPI.getInfo().success(function(infoData){
			console.debug(infoData);
			var streamsUrl = '';
			if(tenant_code)
				streamsUrl = tenant_code + '/';
			streamsUrl += virtualentity_code + '/';
	
			if(infoData.user.activeTenant!=undefined)
				streamsUrl += '?visibleFrom='+infoData.user.activeTenant;			
			else
				streamsUrl += '?visibleFrom=sandbox';

			console.log("url",  Constants.API_SERVICES_STREAM_URL + streamsUrl  + '&callback=JSON_CALLBACK');
			
			 $http({
				method : 'JSONP',
				url : Constants.API_SERVICES_STREAM_URL + streamsUrl  + '&callback=JSON_CALLBACK'
			});
		});
		
		return deferred.promise;
	};
	
	fabricAPI.getVisibleStreamsFromTenant = function(tenantCode) {
		
		var deferred = $q.defer();
		fabricAPI.getInfo().success(function(infoData){
			console.debug(infoData);
		
			var tenantUrl = 'sandbox/';
			if(tenantCode != undefined)
				tenantUrl = tenantCode + '/';			
			
			
			$http({
				method : 'JSONP',
				url : Constants.API_SERVICES_STREAM_URL + tenantUrl  + '?callback=JSON_CALLBACK'
			}).success(function(responseData) {
				deferred.resolve(responseData);
			}).error(function(responseData, responseStatus) {
				resultData = {status: "ko - "+responseStatus, data: responseData};
				deferred.reject(resultData);
			});			
		});
		
		return deferred.promise;
	};
	fabricAPI.getVisibleStreams = function() {
		
		var deferred = $q.defer();
		fabricAPI.getInfo().success(function(infoData){
			console.debug(infoData);
		
			var tenantUrl = '?visibleFrom=sandbox';
			if(infoData.user.activeTenant!=undefined)
				tenantUrl = '?visibleFrom='+infoData.user.activeTenant;			
			
			$http({
				method : 'JSONP',
				url : Constants.API_SERVICES_STREAM_URL + tenantUrl  + '&callback=JSON_CALLBACK'
			}).success(function(responseData) {
				deferred.resolve(responseData);
			}).error(function(responseData, responseStatus) {
				resultData = {status: "ko - "+responseStatus, data: responseData};
				deferred.reject(resultData);
			});			
		});
		
		return deferred.promise;
		
		//var tenantUrl = '?visibleFrom=sandbox';
		//if(tenant_code!=null && tenant_code!=undefined)
		//	tenantUrl = '?visibleFrom='+tenant_code;
		//return $http({
		//	method : 'JSONP',
		//	url : Constants.API_SERVICES_STREAM_URL + tenantUrl  + '&callback=JSON_CALLBACK'
		//});
	};

	fabricAPI.getStream = function(tenant_code, virtualentity_code, stream_code) {
//FIXME
		var deferred = $q.defer();
		var tenantForRequest = "";
		fabricAPI.getInfo().success(function(infoData){
			console.debug(infoData);
			var visible= "?visibleFrom=sandbox";
			
			if(infoData.user.tenantsTokens != undefined){
				angular.forEach(info.info.user.tenantsTokens, function(value, key) {
					tenantForRequest += key + "|";
					console.log("tenantForRequest", tenantForRequest);
				});
				
				console.log('tokenForRequest in getStreamDataMultiToken', tenantForRequest);
				visible = "?visibleFrom=" + tenantForRequest.substr(0, tenantForRequest.length - 1);	
			} else if(infoData.user.activeTenant != undefined)
				visible = "?visibleFrom=" + infoData.user.activeTenant;		
			
			console.debug("===================> visible - ", visible);		
			console.debug("url getStream", Constants.API_SERVICES_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + '/'+visible+'&callback=JSON_CALLBACK');
			$http({
				method : 'JSONP',
				url : Constants.API_SERVICES_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + '/'+visible+'&callback=JSON_CALLBACK'
			}).success(function(responseData) {
				deferred.resolve(responseData);
			}).error(function(responseData, responseStatus) {
				resultData = {status: "ko - "+responseStatus, data: responseData};
				deferred.reject(resultData);
			});			
		});
		
		return deferred.promise;
	};

	fabricAPI.getTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_TENANT_LIST_URL+ '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentities = function(tenant_code) {
		if(tenant_code && tenant_code!=null && tenant_code!="")
			tenant_code = tenant_code + '/';
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createStream = function(tenant_code, virtualentity_code, stream) {
		// return $http({
		// method: "POST",
		// url: Constants.API_SERVICES_STREAM_URL + tenant_code + '/' +
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
		$http.post(Constants.API_SERVICES_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream.stream.codiceStream + '/', stream, {
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

		$http.put(Constants.API_SERVICES_STREAM_URL + stream.stream.codiceTenant + '/' + stream.stream.codiceVirtualEntity + '/' + stream.stream.codiceStream + '/', stream, {
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
				urlCalls.push($http.post(Constants.API_SERVICES_STREAM_COMPONENT_URL + stream.stream.codiceTenant + '/' + stream.stream.codiceVirtualEntity + '/' + stream.stream.codiceStream + '/', componentParam));
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
			url : Constants.API_SERVICES_VIRTUALENTITY_CATEGORIES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getVirtualentityTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_TAGS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_DOMAINS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamSubDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_SUB_DOMAINS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamPhenomenom = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_PHENOMENOM_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamUnitOfMesaurement = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_UNIT_OF_MESAUREMENT_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getStreamDataType = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_DATATYPE_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};


	fabricAPI.getVirtualentity = function(tenant_code, virtualentity_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/' + '?callback=JSON_CALLBACK'
		});
	};


	fabricAPI.getVirtualentityByTenant = function(tenant_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '/' + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.createVirtualentity = function(tenant_code, virtualentity_code, virtualentity) {
		var deferred = $q.defer();
		var resultData = null;

		$http.post(Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/', virtualentity).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};
	
	fabricAPI.createNewTrialTenant = function(tenantObject) {
		//int-sdnet-intapi.sdp.csi.it:90/wso001/services/tenants/newNotDefault
		var deferred = $q.defer();
		var resultData = null;

		tenantObject.tenant.tenantType = "trial";
		console.log("createNewTrialTenant", tenantObject);

		$http.post(Constants.API_SERVICES_TENANT_LIST_URL + 'newNotDefault/', tenantObject).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};
	
	fabricAPI.createNewPersonalTenant = function(tenantObject) {
		//int-sdnet-intapi.sdp.csi.it:90/wso001/services/tenants/newNotDefault
		var deferred = $q.defer();
		var resultData = null;

		tenantObject.tenant.tenantType = "personal";
		console.log("createNewPersonalTenant", tenantObject);

		$http.post(Constants.API_SERVICES_TENANT_LIST_URL + 'newNotDefault/', tenantObject).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.loadTwitterCredential = function() {
		return $http({
			method : 'GET',
			url : Constants.API_SERVICES_TWITTER_USER_URL// + '?callback=JSON_CALLBACK'
		});
	};
	
	fabricAPI.clearTwitterCredential = function() {
		return $http({
			method : 'GET',
			url : Constants.API_SERVICES_TWITTER_USER_URL+ '?action=clear'
		});
	};
		

	fabricAPI.verifyTwitterCredential = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_TWITTER_AUTH_URL + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.checkTwitterQuery = function(tweetQuery) {
		return $http({
			method : 'POST',
			data:tweetQuery,
			url : Constants.API_SERVICES_TWITTER_QUERY_URL
		});
	};
	
	fabricAPI.updateVirtualentity = function(virtualentity) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("updateVirtualEntity url", Constants.API_SERVICES_STREAM_URL + virtualentity.virtualEntity.codiceTenant + '/' + virtualentity.virtualEntity.codeVirtualEntity + '/');
		$http.put(Constants.API_SERVICES_VIRTUALENTITY_URL + virtualentity.virtualEntity.codiceTenant + '/' + virtualentity.virtualEntity.codeVirtualEntity + '/', virtualentity, {
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
			urlAction = Constants.API_SERVICES_LIFECYCLE_STREAM_REQ_INST;
		else if(action == Constants.LIFECYCLE_STREAM_NEW_VERSION)
			urlAction = Constants.API_SERVICES_LIFECYCLE_STREAM_NEW_VERSION;
		else if(action == Constants.LIFECYCLE_STREAM_REQ_UNINST)
			urlAction = Constants.API_SERVICES_LIFECYCLE_STREAM_REQ_UNINST;

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
}]);

