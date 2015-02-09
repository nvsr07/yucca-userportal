/* Controllers */

appControllers.controller('ManagementNavigationCtrl', [ '$scope', "$route",'info',  function($scope, $route, info) {
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
		case 'datasets':
			result =  ($scope.managementTab == 'datasets' || $scope.managementTab == 'editDataset' || $scope.managementTab == 'viewDataset' || $scope.managementTab == 'newDataset' ||  $scope.managementTab == 'uploadDataset');
			break;
		default:
			break;
		}
		return result;
	};
	
}]);


appControllers.controller('ManagementCtrl', [ '$scope', '$route', 'fabricAPIservice', function($scope, $route, fabricAPIservice, filterFilter) {
} ]);

appControllers.controller('ManagementDashboardCtrl',[ '$scope', '$route', 'fabricAPIservice', function($scope, $route, fabricAPIservice, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.tenant = null;

	// FIXME change with single tenant api
	fabricAPIservice.getTenants().success(function(response) {
		for (var i = 0; i < response.tenants.tenant.length; i++) {
			if(response.tenants.tenant[i].tenantCode == $scope.tenantCode){
				$scope.tenant = response.tenants.tenant[i];
				break;
			}
		}

	});


} ]);


appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;
	$scope.showLoading = true;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';

	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	fabricAPIservice.getStreams($scope.tenantCode).success(function(response) {

		$scope.showLoading = false;

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].codiceTenant == $scope.tenantCode){
				if(!responseList[i].deploymentStatusCode || responseList[i].deploymentStatusCode == null)
					responseList[i].deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
				responseList[i].statusIcon = Helpers.stream.statusIcon(responseList[i]);
				$scope.streamsList.push(responseList[i]);
			}
		}
		//$scope.streamsList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		$scope.totalItems = $scope.streamsList.length;
		//	$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.codiceStream);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(stream.deploymentStatusDesc);
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

	$scope.canEdit = function() {
		if($scope.selectedStreams.length==1 && $scope.selectedStreams[0].deploymentStatusCode == Constants.STREAM_STATUS_DRAFT){
			return true;
		}
		return false;
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
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedStreams.length>0){

			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementNewStreamCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.user = {};
	$scope.validationPatternNoSpace = Constants.VALIDATION_PATTERN_NO_SPACE;


	$scope.stream={};
	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result managementnew stream", result);
		$scope.user = result.user;
		console.debug("info user", $scope.user);
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.stream.nomeRichiedente=$scope.user.firstname;
			$scope.stream.cognomeRichiedente=$scope.user.lastname;
			$scope.stream.mailRichiedente=$scope.user.email;
		}
	});

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};



	$scope.virtualEntitiesList = [];


	//internal stream
	$scope.virtualentity=null;
//	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
//	$scope.streamSelectedItem=null;	
//	$scope.streamSiddhiQuery=null;
//	$scope.virtualentityInternal=null;

	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		console.log(response.virtualEntities.virtualEntity);
		for (var int = 0; int < response.virtualEntities.virtualEntity.length; int++) {
			var virtualentity = response.virtualEntities.virtualEntity[int];
			if(virtualentity.idTipoVe != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
				$scope.virtualEntitiesList.push(virtualentity);
			}else{
				$scope.virtualentityInternal=virtualentity;
			}

		}
	});



	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});



	$scope.creationError = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;

	$scope.createStream = function(virtualentity, stream) {
		stream.fps = 0;
		stream.saveData = 0;
		stream.publishStream = 1;
		stream.visibility = 'public';
		stream.accettazionePrivacy=0;
		stream.accettazionePrivacy=$scope.accettazionePrivacy & $scope.accettazioneResponsability;


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
		$location.path('management/streams'+'/'+$scope.tenantCode);
	};
} ]);



appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info','$timeout',"$filter", 'readFilePreview',
                                                    function($scope, $routeParams, fabricAPIservice, info,$timeout,$filter,readFilePreview) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	$scope.validationRes=2;
	$scope.errorMsg="Errore";
	$scope.successMsg="Successo";
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;
	$scope.insertComponentErrors = [];
	$scope.wsUrl ="";

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternNoSpace = Constants.VALIDATION_PATTERN_NO_SPACE;

	
	$scope.defaultQuery = Constants.DEFAULT_SIDDHI;

	$scope.internalStreams = [];
	$scope.inputTypeStream = 1;
	$scope.streamSelectedItem=null;	
	$scope.streamSiddhiQuery="insert query here;";
	$scope.streamSiddhiMirror="";
	$scope.streamsList = [];


	$scope.addStreamToArray = function(){
		$scope.validationRes=2;
		$scope.streamSelectedItem.componenti = new Object();
		$scope.internalStreams.push($scope.streamSelectedItem);
		$scope.loadStreamComponents($scope.streamSelectedItem);		
		$scope.streamSelectedItem=null;
	};

	$scope.cancelStreamToArray = function(index){
		$scope.validationRes=2;
		$scope.internalStreams.splice(index,1);
	};



	// The ui-codemirror option
	$scope.cmOption = {
			lineNumbers: true,
			indentWithTabs: true,
			onLoad : function(_cm){
				console.debug(_cm);
				_cm.setOption("mode", 'text/x-sql');
			}
	};

	$scope.$watch('streamSiddhiQuery', function() {
		$scope.validationRes=2;
	});
	
	
	
	$scope.valideteSiddhi = function(){

		if($scope.stream.componenti==null || $scope.stream.componenti.element==null || $scope.stream.componenti.element.length==0){
			$scope.validationRes=1;
			$scope.errorMsg="STREAM_SIDDHI_INSERT_COMPONENT";
			return;
		}
		if($scope.streamSiddhiQuery==null || $scope.streamSiddhiQuery.indexOf("outputStream")==-1){
			$scope.validationRes=1;
			$scope.errorMsg="STREAM_SIDDHI_PLEASE_OUTPUTSTREAM";
			return;
		}
		
		
		var siddhiStreamDefinitions = "";
		var siddhiStreamArray = [];
		for(var st in $scope.internalStreams){
			console.debug($scope.internalStreams[st]);

			siddhiStreamDefinitions += "define stream " + "input"+st+" (meta_source string, time string ";
			if($scope.internalStreams[st].componenti!= null && $scope.internalStreams[st].componenti.element!=null ){
				var componenti = $scope.internalStreams[st].componenti.element;
				for(var comp in componenti){
					var key = componenti[comp].nome;
					var value =  componenti[comp].dataType;
					if (value == "dateTime") {
						value = "string";
					} else if (value == "longitude") {
						value = "double";
					} else if (value == "latitude") {
						value = "double";
					} else if (value == "boolean") {
						value = "bool";
					}
					siddhiStreamDefinitions += " ,"+key +" "+value;
				}
				siddhiStreamDefinitions +=");";
				siddhiStreamArray.push(siddhiStreamDefinitions);
				siddhiStreamDefinitions="";
			}

		}
		
		//OutputStream Definition
		
		siddhiStreamDefinitions += " define stream " + "outputStream(meta_source string, time string ";
		if($scope.stream.componenti!= null && $scope.stream.componenti.element!=null ){
			var componenti = $scope.stream.componenti.element;
			for(var comp in componenti){
				var key = componenti[comp].nome;
				var value =  componenti[comp].dataType;
				if (value == "dateTime") {
					value = "string";
				} else if (value == "longitude") {
					value = "double";
				} else if (value == "latitude") {
					value = "double";
				} else if (value == "boolean") {
					value = "bool";
				}
				siddhiStreamDefinitions += " ,"+key +" "+value;
			}
			siddhiStreamDefinitions +=");";
			siddhiStreamArray.push(siddhiStreamDefinitions);
			siddhiStreamDefinitions="";
		}
		
		var validationObj = {
				"inputStreamDefiniitons":siddhiStreamArray,
				"queryExpressions":$scope.streamSiddhiQuery + $scope.defaultQuery		
		};
		console.debug("validationObj : ", validationObj);
		fabricAPIservice.validateSiddhi(validationObj).success(function(response) {
			if(response.faultstring != null){
				$scope.validationRes=1;
				$scope.errorMsg=response.faultstring;
			}else{
			$scope.validationRes=0;
			}
			console.debug(response);
		});
	};

	fabricAPIservice.getStreams().success(function(response) {

		var responseList = Helpers.util.initArrayZeroOneElements(response.streams.stream);
		for (var i = 0; i < responseList.length; i++) {
			if(responseList[i].deploymentStatusCode && 	responseList[i].deploymentStatusCode == Constants.STREAM_STATUS_INST 
					&& (responseList[i].visibility && responseList[i].visibility=="public" || responseList[i].codiceTenant==$routeParams.tenant_code)){
				$scope.streamsList.push(responseList[i]);					
			}
		}
	});

	$scope.tagList = [];
	$scope.domainList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
	});

	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});


	$scope.phenomenomList = [];
	fabricAPIservice.getStreamPhenomenom().success(function(response) {
		$scope.phenomenomList = response.Phenomenon.element;
	});

	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
	});

	$scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";

	$scope.stream = {};
