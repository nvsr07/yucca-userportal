appServices.factory('storeAPIservice',["$http","$q","info", "$location", function($http, $q,info, $location) {

	var storeAPI = {};
	
	var host = "";

	getStoreBaseUrl = function(){
		var host = $location.host();
		if(host == 'localhost')
			baseUrl = 'https://int-userportal.smartdatanet.it';
		else{
			var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
			baseUrl = 'https://'+env+'userportal.smartdatanet.it';
		}
		return baseUrl;
	}
	

	storeAPI.getApplications = function() {
		return $http({
			method : 'GET',
			url : getStoreBaseUrl()+'/store/site/blocks/application/application-list/ajax/application-list.jag?action=getApplications',
			responseType :'json'
		});
	};

	storeAPI.getSubscriptions = function() {
		return $http({
			method : 'GET',
			//url : 'https://int-userportal.smartdatanet.it/store/site/blocks/subscription/subscription-list/ajax/subscription-list.jag?action=getAllSubscriptions',
			url : getStoreBaseUrl()+'/store/site/blocks/subscription/subscription-list/ajax/subscription-list.jag?action=getAllSubscriptions&application=s',
			responseType :'json'
		});
		
	};
	
	return storeAPI;
}]);

