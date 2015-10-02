appControllers.controller('DataExplorerCtrl', [ '$scope', '$routeParams', 'fabricAPImanagement', 'odataAPIservice', '$filter', 'info',
                                                     function($scope, $routeParams, fabricAPImanagement, odataAPIservice, $filter, info) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;
	$scope.downloadCsvUrl = Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

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

	
	$scope.loadDataset = function(){
		console.debug("$scope.datasetCode", $scope.datasetCode);
		
		
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
				
				

				$scope.loadMetadata();
			} catch (e) {
				var error = {"message":"Cannot load dataset","detail":"Error while loading dataset "+ $scope.datasetCode};
				$scope.errors.push(error);
				console.error("getDataset ERROR", e);
			};
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

			var detail = "";
			var error = {"message":"Cannot load dataset","detail":detail};
			$scope.errors.push(error);

		});

	};
	
	$scope.loadMetadata = function(){
		odataAPIservice.getMetadata($scope.datasetCode).success(function(response) {
			console.log("odataAPIservice.getMetadata - xml",response);
			var x2js = new X2JS();
			var metadataJson =  x2js.xml_str2json(response);
			console.log("odataAPIservice.getMetadata - json",metadataJson);
			
			
			var measuresMetadata = metadataJson.Edmx.DataServices.Schema.EntityType[0];
			console.log("odataAPIservice.getMetadata - metadata",metadataJson);
			
			datasetType = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet[0]._Name;

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
			$scope.loadData();

		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

			var detail = "";
			var error = {"message":"Cannot load metadatadata","detail":detail};
			$scope.errors.push(error);

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
					$scope.usedFilter += "<span class=' panel-dataexplorer-topbar-separator'>|</span>";
					filterParam += " and ";
				}
			}
		}
		
		console.log("filterParam", filterParam);

		
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
					for (var property in oDataResult) {
						if(property!="__metadata"){
							var value = oDataResult[property];
							
							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'short');
								data[property] = d;
							}
							else
								data[property] = value;

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
						    	if(property == defaultOrderByColumn)
						    		showOrderButton = true;
						    	
						    	
						    	if($scope.orderBy.column == property)
						    		order = $scope.orderBy.order;
						    	var column = {"label":property, "order": order, "showOrderButton": showOrderButton};//, "operators": field.operators, "dataType":field.dataType};
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

