var mydirectives = angular.module('liteWaveDirectives', []);

mydirectives.directive('butterbar', ['$rootScope',
  function($rootScope) {
    return {
      link: function(scope, element, attrs) {
        element.addClass('hide');
        
        $rootScope.$on('$rootChangeStart', function() {
          element.removeClass('hide');
        });
        
        $rootScope.$on('$rootChangeSuccess', function() {
          element.addClass('hide');
        });
      }
    };
  }]);
  
mydirectives.directive('focus', 
  function() {
    return {
      link: function(scope, element, attrs) {
        element[0].focus();
      }
    };
  });