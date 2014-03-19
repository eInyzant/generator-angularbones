<%= scriptAppName %>CssFramework.controller( 'CssFrameworkCtrl', ['$scope', 'AnchorService',
  function CssFrameworkCtrl($scope, AnchorService) {
    $scope.scrollTo = function(elementId) {
      AnchorService.scrollTo(elementId);
      return false;
    };
  }
]);
