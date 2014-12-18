'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '0.8.1 dev');


app.factory('asyncSingleDatasetService', function($http, $q, dataDiscoveryService) {

	var data = [];  
	var myService = {};

	myService.async = function(queryString,single) {
		data = [];
		var urlDataset={makeGet:false};
		var urlStream={makeGet:false};
		var deffered = $q.defer();
		if(single!=true){
			urlDataset = dataDiscoveryService.searchMultiFieldInDatasets(queryString);
//			urlStream = dataDiscoveryService.searchMultiFieldInStreams(queryString);
			// in multiSearch, the fields are in "and" if we search in stream than dont make Dataset call!
//			if(urlDataset.makeGet==true){
//				urlStream.makeGet=false;
//			}
		}else{
			urlDataset = dataDiscoveryService.searchSingleFieldInDatasets(queryString);
			urlStream = dataDiscoveryService.searchSingleFieldInStreams(queryString);
		}
		console.debug("urlDataset",urlDataset);
		console.debug("urlStream",urlStream);
		var callApi="Dataset";
		if(urlDataset.makeGet==false && urlStream.makeGet==true){
			callApi="Stream";
		}else if(urlDataset.makeGet==true && urlStream.makeGet==true){
			callApi="DatasetStream";
		}else if(urlDataset.makeGet==false && urlStream.makeGet==false && queryString!=null && queryString!=""){
			callApi="NoResult";
		}
		
		if(callApi=="NoResult"){
			data=[];
			deffered.resolve();	
			return deffered.promise;
		}else if(callApi=="Dataset"){
			$http.get(urlDataset.url)
			.success(function (res) {
				data = res.d.results;
				console.log(res.d.results);
				deffered.resolve();
			});
			return deffered.promise;
		}else if(callApi=="Stream"){
			$http.get(urlStream.url)
			.success(function (res) {
				for(var i in res.d.results){
					//Normalize the object Datasets in the 2 array, they must be equal.
					var foundDataset = res.d.results[i].Dataset;
					delete res.d.results[i].Dataset;
					foundDataset.Stream=res.d.results[i];
					data.push(foundDataset);
				}
				console.log(res.d.results);
				deffered.resolve();
			});
			return deffered.promise;
		}else if(callApi=="DatasetStream"){
			$http.get(urlDataset.url)
			.success(function (res) {
				console.log("First : d ",res.d,data);
				data = res.d.results;
				deffered.resolve();
			});
			return deffered.promise.then(function(result) {
				var deffered1 = $q.defer();
				$http.get(urlStream.url)
				.success(function (res) {
					console.log("second : d ",res.d,data);
					var secondArray = res.d.results;
					for(var i in secondArray){
						var trovato = false;
						for(var index in data){
							if(data[index].idDataset==secondArray[i].idDataset){
								trovato=true;
								console.debug("trovato=true");
							}
						}
						if(trovato==false){
							var foundDataset = secondArray[i].Dataset;
							delete secondArray[i].Dataset;
							foundDataset.Stream=secondArray[i];
							data.push(foundDataset);
						}
					}
//					data = d;
					console.log("second data",secondArray);
					console.log("complete data",data);
					deffered1.resolve();
				});
				return deffered1.promise;
			});
		}
	};
	myService.data = function() { return data; };

	return myService;
});


