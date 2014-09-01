(function() {
  'use strict';

  /**
   * ngInject
   */
  function CssFrameworkController($scope, AnchorService) {
    $scope.scrollTo = function(elementId) {
      AnchorService.scrollTo(elementId);
      return false;
    };
  }

  angular
    .module('<%= scriptAppName %>')
    .controller('CssFrameworkController', CssFrameworkController)
  ;

})();
