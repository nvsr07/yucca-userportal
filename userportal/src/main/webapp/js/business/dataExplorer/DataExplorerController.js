appControllers.controller('DataExplorerCtrl', [ '$scope', '$routeParams', 'odataAPIservice', 'dataDiscoveryService', '$filter', 'info', '$location', '$modal', 
                                                     function($scope, $routeParams, odataAPIservice, dataDiscoveryService, $filter, info,$location, $modal) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		return env;
	};
	
	

	$scope.currentSidebar = 'none';
	
	$scope.dataset = null;
	$scope.stream = null;
	$scope.errors = [];
	
	$scope.columnsForFilter = [];
	
	

	var operators_date = [{"value":"eq", "label":"=", "valueDelimiter": "", "isFunction": false, "isDate": true},
			                   {"value":"ne", "label":"!=", "valueDelimiter": "", "isFunction": false, "isDate": true},
		                       {"value":"ge", "label":">=", "valueDelimiter": "", "isFunction": false, "isDate": true},
		                       {"value":"gt", "label":">", "valueDelimiter": "", "isFunction": false, "isDate": true},
			                   {"value":"lt", "label":"<", "valueDelimiter": "", "isFunction": false, "isDate": true},
			                   {"value":"le", "label":"<=", "valueDelimiter": "", "isFunction": false, "isDate": true}];

	var operators_number = [{"value":"eq", "label":"=", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                   {"value":"ne", "label":"!=", "valueDelimiter": "", "isFunction": false, "isDate": false},
		                       {"value":"ge", "label":">=", "valueDelimiter": "", "isFunction": false, "isDate": false},
		                       {"value":"gt", "label":">", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                   {"value":"lt", "label":"<", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                   {"value":"le", "label":"<=", "valueDelimiter": "", "isFunction": false, "isDate": false}];

	var operators_string = [{"value":"eq", "label":"equals", "valueDelimiter": "'", "isFunction": false, "isDate": false},
	                        {"value":"startswith", "label":"start with", "valueDelimiter": "'", "isFunction": true, "isDate": false},
	                        {"value":"endswith", "label":"end with", "valueDelimiter": "'", "isFunction": true, "isDate": false},
	                        {"value":"substringof", "label":"contains", "valueDelimiter": "'", "isFunction": true, "isDate": false}];

	var operators_boolean = [{"value":"eq", "label":"=", "isFunction": false, "isDate": false}];


	
	var datasetType = "";
	var defaultOrderByColumn = "internalId";

	$scope.queryOdataLink = "-";
	
	$scope.loadMetadata = function(){
		odataAPIservice.getMetadata($scope.datasetCode).success(function(response) {
			console.log("odataAPIservice.getMetadata - xml",response);
			var x2js = new X2JS();
			var metadataJson =  x2js.xml_str2json(response);
			console.log("odataAPIservice.getMetadata - json",metadataJson);
			

			if ($scope.dataset.Stream == null)
			{
				$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/all";  
			}
			else 
			{
				$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/current";  
			}

			
			
			var measuresMetadata ="";
			var entityType = metadataJson.Edmx.DataServices.Schema.EntityType;
			if(entityType!=null && entityType.constructor === Array)
				measuresMetadata = metadataJson.Edmx.DataServices.Schema.EntityType[0];		
			else
				measuresMetadata = metadataJson.Edmx.DataServices.Schema.EntityType;		
			
			console.log("odataAPIservice.getMetadata - metadata",metadataJson);
			var entitySet = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet;
			
			
			if(entitySet !=null && entitySet.constructor === Array)
				datasetType = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet[0]._Name;
			else
				datasetType = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet._Name;

			defaultOrderByColumn = "internalId";

			for (var k = 0; k < measuresMetadata.Property.length; k++) {
				var prop = measuresMetadata.Property[k];
				var dataType = Helpers.odata.decodeDataType(prop["_Type"]);
				var operators = operators_number;
				switch (dataType) {
				case "string":
					operators = operators_string;					
					break;
				case "boolean":
					operators = operators_boolean;					
					break;
				case "date":
					operators = operators_date;					
					break;
				default:
					operators = operators_number;
					break;
				}
								
				$scope.columnsForFilter.push({"label": prop["_Name"], "operators": operators, "dataType":dataType});
				if(prop["_Name"]=="time"){
					defaultOrderByColumn = "time";
				}
				$scope.orderBy.column = defaultOrderByColumn;
			}
			
			console.log("$scope.columnsForFilter",$scope.columnsForFilter);
			$scope.queryOdataLink = "/userportal/api/proxy/odata/ds_Contgreciaon_201/Measures?$format=json&$top=15&$orderby=time%20desc";

			$scope.loadData();

		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

			var detail = "";
			var error = {"message":"Cannot load metadatadata","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	// http://localhost:8080/userportal/api/proxy/discovery/Datasets?$format=json&$filter=datasetCode%20eq%20%27ds_Provatime_14%27&$top=12
	$scope.loadDataset = function(){

		dataDiscoveryService.loadDatasetDetailFromDatasetCode($scope.datasetCode).success(function(response) {
			$scope.errors = [];
			try{
				console.debug("loadDataset- response",response);
				$scope.dataset = response.d.results[0];
				
				$scope.dataset.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/"+$scope.dataset.tenantCode+"/"+$scope.dataset.datasetCode;
				if($scope.dataset.tags!=null ){
					$scope.dataset.tagsArray = $scope.dataset.tags.split(",");
				}


				//$scope.loadMetadata();
			} catch (e) {
				var error = {"message":"Cannot load dataset","detail":"Error while loading dataset "+ $scope.datasetCode};
				//$scope.errors.push(error);
				console.error("getDataset ERROR",error, e);
			};
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

//			var detail = "";
//			var error = {"message":"Cannot load dataset","detail":detail};
			//$scope.errors.push(error);

		});
	};
	
	$scope.loadMetadata();

	$scope.loadDataset();
	
	var dataForPage = 15;
	$scope.showLoading = true;


	$scope.totalFound = null;
	$scope.usedFilter = "-";
	$scope.dataList = [];
	$scope.columns = [];
	$scope.currentPage = 1;
	$scope.orderBy = {"column":"internalId", "order": "desc"};
	$scope.addFilterError = null;


	
	
	$scope.filters = [];
	
	$scope.selectPage = function() {
		$scope.loadData();
	};	

	$scope.orderResult = function(column, order) {
		console.log("orderResult",column, order);
		if(order && order!='none')
			$scope.orderBy = {"column":column, "order": order};
		else
			$scope.orderBy = {"column":defaultOrderByColumn, "order": "desc"};

		$scope.loadData();
	};	

	$scope.removeFilter = function($index){
		$scope.addFilterError = null;
		console.log("removeFilter", $index);
		$scope.filters.splice($index,1);
	};
	
	$scope.addFilter = function(){
		$scope.addFilterError = null;
		if($scope.newFilterColumn && $scope.newFilterColumn!=null && $scope.newFilterColumn.label!=null && $scope.newFilterColumn.label!='' &&
			$scope.newFilterOperator!=null && $scope.newFilterOperator!=''  &&
			$scope.newFilterValue!=null && $scope.newFilterValue!='' ){
				$scope.filters.push({"column":$scope.newFilterColumn.label,"operator":$scope.newFilterOperator,"value":$scope.newFilterValue});
				$scope.newFilterColumn = null;
				$scope.newFilterOperator = null;
				$scope.newFilterValue = null;
		}
		else{
			$scope.addFilterError = "DATA_EXPLORER_FILTER_ADD_FILTER_ERROR_MISSING_FIELDS";
		}
	};
	
	
	$scope.loadData = function(){
		
		// call oData service to retrieve  the last 30 data
		$scope.errors = [];

//		var collection = 'Measures';

		var start = ($scope.currentPage -1)*dataForPage;
		$scope.dataList = [];
		$scope.columns = [];
		
		$scope.showLoading = true;
		
		var sort = $scope.orderBy.column + "%20" + $scope.orderBy.order;
		console.log("defaultOrderByColumn", defaultOrderByColumn);
		if($scope.orderBy.order == 'none')
			sort = defaultOrderByColumn +"%20desc";
		
		console.log("loadData", $scope.datasetCode, start, dataForPage,sort,datasetType);
		
		var filterParam = null;
		$scope.usedFilter = "-";
		if($scope.filters!=null && $scope.filters.length>0){
			$scope.usedFilter = "";
			filterParam = ""; //time ge datetimeoffset'2014-12-01T07:00:00+01:00' and time lt datetimeoffset'2014-12-01T07:15:00+01:00'
			for (var j = 0; j < $scope.filters.length; j++) {
				var filter = $scope.filters[j];
				console.log("filter", filter);
				
				if(filter.operator.isDate){ // time ge datetimeoffset'2014-08-01T07:00:00+01:00'
					var d = new Date(filter.value);
					var dateToParam =  d.getFullYear() + "-"+ (d.getMonth()+1) + "-" + d.getDate() + 'T' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() +"%2B00:00";
					filterParam += filter.column + " " + filter.operator.value + " datetimeoffset'"+ dateToParam + "'";
				}else if(filter.operator.isFunction){  // filter=substringof(Name, 'urn')
					filterParam += filter.operator.value + "(" +filter.column + "," + filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter+")";
				}
				else{//filter= Entry_No gt 610
					filterParam += filter.column + " " + filter.operator.value + " " +filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter;
				}
				
				
				$scope.usedFilter += filter.column + " " + filter.operator.label + " " + filter.value;
				if(j < $scope.filters.length-1){
					$scope.usedFilter += "<span class=' panel-dataexplorer-topbar-separator'>-</span>";
					filterParam += " and ";
				}
			}
		}
		
		console.log("filterParam", filterParam);

		$scope.queryOdataLink = createQueryOdata($scope.datasetCode, filterParam, start, dataForPage,sort,datasetType);
		
		odataAPIservice.getStreamData($scope.datasetCode, filterParam, start, dataForPage,sort,datasetType).success(function(response) {
			console.log("odataAPIservice.getStreamData",response, datasetType);
			$scope.totalFound = response.d.__count;
			var oDataResultList = response.d.results;
			
			$scope.showLoading = false;

			
			if(oDataResultList.length >0){
				var firstRow = true;
				for (var oDataIndex = 0; oDataIndex < oDataResultList.length; oDataIndex++) {
					var oDataResult = oDataResultList[oDataIndex];
					var data = {};
					var baseBinaryUrl = "";
					if(typeof oDataResult["Binaries"] !== 'undefined' && oDataResult["Binaries"]!=null){
						baseBinaryUrl = $scope.datasetCode + "/DataEntities('"+oDataResult["internalId"]+"')/Binaries";// oDataResult["Binaries"].__deferred.uri;
					}
					for (var property in oDataResult) {
						if(property!="__metadata" && property!="Binaries"){
							var value = oDataResult[property];
							var isBinary = false;
							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
								data[property] =  {"value":d, "isBinary": false};
							}
							else if(value && value!=null  && typeof value["idBinary"] !== 'undefined' && value["idBinary"]!=null){
								data[property] = {"value":value["idBinary"], "isBinary": true, "binaryBaseUrl": baseBinaryUrl};
								isBinary = true;
							}
							else
								data[property] = {"value":value, "isBinary": false};

							/*var field = allFields[property];
							
							if(field.dataType == "date"){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
								data[property] = d;
							}
							else
								data[property] = value;*/
							
						    if(firstRow){
						    	var order = 'none';
						    	
						    	var showOrderButton = $scope.totalFound<Constants.ODATA_MAX_RESULT_SORTABLE?true:false;
						    	if(isBinary)
						    		showOrderButton = false;
						    	else if(property == defaultOrderByColumn)
						    		showOrderButton = true;
						    	
						    	
						    	if($scope.orderBy.column == property)
						    		order = $scope.orderBy.order;
						    	var column = {"label":property, "order": order, "showOrderButton": showOrderButton, "showBinaryIcon":isBinary};//, "operators": field.operators, "dataType":field.dataType};
						    	$scope.columns.push(column);
						    }
						}
					}
			    	firstRow=false;
					$scope.dataList.push(data);
				};
				
			};
			
			
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

			var detail = ""+ response.error.code + " - " + response.error.message.value;
			var error = {"message":"Cannot load data","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	var createQueryOdata = function(stream_code, filter, skip, top, orderby, collection){
		
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));

		var streamDataUrl = "http://"+env+"api.smartdatanet.it/api/"+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		return streamDataUrl;

	};
	
	
	

	$scope.loadBinaryDetail = function(rowNum, column){
		console.log("loadBinaryDetail",rowNum,  column, $scope.dataList[rowNum][column]);
		$scope.dataList[rowNum][column].showBinaryDetail = true;
		$scope.dataList[rowNum][column].loadingBinaryDetail = true;
		odataAPIservice.getBinaryAttachData($scope.dataList[rowNum][column].binaryBaseUrl,$scope.dataList[rowNum][column].value).success(function(response) {
			console.log("getBinaryAttachData",response);
			$scope.dataList[rowNum][column].loadingBinaryDetail = false;
			if(response.d.results.length>0){
				$scope.dataList[rowNum][column].binaryDetail = response.d.results[0];
				if(typeof $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary !== 'undefined' && $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary!=null &&
					$scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary.length>4){
					// urlDownloadBinary -> /api/Binariomerco_154/attachment/153/1/provaDav remove /api
					$scope.dataList[rowNum][column].binaryDetail.absoluteUrlDownloadBinary =   Constants.API_ODATA_URL + $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary.substring(5);
					console.log("absoluteUrlDownloadBinary",$scope.dataList[rowNum][column].binaryDetail.absoluteUrlDownloadBinary);
				}
			}
			else{
				$scope.dataList[rowNum][column].noBinaryFound =true;
			}
		});
				
	};
	
	$scope.hasBinaryPreview = function(contentTypeBinary){
		var mediaType = Helpers.util.getMediaTypeFromContentType(contentTypeBinary);
		return mediaType == 'image' || mediaType == 'video' || mediaType == 'audio'; 
	};
	
	$scope.previewBinary  = function(binary, type){
		console.log("previewBinary",binary);
	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'dataexplorerPreviewBinary.html',
	      controller: 'DataExplorerPreviewBinaryCtrl',
	      size: 'lg',
	      resolve: {
	    	  binaryPreview: function () {
	    		  return binary;
	    	  }, 
	    	  previewType : function(){
	        	return type;
	    	  }
	      }
	    });
	};


} ]);


appControllers.controller('DataExplorerPreviewBinaryCtrl', [ '$scope', '$modalInstance', 'binaryPreview','previewType', function ($scope, $modalInstance, binaryPreview, previewType) {
	console.log("DataExplorerPreviewBinaryCtrl - binaryPreview", binaryPreview, previewType);
	$scope.binaryPreview = binaryPreview;	
	var mediaType = Helpers.util.getMediaTypeFromContentType(binaryPreview.contentTypeBinary);
	console.log("mediaType",mediaType);
	$scope.isImage = function(){
		return previewType!='metadata' && mediaType == 'image'; 
	};
	
	$scope.isVideo = function(){
		return previewType!='metadata' && mediaType == 'video'; 
	};

	$scope.isAudio = function(){
		var isAudio = previewType!='metadata' && mediaType == 'audio';
		console.log("isAudio",isAudio);
		return previewType!='metadata' && mediaType == 'audio'; 
	};
	
	$scope.isHtml = function(){
		return previewType!='metadata' && binaryPreview.contentTypeBinary == 'text/html'; 
	};
	
	$scope.isXml = function(){
		return previewType!='metadata' && (binaryPreview.contentTypeBinary == 'text/xml' || binaryPreview.contentTypeBinary == 'application/xml') ; 
	};

	$scope.isTxt = function(){
		return previewType!='metadata' && mediaType == 'text' ; 
	};

	$scope.isPdf = function(){
		return previewType!='metadata' && (binaryPreview.contentTypeBinary == 'application/pdf' || binaryPreview.contentTypeBinary == 'application/xml') ; 
	};

	
	$scope.showInIFrame = function(){
		return $scope.isXml() || $scope.isXml() || $scope.isHtml() || $scope.isPdf() || $scope.isTxt();
	};


	$scope.isMetadata = function(){
		return previewType=='metadata';
	};
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

appControllers.controller('DataBrowserCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'dataDiscoveryService', '$location', '$filter', '$http',  'info', 'dataexplorerBrowseData',
                                                function($scope, $routeParams, fabricAPIservice, dataDiscoveryService, $location, $filter,  $http, info,dataexplorerBrowseData) {
	
	$scope.currentStep = 'domains';
	$scope.browseSteps = [{'name':'domains', 'style':''},
	                      {'name':'tags', 'style':''},
	                      {'name':'results', 'style':''}];
	
	$scope.stepTitle='DATABROWSER_CHOOSE_DOMAIN_TITLE';
		
	$scope.goToChooseDomains  = function(){ 
		$scope.selectedDomain = null;
		$scope.selectedTags = [];
		$scope.queryInput = null;
		dataexplorerBrowseData.setSearchResult(null);
		fromBackButton = false;
		$scope.currentStep = 'domains'; 
		$scope.stepTitle='DATABROWSER_CHOOSE_DOMAIN_TITLE';
	};
	
	$scope.goToChooseTags  = function(clearDomain){ 
		if(clearDomain) 
			$scope.selectedDomain = null; 
		dataexplorerBrowseData.setSearchResult(null);
		fromBackButton = false;
		$scope.currentStep = 'tags'; 
		$scope.stepTitle='DATABROWSER_CHOOSE_TAG_TITLE';
	};
	
	var searchType = "";
	$scope.goToResults  = function(searchTypeParam){ 
		
		$scope.currentStep = 'results';
		
		$scope.stepTitle='DATABROWSER_RESULTS_TITLE';
		$scope.currentPage = 1;
		dataexplorerBrowseData.setSearchResult(null);
		fromBackButton = false;
		searchType  = searchTypeParam;
		$scope.selectPage(1);
	};

	$scope.domainList = [];
	//$scope.selectedDomains = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
		
		$scope.domainList.sort();
	});
	
	
	//TODO manage sort in table results
	//	var sortColumn = null;
	//	var sortOrder = "desc";
	//	$scope.orderResult = function(column, order) {
	//		console.log("orderResult",column, order);
	//		if(order && order!='none'){
	//			//$scope.orderBy = {"column":column, "order": order};
	//			sortColumn = column;
	//			sortOrder = order;
	//		}
	//		else{
	//			//$scope.orderBy = {"column":defaultOrderByColumn, "order": "desc"};
	//			sortColumn = null;
	//			sortOrder = "desc";
	//		}
	//		$scope.datasetList.sort(compare);
	//		if(sortOrder == "desc"){
	//			$scope.datasetList.reverse();
	//		}
	//		//$scope.loadData();
	//	};	
	//	
	//	
	//	function compare(a,b) {
	//		if(typeof a !=  'undefined' && a!=null  && typeof b !=  'undefined' && b!=null && sortColumn!=null)
	//		  if (a[sortColumn] < b[sortColumn])
	//		    return -1;
	//		  if (a[sortColumn] > b[sortColumn])
	//		    return 1;
	//		  return 0;
	//	}

	$scope.selectDomain = function(domain){
		$scope.selectedDomain = domain;
		$scope.datasetList = [];
		$scope.goToResults("browse");

		//$scope.goToChooseTags();
	};
	
	$scope.tagList = [];
	$scope.selectedTags = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
		$scope.tagList.sort();
	});

	$scope.isTagSelected = function(tag){
		return Helpers.util.arrayContainsString(tag,  $scope.selectedTags);
	};
	
	$scope.selectTag = function(tag){
		console.log(tag);
		var tagIndex  = $scope.selectedTags.indexOf(tag);
		if(tagIndex>-1)
			$scope.selectedTags.splice(tagIndex, 1);
		else
			$scope.selectedTags.push(tag);
	};
	
	
	
	
	$scope.currentPage = 1;
	var datasetForPage = 12;
	$scope.isNavigation = false;
	$scope.showNavigationLoading = false;
	$scope.showSearchLoading = false;

	$scope.totalFound = null;
	$scope.resultViewType = 'box';

	$scope.datasetList = [];

	var fromBackButton = false;
	$scope.selectPage = function(currentPage) {
		
		if(!fromBackButton){
			$scope.currentPage = currentPage;
			switch (searchType) {
				case 'query':
					$scope.selectedDomain = null;
					$scope.selectedTags = [];
					$scope.datasetList = [];
					searchStart = 0;
					$scope.search();
					break;
				default:
					$scope.inputQuery = null;
					$scope.selectedTags = [];
					$scope.datasetList = [];
					searchStart = 0;
					$scope.search();
					break;
			}
		}else
			fromBackButton = false;
	};	

	$scope.columns = [];
	var order = 'none';
	
	$scope.columns.push({"label":"DATASET", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_DATADOMAIN", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_TAGS", "order": order, "showOrderButton": false});
	$scope.columns.push({"label":"DATASET_FIELD_CONFIGDATA_TENANT", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_LICENSE", "order": order, "showOrderButton": false});

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		if(host=='localhost')
			env = "int-";
		return env;
	};
	

	var cleanMetadata = function(data){
		if(typeof data["description"] === "undefined" || data["description"]==null)
			data["description"] = "";
		
		if(typeof data["license"] === "undefined" || data["license"]==null)
			data["license"] = "";
		
		if(typeof data["disclaimer"] === "undefined" || data["disclaimer"]==null)
			data["disclaimer"] = null;
		
		if(typeof data["copyright"] === "undefined" || data["copyright"]==null)
			data["copyright"] = null;

    	//if(!data["datasetIcon"] || data["datasetIcon"] == null)
    	//	data["datasetIcon"] = "img/stream-icon-default.png";
    	//data.datasetIcon = "http://"+getEnvirorment() + "userportal.smartdatanet.it"+data.thumbnailurl;
		//data.datasetIcon = Constants.API_RESOURCES_URL + "dataset/icon/"+data.tenantCode+"/"+data.datasetCode;
    	
    	return data;
	};
	
	$scope.errors = [];

	$scope.findDatasets = function(){
		// call oData service to retrieve  the last 30 data
		$scope.isNavigation = true;
		$scope.errors = [];

		var start = ($scope.currentPage -1)*datasetForPage;
		var sort = null;
		$scope.datasetList = [];
		
		$scope.showNavigationLoading = true;
		
		
		dataDiscoveryService.findDatasets($scope.selectedDomain, $scope.selectedTags, start, datasetForPage, sort).success(function(response) {
			console.log("dataDiscoveryService.findDatasets",response);
			$scope.totalFound = response.d.__count;
			$scope.showNavigationLoading = false;
			var datasetResultList = response.d.results;

			if(datasetResultList.length >0){
				for (var datasetIndex = 0; datasetIndex < datasetResultList.length; datasetIndex++) {
					var oDataResult = datasetResultList[datasetIndex];
					var data = {};
					for (var property in oDataResult) {
						if(property!="__metadata"){
							var value = oDataResult[property];
							if(typeof value == "undefined" || value==null)
								value = "";
							
							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
								data[property] = d;
							}
							else
								data[property] = value;
							
							if(property=="tags" && value!=null) {
								data[property] = value.split(",");
							}
							
						}
					}
			    	firstRow=false;
			    	if(data.Stream && data.Stream!=null && data.Stream.smartOName && data.Stream.smartOName!=null)
			    		data.customDescription = data.Stream.smartOName;
			    	else{
			    		data.customDescription = data.datasetName;
			    		data.datasetName = data.description;
			    	}
					$scope.datasetList.push(cleanMetadata(data));
				};
				
			};
			
			var searchResult = {};
			searchResult.currentPage = $scope.currentPage;
			searchResult.searchType = 'browse';
			searchResult.datasetList = $scope.datasetList;
			searchResult.selectedDomain = $scope.selectedDomain;
			searchResult.selectedTags = $scope.selectedTags;
			searchResult.totalFound = $scope.totalFound;
			searchResult.queryInput = $scope.queryInput;

			
			dataexplorerBrowseData.setSearchResult(searchResult);

		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showNavigationLoading = false;

			var detail = ""+ response.error.code + " - " + response.error.message.value;
			var error = {"message":"Cannot load dataset","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	$scope.exploreData = function(data){
		console.log("exploreData", data);
		$location.path('dataexplorer/'+data.tenantCode+'/'+data.datasetCode);

	};
	
	$scope.openDetail = function(data){
		console.log("exploreData", data);
		var path = 'dataexplorer/' +  data.type+ '/' + data.tenantCode+'/';
		switch (data.type) {
		case "stream":
			path += data.virtualentityCode + '/' + data.streamCode;
			break;
		default:
			path += data.datasetCode;
			break;
		}
		$location.path(path);
	};
	
	var searchStart = 0;
	var searchPage = 12;
	
	$scope.noMoreSearchData = false;
	
	$scope.search = function(){
		$scope.totalFound = null;
		$scope.isNavigation = false;
		console.log("search", $scope.queryInput);
		$scope.showSearchLoading = true;
		$scope.errors = [];
		
		//var start = ($scope.currentPage -1)*datasetForPage;
		
		var transform = function(data){
	        return $.param(data);
	    };
	    
	    var searchParams =  {"action":"searchAPIs","query":$scope.queryInput,"start":searchStart,"end": searchPage};
	    if($scope.selectedDomain!=null){
	    	searchParams =  {"action":"searchAPIs","query":$scope.selectedDomain,"start":searchStart,"end": searchPage};
	    }
	    
		//var searchParams = {"action":"searchAPIs","query":$scope.queryInput,"start":start,"end": datasetForPage};
//		$http({
//			method : 'POST',
//	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//	        transformRequest: transform
//			data:{"action":"searchAPIs","query":queryInput,"start":"0","end": "10"},
//			url : Constants.API_STORE_URL+'site/blocks/search/api-search/ajax/search.jag'
//		})
		$http.post(
//				Constants.API_STORE_URL+'site/blocks/search/api-search/ajax/search.jag',
				'/store/site/blocks/search/api-search/ajax/search.jag',
				searchParams, {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					transformRequest: transform}
	    ).success(function(response) {
			console.log("search response", response);
			$scope.showSearchLoading = false;

			//$scope.datasetList=[];
			$scope.noMoreSearchData = true;
			if(response.result && response.result!=null){
				for (var datasetIndex = 0; datasetIndex < response.result.length; datasetIndex++) {
					var dataFromSearch = response.result[datasetIndex];
					//if(!Helpers.util.endsWith(dataFromSearch.name, "_stream")){
						var data = {};
						
						data.datasetCode = dataFromSearch.name;
						
						if(Helpers.util.endsWith(data.datasetCode, "_odata")){
							data.datasetCode = data.datasetCode.substring(0,data.datasetCode.length-6);
							data.type='dataset';
						}
						else if(Helpers.util.endsWith(data.datasetCode, "_stream")){
							data.datasetCode = data.datasetCode.substring(0,data.datasetCode.length-7);
							data.type='stream';
						}
	
						data.datasetName = dataFromSearch.description;
						data.customDescription = dataFromSearch.extraApiDescription;
						data.description = dataFromSearch.description;
						data.dataDomain = dataFromSearch.extraDomain;
						data.tags = [];
						if(dataFromSearch.Tags!=null){
							data.tags= dataFromSearch.Tags.split(",");
						}
						data.tenantCode = dataFromSearch.extraCodiceTenant;
						data.license = dataFromSearch.extraLicence;
						data.copyright = dataFromSearch.extraCopyright;
						data.disclaimer = dataFromSearch.extraDisclaimer;
						data.streamCode = dataFromSearch.extraCodiceStream;
						data.virtualentityCode = dataFromSearch.extraVirtualEntityCode;

						data.datasetIcon = "http://"+getEnvirorment() + "userportal.smartdatanet.it"+dataFromSearch.thumbnailurl;
						$scope.datasetList.push(cleanMetadata(data));
						$scope.noMoreSearchData = false;
				//	}
				}
				searchStart += searchPage; 
			}
			
			var searchResult = {};
			searchResult.searchStart = searchStart;
			searchResult.searchType = 'query';
			searchResult.datasetList = $scope.datasetList;
			searchResult.queryInput = $scope.queryInput;
			searchResult.selectedDomain = $scope.selectedDomain;

			
			dataexplorerBrowseData.setSearchResult(searchResult);

		}).error(function(response) {
			console.log("search response error", response);
			$scope.showSearchLoading = false;

		});
	};
	
	if(dataexplorerBrowseData.getSearchResult()!=null){
		var searchResult = dataexplorerBrowseData.getSearchResult();

		$scope.currentPage = searchResult.currentPage;
		searchStart = searchResult.searchStart;
		searchType  = searchResult.searchType;
		$scope.selectedDomain = searchResult.selectedDomain;
		$scope.selectedTags = searchResult.selectedTags;
		$scope.queryInput = searchResult.queryInput;
		$scope.totalFound = searchResult.totalFound;


		$scope.datasetList = searchResult.datasetList;

		fromBackButton = true;
		$scope.currentStep = 'results';
		$scope.stepTitle='DATABROWSER_RESULTS_TITLE';
	}

	// https://int-userportal.smartdatanet.it/store/site/blocks/search/api-search/ajax/search.jag -d 'action=searchAPIs&query=grecia&start=0&end=10'
}]);


