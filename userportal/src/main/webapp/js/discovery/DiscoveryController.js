/* Controllers */
/*
appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route", function($scope, $route) {
	$scope.$route = $route;
	$scope.managementTab = $route.current.params.managementTab;
	$scope.tenant = $route.current.params.tenant_code;

	$scope.buildTimestamp = BuildInfo.timestamp;

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
	$scope.isMenuActive= function(menuItem){

		var result = false;
		switch (menuItem){
		case 'dashboard':
			result =  ($scope.managementTab == 'dashboard');
			break;
		case 'streams':
			result =  ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal');
			break;
		case 'virtualentities':
			result =  ($scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity');
			break;
		case 'dataset':
			result =  ($scope.managementTab == 'dataset');
			break;
		default:
			break;
		}
		return result;
	};
}]);
*/

appControllers.controller('DiscoveryCtrl', [ '$scope', '$route', 'dataDiscoveryService', function($scope, $route, dataDiscoveryService, filterFilter) {
	$scope.$route = $route;
	$scope.activeSearch = 'simpleSearch';
	$scope.fieldList = Constants.DISCOVERY_FIELDS;
	$scope.fieldOperationList = Constants.DISCOVERY_FIELD_OPERATIONS;
	$scope.simpleSearchInputVal ;
	$scope.searchResult=[];
	$scope.advancedFilters = [];
	$scope.reverse=false;
	
	$scope.setActiveSearch = function (activeSearch){
		$scope.activeSearch = activeSearch;
	};
	$scope.changePredicate = function(field){
		$scope.predicate =field;
		$scope.reverse=!$scope.reverse;
	};
	
	
	$scope.search = function(SearchInputVal){
		dataDiscoveryService.searchSingleFieldInDatasets(SearchInputVal).success(function(response) {
			console.debug("response Dataset",response.d);
			$scope.searchResult=response.d.results;
			$scope.scrollTo("discovery-results-anchor");
		});
	};
	
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.searchResult.length;
	$scope.predicate = '';
	
	var MAX_NUM_ADVANCED_FILTERS = 3;
	for (var int = 0; int <  MAX_NUM_ADVANCED_FILTERS; int++) {
		$scope.advancedFilters[int] = {field: null, op:null, value: null};
	}
	
	
	$scope.searchAdvanced = function (){
		console.debug("$scope.advancedFilters : ",$scope.advancedFilters);
		dataDiscoveryService.searchMultiFieldInDatasets($scope.advancedFilters).success(function(response) {
			console.debug("response Dataset",response.d);
			$scope.searchResult=response.d.results;
			$scope.scrollTo("discovery-results-anchor");
		});
		
	};
	
	
	$scope.scrollTo = function(targetId){
		console.log("scrollTo", targetId);
		Helpers.util.scrollTo(targetId);
	};

	$scope.dataset = null;
	$scope.datasetTags = null;
	$scope.datasetApiUrls = null;
	$scope.datasetStreamsUrl = null;
	$scope.datasetDownloadCsvUrl = null;
	
	$scope.showDetail = function(idDataset){
		console.log("showDetail - idDataset", idDataset);
		$scope.dataset = null;
		$scope.datasetTags = null;
		$scope.datasetApiUrls = null;
		$scope.datasetStreamsUrl = null;
		$scope.datasetDownloadCsvUrl = null;
		
		dataDiscoveryService.loadDatasetDetail(idDataset).success(function(response) {
			console.debug("loadDatasetDetail - response",response);
			$scope.dataset=response.d;
			console.debug("loadDatasetDetail - response Dataset",$scope.dataset);
			if($scope.dataset && $scope.dataset.tags && $scope.dataset.tags!=null)
				$scope.datasetTags = $scope.dataset.tags.split(",");
			
			if($scope.dataset && $scope.dataset.API && $scope.dataset.API!=null)
				$scope.datasetApiUrls = $scope.dataset.API.split(",");
			
			if($scope.dataset && $scope.dataset.STREAM && $scope.dataset.STREAM!=null)
				$scope.datasetStreamUrls = $scope.dataset.STREAM.split(",");
			
			if($scope.dataset && $scope.dataset.download && $scope.dataset.download!=null)
				$scope.datasetDownloadCsvUrl = $scope.dataset.download;
			$scope.scrollTo("discovery-detail-anchor");
		});
		
	};
	
	
	$scope.piechartColors = ['#1b4b46', '#266962', '#31877e', '#3ba59a', '#49bdb1', '#69c9bf', '#87d4cc', '#a5dfd9', '#c3e9e6', '#e1f4f2'];
	
	$scope.exampleData = [{
		key: "One",
		y: 5
		}, {
		key: "Two",
		y: 2
		}, {
		key: "Three",
		y: 9
		}, {
		key: "Four",
		y: 7
		}, {
		key: "Five",
		y: 4
		}, {
		key: "Six",
		y: 3
		}, {
		key: "Seven",
		y: 9
		}];
	
		$scope.xFunction = function() {
			return function(d) {
				return d.key;
			};
		 };
		 $scope.yFunction = function() {
			 return function(d) {
				 return d.y;
			 };
		 };
		 $scope.descriptionFunction = function() {
			 return function(d) {
				 return d.key;
			 };
		 };
		 
} ]);