//	$scope.stream.saveData = '0';
//	$scope.stream.visibility = 'public';
//	$scope.stream.publish = 0;
	$scope.loadStream = function(){
		fabricAPIservice.getStream($routeParams.tenant_code, $routeParams.entity_code, $routeParams.stream_code).success(function(response) {
			$scope.stream = response.streams.stream;
			
			

			if($scope.stream.saveData==1){
				$scope.saveData=true;
			}else{
				$scope.saveData=false;
			}

			if($scope.stream.publishStream==1){
				$scope.publish=true;
			}else{
				$scope.publish=false;
			}
			
			
			//FIXME publishStream forced to true , delete this line when the radio button is enabled.
			$scope.stream.publishStream=1;
			

			if($scope.stream.visibility==null){
				$scope.stream.visibility = 'public';
			}
			console.debug("$scope.stream internal before clean",$scope.stream);
			if(!$scope.stream.streamInternalChildren || !$scope.stream.streamInternalChildren.streamChildren){
				$scope.stream.streamInternalChildren={};
				$scope.stream.streamInternalChildren.streamChildren=[];
			}

			$scope.stream.streamInternalChildren.streamChildren=Helpers.util.initArrayZeroOneElements($scope.stream.streamInternalChildren.streamChildren);

			for(var i =0 ; i<$scope.stream.streamInternalChildren.streamChildren.length;i++){
				var existingStream =  $scope.stream.streamInternalChildren.streamChildren[i];

				$scope.loadStreamComponents(existingStream);
			}

			if(!$scope.stream.streamIcon || $scope.stream.streamIcon == null)
				$scope.stream.streamIcon  = "img/stream-icon-default.png";

			if( $scope.stream.internalQuery && $scope.stream.internalQuery["@nil"]){
				$scope.stream.internalQuery=null;
			}
			console.debug("$scope.stream.internalQuery ",$scope.stream.internalQuery);

			$scope.streamSiddhiMirror= $scope.stream.internalQuery;	
			setTimeout(function(){
				  $scope.$apply(function(){
					  $scope.streamSiddhiQuery=$scope.streamSiddhiMirror;
				  });
				  }, 100);

			$scope.internalStreams=$scope.stream.streamInternalChildren.streamChildren;

			console.debug("$scope.stream internal",$scope.stream);
			if(!$scope.stream.streamTags)
				$scope.stream.streamTags = new Object();
			$scope.stream.streamTags.tag = Helpers.util.initArrayZeroOneElements($scope.stream.streamTags.tag);

			if($scope.stream.componenti == null)
				$scope.stream.componenti = new Object();
			$scope.stream.componenti.element = Helpers.util.initArrayZeroOneElements($scope.stream.componenti.element);


			if(!$scope.stream.deploymentStatusCode || $scope.stream.deploymentStatusCode == null)
				$scope.stream.deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;

			$scope.stream.domain = $scope.stream.domainStream;
			$scope.wsUrl = Helpers.stream.wsOutputUrl($scope.stream);
		});
	};


	$scope.loadStreamComponents = function(existingStream){
		fabricAPIservice.getStream(existingStream.codiceTenant,existingStream.codiceVirtualEntity,existingStream.codiceStream).success(function(response) {
			var stream = response.streams.stream;
			for (var i = 0; i < $scope.internalStreams.length; i++) {
				if($scope.internalStreams[i].idStream==stream.idStream){
					$scope.internalStreams[i].componenti = {}; 
					$scope.internalStreams[i].componenti.element = Helpers.util.initArrayZeroOneElements(stream.componenti.element);
				}
			}
		});

	};



	$scope.loadStream();

	$scope.newComponent = null;
	$scope.newComponentUnitOfMeasurement = null;
	$scope.newComponentPhenomenon = null;
	$scope.newComponentDataType = null;

	$scope.addComponent = function(){
		$scope.validationRes=2;
		$scope.insertComponentErrors = [];
		if($scope.newComponent && $scope.newComponent.nome && $scope.newComponent.nome!=null){
			var found = false;
			
			if($scope.newComponent.nome.indexOf(' ') >= 0){
				$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE');
			}
			else{

				for (var int = 0; int < $scope.stream.componenti.element.length; int++) {
					if($scope.stream.componenti.element[int].nome == $scope.newComponent.nome){
						found = true;
						break;
					}
				}
	
				if(!found){
					if($scope.newComponentUnitOfMeasurement){
						$scope.newComponent.idMeasureUnit = $scope.newComponentUnitOfMeasurement.idMeasureUnit;
						$scope.newComponent.measureUnit = $scope.newComponentUnitOfMeasurement.measureUnit;
						$scope.newComponent.measureUnitCategory = $scope.newComponentUnitOfMeasurement.measureUnitType;
					}
					if($scope.newComponentPhenomenom){
						$scope.newComponent.idPhenomenon = $scope.newComponentPhenomenom.idPhenomenon;
						$scope.newComponent.phenomenon = $scope.newComponentPhenomenom.phenomenon;
						$scope.newComponent.phenomenonCategory = $scope.newComponentPhenomenom.phenomenonType;
					}
					if($scope.newComponentDataType){
						$scope.newComponent.idDataType = $scope.newComponentDataType.idDataType;
						$scope.newComponent.dataType = $scope.newComponentDataType.dataType;
					}
	
				}
				else{
					$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE');
				}
			}
		}
		else
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED');

		console.log("$scope.newComponentDataType", $scope.newComponentDataType);
		if($scope.newComponentDataType == null || $scope.newComponentDataType == ""){
			$scope.insertComponentErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED');
		}

		if($scope.insertComponentErrors.length==0){
			$scope.stream.componenti.element.push($scope.newComponent);
			$scope.newComponent = null;
		}
		return false;
	};

	$scope.removeComponent = function(index){
		$scope.validationRes=2;
		$scope.stream.componenti.element.splice(index,1);
		return false;
	};

	$scope.newTag = null;
	$scope.addTag = function(){
		if($scope.newTag){
			var found = false;	
			for (var int = 0; int < $scope.stream.streamTags.tag.length; int++) {
				var existingTag = $scope.stream.streamTags.tag[int];
				if(existingTag.tagCode == $scope.newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.stream.streamTags.tag.push({"tagCode":$scope.newTag});
		}
		$scope.newTag = null;
		return false;

	};

	$scope.removeTag = function(index){
		$scope.stream.streamTags.tag.splice(index,1);
		return false;
	};
	
	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.STREAM_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readPreview();
	};
	
	var readPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.stream.streamIcon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};


	$scope.canInstall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canUnistall = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	$scope.canEdit = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.stream.deploymentStatusCode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};


	$scope.cancel = function(){
		$location.path('management/streams');
	};

	$scope.updateStream = function() {
		
		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			Helpers.util.scrollTo("validateMsg");
		}else{	
		$scope.validationRes=2;
		$scope.updateInfo = null;
		$scope.updateWarning = null;
		$scope.warningMessages = [];
		$scope.updateError = null;

		var newStream = new Object();

		newStream.stream =  $scope.stream;      
		newStream.stream.internalQuery=  $scope.streamSiddhiQuery;
		//	newStream.stream.internalQuery = $scope.streamSiddhiQuery;
		newStream.stream.streamInternalChildren={};
		newStream.stream.streamInternalChildren.streamChildren=[];
		for(var i = 0; i< $scope.internalStreams.length; i++){
			newStream.stream.streamInternalChildren.streamChildren.push({
				"aliasChildStream":"input"+i,
				"idChildStream": $scope.internalStreams[i].idStream
			});
		}

		console.log("newStream", newStream);
		if(!$scope.stream.componenti.element || $scope.stream.componenti.element.length==0){
			$scope.updateWarning = true;
			$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}

		Helpers.util.scrollTo();
		if(!$scope.updateWarning){

			var promise   = fabricAPIservice.updateStream(newStream);

			promise.then(function(result) {
				$scope.updateInfo = {status: result.status};
				$scope.loadStream();

			}, function(result) {
				$scope.updateError = angular.fromJson(result.data);
				console.log("result.data ", result.data);
				$scope.loadStream();
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		};
		}
	};	

	$scope.requestInstallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST);
	};

	$scope.requestUnistallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST);
	};

	$scope.createNewVersion = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION);
	};

	var updateLifecycle = function(action) {
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();
		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
		promise.then(function(result) {
			console.log("result updateLifecycle ", result);
			//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
			$scope.updateInfo = {status: result.status};
			$scope.loadStream();
		}, function(result) {
			$scope.updateError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
			$scope.loadStream();
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};
} ]);



/* VIRTUAL ENTITY */

appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;


	console.log("info.isOwner( $scope.tenantCode);", info.isOwner( $scope.tenantCode));
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.virtualentitiesList = [];
	$scope.filteredVirtualentitiesList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.virtualentitiesList.length;
	$scope.predicate = '';


	fabricAPIservice.getVirtualentities($scope.tenantCode).success(function(response) {
		$scope.showLoading = false;

		// Dig into the responde to get the relevant data
		console.log("response", response);
		if(response.virtualEntities==null)
			response.virtualEntities = {};
		$scope.virtualentitiesList = Helpers.util.initArrayZeroOneElements(response.virtualEntities.virtualEntity);
		$scope.totalItems = $scope.virtualentitiesList.length;
		//$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	});

	$scope.selectPage = function() {
		//$scope.filteredVirtualentitiesList = $scope.virtualentitiesList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchCodeFilter = function(virtualentity) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(virtualentity.codeVirtualEntity);
	};

	$scope.searchStatusFilter = function(virtualentity) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(virtualentity.deploymentStatusDesc);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
//		$scope.totalItems = $scope.filteredVirtualentitiesList.length;
	});

	$scope.selectedVirtualentities = [];

	$scope.isSelected = function(virtualentity) {
		return $scope.selectedVirtualentities.indexOf(virtualentity) >= 0;
	};

	$scope.isInternal = function(virtualentity) {
		return virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.updateSelection = function($event, virtualentity) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, virtualentity);
	};	
	var updateSelected = function(action, virtualentity) {
		if (action === 'add' && $scope.selectedVirtualentities.indexOf(virtualentity) === -1) {
			$scope.selectedVirtualentities.push(virtualentity);
		}
		if (action === 'remove' && $scope.selectedVirtualentities.indexOf(virtualentity) !== -1) {
			$scope.selectedVirtualentities.splice($scope.selectedVirtualentities.indexOf(virtualentity), 1);
		}
	};

	$scope.editVirtualentity = function(){
		if($scope.selectedVirtualentities.length===1){
			$location.path('management/editVirtualentity/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+ $scope.selectedVirtualentities[0].codeVirtualEntity );
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteStream = function(){
		//FIXME forse codice morto!!
//		alert("Funzionalita non ancora abilitata!");
		if($scope.selectedVirtualentities.length>0){
			console.debug("delete Stream");
			//$location.path('management/editStream/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+$scope.selectedVirtualentities[0].codiceVirtualEntity+'/'+$scope.selectedVirtualentities[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};

	$scope.deleteVirtualentity = function(){
//		alert("Funzionalita non ancora abilitata!");
		if($scope.selectedVirtualentities.length>0){
			console.debug("delete VE");
			//$location.path('management/editStream/'+$scope.selectedVirtualentities[0].codiceTenant +'/'+$scope.selectedVirtualentities[0].codiceVirtualEntity+'/'+$scope.selectedVirtualentities[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);

appControllers.controller('ManagementNewVirtualentityCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice', 'info', function($scope, $route, $location, fabricAPIservice, info) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.categoriesList = [];
	fabricAPIservice.getVirtualentityCategories().success(function(response) {
		$scope.categoriesList = response.categoriaVirtualEntity.element;
	});

	$scope.typesList = [];
	fabricAPIservice.getVirtualentityTypes().success(function(response) {
		for (var int = 0; int < response.tipoVirtualEntity.element.length; int++) {
			var virtualentity = response.tipoVirtualEntity.element[int];

			if(virtualentity.idTipoVirtualEntity != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
				$scope.typesList.push(virtualentity);
		}

		//$scope.typesList = response.tipoVirtualEntity.element;
	});
	$scope.codeVirtualEntity;
	$scope.generateUUID = function(virtualentity){
		console.log("ui");
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		$scope.codeVirtualEntity = uuid;
	};

	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
	$scope.validationPatternUUID = (function() {
		return {
			test: function(value) {
				if( $scope.selectedType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ) return true;
				else return Constants.VALIDATION_PATTERN_UUID.test(value);
			}
		};
	})();

	$scope.selectedType;
	$scope.selectedFeedTweetType=false;
	$scope.selectedCategory = null;
	$scope.creationError = null;
	$scope.isDevice = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isInternal = function() {
		if(!$scope.selectedType)
			return false;
		return $scope.selectedType.idTipoVirtualEntity == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.isCodeRequired = function() {
		console.debug("isCodeRequired function $scope.selectedType ::",$scope.selectedType);
		if(!$scope.selectedType){
			return false;
		}
		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ||  $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};

	$scope.enableCodeGeneateButton = function() {
		if(!$scope.selectedType){
			return false;
		}
		return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};

	$scope.isCategoryRequired= function() {
		console.debug("isCategoryRequired function $scope.selectedType ::",$scope.selectedType);
		if(!$scope.selectedType){
			return false;
		}
		//return $scope.selectedType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
		return true;
	};


	$scope.selectTypeChange = function() {
		console.debug("selectTypeChange function $scope.selectedType ::", $scope.selectedType);
		$scope.codeVirtualEntity = "";
		$scope.selectedCategory = null;
		return true;
	};



	$scope.createVirtualentity = function(virtualentity) {
		console.log("virtualentity", virtualentity);
		if(!virtualentity)
			virtualentity = new Object();

		virtualentity.idTipoVe = $scope.selectedType;
		if($scope.selectedCategory)
			virtualentity.idCategoriaVe = $scope.selectedCategory.idCategoria;

		var newVirtualentity = new Object();
		newVirtualentity.codeVirtualEntity = $scope.codeVirtualEntity;
		newVirtualentity.virtualEntity = virtualentity;

		console.log("newVirtualentity", newVirtualentity);

		var promise   = fabricAPIservice.createVirtualentity($scope.tenantCode, $scope.codeVirtualEntity,  newVirtualentity);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editVirtualentity/'+$scope.tenantCode +'/'+$scope.codeVirtualEntity);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	

	$scope.cancel = function(){    
		$location.path('management/virtualentities'+'/'+$scope.tenantCode);
	};
} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'info', function($scope, $routeParams, fabricAPIservice, info) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.updateInfo = null;
	$scope.updateError = null;

	$scope.virtualentity = null;

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternInteger = Constants.VALIDATION_PATTERN_INTEGER;


	$scope.loadVirtualentity = function(){
		fabricAPIservice.getVirtualentity($routeParams.tenant_code, $routeParams.entity_code).success(function(response) {
			$scope.virtualentity = response.virtualEntities.virtualEntity;
			if(!$scope.virtualentity.virtualEntityPositions)
				$scope.virtualentity.virtualEntityPositions = {};
			$scope.virtualentity.virtualEntityPositions.position = Helpers.util.initArrayZeroOneElements($scope.virtualentity.virtualEntityPositions.position);
			if($scope.virtualentity.virtualEntityPositions.position.length == 0){
				$scope.virtualentity.virtualEntityPositions.position.push({});
				$scope.virtualentity.virtualEntityPositions.position[0].room = 0;
			}
			Helpers.util.cleanNilInField($scope.virtualentity);
		});
	};

	$scope.loadVirtualentity();

	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	$scope.cancel = function(){
		$location.path('management/virtualentities');
	};

	$scope.isDevice = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isInternal = function() {
		if(!$scope.virtualentity || !$scope.virtualentity.tipoVirtualEntity)
			return false;
		return $scope.virtualentity.idTipoVe == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};


	$scope.updateVirtualentity = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();

		var newVirtualentity = new Object();
		// FIXME remove when api will be updated
		if($scope.virtualentity.virtualEntityPositions && 
				$scope.virtualentity.virtualEntityPositions.position &&
				$scope.virtualentity.virtualEntityPositions.position.length>0){
			if(!$scope.virtualentity.virtualEntityPositions.position[0].lon)
				$scope.virtualentity.virtualEntityPositions.position[0].lon = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].lat)
				$scope.virtualentity.virtualEntityPositions.position[0].lat = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].elevation)
				$scope.virtualentity.virtualEntityPositions.position[0].elevation = 0;
			if(!$scope.virtualentity.virtualEntityPositions.position[0].floor)
				$scope.virtualentity.virtualEntityPositions.position[0].floor = 0;

		}
		else{
		}

		newVirtualentity.virtualEntity =  $scope.virtualentity;
		console.log("newVirtualentity", newVirtualentity);
		var promise   = fabricAPIservice.updateVirtualentity(newVirtualentity);
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



appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', 'fabricAPIservice', function($scope, fabricAPIservice) {

	$scope.tenantsList = null;

	fabricAPIservice.getTenants().success(function(response) {
		console.log("response",response);
		$scope.tenantsList = response.tenants.tenant;
		console.log("$scope.tenantsList",$scope.tenantsList);

	});

} ]);


/* Dataset */
appControllers.controller('ManagementDatasetListCtrl', [ '$scope', '$route', '$location', 'fabricAPImanagement', 'info', function($scope, $route, $location, fabricAPImanagement, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;

	$scope.datasetList = [];
	$scope.filteredDatasetsList = [];
	$scope.nameFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.datasetList.length;
	$scope.predicate = '';

	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	fabricAPImanagement.getDatasets($scope.tenantCode).success(function(response) {
		$scope.showLoading = false;

		$scope.datasetList = response;
		$scope.totalItems = $scope.datasetList.length;
	});


	$scope.selectPage = function() {
		//$scope.filteredStreamsList = $scope.streamsList.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);
	};

	$scope.searchNameFilter = function(dataset) {
		console.log("$scope.nameFilter", $scope.nameFilter);
		console.log("dataset.metadata", dataset);
		var keyword = new RegExp($scope.nameFilter, 'i');

		return !$scope.nameFilter || (dataset.info.datasetName && keyword.test(dataset.info.datasetName));
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
		console.log("newName", newName);
	});


	$scope.selectedDatasets = [];

	$scope.isSelected = function(dataset) {
		return $scope.selectedDatasets.indexOf(dataset) >= 0;
	};

	$scope.updateSelection = function($event, dataset) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, dataset);
	};

	var updateSelected = function(action, dataset) {
		if (action === 'add' && $scope.selectedDatasets.indexOf(dataset) === -1) {
			$scope.selectedDatasets.push(dataset);
		}
		if (action === 'remove' && $scope.selectedDatasets.indexOf(dataset) !== -1) {
			$scope.selectedDatasets.splice($scope.selectedDatasets.indexOf(dataset), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].configData && $scope.selectedDatasets[0].configData.type == "dataset" && $scope.selectedDatasets[0].configData.subtype == "bulkDataset")){
			return true;
		}
		return false;
	};




	$scope.editDataset = function(){
		if($scope.selectedDatasets.length===1){

			$location.path('management/editDataset/'+$scope.tenantCode +'/'+$scope.selectedDatasets[0].datasetCode);
		}
		else{
			// FIXME error message...
		}
	};
	$scope.deleteDataset = function(){
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedDatasets.length>0){

			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].codiceStream);
		}
		else{
			// FIXME error message...
		}
	};
} ]);


