(function() {
  'use strict';

  function FontsController($scope, AnchorService) {
    $scope.scrollTo = function(elementId) {
      AnchorService.scrollTo(elementId);
      return false;
    };
  }

  angular
    .module('<%= scriptAppName %>')
    .controller('FontsController', FontsController)
  ;
})();
