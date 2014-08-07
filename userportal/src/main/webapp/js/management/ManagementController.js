/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route", function($scope, $route) {
	$scope.$route = $route;
	$scope.managementTab = $route.current.params.managementTab;
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
} ]);

appControllers.controller('ManagementCtrl', [ '$scope', function($scope) {
} ]);

appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$location', 'fabricAPIservice', function($scope, $location, fabricAPIservice, filterFilter) {
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';

	fabricAPIservice.getStreams().success(function(response) {
		// Dig into the responde to get the relevant data
		$scope.streamsList = response.streams.stream;
		$scope.totalItems = $scope.streamsList.length;
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(stream.status);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newCode", newCode);
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
		console.log("newStatus", newStatus);
	});

	$scope.selectedStreams = [];
	
	$scope.isSelected = function(stream) {
		 return $scope.selectedStreams.indexOf(stream) >= 0;
	};
		
	$scope.updateSelection = function($event, stream) {
		var checkbox = $event.target;
		 var action = (checkbox.checked ? 'add' : 'remove');
		  updateSelected(action, stream);
	};	
	var updateSelected = function(action, stream) {
		if (action === 'add' && $scope.selectedStreams.indexOf(stream) === -1) {
			$scope.selectedStreams.push(stream);
		}
		if (action === 'remove' && $scope.selectedStreams.indexOf(stream) !== -1) {
			$scope.selectedStreams.splice($scope.selectedStreams.indexOf(stream), 1);
		}
	};
	
	$scope.editStream = function(){
		if($scope.selectedStreams.length===1){
			
			$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		if($scope.selectedStreams.length>0){
			
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementNewStreamCtrl', [ '$scope', '$location', 'fabricAPIservice', function($scope, $location, fabricAPIservice) {
	$scope.tenantCode = 'TSTSTP01';
	$scope.virtualEntitiesList = [];
	fabricAPIservice.getVirtualEntities($scope.tenantCode).success(function(response) {
		$scope.virtualEntitiesList = response.virtualEntities.virtualEntity;
	});
	$scope.creationError = null;
	$scope.createStream = function(virtualentity, stream) {
		var newStream = new Object();
		newStream.stream = stream;
		var promise   = fabricAPIservice.createStream($scope.tenantCode, virtualentity.codeVirtualEntity,  newStream);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editStream/'+$scope.tenantCode +'/'+virtualentity.codeVirtualEntity+'/'+newStream.stream.codiceStream);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	
	
	$scope.cancel = function(){
		$location.path('management/streams');
	};
} ]);



appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', function($scope, $routeParams, fabricAPIservice) {
	
	$scope.unitOfMesaurementList = [
	                                {name:'cm', type: 'Length'},
	                                {name:'m', type: 'Length'},
	                                {name:'km', type: 'Length'},
	                                {name:'mg', type: 'Weight'},
	                                {name:'g', type: 'Weight'},
	                                {name:'kg', type: 'Weight'},
	                               ];
	
	$scope.phenomenomList = [
	                         {name:'Wind Speed', type: 'Type 1'},
	                         {name:'Air Temperature', type: 'Type 1'},
	                         {name:'Measure 03', type: 'Type 1'},
	                         {name:'Measure 01', type: 'Type 2'},
	                         {name:'Measure 02', type: 'Type 2'},
	                         {name:'Measure 03', type: 'Type 2'},
	                         ];

	$scope.updateInfo = null;
	$scope.updateError = null;

	$scope.dataTypeList = ['String', 'Number', 'Date'];
	$scope.stream = null;
	fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
		$scope.stream = response.streams.stream;
		if(!$scope.stream.tags)
			$scope.stream.tags = [];
		if(!$scope.stream.componenti)
			$scope.stream.componenti = [];
	});
		
	//$scope.virtualEntitiesList = [];
	//fabricAPIservice.getVirtualEntities($routeParams.tenant_code).success(function(response) {
	//	$scope.virtualEntitiesList = response.virtualEntities.virtualEntity;
	//});
	
	
	$scope.newComponent = null;
	$scope.addComponent = function(){
		$scope.stream.componenti.push($scope.newComponent);
		$scope.newComponent = null;
		return false;
	};
	
	$scope.removeComponent = function(index){
		$scope.stream.componenti.splice(index,1);
		return false;
	};

	$scope.newTag = null;
	$scope.addTag = function(){
		$scope.stream.tags.push($scope.newTag);
		$scope.newTag = null;
		return false;
	};
	
	$scope.removeTag = function(index){
		$scope.stream.tags.splice(index,1);
		return false;
	};

	$scope.cancel = function(){
		$location.path('management/streams');
	};
	
	$scope.updateStream = function() {
		var newStream = new Object();
		newStream.stream =  $scope.stream;
		console.log("newStream", newStream);
		var promise   = fabricAPIservice.updateStream($scope.tenantCode, $scope.codeVirtualEntity,  newStream);
		promise.then(function(result) {
			console.log("result qui ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});

		
	};	
} ]);