appControllers.controller('ManagementNewDatasetCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice','fabricAPImanagement', 'info', function($scope, $route, $location, fabricAPIservice, fabricAPImanagement, info) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.creationError = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;

	$scope.createDataset = function(dataset) {
		var newDataset = dataset;
		newDataset.configData.tenant=$scope.tenantCode;
		newDataset.configData.datasetversion=$scope.tenantCode;
		newDataset.configData.type = "dataset";
		newDataset.configData.subtype = "bulkDataset";
		console.log("dataset qui ", newDataset);

		var promise   = fabricAPImanagement.createDataset($scope.tenantCode, newDataset);
		promise.then(function(result) {
			console.log("result qui ", result);
			$location.path('management/editDataset/'+$scope.tenantCode +'/'+result.data.id);
		}, function(result) {
			$scope.creationError = angular.fromJson(result.data);
			console.log("result.data ", result.data);
		}, function(result) {
			console.log('Got notification: ' + result);
		});
	};	

	$scope.cancel = function(){
		$location.path('management/streams'+'/'+$scope.tenantCode);
	};
} ]);

appControllers.controller('ManagementDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPIservice', 'fabricAPImanagement', '$location', 'info', 'readFilePreview',
                                                     function($scope, $routeParams, fabricAPIservice, fabricAPImanagement, $location, info,readFilePreview) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;
	$scope.downloadCsvUrl = Constants.API_MANAGEMENT_DATASET_DOWNLOAD_URL + $scope.tenantCode + '/' + $scope.datasetCode + '/csv';

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.updateInfo = null;
	$scope.updateError = null;


	$scope.tagList = [];
	$scope.domainList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
	});


	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
	});





	$scope.dataset = null;
	$scope.stream = null;
	$scope.apiMetdataUrl = "";


