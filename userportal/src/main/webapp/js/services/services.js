'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '1.11.0');

appServices.factory('readFilePreview', function($q) {
	return {
		readTextFile: function (file, previewSize, encoding) {
			var deferread = $q.defer();
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				console.log("file", file);
				if ((file !== undefined) && (file !== null)) {
					reader.onload = function (event) {

						deferread.resolve(event.target.result);
					};
					var firstBytes = file.slice(0, previewSize + 1);
					reader.readAsText(firstBytes, encoding);
				}else{
					console.log("reject", file);
					deferread.reject("You need to pass a file.");
				}
			}else{
				deferread.reject("Your browser don't support File api.");
			}

			return deferread.promise;
		},
		readImageFile: function (file) {
			var deferread = $q.defer();
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var reader = new FileReader();
				console.log("file", file);
				if ((file !== undefined) && (file !== null)) {
					reader.onload = function (event) {
						deferread.resolve(event.target.result);
					};
					reader.readAsDataURL(file);
				}else{
					console.log("reject", file);
					deferread.reject("You need to pass a file.");
				}
			}else{
				deferread.reject("Your browser don't support File api.");
			}

			return deferread.promise;
		}
		
	};
});

appServices.factory('sharedStream',  function () {
	var stream = null;
	
	return {
		getStream: function () {
			return stream;
		},
		setStream: function(value) {
			stream = value;
		}
	};
});

appServices.factory('sharedDataset',  function () {
	var dataset = null;
	
	return {
		getDataset: function () {
			return dataset;
		},
		setDataset: function(value) {
			dataset = value;
		}
	};
});


appServices.factory('sharedAdminResponse',  function () {
	var response = null;
	
	return {
		getResponse: function () {
			return response;
		},
		setResponse: function(value) {
			response = value;
		}
	};
});


appServices.factory('dataexplorerBrowseData',  function () {
	var searchResult = null;
	
	return {
		getSearchResult: function () {
			return searchResult;
		},
		setSearchResult: function(value) {
			searchResult = value;
		}
	};
});


appServices.factory('dataexplorerService',  function () {
	var searchInput = null;
	
	return {
		getSearchInput: function () {
			return searchInput;
		},
		setSearchInput: function(value) {
			searchInput = value;
		}
	};
});



appServices.factory('sharedUploadBulkErrors',  function () {
	var errors = null;
	
	return {
		getErrors: function () {
			return errors;
		},
		setErrors: function(value) {
			errors = value;
		}
	};
});


appServices.factory('devService', function($q) {
	return {
		fakeHttpCall : function(isSuccessful, result) {
		
			var deferred = $q.defer();
		
			setTimeout(function() {
			    if (isSuccessful === true) {
			    	if(typeof result == 'undefined')
			    		result = "Successfully resolved the fake $http call";
			        deferred.resolve(result);
			    }
			    else {
			    	if(typeof result == 'undefined')
			    		result = "Oh no! Something went terribly wrong in you fake $http call";
			        deferred.reject(result);
			    }
			}, 200 );
		
		   return deferred.promise;
		}
	};
});