appServices.factory('dataDiscoveryService', function($http, $q) {
	var dataDiscovery = {};

	var keyArray=[{key:"idDataset",type:"Integer"},{key:"tenantCode",type:"String"},
	              {key:"dataDomain",type:"String"},{key:"license",type:"String"},{key:"fps",type:"Double"},
	              {key:"datasetName",type:"String"},{key:"visibility",type:"String"},{key:"tags",type:"String"},
	              {key:"measureUnit",type:"String"}];

	var keyStreamArray=[{key:"smartOCode",type:"String"},{key:"streamCode",type:"String"},{key:"streamName",type:"String"},{key:"streamDescription",type:"String"}];

	var buildStringQuery = function(key,op,value){
		console.debug(key,op,value);
		if(op.trim()=="eq" || op.trim()=="ne"){
			return " "+key+" "+op+" '"+value+"'";
		}else if(op.trim()=="substringof"){
			return " "+op+"('"+value+"' ,"+key+" ) eq true ";
		}else if(op.trim()=="startswith" || op.trim()=="endswith"  ){
			return " "+op+"("+key+",'"+value+"' ) eq true ";
		}
	};

	dataDiscovery.searchMultiFieldInDatasets = function(queryArray){

		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Datasets?$expand=Stream&$format=json";
		var URLQuery="";
		var URLFilter = "&$filter=("; 
		var first = true ;
		var makeGet=false;
		console.debug("searchMultiFieldInDatasets",queryArray);
		for (var int = 0; int <  3; int++) {
			console.debug("queryArray[int]",queryArray[int]);
			if(queryArray[int].value!=null && queryArray[int].value.trim()!=""){
				var keyValue=queryArray[int];

				switch (keyValue.field) {
				case "idDataset":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery += " idDataset "+queryArray[int].op+" "+keyValue.value.trim();
					first=false;
					break;
				case "tenantCode":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());// " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
					first=false;
					break;
				case "dataDomain":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,dataDomain ) eq true ";
					first=false;
					break;
				case "license":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,license ) eq true ";
					first=false;
					break;
				case "fps":
					if(!isNaN(keyValue.value.trim())){
						if(!first){ 
							URLQuery+=" and ";						
						}
						URLQuery += " fps "+queryArray[int].op+" "+keyValue.value.trim()+"m ";
					}
					first=false;
					break;
				case "datasetName":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += "substringof('"+keyValue.value.trim()+"' ,datasetName ) eq true ";
					first=false;
					break;
				case "visibility":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += "substringof('"+keyValue.value.trim()+"' ,visibility ) eq true ";
					first=false;
					break;
				case "tags":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,tags ) eq true ";
					first=false;
					break;
				case "measureUnit":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,measureUnit ) eq true ";
					first=false;
					break;
				}				
			} 
		}
		if(URLQuery.trim()!=""){
			URLBaseQuery+= URLFilter + URLQuery+") ";
			makeGet=true;
		}

		console.debug("dataDiscovery.searchDatasets URL : ",URLBaseQuery);
		return {
			makeGet : makeGet,
			url:URLBaseQuery
//			url : "http://int-api.smartdatanet.it/datadiscovery/SmartDataServiceDiscoveryServlet.svc/Datasets?$format=json"
		};

	};


	dataDiscovery.searchSingleFieldInDatasets = function(queryString){

		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Datasets?$expand=Stream&$format=json";
		var URLQuery="";
		var makeGet=false;
		var URLFilter = "&$filter=("; 
		if(queryString != undefined && queryString.trim()!=""){

			var res = queryString.split(" ");
			var first = true ;
			for(var index in res ){				
				var keyValue = res[index].split(":");
				if(keyValue.length == 1 && index<3){	
					for(var obj in keyArray){
						console.debug("queryString",queryString,keyArray[obj].type,!isNaN(keyValue));
						if(keyArray[obj].type=="Integer" && !isNaN(keyValue) && queryString.indexOf(".")==-1){
							if(!first){ 
								URLQuery+=" or ";						
							}
							first=false;
							URLQuery += keyArray[obj].key+" eq " +keyValue;

						}else if(keyArray[obj].type=="String" && isNaN(keyValue)){
							if(!first){ 
								URLQuery+=" or ";
							}
							first=false;
							URLQuery += "substringof('"+keyValue+"' , "+keyArray[obj].key+" ) eq true ";
						}else if(keyArray[obj].type=="Double" && !isNaN(keyValue)){
							if(!first){ 
								URLQuery+=" or ";
							}
							first=false;
							URLQuery += keyArray[obj].key+" eq " +keyValue+"m";
						}				
					}
				}else if(keyValue.length==2 && index<3){
					switch (keyValue[0].trim().toUpperCase()) {
					case "idDataset".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " idDataset eq " +keyValue[1].trim();
						first=false;
						break;
					case "tenantCode".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,tenantCode ) eq true ";
						first=false;
						break;
					case "dataDomain".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,dataDomain ) eq true ";
						first=false;
						break;
					case "license".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,license ) eq true ";
						first=false;
						break;
					case "fps".toUpperCase():

						if(!isNaN(keyValue[1].trim())){
							if(!first){ 
								URLQuery+=" or ";						
							}
							URLQuery += " fps eq " +keyValue[1].trim()+"m ";
						}
						first=false;
						break;
					case "datasetName".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += "substringof('"+keyValue[1].trim()+"' ,datasetName ) eq true ";
						first=false;
						break;
					case "visibility".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += "substringof('"+keyValue[1].trim()+"' ,visibility ) eq true ";
						first=false;
						break;
					case "tags".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,tags ) eq true ";
						first=false;
						break;
					case "measureUnit".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,measureUnit ) eq true ";
						first=false;
						break;
					}
				}
			}
		}

		if(URLQuery.trim()!=""){
			URLBaseQuery+= URLFilter + URLQuery+")";
			makeGet=true;
		}

		console.debug("dataDiscovery.searchDatasets URL : ",URLBaseQuery);
		return {
			makeGet:makeGet,
			url:URLBaseQuery
		};
	};




	dataDiscovery.searchMultiFieldInStreams = function(queryArray){

		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Streams?$expand=Dataset&$format=json";
		var URLQuery="";
		var URLFilter = "&$filter=("; 
		var first = true ;
		var makeGet=false;
		console.debug("searchMultiFieldInStreams",queryArray);
		for (var int = 0; int <  3; int++) {
			console.debug("queryArray[int]",queryArray[int]);
			if(queryArray[int].value!=null && queryArray[int].value.trim()!=""){
				var keyValue=queryArray[int];

				switch (keyValue.field) {

				case "streamCode":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());// " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
					first=false;
					break;
				case "smartOCode":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());// " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,tenantCode ) eq true ";
					first=false;
					break;
				case "streamName":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,dataDomain ) eq true ";
					first=false;
					break;
				case "streamDescription":
					if(!first){ 
						URLQuery+=" and ";						
					}
					URLQuery +=buildStringQuery(keyValue.field,queryArray[int].op,keyValue.value.trim());
//					URLQuery += " substringof('"+keyValue.value.trim()+"' ,license ) eq true ";
					first=false;
					break;

				}				
			} 
		}
		if(URLQuery.trim()!=""){
			URLBaseQuery+= URLFilter + URLQuery+") ";
			 makeGet=true;
		}

		console.debug("dataDiscovery.searchDatasets URL : ",URLBaseQuery);
		return {
			makeGet :makeGet,
			url:URLBaseQuery
//			url : "http://int-api.smartdatanet.it/datadiscovery/SmartDataServiceDiscoveryServlet.svc/Datasets?$format=json"
		};

	};


	dataDiscovery.searchSingleFieldInStreams = function(queryString){

		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Streams?$expand=Dataset&$format=json";
		var URLQuery="";
		var makeGet=false;
		var URLFilter = "&$filter=("; 
		if(queryString != undefined && queryString.trim()!=""){

			var res = queryString.split(" ");
			var first = true ;
			for(var index in res ){				
				var keyValue = res[index].split(":");
				if(keyValue.length == 1 && index<3){	
					for(var obj in keyStreamArray){
						console.debug("queryString",queryString,keyStreamArray[obj].type,!isNaN(keyValue));
						if(keyStreamArray[obj].type=="Integer" && !isNaN(keyValue) && queryString.indexOf(".")==-1){
							if(!first){ 
								URLQuery+=" or ";						
							}
							first=false;
							URLQuery += keyStreamArray[obj].key+" eq " +keyValue;

						}else if(keyStreamArray[obj].type=="String" && isNaN(keyValue)){
							if(!first){ 
								URLQuery+=" or ";
							}
							first=false;
							URLQuery += "substringof('"+keyValue+"' , "+keyStreamArray[obj].key+" ) eq true ";
						}else if(keyStreamArray[obj].type=="Double" && !isNaN(keyValue)){
							if(!first){ 
								URLQuery+=" or ";
							}
							first=false;
							URLQuery += keyStreamArray[obj].key+" eq " +keyValue+"m";
						}				
					}
				}else if(keyValue.length==2 && index<3){
					switch (keyValue[0].trim().toUpperCase()) {
					case "streamCode".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,streamCode ) eq true ";
						first=false;
						break;
					case "smartOCode".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,smartOCode ) eq true ";
						first=false;
						break;
					case "streamName".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,streamName ) eq true ";
						first=false;
						break;
					case "streamDescription".toUpperCase():
						if(!first){ 
							URLQuery+=" or ";						
						}
						URLQuery += " substringof('"+keyValue[1].trim()+"' ,streamDescription ) eq true ";
						first=false;
						break;
					}
				}
			}
		}

		if(URLQuery.trim()!=""){
			URLBaseQuery+= URLFilter + URLQuery+")";
			makeGet=true;
		}

		console.debug("dataDiscovery.searchDatasets URL : ",URLBaseQuery);
		return {
			makeGet:makeGet,
			url:URLBaseQuery
		};
	};


	dataDiscovery.loadDatasetDetail = function(datasetId){

		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Datasets("+datasetId+")?$format=json&$expand=Stream,Fields";
		console.debug("dataDiscovery.loadDatasetDetail URL : ",URLBaseQuery);
		return $http({
			method : 'GET',
			url:URLBaseQuery
//			url : "http://int-api.smartdatanet.it/datadiscovery/SmartDataServiceDiscoveryServlet.svc/Datasets(1)?$format=json&$expand=Fields"
		});

	};
	return dataDiscovery;
});


