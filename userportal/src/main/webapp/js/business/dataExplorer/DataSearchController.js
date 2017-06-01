
// TODO start Browse
appControllers.controller('DataSearchLandingCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'dataDiscoveryService', '$location', '$filter', '$http',  'info', 'dataexplorerService', 'metadataapiAPIservice','$translate',
                                                function($scope, $routeParams, fabricAPIservice, dataDiscoveryService, $location, $filter,  $http, info,dataexplorerService, metadataapiAPIservice,$translate) {
	
	var domainList = {};
	$scope.domainList = [];
	$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10, currentPage: 1};

	fabricAPIservice.getStreamDomains().success(function(response) {

		
		var domainListPagination = {"start": "0", "rows":"0"};
		var domainListFacet = {"field":"domainCode"};
		
		
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			domainList[response.streamDomains.element[int].codDomain] = {"domain":response.streamDomains.element[int].codDomain,"count":0};
		}
		
		metadataapiAPIservice.search(null,null, null, domainListPagination,null, null, domainListFacet).success(function(response) {
			console.log("metadataapiAPIservice.search_ response", response);
			var domainFacets = response.facetCount.facetFields.domainCode.facetItems;
			for (var domainFacet in domainFacets) {
				if (domainFacets.hasOwnProperty(domainFacet)) {
					if(typeof domainList[domainFacet.toUpperCase()] != 'undefined')
						domainList[domainFacet.toUpperCase()] = {"domain":domainFacet.toUpperCase(),"count":domainFacets[domainFacet]};
				}
			}
			for (var d in domainList) {
				if (domainList.hasOwnProperty(d)) {
					$scope.domainList.push(domainList[d]);
				}
			}
			
			$scope.domainList.sort(
				function(a,b) {
					if (a.domain < b.domain)
						return -1;
					if (a.domain > b.domain)
						return 1;
					return 0;
				});
		});
		
		$scope.domainList.sort();
	}).error(function(response) {
		Console.error("fabricAPIservice.getStreamDomains() ",response );
	});
	
	$scope.search = function(selectedDomain){
		console.log("search", selectedDomain);
		if(typeof selectedDomain!= 'undefined' && selectedDomain!=null)
			$scope.metadataSearchInput.filter.domainCode = [selectedDomain];
		console.log("search - metadataSearchInput", $scope.metadataSearchInput);
		dataexplorerService.setSearchInput($scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search({query:$scope.metadataSearchInput.query});
	};
	
}]);

