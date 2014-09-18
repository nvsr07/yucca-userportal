var Helpers = Helpers || {};

Helpers.stream = {
	wsOutputUrl: function(stream) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var virtualentity_stream = "";
		
		if(!Helpers.util.isStringEmpty(stream.codiceVirtualEntity) && !Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream = stream.codiceVirtualEntity+ "_"+ stream.codiceStream;
		else if(!Helpers.util.isStringEmpty(stream.codiceVirtualEntity))
			virtualentity_stream = stream.codiceVirtualEntity;
		else  if(!Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream += stream.codiceStream;

		var result  = "/topic/output."+stream.codiceTenant+"."+virtualentity_stream;
		return result;
	},
	wsStatUrl: function(stream){
		var result = Helpers.stream.wsOutputUrl(stream)+".stat";
		return result;
	},
	wsErrorUrl: function(stream){
		var result = Helpers.stream.wsOutputUrl(stream)+".errors";
		return result;
	},
};

Helpers.util = {
	isStringEmpty: 	function(str) {
	    return (!str || 0 === str.length);
	},
	initArrayZeroOneElements: function(obj){
		var result = [];
		if(obj){
			if(obj instanceof Array){
				result = obj;
			}
			else{
				result.push(obj);
			}
		}
		return result;
	},
	
	cleanNilInField: function(obj){
		if(obj){
			for (var property in obj) {
			    if (obj.hasOwnProperty(property)){
			    	if(typeof(obj[property]) === 'object' && obj[property] !=null && obj[property]["@nil"]){
			    		obj[property] = null;
			    	}
			    }
			}

		}
	},
	
	scrollTo: function(elementId){
		var top= 0
		if(elementId)
			top= $('#'+elementId).offset().top;
		
		$('html,body').animate({scrollTop:top}, 500);

	}
};

Helpers.errors = {
		wsErrorUrl : function(tenantCode){
			var result  = "/topic/output."+tenantCode+".errors";
			return result;
		}
		
};