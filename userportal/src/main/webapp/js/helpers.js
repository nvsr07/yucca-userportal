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
	
	isNumber: function (n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
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
					if (i == elementIndex - 1)
						result.push(array[i + 1]);
					else if (i == elementIndex)
						result.push(array[i - 1]);
					else
						result.push(array[i]);

				}
			}
		}
		return result;
	},

	capitaliseFirstLetter:function (input)
	{
		if(input && input!=null)
			return string.charAt(0).toUpperCase() + string.slice(1);
		return "";
	}, 
	
	CSVtoArray : function(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		// Standard fields.
		"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [ [] ];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[1];
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
			} else {
				// We found a non-quoted value.
				strMatchedValue = arrMatches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}
		// Return the parsed data.
		return (arrData);
	}
};

Helpers.mongo = {
		date2millis : function(dateIn) {
			var time = null;
			if(dateIn){
				var offset = new Date().getTimezoneOffset();
				var parts = /\/Date\((-?\d+)([+-]\d{4})?.*/.exec(dateIn);

				if (parts[2] == undefined)
				    parts[2] = 0;
	                        var p  = parseInt(parts[2]);
				time = new Date(parts[1] - (p * 60000));
			}
			return time;
		}
};

Helpers.errors = {
	wsErrorUrl : function(tenantCode) {
		var result = "/topic/output." + tenantCode + ".errors";
		return result;
	}
};


Helpers.render = {
		
	safeTags : function (stringIn) {
		var stringOut = "";
		if(stringIn && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				stringOut = stringIn.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
			else 
				stringOut = stringIn;
		}
	    return stringOut;   

	},
		
	prettifyTwitterUser : function(stringIn){
		var outString = "";
		if(stringIn && stringIn!=null)
			outString = stringIn.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<span class="tweet-user">$2</span>');
		return outString;
	},
	prettifyTwitterHashtag : function(stringIn){
		var outString = "";
		if(stringIn && stringIn!=null)
			outString = stringIn.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<span class="tweet-hashtag">$2</span>');
		return outString;
	},
	linkify: function(stringIn) {
		var outString = "";
		if(stringIn && stringIn!=null){

			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string"){
			    var  replacePattern1, replacePattern2, replacePattern3;
		
			    //URLs starting with http://, https://, or ftp://
			    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			    outString = stringIn.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
		
			    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
			    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			    outString = outString.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
		
			    //Change email addresses to mailto:: links.
			    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
			    outString = outString.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
			} else 
				stringOut = stringIn;
		}

		return outString;
	},
	prettifyTwitterMessage: function(stringIn){
		var pretty  = Helpers.render.safeTags(stringIn);
		pretty = 	Helpers.render.linkify(pretty);
		pretty = Helpers.render.prettifyTwitterHashtag(pretty);
		pretty = Helpers.render.prettifyTwitterUser(pretty);
		return pretty;
	}
		
};