appServices.factory('odataAPIservice', function($http, $q) {

	var odataAPIservice = {};
	
	odataAPIservice.getStreamData = function(stream_code, skip, top, orderby ) {

		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/Measures?$format=json";
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		
		console.log("streamDataUrl",streamDataUrl);
		
		return $http({
			method : 'JSONP',
			url : streamDataUrl + '&callback=JSON_CALLBACK'
		});
	};

	return odataAPIservice;
});

