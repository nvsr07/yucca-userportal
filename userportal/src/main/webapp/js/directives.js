'use strict';

/* Directives */
var appDirectives = angular.module('userportal.directives', []);

appDirectives.directive('appVersion', [ 'version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
} ]);

appDirectives.directive('mainNavbar', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('homeHeader', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/home-header.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainNavbarProfile', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-navbar-profile.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('mainFooter', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/common/main-footer.html?'+BuildInfo.timestamp,
	};
});




appDirectives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


appDirectives.directive('scrollOnClick', function() {
	return {
	    restrict: 'A',
	    link: function(scope, $elm, attrs) {
	    	var idToScroll = attrs.href;
	    	console.log("idToScroll",idToScroll);
	    	$elm.on('click', function() {
	    		var $target;
	    		if (idToScroll && idToScroll!='javascript:void(0)') {
	    			$target = $(idToScroll);
	    		} else {
	    			$target = $elm;
	    		}
	    		console.debug("target ",$target);
	    		$("body").animate({scrollTop: $target.offset().top}, "slow");
	    	});
	    }
	 };
});

appDirectives.directive('ngConfirmClick', function(){
	return {
		priority: -1,
		restrict: 'A',
		link: function(scope, element, attrs){
			element.bind('click', function(e){
				var message = attrs.ngConfirmClick;
				if(message && !confirm(message)){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
			});
		}
	};
 });

appDirectives.directive('iframeOnload', [function(){
	return {
	    scope: {
	        callBack: '&iframeOnload'
	    },
	    link: function(scope, element, attrs){
	        element.on('load', function(){
	        	console.log("iframeOnload");
	            return scope.callBack();
	        });
	    }
	};
}]);



appDirectives.directive('alertPanel', [function(){
	return {
	  restrict: 'EA',
	  template: '<div class="alert alert-{{type}}">'+
				'  <strong>{{message|translate}}</strong>'+
				'  <div> <span ng-if="code">Code: {{code}} - </span> <span ng-if="detail">{{detail}}</span></div>'+
				'</div>',
	  scope: {
		type: '@',
	    code: '@',
	    message: '@',
	    detail: '@',
	    details: '@'
	  }
	};
}]);



//appDirectives.directive('inputWithHtmlHint', function(){
//	  return {
//	    require: "?ngModel",
//	    scope: true,
//		restrict : 'E',
//	    link: function(scope, element, attrs, ngModel){
//	      if (!ngModel) return;
//
//	      scope.onChange = function(){
//	        ngModel.$setViewValue(scope.value);
//	      };
//
//	      ngModel.$render = function(){
//	        scope.value = ngModel.$modelValue;
//	      };
//	    },
//	    template: '<div class="input-group input-group-sm " >' +  
//				  '  <input class="input-sm form-control" type="text" name="'+inputName+'" ng-model="newField.dateTimeFormat" >
//												<span class="input-group-addon" tooltip-html-unsafe="{{htmlTooltip}}" tooltip-trigger="click">&quest;</span>
//											</div>"
//	  };
//});