appControllers.controller('DataSearchCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'dataDiscoveryService', '$location', '$filter', '$http',  'info', 'dataexplorerService', 'metadataapiAPIservice','$translate',
	                                                     function($scope, $routeParams, fabricAPIservice, dataDiscoveryService, $location, $filter,  $http, info,dataexplorerService, metadataapiAPIservice,$translate) {


	
	console.log("$routeParams", $routeParams);
	
	$scope.metadataSearchInput = dataexplorerService.getSearchInput();
	console.log("---------metadataSearchInput	-----------", $scope.metadataSearchInput);

	if(typeof $scope.metadataSearchInput == 'undefined' || $scope.metadataSearchInput == null)
		$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10};
	
	if(!isNaN($routeParams.page))
		$scope.currentPage = parseInt($routeParams.page);
	else
		$scope.currentPage = 1;
	console.log("--------------------", $scope.currentPage);
	
	
	if(!isNaN($routeParams.rows))
		$scope.metadataSearchInput.rows = parseInt($routeParams.rows);
	
	if($routeParams.query )
		$scope.metadataSearchInput.query = $routeParams.query;

	$scope.addFilter = function(facetName, facetValue){
		console.log("addFilter",facetName, facetValue);
		if(typeof $scope.metadataSearchInput.filter[facetName] == 'undefined'){
			$scope.metadataSearchInput.filter[facetName] = [facetValue];
		}
		else{
			if($scope.metadataSearchInput.filter[facetName].indexOf(facetValue)< 0){
				$scope.metadataSearchInput.filter[facetName].push(facetValue);
			}
		}
		$scope.metadataSearchInput.start=0;
		dataexplorerService.setSearchInput($scope.metadataSearchInput);
		console.log("metadataSearchInput",$scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search({query:$scope.metadataSearchInput.query, page:1,time: new Date().getTime()});
		
	};
	
	$scope.removeFilter = function(facetName, facetValue){
		console.log("removeFilter",facetName, facetValue);

		if(typeof $scope.metadataSearchInput.filter[facetName] != 'undefined'){
			for(var i = $scope.metadataSearchInput.filter[facetName].length - 1; i >= 0; i--) {
			    if($scope.metadataSearchInput.filter[facetName][i] === facetValue) {
					$scope.metadataSearchInput.start=0;
			    	$scope.metadataSearchInput.filter[facetName].splice(i, 1);
					dataexplorerService.setSearchInput($scope.metadataSearchInput);
					if($scope.metadataSearchInput.filter[facetName].length==0)
						delete $scope.metadataSearchInput.filter[facetName];
					$location.path('dataexplorer/searchresults').search({query:$scope.metadataSearchInput.query, page:1,time: new Date().getTime()});
			    }
			}
			
		}
		
	};
	
	$scope.showSearchLoading = false;

	$scope.columns = [];
	var order = 'none';
	
	$scope.columns.push({"label":"DATABROWSER_ENTITY", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_DATADOMAIN", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_TAGS", "order": order, "showOrderButton": false});
	$scope.columns.push({"label":"DATASET_FIELD_CONFIGDATA_TENANT", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_LICENSE", "order": order, "showOrderButton": false});

	var cleanMetadata = function(data){
		if(typeof data["description"] === "undefined" || data["description"]==null)
			data["description"] = "";
		
		if(typeof data["license"] === "undefined" || data["license"]==null)
			data["license"] = "";
		
		if(typeof data["disclaimer"] === "undefined" || data["disclaimer"]==null)
			data["disclaimer"] = null;
		
		if(typeof data["copyright"] === "undefined" || data["copyright"]==null)
			data["copyright"] = null;

    	return data;
	};
	
	
	
	$scope.errors = [];

	
	$scope.exploreData = function(data){
		console.log("exploreData", data);
		$location.path('dataexplorer/'+data.tenantCode+'/'+data.dataset.code);

	};
	
	$scope.openStreamDashboard = function(data){
		console.log("openStreamDashboard", data);
		$location.path('dashboard/stream/'+data.tenantCode+'/'+data.stream.smartobject.code+'/'+data.stream.code);

	};
	
	$scope.openDetail = function(data){
		console.log("exploreData", data);
		$location.path(data.detailPath);
	};
	
	$scope.noMoreSearchData = false;
	
	var metadataSearchFacet = {"field": "entityType,visibility,domainCode,subdomainCode,organizationCode,tenantCode,tagCode"};
	var metadataSearchFacetOrder = {"entityType": 0,"domainCode": 1,"subdomainCode": 2,"tagCode": 3,"organizationCode": 4,"tenantCode": 5,"visibility": 6};


	$scope.layoutInfo = {"sideMenu": "facet",
						 "totalFound":0
						};
	
	
	
	$scope.metadataSearchOutput = {datasetList: [],
			facetList: []
	};
	
	var parseSearchMetadataResult = function(dataFromSearch){
		var data = {};
		
		data.name = dataFromSearch.name;
		data.description = dataFromSearch.description;
		data.description_show_all=false;
		data.domainCode = dataFromSearch.domainCode;
		
		data.tags = dataFromSearch.tags;
		data.tagCodes = dataFromSearch.tagCodes;
		data.tenantCode = dataFromSearch.tenantCode;
		
		if(typeof dataFromSearch.license!= 'undefined'){
			data.license = dataFromSearch.license;
			if(data.license.length>3){
				var licenseForCheck = data.license.toLowerCase().replace(/ /g, '').replace(/-/g, '').substring(0,4);
				if(licenseForCheck.indexOf("ccby")==0)
					data.license_icon="cc-by-88x31.png";
				else if(licenseForCheck.indexOf("cc0")==0)
					data.license_icon="cc-0-88x31.png";
			}
		}
		data.copyright = dataFromSearch.copyright;
		data.disclaimer = dataFromSearch.disclaimer;
		
		var baseDetailPath = 'dataexplorer/detail/' + data.tenantCode+'/';
		
		data.type=dataFromSearch.type.join(" + "); 
		data.icon = dataFromSearch.icon;
		
		if(dataFromSearch.dataset!=null){
			data.dataset = {};
			data.dataset.code = dataFromSearch.dataset.code;
			data.showDataexplorerButton = true;
			data.detailPath  = baseDetailPath + data.dataset.code;
		}

		if(dataFromSearch.stream!=null){
			data.stream = {};
			data.stream.code = dataFromSearch.stream.code;
			if(dataFromSearch.stream.smartobject!=null){
				data.stream.smartobject= {};
				data.stream.smartobject.code = dataFromSearch.stream.smartobject.code;
				data.stream.smartobject.description = dataFromSearch.stream.smartobject.description;
			}
			data.showDashboardButton = true;
			data.detailPath  = baseDetailPath + data.stream.smartobject.code + '/' + data.stream.code;
		}
		
		return data;
	};

	$scope.facetCompactLimit = 4;
	
	var facetComparator = function(a,b) {
		var res = 0;
		if (a.count> b.count)
			res = -1;
		else if (a.count < b.count)
			res = 1;
		else if (a.label < b.label)
			res = -1;
		else if (a.label > b.label)
			res = 1;
		return res;
	};
	
	$scope.selectPage = function(){
		console.log("selectPage", $scope.currentPage);
		dataexplorerService.setSearchInput($scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search({page:$scope.currentPage});

	};
	
	/* $scope.$watch('currentPage', function(newPage){
		 console.log("--+ + +  ------------------", $scope.currentPage);
		 dataexplorerService.setSearchInput($scope.metadataSearchInput);
		$location.path('dataexplorer/searchresults').search({page:$scope.currentPage});
	 });
	*/
	
	$scope.search = function(){
		console.log("search", $scope.metadataSearchInput);
		$scope.showSearchLoading = true;
		$scope.errors = [];
		$scope.metadataSearchOutput.facetList = [];
		$scope.metadataSearchOutput.datasetList = [];
		console.log("ss",$scope.metadataSearchInput);
		$scope.metadataSearchInput.start=($scope.currentPage-1)*$scope.metadataSearchInput.rows;
		var metadataSearchPagination = {"start": $scope.metadataSearchInput.start, "rows": $scope.metadataSearchInput.rows};
		console.log("metadataSearchPagination",metadataSearchPagination);
		
		// search(apiVersion,q, lang, pagination,filter, geolocalization, facet)
		metadataapiAPIservice.search(null, $scope.metadataSearchInput.query, null, metadataSearchPagination,$scope.metadataSearchInput.filter, null, metadataSearchFacet).success(function(response) {
			console.log("metadataapiAPIservice.search response", response);
			$scope.showSearchLoading = false;
			$scope.metadataSearchOutput.totalFound = response.totalCount;
			$scope.metadataSearchOutput.totalPages = response.totalCount;
			$scope.metadataSearchOutput.start = response.start;
			
			var facets = response.facetCount.facetFields;
			for (var facetKey in facets) {
			    if (facets.hasOwnProperty(facetKey)) {
			    	var facetFirstItems = [];
			    	var facetItems = [];
					for (var facetItemKey in facets[facetKey].facetItems) {
						if(facets[facetKey].facetItems[facetItemKey] != 0){
							var facetItem= {"name": facetItemKey, "label": facetItemKey, "count": facets[facetKey].facetItems[facetItemKey]};
							
							if(facetKey == 'domainCode' || facetKey == 'subdomainCode' || facetKey == 'tagCode' ){
								facetItem.name=facetItemKey.toUpperCase();
								facetItem.label=$translate.instant(facetItemKey.toUpperCase());
							}
							console.log("$scope.metadataSearchInput.filter[facetKey]", $scope.metadataSearchInput.filter[facetKey]);
							if(typeof $scope.metadataSearchInput.filter != 'undefined' && typeof $scope.metadataSearchInput.filter[facetKey] != 'undefined' && $scope.metadataSearchInput.filter[facetKey] !=null){
								if($scope.metadataSearchInput.filter[facetKey].indexOf(facetItem.name) > -1)
									facetItem.active = true;
							}
							
							facetItems.push(facetItem);
							
						}
					}
					if(facetItems.length>0){
						facetItems.sort(function(a,b) {
								return facetComparator(a,b);
							});
						
						for (var facetIndex = 0; facetIndex < facetItems.length; facetIndex++) {
							if(facetIndex>=$scope.facetCompactLimit)
								break;
							facetFirstItems.push(facetItems[facetIndex]);
						}

						$scope.metadataSearchOutput.facetList.push({"facet":facetKey, "label":  $translate.instant("FACET_"+facetKey), "items": facetItems, "firstItems": facetFirstItems, "compact" : true, "order": metadataSearchFacetOrder[facetKey]});
					}
			    }
			}
			
			$scope.metadataSearchOutput.facetList.sort(
					function(a,b) {
						if (a.order < b.order)
							return -1;
						if (a.order > b.order)
							return 1;
						return 0;
					});
			
			if(response.count>0){
				for (var datasetIndex = 0; datasetIndex < response.metadata.length; datasetIndex++) {
					var dataFromSearch = response.metadata[datasetIndex];
					var data = parseSearchMetadataResult(dataFromSearch);
					$scope.metadataSearchOutput.datasetList.push(cleanMetadata(data));
				}
			}
			
			var searchResult = {};
			searchResult.metadataSearchInput = $scope.metadataSearchInput;
			searchResult.metadataSearchOutput = $scope.metadataSearchOutput;


		}).error(function(response) {
			console.log("search response error", response);
			$scope.errors.push({"messagge":"Search error", "detail":response});
			$scope.showSearchLoading = false;

		});

		
		
		
	  
	
	};
	
	$scope.search();

	
	/*
	if(dataexplorerBrowseData.getSearchResult()!=null){
		var searchResult = dataexplorerBrowseData.getSearchResult();

		$scope.metadataSearchInput = searchResult.metadataSearchInput;
		$scope.metadataSearchOutput = searchResult.metadataSearchOutput;


		fromBackButton = true;
		$scope.currentStep = 'results';
		$scope.stepTitle='DATABROWSER_RESULTS_TITLE';
	}
*/
	// https://int-userportal.smartdatanet.it/store/site/blocks/search/api-search/ajax/search.jag -d 'action=searchAPIs&query=grecia&start=0&end=10'
}]);

