appServices.factory('metadataapiAPIservice',["$http","$q","info", function($http, $q,info) {

	var metadataapiAPI = {};


	metadataapiAPI.search = function(apiVersion,q, lang, pagination,filter, geolocalization, facet) {
		if(apiVersion==null)
			apiVersion= 'v02';
		
		var metadataapiUrl = Constants.API_METADATA_URL + apiVersion + '/search?callback=JSON_CALLBACK';
		
		
		
		
		if(q!=null) 
			metadataapiUrl += '&q='+q;
		
		if(lang!=null) 
			metadataapiUrl += '&lang='+lang;
		
		if(pagination!=null){
			if(typeof pagination.start != 'undefined' && pagination.start!=null) 
				metadataapiUrl += '&start='+pagination.start;
			if(typeof pagination.rows != 'undefined' && pagination.rows!=null) 
				metadataapiUrl += '&rows='+pagination.rows;
			if(typeof pagination.sort != 'undefined' && pagination.sort!=null) 
				metadataapiUrl += '&sort='+pagination.sort;
		}
		
		if(filter!=null){
			if(typeof filter.tenantCode != 'undefined' && filter.tenantCode!=null && filter.tenantCode.length>0) 
				metadataapiUrl += '&tenant='+filter.tenantCode.join(",");
			if(typeof filter.organizationCode != 'undefined' && filter.organizationCode!=null && filter.organizationCode.length>0) 
				metadataapiUrl += '&organization='+filter.organizationCode.join(",");
			if(typeof filter.domainCode != 'undefined' && filter.domainCode!=null && filter.domainCode.length>0) 
				metadataapiUrl += '&domain='+filter.domainCode.join(",");
			if(typeof filter.subdomain != 'undefined' && filter.subdomain !=null && filter.subdomain.length>0) 
				metadataapiUrl += '&subdomain='+filter.subdomain.join(",");
			if(typeof filter.tagCode != 'undefined' && filter.tagCode!=null && filter.tagCode.length>0) 
				metadataapiUrl += '&tags='+filter.tagCode.join(",");
			if(typeof filter.opendata != 'undefined' && filter.opendata!=null) 
				metadataapiUrl += '&opendata='+opendata;
			
			if(typeof filter.visibility != 'undefined' && filter.visibility!=null) 
				metadataapiUrl += '&visibility='+filter.visibility;
			if(typeof filter.opendata != 'undefined' && filter.opendata!=null) 
				metadataapiUrl += '&opendata='+opendata;
			if(typeof filter.isSearchExact != 'undefined' && filter.isSearchExact!=null) 
				metadataapiUrl += '&isSearchExact='+filter.isSearchExact;
			if(typeof filter.includeSandbox != 'undefined' && filter.includeSandbox!=null) 
				metadataapiUrl += '&includeSandbox='+filter.includeSandbox;
			if(typeof filter.hasStream != 'undefined' && filter.hasStream!=null) 
				metadataapiUrl += '&hasStream='+hasStream;
			if(typeof filter.hasDataset != 'undefined' && filter.hasDataset!=null) 
				metadataapiUrl += '&hasDataset='+hasDataset;

			if(typeof filter.entityType != 'undefined' && filter.entityType!=null){
				for (var entityTypeIndex = 0; entityTypeIndex < filter.entityType.length; entityTypeIndex++) {
					if(filter.entityType[entityTypeIndex] == 'stream')
						metadataapiUrl += '&hasStream=true';
					if(filter.entityType[entityTypeIndex] == 'dataset')
						metadataapiUrl += '&hasDataset=true';
						
				}
			}
				
		}
		
		console.log("filter", filter);
		
		if(geolocalization!=null){
			if(typeof geolocalization.geolocalized != 'undefined' && geolocalization.geolocalized!=null) 
				metadataapiUrl += '&geolocalized='+geolocalization.geolocalized;
			if(typeof geolocalization.minLat != 'undefined' && geolocalization.minLat!=null) 
				metadataapiUrl += '&minLat='+geolocalization.minLat;
			if(typeof geolocalization.minLon != 'undefined' && geolocalization.minLon!=null) 
				metadataapiUrl += '&minLon='+geolocalization.minLon;
			if(typeof geolocalization.maxLat != 'undefined' && geolocalization.maxLat!=null) 
				metadataapiUrl += '&maxLat='+geolocalization.maxLat;
			if(typeof geolocalization.maxLon != 'undefined' && geolocalization.maxLon!=null) 
				metadataapiUrl += '&maxLon='+geolocalization.maxLon;
		}

		
		
	
		if(facet!=null){
			if(typeof facet.field != 'undefined' && facet.field!=null) 
				metadataapiUrl += '&facet.field='+ facet.field;
			if(typeof facet.prefix != 'undefined' && facet.prefix!=null) 
				metadataapiUrl += '&facet.prefix='+ facet.prefix;
			if(typeof facet.sort != 'undefined' && facet.sort!=null) 
				metadataapiUrl += '&facet.sort='+ facet.sort;
			if(typeof facet.contains != 'undefined' && facet.contains!=null){
				metadataapiUrl += '&facet.contains='+ facet.contains;
				if(typeof facet.contains.ignoreCase != 'undefined' && facet.contains.ignoreCase!=null) 
					metadataapiUrl += '&facet.contains.ignoreCase='+ facet.contains.ignoreCase;
			}
			if(typeof facet.limit != 'undefined' && facet.limit!=null)
				metadataapiUrl += '&facet.limit='+ facet.limit;
			if(typeof facet.offset != 'undefined' && facet.offset!=null) 
				metadataapiUrl += '&facet.offset='+ facet.offset;
			if(typeof facet.mincount != 'undefined' && facet.mincount!=null) 
				metadataapiUrl += '&facet.mincount='+ facet.mincount;
			if(typeof facet.missing != 'undefined' && facet.missing!=null) 
				metadataapiUrl += '&facet.missing='+ facet.missing;

		}
		

		console.log("metadataapiAPI.search - metadataapiUrl", metadataapiUrl);
		return $http({
			method : 'JSONP',
			url : metadataapiUrl
		});
	};
	
	metadataapiAPI.detailStream = function(apiVersion,tenantCode, soCode, streamCode) {
		if(apiVersion==null)
			apiVersion= 'v02';
		//http://localhost:8080/metadataapi/api/v02/detail/smartlab/SmartdatanetEventi/artissimaTorino
		var metadataapiUrl = Constants.API_METADATA_URL + apiVersion + '/detail/' + tenantCode + '/' + soCode + '/' + streamCode + '?callback=JSON_CALLBACK';

		console.log("metadataapiAPI.detailStream - metadataapiUrl", metadataapiUrl);
		return $http({
			method : 'JSONP',
			url : metadataapiUrl
		});
	};
	
	metadataapiAPI.detailDataset = function(apiVersion,datasetCode) {
		if(apiVersion==null)
			apiVersion= 'v02';
		//http://localhost:8080/metadataapi/api/v02/detail/smartlab/SmartdatanetEventi/artissimaTorino
		var metadataapiUrl = Constants.API_METADATA_URL + apiVersion + '/detail/' + datasetCode + '?callback=JSON_CALLBACK';

		console.log("metadataapiAPI.detailDataset - metadataapiUrl", metadataapiUrl);
		return $http({
			method : 'JSONP',
			url : metadataapiUrl
		});
	};


	return metadataapiAPI;
}]);
