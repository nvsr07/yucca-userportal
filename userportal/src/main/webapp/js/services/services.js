'use strict';

/* Services */

var appServices = angular.module('userportal.services', [ 'userportal.config' ]);

appServices.value('version', '1.3.0');

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
