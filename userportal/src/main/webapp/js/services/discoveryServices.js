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

	dataDiscovery.loadStreamDetail = function(tenant_code, virtualentity_code, stream_code){
		
		//Streams?$expand=Dataset&$format=json&$filter=(smartOCode eq 'f8b8bd31-f37c-5a97-9cca-bd2f0f2c8c73'  and  'T' eq streamCode  )

		var filters = [];
		
		if(tenant_code && tenant_code!=null)
			filters.push(" tenantCode eq '" + tenant_code + "' ");
		if(virtualentity_code && virtualentity_code!=null)
			filters.push(" smartOCode eq '" + virtualentity_code + "' ");
		if(stream_code && stream_code!=null)
			filters.push(" streamCode eq '" + stream_code + "' ");
		var filter = "";
		if(filters.length>0)
			filter = "&$filter=("+filters.join(" and ")+")";
		
		var URLBaseQuery = Constants.API_DISCOVERY_DATASET_URL + "Streams?$expand=Dataset&$format=json" + filter;
		console.debug("dataDiscovery.loadStreamDetail URL : ",URLBaseQuery);
		return $http({
			method : 'GET',
			url:URLBaseQuery
//			url : "http://int-api.smartdatanet.it/datadiscovery/SmartDataServiceDiscoveryServlet.svc/Datasets(1)?$format=json&$expand=Fields"
		});

	};
	
	
	
	
	
	
	
	
	//http://localhost:8080/userportal/api/proxy/discovery/ Datasets?&$format=json&$filter=(%20tags%20%20eq%20%20%27acqua%27%20and%20%20tenantCode%20%20eq%20%20%27sandbox%27)
	
	
	
	dataDiscovery.findDatasets = function(domain, taglist, skip, top, orderby) {

		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var datasetsUrl = Constants.API_DISCOVERY_DATASET_URL+"Datasets?$format=json";
		
		var filter = "";
		var filters = [];
		if(domain && domain!=null){
			filters.push("dataDomain eq '" + domain +"'");
		}
		if(taglist && taglist!=null && taglist.length>0){
			var tags = taglist.join(",");
			filters.push("tags eq '" + tags +"'");
		}
		if(filters.length>0){
			filter =  filters.join(" and ");
			datasetsUrl += '&$filter='+filter;
		}

		if(skip && skip!=null)
			datasetsUrl += '&$skip='+skip;
		if(top && top!=null)
			datasetsUrl += '&$top='+top;
		if(orderby && orderby!=null)
			datasetsUrl += '&$orderby='+orderby;
		
		//var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : datasetsUrl
//			headers: {
//				'Authorization': user
//				},
//			withCredentials : true
		});
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return dataDiscovery;
});


