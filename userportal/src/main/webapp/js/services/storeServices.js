appServices.factory('storeAPIservice',["$http","$q","info", function($http, $q,info) {

	var storeAPI = {};

	storeAPI.getApplications = function() {
		return $http({
			method : 'JSONP',
			url : 'https://int-userportal.smartdatanet.it/store/site/blocks/application/application-list/ajax/application-list.jag?action=getApplications',
			responseType :'json'
		});
	};

	storeAPI.getSubscriptions = function() {
		return $http({
			method : 'JSONP',
			url : 'https://int-userportal.smartdatanet.it/store/site/blocks/subscription/subscription-list/ajax/subscription-list.jag?action=getAllSubscriptions',
			responseType :'json'
		});
		
	}
	
	return storeAPI;
}]);

