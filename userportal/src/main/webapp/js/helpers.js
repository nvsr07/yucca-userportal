var Helpers = Helpers || {};

Helpers.stream = {
	wsOutputUrl : function(stream) {
		// output/csi/550e8400-e29b-41d4-a716-446655440000_thermo_a
		// <tipologia>/<tenant>/<sensore>_<flusso>[/<aux>]
		// "/topic/output.ten1.flussoProva.stat"
		var virtualentity_stream = "";

		if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity) && !Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream = stream.codiceVirtualEntity + "_" + stream.codiceStream;
		else if (!Helpers.util.isStringEmpty(stream.codiceVirtualEntity))
			virtualentity_stream = stream.codiceVirtualEntity;
		else if (!Helpers.util.isStringEmpty(stream.codiceStream))
			virtualentity_stream += stream.codiceStream;

		var result = "/topic/output." + stream.codiceTenant + "." + virtualentity_stream;
		return result;
	},
	wsStatUrl : function(stream) {
		var result = Helpers.stream.wsOutputUrl(stream) + ".stat";
		return result;
	},
	wsErrorUrl : function(stream) {
		var result = Helpers.stream.wsOutputUrl(stream) + ".errors";
		return result;
	},
	statusIcon : function(stream) {
		var icon = "";
		if (stream.deploymentStatusDesc) {
			var cssClass = "";
			switch (stream.deploymentStatusCode) {
			case "draft":
				cssClass = "glyphicon-pencil action-edit";
				break;
			case "req_inst":
				cssClass = "glyphicon-cog action-request-installation";
				break;
			case "inst":
				cssClass = "glyphicon-save action-install";
				break;
			case "req_uninst":
				cssClass = "glyphicon-cog action-uninstall";
				break;
			case "uninst":
				cssClass = "glyphicon-time action-historical";
				break;
			}
			icon = "<span class='glyphicon " + cssClass + "'></span>";
		}

		return icon;
	}
};

Helpers.util = {
	isStringEmpty : function(str) {
		return (!str || 0 === str.length);
	},
	initArrayZeroOneElements : function(obj) {
		var result = [];
		if (obj) {
			if (obj instanceof Array) {
				result = obj;
			} else {
				result.push(obj);
			}
		}
		return result;
	},

	cleanNilInField : function(obj) {
		if (obj) {
			for ( var property in obj) {
				if (obj.hasOwnProperty(property)) {
					if (typeof (obj[property]) === 'object' && obj[property] != null && obj[property]["@nil"]) {
						obj[property] = null;
					}
				}
			}

		}
	},

	scrollTo : function(elementId) {
		var top = 0;
		if (elementId)
			top = $('#' + elementId).offset().top;

		$('html,body').animate({
			scrollTop : top
		}, 500);

	},

	arrayMoveUpElement : function(array, elementIndex) {
		var result = [];
		if (array && array instanceof Array) {
			if (elementIndex >= array.length - 1)
				result = array;
			else {
				for (var i = 0; i < array.length; i++) {
					if (i == elementIndex)
						result.push(array[i + 1]);
					else if (i == elementIndex + 1)
						result.push(array[i - 1]);
					else
						result.push(array[i]);

				}
			}
		}
		return result;
	},
	
	arrayMoveDownElement : function(array, elementIndex) {
		var result = [];
		if (array && array instanceof Array) {
			if (elementIndex <= 0)
				result = array;
			else {
				for (var i = 0; i < array.length; i++) {
					if (i == elementIndex-1)
						result.push(array[i + 1]);
					else if (i == elementIndex)
						result.push(array[i - 1]);
					else
						result.push(array[i]);

				}
			}
		}
		return result;
	}
};

Helpers.errors = {
	wsErrorUrl : function(tenantCode) {
		var result = "/topic/output." + tenantCode + ".errors";
		return result;
	}
};
