<%= scriptAppName %>About.controller( 'AboutCtrl', ['$scope', 'AboutService',
  function AboutCtrl($scope, AboutService) {
    AboutService.getAboutData(function(data) {
      $scope.aboutData = data;
    });
  }
]);