appServices.factory('fabricAPIservice', function($http, $q) {

	var fabricAPI = {};

	fabricAPI.getInfo = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_INFO_URL + '?callback=JSON_CALLBACK'
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
			url : Constants.API_SERVICES_STREAM_LIST_URL + tenantUrl  + '?callback=JSON_CALLBACK'
		});
	};
	
	fabricAPI.getVisibleStreams = function(tenant_code) {
		var tenantUrl = '?visibleFrom=sandbox';
		if(tenant_code)
			tenantUrl = '?visibleFrom='+tenant_code;
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_LIST_URL + tenantUrl  + '&callback=JSON_CALLBACK'
		});
	};

	// fabricAPI.getStream = function(id_stream) {
	fabricAPI.getStream = function(tenant_code, virtualentity_code, stream_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_STREAM_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + '/?callback=JSON_CALLBACK'
		});
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
			url : Constants.API_SERVICES_VIRTUALENTITY_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
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
});


appServices.factory('webSocketService', function($rootScope, WEB_SOCKET_BASE_URL, WEB_SOCKET_USER, WEB_SOCKET_SECRET) {
	var stompClient = {};	
//	var self = this;
	var root = $rootScope;
	var connectedFlag = false;
	var SingletonClient = null;
	var selfCallback = null;
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
		selfCallback=updateStatus;
		CancelAllSubscriptions();

		/*
		 * Fai la disconnect
		 */

		if(connectedFlag){
			stompClient.disconnect(function(){
				connectedFlag=false;
			});
		}


		updateStatus(Constants.WEBSOCKET_CONNECTING);
		stompClient = Stomp.client(WEB_SOCKET_BASE_URL);

		stompClient.connect(user, password, function(frame) {
			connectedFlag=true;
			updateStatus(Constants.WEBSOCKET_CONNECTED);
			root.$apply(function() {
				on_connect.apply(stompClient, frame);
			});
		}, function(frame) {			
			if (count<5) {
				console.debug("Tentativo di riconnessione numero : ",count);
				updateStatus(Constants.WEBSOCKET_CONNECTING);
				setTimeout(function(){ new ConnectTheSocket(on_connect, on_error, vhost,++count,updateStatus);},count*1000);
				console.debug("awake.. ");		         	       
			} else{
				updateStatus(Constants.WEBSOCKET_NOT_CONNECTED);
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
		selfCallback(Constants.WEBSOCKET_CONNECTED);
		var subscribedClient = stompClient.subscribe(queue, function() {
			selfCallback(Constants.WEBSOCKET_CONNECTED);//if I receive a message It means I'm connected
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
		updateStatus(Constants.WEBSOCKET_CONNECTING);
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
			updateStatus(Constants.WEBSOCKET_CONNECTED);
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
				updateStatus(Constants.WEBSOCKET_CONNECTING);
				console.debug("createClient count ::::::::::::: ",count);    						       
				setTimeout(function(){createClient(intSettings,++count);},count*1000);
				console.debug("awake.. ");		         	       
			} else{
				updateStatus(Constants.WEBSOCKET_NOT_CONNECTED);
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
				updateStatus(Constants.WEBSOCKET_CONNECTING);
				clientInstance = createClient(settings,1,updateStatus);              	  
			}
			return clientInstance;
		}
	};
})();

appServices.factory('readFilePreview', function($q) {
	return {
		readFile: function (file, previewSize, encoding) {
			var deferread = $q.defer();
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				console.log("file", file);
				if ((file !== undefined) && (file !== null)) {
					reader.onload = function (event) {

						deferread.resolve(event.target.result);
					};
					var firstBytes = file.slice(0, previewSize + 1);
					reader.readAsText(firstBytes, encoding);
				}else{
					console.log("reject", file);
					deferread.reject("You need to pass a file.");
				}
			}else{
				deferread.reject("Your browser don't support File api.");
			}

			return deferread.promise;
		}
	};
});



appServices.factory('fabricAPImanagement', function($http, $q) {

	var fabricAPI = {};

	fabricAPI.getDatasets = function(tenant_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getDataset = function(tenant_code, dataset_id) {
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_URL+ tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK'
		});
	};



	fabricAPI.createDataset = function(tenant_code, dataset) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Dataset", dataset);
		$http.post(Constants.API_MANAGEMENT_DATASET_URL + tenant_code + '/', dataset).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.updateDataset = function(tenant_code, dataset_id, dataset) {
		var deferred = $q.defer();
		var resultData = null;

		$http.put(Constants.API_MANAGEMENT_DATASET_URL+ tenant_code + '/' + dataset_id, dataset).success(function(responseData) {
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


