var Helpers = Helpers || {};

Helpers.stream = {
	wsOutputUrl: function(stream) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var sensor_stream = "";
		
		if(!Helpers.util.isStringEmpty(stream.sensor) && !Helpers.util.isStringEmpty(stream.name))
			sensor_stream = stream.sensor+ "_"+ stream.name;
		else if(!Helpers.util.isStringEmpty(stream.sensor))
			sensor_stream = stream.sensor;
		else  if(!Helpers.util.isStringEmpty(stream.name))
			sensor_stream += stream.name;

		var result  = "/topic/output."+stream.tenant+"."+sensor_stream;
		return result;
	},
	wsStatUrl: function(stream){
		var result = Helpers.stream.wsOutputUrl(stream)+".stat";
		return result;
	},
};

Helpers.util = {
	isStringEmpty: 	function(str) {
		    return (!str || 0 === str.length);
		},
};