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
		if (input) {
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

appFilters.filter('string_ellipse', function () {
    return function (text, length, end) {
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