//	if($scope.dataset.columns == null)
//	$scope.dataset.columns = new Object();
//	$scope.dataset.columns.column = Helpers.util.initArrayZeroOneElements($scope.dataset.columns.column);

	$scope.loadDataset = function(){
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.datasetCode).success(function(response) {
			console.debug("loadDataset- response",response);
			$scope.apiMetdataUrl = response.apiMetadataUrl;
			$scope.dataset = response.metadata;
			$scope.stream = response.stream;
			if(!$scope.dataset)
				$scope.dataset = new Object();
			if(!$scope.dataset.info)
				$scope.dataset.info = new Object();
			if(!$scope.dataset.info.tags)
				$scope.dataset.info.tags = [];

			$scope.dataset.info.visibility = 'public';
			if(!$scope.dataset.info.icon || $scope.dataset.info.icon == null)
				$scope.dataset.info.icon  = "img/dataset-icon-default.png";

		});

	};

	$scope.loadDataset();

	$scope.newTag = null;
	$scope.addTag = function(){
		if($scope.newTag){
			var found = false;	
			for (var int = 0; int < $scope.dataset.info.tags.length; int++) {
				var existingTag = $scope.dataset.info.tags[int];
				if(existingTag.tagCode == $scope.newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.dataset.info.tags.push({"tagCode":$scope.newTag});
		}
		$scope.newTag = null;
		return false;

	};

	$scope.removeTag = function(index){
		$scope.metadata.info.tags.splice(index,1);
		return false;
	};
	
	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readIconPreview();
	};
	
	var readIconPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.dataset.info.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	$scope.canEdit = function() {
		return ($scope.dataset && $scope.dataset.configData && $scope.dataset.configData.type == "dataset" && $scope.dataset.configData.subtype == "bulkDataset");
	};

	$scope.canAddData = function() {
		return ($scope.dataset && $scope.dataset.configData && $scope.dataset.configData.type == "dataset" && $scope.dataset.configData.subtype == "bulkDataset");
	};

	$scope.updateDataset = function() {
		var newDataset =  $scope.dataset;

		if(!newDataset.info.tags && newDataset.info.tags.length==0){
			newDataset.info.tags = null;
		}

		$scope.updateInfo = null;
		$scope.updateError = null;
		Helpers.util.scrollTo();
		
		console.log("updateDataset newDataset ", newDataset);


		var promise   = fabricAPImanagement.updateDataset($scope.tenantCode, $scope.datasetCode, newDataset);

		promise.then(function(result) {
			if(result.errors && data.errors.length>0){
				$scope.updateError = true;
				$scope.updateErrors = data.errors;
				Helpers.util.scrollTo();
			}
			else{
				$scope.updateInfo = {status: "Ok"};
				$scope.loadDataset();
			}
		}, function(result) {
			$scope.updateError = true;
			$scope.updateErrors = angular.fromJson(result.data);
			console.log("result.data ", result.data);
			$scope.loadDataset();
		}, function(result) {
			console.log('Got notification: ' + result);
		});


	};	

	$scope.requestInstallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST);
	};

	$scope.requestUnistallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST);
	};

	$scope.createNewVersion = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION);
	};

	var updateLifecycle = function(action) {
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
//		$scope.updateInfo = null;
//		$scope.updateError = null;
//		Helpers.util.scrollTo();
//		var promise   = fabricAPIservice.lifecycleStream(action, $scope.stream);
//		promise.then(function(result) {
//		console.log("result updateLifecycle ", result);
//		//$scope.updateInfo = angular.fromJson(result.data);  //FIXME when the api will be ready
//		$scope.updateInfo = {status: result.status};
//		$scope.loadStream();
//		}, function(result) {
//		$scope.updateError = angular.fromJson(result.data);
//		console.log("result.data ", result.data);
//		$scope.loadStream();
//		}, function(result) {
//		console.log('Got notification: ' + result);
//		});
	};
} ]);



appControllers.controller('ManagementUploadDatasetCtrl', [ '$scope', '$routeParams', 'fabricAPImanagement', 'info', '$upload', 'readFilePreview','$translate',  
                                                           function($scope, $routeParams, fabricAPImanagement, info, $upload, readFilePreview, $translate) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	$scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;
	$scope.choosenFileSize = null;
	$scope.selectedFile = null;
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;
	$scope.updateErrors = null;
	console.log("uploadData START", $scope.datasetCode);

	$scope.formatList = ["csv"];

	$scope.csvSeparator = ";";
	$scope.fileEncoding = "UTF-8";
	$scope.importFileType = "csv";
	$scope.csvSkipFirstRow = true;

	$scope.dataset = null;

	$scope.loadDataset = function(){
		fabricAPImanagement.getDataset($scope.tenantCode, $scope.datasetCode).success(function(response) {
			console.debug("loadDataset- response",response);
			$scope.dataset = response.metadata;
			if(!$scope.dataset)
				$scope.dataset = new Object();
			if(!$scope.dataset.info)
				$scope.dataset.info = new Object();
			if(!$scope.dataset.info.tags)
				$scope.dataset.info.tags = [];

			$scope.dataset.info.visibility = 'public';
		});

	};

	$scope.loadDataset();

	$scope.onFileSelect = function($files) {
		$scope.selectedFile = $files[0];
		if($scope.selectedFile !=null && $scope.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.choosenFileSize = $scope.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			readPreview();
	};

	$scope.previewLines = [];

	var readPreview = function(){
		$scope.updateInfo = null;
		$scope.updateError = null;
		$scope.updateErrors = null;
		$scope.updateWarning = null;
		readFilePreview.readTextFile($scope.selectedFile, 10000, $scope.fileEncoding).then(
				function(contents){



					var lines = contents.split(/\r\n|\n/);
					console.log("nr righe", lines.length);
					var firstRows = lines.slice(0, 5);
					$scope.previewLines = [];
					console.log("(firstRows.join",firstRows.join("\n"));

					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),$scope.csvSeparator));

					$scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),$scope.csvSeparator);
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};


	$scope.isUploading = false;

	$scope.uploadData = function() {
		$scope.updateInfo = null;
		$scope.updateError = null;
		$scope.updateErrors = null;
		$scope.updateWarning = null;
		console.log("uploadData START");

		$scope.upload = $upload.upload({
			url: Constants.API_MANAGEMENT_DATASET_ADD_DATA_URL + $scope.tenantCode + '/'+ $scope.datasetCode + '/', 

			method: 'POST',
			data: {formatType: $scope.importFileType, 
				csvSeparator: $scope.csvSeparator, encoding: $scope.fileEncoding , skipFirstRow: $scope.csvSkipFirstRow },
				file: $scope.selectedFile, // or list of files ($files) for html5 only
				fileName: $scope.selectedFile.name,

		}).progress(function(evt) {
			$scope.isUploading = true;
			console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(data, status, headers, config) {
			$scope.isUploading = false;
			console.log("upload finish");
			if(data.errors && data.errors.length>0){
				$scope.updateError = true;
				$scope.updateErrors = data.errors;
				Helpers.util.scrollTo();
			}
			else{
				$scope.updateInfo = {status: "Upload OK"};
			}
		});


	};	

} ]);


