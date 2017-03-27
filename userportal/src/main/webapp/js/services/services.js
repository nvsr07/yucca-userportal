'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '1.6.0');

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
