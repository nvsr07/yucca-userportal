appServices.factory('odataAPIservice', function($http, $q,info) {

	var odataAPIservice = {};
	
	odataAPIservice.getStreamData = function(stream_code, filter, skip, top, orderby, collection ) {
		if(!collection || collection == null)
			collection = 'Measures';
		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		
		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : streamDataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};

	odataAPIservice.getStreamDataLastHour = function(stream_code, skip, top, orderby , collection ) {
		if(!collection || collection == null)
			collection = 'Measures';

		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/"+collection+"$format=json";
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		
		var d = new Date();
		var sMonth = d.getUTCMonth()+1;
		if (sMonth.toString().length<2) { sMonth = "0"+sMonth;};
		var sDay = d.getUTCDate();
		if (sDay.toString().length<2) { sDay = "0"+sDay;};
		var sHour = d.getUTCHours();
		sHour=sHour-1;
		if (sHour.toString().length<2) { sHour = "0"+sHour;};
		var sMin = d.getUTCMinutes();
		if (sMin.toString().length<2) { sMin = "0"+sMin;};
		var sSec = d.getUTCSeconds();
		if (sSec.toString().length<2) { sSec = "0"+sSec;};
		 
		var sDate = d.getUTCFullYear()+"-"+sMonth+"-"+sDay+"T"+sHour+":"+sMin+":"+sSec+"+00:00";
		
		streamDataUrl += "&$filter=time ge datetimeoffset'"+sDate+"'";
		
		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : streamDataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};

	odataAPIservice.getMetadata  = function(stream_code) {
		// https://int-api.smartdatanet.it/api/ds_Contgreciaon_201/$metadata
		var metadataUrl = Constants.API_ODATA_URL+stream_code+"/$metadata";

		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : metadataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};
	
	
	odataAPIservice.getBinaryAttachData = function(baseUrl, binaryCode){
		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/Binariomerco_154/DataEntities('5625124873454fcbf9829960')/Binaries?$filter=idBinary%20eq%20%27provaDav2%27&$format=json
		var binaryUrl = Constants.API_ODATA_URL+baseUrl+"?$filter=idBinary eq '"+binaryCode+"'&$format=json";

		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : binaryUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};
	return odataAPIservice;
});