appControllers.controller('ManagementNewDatasetWizardCtrl', [ '$scope', '$route', '$location', 'fabricAPIservice','fabricAPImanagement','readFilePreview','info', '$upload', 
                                                              function($scope, $route, $location, fabricAPIservice, fabricAPImanagement,readFilePreview, info, $upload) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'upload', 'style':''},
	                      {'name':'columns', 'style':''},
	                      ];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};

	refreshWizardToolbar();

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	$scope.domainList = [];
	fabricAPIservice.getStreamDomains().success(function(response) {
		for (var int = 0; int < response.streamDomains.element.length; int++) {
			$scope.domainList.push(response.streamDomains.element[int].codDomain);
		}
	});

	$scope.tagList = [];
	$scope.domainList = [];
	fabricAPIservice.getStreamTags().success(function(response) {
		for (var int = 0; int < response.streamTags.element.length; int++) {
			$scope.tagList.push(response.streamTags.element[int].tagCode);
		}
	});

	$scope.unitOfMesaurementList = [];
	fabricAPIservice.getStreamUnitOfMesaurement().success(function(response) {
		$scope.unitOfMesaurementList = response.measureUnit.element;
	});

	var defaultDataType = null;
	$scope.dataTypeList = [];
	fabricAPIservice.getStreamDataType().success(function(response) {
		$scope.dataTypeList = response.dataType.element;
		//$scope.dataTypeList.push(coordinatesDataType);
		for (var int = 0; int < $scope.dataTypeList; int++) {
			if($scope.dataTypeList[int].dataType == 'string'){
				console.log("$scope.dataTypeList[int].dataType", $scope.dataTypeList[int].dataType);
				defaultDataType = $scope.dataTypeList[int].dataType;
				break;
			}
		}
	});



	$scope.metadata = {info:{}, configData: {}};
	$scope.metadata.info.icon  = "img/dataset-icon-default.png";
	$scope.metadata.info.visibility = "private";
	$scope.metadata.info.importFileType = "csv";

	$scope.user = {};

	fabricAPIservice.getInfo().success(function(result) {
		console.debug("result managementnew stream", result);
		$scope.user = result.user;
		console.debug("info user", $scope.user);
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.metadata.info.requestorName=$scope.user.firstname;
			$scope.metadata.info.requestorSurname=$scope.user.lastname;
			$scope.metadata.info.requestornEmail=$scope.user.email;
		}
	});

	$scope.newTag = null;
	$scope.addTag = function(newTag){
		console.log("addTag", newTag);
		if(newTag){
			if(! $scope.metadata.info.tags)
				$scope.metadata.info.tags = [];

			var found = false;	
			for (var int = 0; int < $scope.metadata.info.tags.length; int++) {
				var existingTag = $scope.metadata.info.tags[int];
				if(existingTag.tagCode == newTag){
					found = true;
					break;
				}

			}
			if(!found)
				$scope.metadata.info.tags.push({"tagCode":newTag});
		}
		return false;

	};

	$scope.removeTag = function(index){
		$scope.metadata.info.tags.splice(index,1);
		return false;
	};

	$scope.creationError = null;
	$scope.saveError = null;
	$scope.saveErrors = null;

	$scope.accettazionePrivacy=0;
	$scope.accettazioneResponsability=0;


	$scope.selectedFile = null;
	$scope.uploadDatasetError = null;
	$scope.uploadDatasetInfo = null;

	$scope.formatList = ["csv"];

	$scope.csvSeparator = ";";
	$scope.fileEncoding = "UTF-8";
	$scope.csvSkipFirstRow = true;

	$scope.choosenFileSize = null;
	$scope.updateWarning = null;
	$scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;
	$scope.choosenFileSize = null;

	
	$scope.selectedIcon;
	$scope.onIconSelect = function($files) {
		$scope.selectedIcon = $files[0];
		if($scope.selectedIcon !=null && $scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
			$scope.choosenIconSize = $scope.selectedIcon.size; 
			$scope.updateWarning = true;
			$scope.selectedIcon = null;
		}
		else
			readIconPreview();
	};

	var readIconPreview = function(){
		readFilePreview.readImageFile($scope.selectedIcon).then(
				function(contents){
					console.log("contents" , contents);
					$scope.metadata.info.icon = contents;
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};

	$scope.onFileSelect = function($files) {
		$scope.updateWarning = null;
		$scope.selectedFile = $files[0];
		if($scope.selectedFile !=null && $scope.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.choosenFileSize = $scope.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			readPreview();
	};

	$scope.previewLines = [];
	$scope.previewColumns = [];



	var readPreview = function(){
		$scope.uploadDatasetError = null;
		readFilePreview.readTextFile($scope.selectedFile, 10000, $scope.fileEncoding).then(
				function(contents){
					var lines = contents.split(/\r\n|\n/);
					console.log("nr righe", lines.length);
					//console.log(lines);
					var firstRows = lines.slice(0, 5);
					$scope.previewLines = [];
					console.log("(firstRows.join",firstRows.join("\n"));

					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),$scope.csvSeparator));

					$scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),$scope.csvSeparator);


					console.log("$scope.previewLines",$scope.previewLines);

					$scope.metadata.info.fields = [];
					$scope.previewColumns = [];
					console.log("defaultDataType",defaultDataType);
					if($scope.previewLines.length>0){
						for (var int = 0; int < $scope.previewLines[0].length; int++) {
							$scope.previewColumns.push(
									{index: int, 
										sourceColumn: int+1, 
										fieldName: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										fieldAlias: $scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
										dataType: defaultDataType,
										isKey: false, 
										measureUnit: null,
										skipColumn: false});
						}
						$scope.refreshColumnOrder();
					}
					console.log("$scope.previewColumns",$scope.previewColumns);
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};


	$scope.refreshColumnOrder = function(){
		console.log("refreshColumnOrder");
		if($scope.previewColumns && $scope.previewColumns.length>0){
			var order = 1;
			$scope.metadata.info.fields = [];
			for (var int = 0; int < $scope.previewColumns.length; int++) {
				var column  = $scope.previewColumns[int];
				column.index = int;
				if(!column.skipColumn){
					//column.sourceColumn = order;
					var dataType = column.dataType?column.dataType.dataType:'string';
					var measureUnit = column.measureUnit?column.measureUnit.measureUnit:null;
					$scope.metadata.info.fields.push(
							{"sourceColumn":column.sourceColumn, 
								"fieldName":column.fieldName, 
								"fieldAlias":column.fieldAlias, 
								"dataType":dataType, 
								"isKey":column.isKey?1:0, 
								"measureUnit":measureUnit,
								"dateTimeFormat":column.dateTimeFormat}
					);
					order++;
				}

			}
		}
	};


	$scope.onDropCsvFieldComplete=function(fromIndex, toIndex,evt){
		var columToMove = $scope.previewColumns[fromIndex];
		columToMove.dragging = false;
		$scope.previewColumns.splice(fromIndex, 1);
		$scope.previewColumns.splice(toIndex, 0, columToMove);
		$scope.refreshColumnOrder();
	};

	$scope.isDateTimeField = function(field){
		if(field && field.dataType && field.dataType.dataType && field.dataType.dataType == "dateTime")
			return true;
		return false;
	};
	
	$scope.isCoordinatesField = function(field){
		if(field && field.dataType && field.dataType.dataType && field.dataType.dataType == "coordinates")
			return true;
		return false;
	};
	
	$scope.isCommonField = function(field){
		return !$scope.isCoordinatesField(field) && !$scope.isDateTimeField(field);
	};
	
	$scope.cancel = function(){
		$location.path('management/datasets'+'/'+$scope.tenantCode);
	};

	$scope.htmlTooltip = '<div><table class="table table-supercondensed table-dateformat-help">'+
	'	<thead>'+
	'		<tr><th>Letter</th><th>Date or Time</th><th>Presentation</th><th>Examples</th></tr>'+
	'	</thead>'+
	'	<tbody>'+
	'		<tr><td><strong>G</strong></td><td>Era designator</td><td>Text</td><td><strong>AD</strong></td></tr>'+
	'		<tr><td><strong>y</strong></td><td>Year</td><td>Year</td><td><strong>1996</strong>;<strong>96</strong></td></tr>'+
	'		<tr><td><strong>M</strong></td><td>Month in year</td><td>Month</td><td><strong>July</strong>; <strong>Jul</strong>; <strong>07</strong></td></tr>'+
	'		<tr><td><strong>w</strong></td><td>Week in year</td><td>Number</td><td><strong>27</strong></td></tr>'+
	'		<tr><td><strong>W</strong></td><td>Week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
	'		<tr><td><strong>D</strong></td><td>Day in year</td><td>Number</td><td><strong>189</strong></td></tr>'+
	'		<tr><td><strong>d</strong></td><td>Day in month</td><td>Number</td><td><strong>10</strong></td></tr>'+
	'		<tr><td><strong>F</strong></td><td>Day of week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
	'		<tr><td><strong>E</strong></td><td>Day in week</td><td>Text</td><td><strong>Tuesday</strong>; <strong>Tue</strong></td></tr>'+
	'		<tr><td><strong>a</strong></td><td>Am/pm marker</td><td>Text</td><td><strong>PM</strong></td></tr>'+
	'		<tr><td><strong>H</strong></td><td>Hour in day (0-23)</td><td>Number</td><td><strong>0</strong></td></tr>'+
	'		<tr><td><strong>k</strong></td><td>Hour in day (1-24)</td><td>Number</td><td><strong>24</strong></td></tr>'+
	'		<tr><td><strong>K</strong></td><td>Hour in am/pm (0-11)</td><td>Number</td><td><strong>0</strong></td></tr>'+
	'		<tr><td><strong>h</strong></td><td>Hour in am/pm (1-12)</td><td>Number</td><td><strong>12</strong></td></tr>'+
	'		<tr><td><strong>m</strong></td><td>Minute in hour</td><td>Number</td><td><strong>30</strong></td></tr>'+
	'		<tr><td><strong>s</strong></td><td>Second in minute</td><td>Number</td><td><strong>55</strong></td></tr>'+
	'		<tr><td><strong>S</strong></td><td>Millisecond</td><td>Number</td><td><strong>978</strong></td></tr>'+
	'		<tr><td><strong>z</strong></td><td>Time zone</td><td>General time zone</td><td><strong><span title="Pacific Standard Time; PST; GMT-08:00">Pacific Standard Time; PST; &hellip;</td></tr>'+
	'		<tr><td><strong>Z</strong></td><td>Time zone</td><td>RFC 822 time zone</td><td><strong>-0800</strong></td>'+
	'	</tbody>'+
	'</table>' + 
	'   </div>'+
	'   <div class="alert">For detail refer to <a href="http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html" target="_blank" class="alert-link">Java Date Format</a></div>' +
	'   <div class="alert alert-info"><strong><i class="glyphicon glyphicon-time"></i></strong>&nbsp;Default timezone <strong>Europe/Rome</strong></div>';
	
	
	$scope.goToStart  = function(){ $scope.currentStep = 'start'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToUpload  = function(){  $scope.currentStep = 'upload';refreshWizardToolbar();};
	$scope.goToColumns  = function(){readPreview(); $scope.currentStep = 'columns';refreshWizardToolbar();};

	$scope.isUploading = false;

	$scope.createDataset = function(dataset) {
		$scope.saveError = null;
		$scope.saveErrors = null;
		console.log("createDataset START", dataset);
		var newDataset = dataset;
		newDataset.configData.tenantCode=$scope.tenantCode;
		newDataset.configData.type = "dataset";
		newDataset.configData.subtype = "bulkDataset";
		console.log("dataset qui ", newDataset);

		$scope.upload = $upload.upload({
			url: Constants.API_MANAGEMENT_DATASET_URL + $scope.tenantCode + '/', 

			method: 'POST',
			data: {dataset: newDataset, formatType: $scope.metadata.info.importFileType, csvSeparator: $scope.csvSeparator, encoding: $scope.fileEncoding, skipFirstRow: $scope.csvSkipFirstRow },
			file: $scope.selectedFile, // or list of files ($files) for html5 only
			fileName: $scope.selectedFile.name,

		}).progress(function(evt) {
			$scope.isUploading = true;
			console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(data, status, headers, config) {
			$scope.isUploading = false;
			console.log("data loaded");
			if(data.errors && data.errors.length>0){
				$scope.saveError = true;
				$scope.saveErrors = data.errors;
				Helpers.util.scrollTo();
			}
			else{
				$location.path('/management/viewDataset/'+$scope.tenantCode+"/"+data.metadata.datasetCode);
			}

		});


	};	

} ]);


