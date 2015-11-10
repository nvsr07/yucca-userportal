appServices.factory('storeAPIservice',["$http","$q","info", "$location", function($http, $q,info, $location) {

	var storeAPI = {};

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
	
	var transform = function(data){
        return $.param(data);
    };
	

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
	
	storeAPI.addSubscription = function(name, version, provider, applicationId) {
	    var params =  {"action":"addSubscription","name":name,"version":version,"provider": provider, "tier":"Unlimited", "applicationId":applicationId};
		return $http.post(getStoreBaseUrl()+'/store/site/blocks/subscription/subscription-add/ajax/subscription-add.jag?',
				params, 
				{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				transformRequest: transform}
		);
	};
	
	storeAPI.removeSubscription = function(name, version, provider, applicationId) {
	    var params =  {"action":"removeSubscription","name":name,"version":version,"provider": provider, "tier":"Unlimited", "applicationId":applicationId};
		return $http.post(getStoreBaseUrl()+'/store/site/blocks/subscription/subscription-remove/ajax/subscription-remove.jag?',
				params, 
				{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				transformRequest: transform}
		);
	};

	storeAPI.createApplication = function(name, version, provider, application) {
	    var params =  {"action":"addApplication","application":application.name, "tier":"Unlimited", "description":application.description, "callbackUrl":""};
		return $http.post(getStoreBaseUrl()+'/store/site/blocks/application/application-add/ajax/application-add.jag?',
				params, 
				{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				transformRequest: transform}
		);
	};

	storeAPI.updateApplication = function(name, version, provider, application) {
	    var params =  {"action":"updateApplication","applicationOld":application.name, "applicationNew":application.name, "tier":"Unlimited","callbackUrlNew":"", "descriptionNew":application.description};
		return $http.post(getStoreBaseUrl()+'/store/site/blocks/application/application-update/ajax/application-update.jag?',
				params, 
				{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				transformRequest: transform}
		);
	};

	
	return storeAPI;
}]);


