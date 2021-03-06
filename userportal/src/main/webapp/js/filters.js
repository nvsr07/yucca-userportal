'use strict';

/* Filters */
var appFilters  = angular.module('userportal.filters', []);

appFilters.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);


appFilters.filter('clearNil', function() {
	return function(input) {
		if (input) {
			if(typeof(input) === 'object' && input !=null && input["@nil"]){
	    		return "";
	    	}
	        return input;
	    }
	};
});


appFilters.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return (input && input!=null) ? input.slice(start) : [];
    };
});

appFilters.filter('number_ellipse', function() {
	return function(input, min, max) {
		var output = input;
		if (input && Helpers.util.isNumber(input)) {
			if(Math.abs(input)<min)
				output ="<" + min; 
			else if(Math.abs(input)>1000)
				output =">" + max; 
			else
				output = input.toFixed(2);
	    }
		return output;
	};
});

appFilters.filter('subDomainFilter', function () {
    return function (subDomainList, domain) {
    	var subDomainFilteredList = [];
    	angular.forEach(subDomainList, function(val, key) {
    		if ((val.codDomain == domain) && (val.deprecated == 0)){
    			this.push(val.codSubDomain);
    		}
    	}, subDomainFilteredList);
    	return subDomainFilteredList;
    };
});

appFilters.filter('string_ellipse', function () {
    return function (text, length, end) {
    	
    	if(typeof text === "undefined"  || text == null)
    		text = "";
    	
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }
    };
});



appFilters.filter('datetimeFormatted', function() {
    return function(dateIn) {
    	var dateOut = "";
    	if(dateIn && dateIn!=null)
    		dateOut  = dateIn.format("dd/mm/yyyy HH:MM");
        return dateOut;
    };
});

appFilters.filter('dateFormatted', function() {
    return function(dateIn) {
    	var dateOut = "";
    	if(dateIn && dateIn!=null)
    		dateOut  = dateIn.format("dd/mm/yyyy");
        return dateOut;
    };
});


appFilters.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


appFilters.filter('format_filesize', function() {
	return function(input) {
		var output = "";
		if (input) {
			input=Math.trunc(input);
			if(input<1000)
				output=input+"byte";
			else if(input<1000000)
				output=(input/1000).toFixed(1)+"Kb";
			else if(input<1000000000)
				output=(input/1000000).toFixed(1)+"Mb";
			else if(input<1000000000000)
				output=(input/1000000000).toFixed(1)+"Gb";
	    }
		return output;
	};
});

appFilters.filter('format_time_from_seconds', function() {
	return function(input) {
		var output = "";
		if (input) {
   	 	var sec_num = parseInt(input);
   	 	var hours   = Math.floor(sec_num / 3600);
  		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  		var seconds = sec_num - (hours * 3600) - (minutes * 60);
      	
	    if(hours>0)
	        output += hours+"h "; 
				if(minutes>0)
	        output += minutes+"m "; 
				if(seconds>0 )
	        output += seconds+"s "; 
	    }
		return output;	
	};
});

appFilters.filter('format_big_number', function() {
	return function(input) {
		var output = "";
		if (input) {
			input=Math.trunc(input);
			if(input<1000)
				output=input;
			else if(input<1000000)
				output=(input/1000).toFixed(2)+" <span class='counter-group'>mila</span>";
			else if(input<1000000000)
				output=(input/1000000).toFixed(2)+" <span class='counter-group'>mln</span>";
			else if(input<1000000000000)
				output=(input/1000000000).toFixed(2)+" <span class='counter-group'>mld</span>";
	    }
		return (""+output).replace(".", ","); 
	};
});

appFilters.filter('nvl', function() {
	return function(input, ifNull) {
		var output = input;
		if (!input || input ==null) {
			output = ifNull;
	    }
		return output;
	};
});

appFilters.filter('booleanToString', function() {
	return function(input) {
		var output = 'NO';
		if (input!=null && (input===1 || input==1 || input == 'true'||input === true))
			output = 'YES';
		return output;
	};
});

appFilters.filter('prettifyTweet', function() {
	return function(input) {
		var output = input;
		if ((typeof input != "undefined") && input !=null) {
			output = Helpers.render.prettifyTwitterMessage(input);
			output = output.toString();
	    }
		return output;
	};
});