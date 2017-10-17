/* Controllers */

appControllers.controller('DiscoveryCtrl', [ '$scope','$rootScope' ,'$route', 'dataDiscoveryService','asyncSingleDatasetService', function($scope,$rootScope, $route, dataDiscoveryService,asyncSingleDatasetService) {
	$scope.$route = $route;
	$scope.activeSearch = 'simpleSearch';
	$scope.fieldList = Constants.DISCOVERY_FIELDS;
	$scope.fieldOperationList = Constants.DISCOVERY_FIELD_OPERATIONS;
	$scope.simpleSearchInputVal ;
	
	if(VeToDiscovery!=undefined && VeToDiscovery!=""){
		$scope.simpleSearchInputVal = VeToDiscovery;
		VeToDiscovery="";
	}
	
	
	$scope.searchResult=[];
	$scope.advancedFilters = [];
	$scope.reverse=false;
	$scope.isSearching = false;
	$scope.showResultList = false;


	$scope.dataset = null;
	$scope.datasetTags = null;
	$scope.datasetApiUrls = null;
	$scope.datasetStreamsUrl = null;
	$scope.datasetDownloadCsvUrl = null;

	$scope.setActiveSearch = function (activeSearch){
		$scope.activeSearch = activeSearch;
	};
	$scope.changePredicate = function(field){
		$scope.predicate =field;
		$scope.reverse=!$scope.reverse;
	};
	
	var clearResults = function(){
		searchResult = [];
		$scope.dataset = null;
		$scope.datasetTags = null;
		$scope.datasetApiUrls = null;
		$scope.datasetStreamsUrl = null;
		$scope.datasetDownloadCsvUrl = null;
	};

	$scope.search = function(SearchInputVal){
		$scope.isSearching = true;
		$scope.showResultList = true;
		clearResults();
		$scope.VIRTUALENTITY_TYPE_TWITTER_TYPE = "Feed Tweet";
		
		asyncSingleDatasetService.async(SearchInputVal,true).then(function() {
			$scope.isSearching = false;
			var data = asyncSingleDatasetService.data();
			console.debug(" myService.data()", data);
			$scope.searchResult=data;
			refresh();
			$scope.scrollTo("discovery-results-anchor");
		});

	};
	var refresh = function(){
		$scope.$evalAsync(function( $scope ) {console.log( "$evalAsync" );}); 
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
		$scope.isSearching = true;
		$scope.showResultList = true;
		clearResults();

		asyncSingleDatasetService.async($scope.advancedFilters,false).then(function() {
			$scope.isSearching = false;
			var data = asyncSingleDatasetService.data();
			console.debug(" myService.data()", data);
			$scope.searchResult=data;
			refresh();
			$scope.scrollTo("discovery-results-anchor");
		});
	};

	$scope.scrollTo = function(targetId){
		console.log("scrollTo", targetId);
		Helpers.util.scrollTo(targetId);
	};


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
			console.log("$scope.dataset.download",$scope.dataset.download);

			console.log("datasetDownloadCsvUrl",$scope.datasetDownloadCsvUrl);
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


