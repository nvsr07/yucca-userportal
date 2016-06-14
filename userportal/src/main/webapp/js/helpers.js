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
	
	formatDateForInputHtml5: function(dateIn){
		var dateOut = "";
		try{
			var day = dateIn.getDate();
			var month = 1+ dateIn.getMonth();
			
			dateOut = ""+dateIn.getFullYear()+"-"+(month<10?"0":"")+month+"-"+(day<10?"0":"")+day;
		}
		catch (e) {
			console.error("Helpers.util.formatDateForInputHtml5 - dateIn, error",dateOut, e);
		}

		return dateOut;
		
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

	capitaliseFirstLetter:function (input){
		if(input && input!=null)
			return string.charAt(0).toUpperCase() + string.slice(1);
		return "";
	}, 
	
	arrayContainsString:function (element, array) {
	    if(typeof array != 'undefined' && array!=null)
	    	return (array.indexOf(element) > -1);
	    else
	    	return false;
	},
	
	endsWith:function(str, suffix){
		if(!str || str==null)
			str = "";
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
	},
	
	getMediaTypeFromContentType: function(contentType){
	    var mediaType = null;
	    if(typeof contentType !== 'undefined' && contentType!=null && contentType.indexOf('/')>0){
	    	mediaType = contentType.substring(0, contentType.indexOf('/'));
	        
	    }
	    return mediaType;
	},
	
	getQueryParams: function(qs) {
		var params = {};
		if(typeof qs !== 'undefined' && qs!=null){
		    qs = qs.split('+').join(' ');
	
		    var tokens;
		    var re = /[?&]?([^=]+)=([^&]*)/g;
	
		    while (tokens = re.exec(qs)) {
		        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		    }
		}
	    return params;
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
		},
		date2string : function(dateIn) {
			var formattedDate = "";
			if(dateIn)
				formattedDate = Helpers.mongo.date2millis(dateIn).format("dd/mm/yyyy HH:MM");
			return formattedDate;
		}
};

Helpers.odata = {
		decodeDataType : function(dataTypeOdata) {
			var dataType = "";
			if(dataTypeOdata!=null){
				switch (dataTypeOdata) {
					case "Edm.Boolean":
						dataType = "boolean";
						break;
					case "Edm.DateTime":
					case "Edm.Time":
					case "Edm.DateTimeOffset":
						dataType = "date";
						break;
					case "Edm.Decimal":
					case "Edm.Double":
					case "Edm.Int16":
					case "Edm.Int32":
					case "Edm.Int64":		
						dataType = "number";
						break;
					case "Edm.String":
						dataType = "string";
						break;
					default:
						dataType = "string";
						break;
				}
//				if(dataTypeOdata == "Edm.String")
//					dataType = "string";
			}
		    return dataType;

		    // Not Supported
		    // Edm.SByte
			// Edm.Binary
			// Edm.Byte
			// Edm.Guid
			// Edm.Single
			// Edm.Geography
			// Edm.GeographyPoint
			// Edm.GeographyLineString
			// Edm.GeographyPolygon
			// Edm.GeographyMultiPoint
			// Edm.GeographyMultiLineString
			// Edm.GeographyMultiPolygon
			// Edm.GeographyCollection
			// Edm.Geometry
			// Edm.GeometryPoint
			// Edm.GeometryLineString
			// Edm.GeometryPolygon
			// Edm.GeometryMultiPoint
			// Edm.GeometryMultiLineString
			// Edm.GeometryMultiPolygon
			// Edm.GeometryCollection
			// Edm.Stream
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
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
			else 
				outString = stringIn;
		}
	    return outString;   

	},
		
	prettifyTwitterUser : function(stringIn){
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/(^|\W)(@[a-z\d][\w-]*)/ig, '$1<span class="tweet-user">$2</span>');
			else 
				outString = stringIn;
		}
		return outString;
	},
	prettifyTwitterHashtag : function(stringIn){
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
			var typeStringIN = typeof stringIn;
			if (typeStringIN == "string")
				outString = stringIn.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<span class="tweet-hashtag">$2</span>');
			else 
				outString = stringIn;
		}
		return outString;
	},
	linkify: function(stringIn) {
		var outString = "";
		if((typeof stringIn != "undefined") && stringIn!=null){
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
				outString = stringIn;
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

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoDateTime2:   "yyyy-mm-dd'+'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
