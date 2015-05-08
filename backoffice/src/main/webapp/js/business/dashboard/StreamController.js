appControllers.controller('StreamsCtrl', [ '$scope', "$route", 'fabricAPIservice', '$translate', '$modal',  function($scope, $route, fabricAPIservice, $translate, $modal) {
	console.log("$modal", $modal);
		
	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'Installazione in corso';
	$scope.virtualentityFilter = null;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;
	
	$scope.errors = [];
	$scope.warnings = [];
	$scope.infos = [];
	
	$scope.actions = ['install', 'upgrade', 'delete', 'migrate'];
	
	
	fabricAPIservice.getVisibleStreams().success(function(response) {
		$scope.showLoading = false;
		
		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			var row = {};
			row.rowIndex = i;
			row.stream = responseList[i];
			row.statusIcon = Helpers.stream.statusIcon(row.stream);
			row.deploymentStatusCodeTranslated =  $translate.instant(row.stream.deploymentStatusCode);
			row.isSelected = false;
			row.isUpdating = false;
			if(!row.stream.deploymentStatusCode || row.stream.deploymentStatusCode==null)
				row.stream.deploymentStatusCode = "draft";
			
			if(row.stream.deploymentStatusCode=='req_inst'){
				if(row.stream.deploymentVersion === 1)
					row.action = 'install';
				else
					row.action = 'upgrade';
			}
			else if(row.stream.deploymentStatusCode=='inst'){
				row.action = 'migrate';
			}
			else if(row.stream.deploymentStatusCode=='req_uninst'){
				row.action = 'delete';
			}

			row.startStep = 0;
			row.endStep = null;
			
			if(row.stream.streamIcon || row.stream.streamIcon == null)
				row.stream.streamIcon  = "img/stream-icon-default.png";
			
			
			$scope.streamsList.push(row);					
		}
		
		$scope.totalItems = $scope.streamsList.length;
	});

	$scope.searchTenantsFilter = function(stream) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(stream.codiceTenant);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream)|| keyword.test(stream.nomeStream);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.stream.deploymentStatusCode) || keyword.test(row.deploymentStatusCodeTranslated);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		console.log("statusFilter",$scope.filteredStreamsList.length);
		$scope.totalItems = $scope.filteredStreamsList.length;
	});


	$scope.searchVirtualentityFilter = function(stream) {
		var keyword = new RegExp($scope.virtualentityFilter, 'i');
		return !$scope.virtualentityFilter || keyword.test(stream.codiceVirtualEntity);
	};

	$scope.$watch('virtualentityFilter', function(newVirtualentity) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	
	$scope.updateSelection = function($event, rowIndex) {
		var checkbox = $event.target;
		if(checkbox.checked)
			$scope.streamsList[rowIndex].isSelected=true;
		else
			$scope.streamsList[rowIndex].isSelected=false;
	};	
	
	$scope.clearSelection = function(){
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				$scope.streamsList[i].isSelected=false;
			}
		}
		
	}
	
	$scope.selectAll = function($event){
		console.log("selectAll", $event)
		$scope.clearSelection();
		var checkbox = $event.target;
		console.log("checkbox.checked", checkbox.checked)

		if(checkbox.checked){
			console.log("checkbox.checked in", checkbox.checked)

			if($scope.filteredStreams && $scope.filteredStreams!=null){
				

				for (var i = 0; i < $scope.filteredStreams.length; i++) {
					console.log("$scope.filteredStreams[i].isSelected", $scope.filteredStreams[i].isSelected)

					$scope.filteredStreams[i].isSelected=true;
				}
			}
		}
	}
	
	
//	$scope.canInstall = function(row){ return row.stream.deploymentStatusCode=='req_inst';};
//	$scope.canUninstall = function(row){ return row.stream.deploymentStatusCode=='req_uninst';};
//	$scope.canUpgrade = function(row){return row.stream.deploymentStatusCode=='req_uninst';};
//	$scope.canMigrate = function(row){return row.stream.deploymentStatusCode=='req_uninst';};
//	
//	$scope.install = function(row){row.isUpdating = true;};
//	$scope.uninstall = function(row){};
//	$scope.upgrade = function(row){};
//	$scope.migrate = function(row){};
		
	
	$scope.execActions = function(){
		console.log("execActions");
		$scope.errors = [];
		$scope.warnings = [];
		$scope.infos = [];
		
		var atLeastOneSelected = false;
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				if($scope.streamsList[i].isSelected){
					console.log("stream",$scope.streamsList[i].stream);
					console.log("action",$scope.streamsList[i].action);
					console.log("startStep",$scope.streamsList[i].startStep);
					console.log("endStep",$scope.streamsList[i].endStep);
					atLeastOneSelected = true;
				}
			}
		}
		if(!atLeastOneSelected)
			$scope.warnings.push('DASHBOARD_WARNING_NO_STREAM');

	}

	$scope.openLog = function (selectedStream) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamInstalLog.html',
	      controller: 'StreamInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  stream: function () {
	          return selectedStream;
	        }
	      }
	    });

	}
	
} ]);

appControllers.controller('StreamInstallLogCtrl', [ '$scope', '$modalInstance', 'stream' ,function ($scope, $modalInstance, stream) {
	$scope.stream = stream;
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

