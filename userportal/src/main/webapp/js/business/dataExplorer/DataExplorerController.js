appControllers.controller('DataExplorerCtrl', [ '$scope', '$routeParams', 'fabricAPImanagement', 'odataAPIservice', '$filter', 'info',
                                                     function($scope, $routeParams, fabricAPImanagement, odataAPIservice, $filter, info) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;
	$scope.downloadCsvUrl = Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

	$scope.currentSidebar = 'none';

	$scope.dataset = null;
	$scope.stream = null;
	$scope.errors = [];
	
	var allFields = {};

	var operators_number = [{"value":"eq", "label":"=", "valueDelimiter": "", "isFunction": false},
			                   {"value":"ne", "label":"!=", "valueDelimiter": "", "isFunction": false},
		                       {"value":"ge", "label":">=", "valueDelimiter": "", "isFunction": false},
		                       {"value":"gt", "label":">", "valueDelimiter": "", "isFunction": false},
			                   {"value":"lt", "label":"<", "valueDelimiter": "", "isFunction": false},
			                   {"value":"le", "label":"<=", "valueDelimiter": "", "isFunction": false}];

	var operators_string = [{"value":"eq", "label":"equals", "valueDelimiter": "'", "isFunction": false},
	                        {"value":"startswith", "label":"start with", "valueDelimiter": "'", "isFunction": true},
	                        {"value":"endswith", "label":"end with", "valueDelimiter": "'", "isFunction": true},
	                        {"value":"substringof", "label":"contains", "valueDelimiter": "'", "isFunction": true}];

	var operators_boolean = [{"value":"eq", "label":"="}];


	
	
	$scope.loadDataset = function(){
		console.debug("$scope.datasetCode", $scope.datasetCode);
		allFields = {};
		
		
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.datasetCode).success(function(response) {
			$scope.errors = [];
			try{
				console.debug("loadDataset- response",response);
				$scope.apiMetdataUrl = response.apiMetadataUrl;
				$scope.dataset = response.metadata;
				$scope.stream = response.stream;
				$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
				if(!$scope.dataset)
					$scope.dataset = new Object();
				if(!$scope.dataset.info)
					$scope.dataset.info = new Object();
				if(!$scope.dataset.info.tags)
					$scope.dataset.info.tags = [];

				if(!$scope.dataset.info.icon || $scope.dataset.info.icon == null)
					$scope.dataset.info.icon  = "img/dataset-icon-default.png";
				
				
				allFields["streamCode"] = {"fieldName": "streamCode", "dataType": "string", "operators": operators_string};
				allFields["sensor"] = {"fieldName": "sensor", "dataType": "string", "operators": operators_string};
				allFields["time"] = {"fieldName": "time", "dataType": "date", "operators": operators_number};
				allFields["internalId"] = {"fieldName": "internalId", "dataType": "string", "operators": operators_string};
				allFields["datasetVersion"] = {"fieldName": "datasetVersion", "dataType": "long", "operators":operators_number};
				allFields["idDataset"] = {"fieldName": "idDataset", "dataType": "string", "operators": operators_string};
				
				for ( var fieldIndex in $scope.dataset.info.fields) {
					var field = $scope.dataset.info.fields[fieldIndex];
					var operators = operators_number;
					if(field.dataType == "string")
						operators = operators_string;
					else if(field.dataType == "boolean")
						operators = operators_boolean;
					
					allFields[field.fieldName] = {"fieldName": field.fieldName, "dataType": field.dataType,"operators": operators};
				}

				
				$scope.loadData();
			} catch (e) {
				var error = {"message":"Cannot load dataset","detail":"Error while loading dataset "+ $scope.datasetCode};
				$scope.errors.push(error);
				console.error("getDataset ERROR", e);
			};
		});

	};

	$scope.loadDataset();
	
	var dataForPage = 15;
	$scope.showLoading = true;


	$scope.totalFound = null;
	$scope.usedFilter = "-";
	$scope.dataList = [];
	$scope.columns = [];
	$scope.currentPage = 1;
	$scope.orderBy = {"column":"time", "order": "desc"};


	
	
	$scope.filters = [];
	
	$scope.selectPage = function() {
		$scope.loadData();
	};	

	$scope.orderResult = function(column, order) {
		console.log("orderResult",column, order);
		if(order && order!='none')
			$scope.orderBy = {"column":column, "order": order};
		else
			$scope.orderBy = {"column":"time", "order": "desc"};

		$scope.loadData();
	};	

	$scope.removeFilter = function($index){
		console.log("removeFilter", $index);
		$scope.filters.splice($index,1);
	};
	
	$scope.addFilter = function(){
		console.log("add filter", $scope.newFilterOperator);
		console.log("$scope.newFilterValue", $scope.newFilterValue);
		$scope.filters.push({"column":$scope.newFilterColumn.label,"operator":$scope.newFilterOperator,"value":$scope.newFilterValue});
		$scope.newFilterColumn = null;
		$scope.newFilterOperator = null;
		$scope.newFilterValue = null;
	};
	
	$scope.loadData = function(){
		
		// call oData service to retrieve  the last 30 data
		$scope.errors = [];

		var collection = 'Measures';

		var start = ($scope.currentPage -1)*dataForPage;
		$scope.dataList = [];
		$scope.columns = [];
		
		$scope.showLoading = true;
		
		var sort = $scope.orderBy.column + "%20" + $scope.orderBy.order;
		if($scope.orderBy.order == 'none')
			sort = "time%20desc";
		console.log("loadData", $scope.datasetCode, start, dataForPage,sort,collection);
		
		var filterParam = null;
		$scope.usedFilter = "-";
		if($scope.filters!=null && $scope.filters.length>0){
			$scope.usedFilter = "";
			filterParam = ""; //time ge datetimeoffset'2014-12-01T07:00:00+01:00' and time lt datetimeoffset'2014-12-01T07:15:00+01:00'
			for (var j = 0; j < $scope.filters.length; j++) {
				var filter = $scope.filters[j];
				console.log("filter", filter);
				if(filter.operator.isFunction){  // filter=substringof(Name, 'urn')
					filterParam += filter.operator.value + "(" +filter.column + "," + filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter+")";
				}
				else{//filter= Entry_No gt 610
					filterParam += filter.column + " " + filter.operator.value + " " +filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter;
				}
				$scope.usedFilter += filter.column + " " + filter.operator.label + " " + filter.value;
				if(j < $scope.filters.length-1){
					$scope.usedFilter += ", ";
					filterParam += " and ";
				}
			}
		}
		
		console.log("filterParam", filterParam);
		
		odataAPIservice.getStreamData($scope.datasetCode, filterParam, start, dataForPage,sort,collection).success(function(response) {
			console.log("odataAPIservice.getStreamData",response, collection);
			$scope.totalFound = response.d.__count;
			var oDataResultList = response.d.results;
			
			$scope.showLoading = false;

			
			if(oDataResultList.length >0){
				var firstRow = true;
				for (var oDataIndex = 0; oDataIndex < oDataResultList.length; oDataIndex++) {
					var oDataResult = oDataResultList[oDataIndex];
					var data = {};
					for (var property in oDataResult) {
						if(property!="__metadata"){
							var value = oDataResult[property];
							var field = allFields[property];
							
							if(field.dataType == "date"){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
								data[property] = d;
							}
							else
								data[property] = value;
							
//							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
//								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
//								data[property] = d;
//							}
//							else
//								data[property] = value;
						    
						    if(firstRow){
						    	var order = 'none';
						    	console.log("firsRow",$scope.orderBy.column, property);
						    	
						    	var showOrderButton = $scope.totalFound<Constants.ODATA_MAX_RESULT_SORTABLE?true:false;
						    	if(property == 'time')
						    		showOrderButton = true;
						    	
						    	
						    	if($scope.orderBy.column == property)
						    		order = $scope.orderBy.order;
						    	var column = {"label":property, "order": order, "showOrderButton": showOrderButton, "operators": field.operators, "dataType":field.dataType};
						    	console.log("firsRow",column);
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


} ]);

