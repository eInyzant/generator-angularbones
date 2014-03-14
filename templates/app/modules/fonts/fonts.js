angular.module( '<%= scriptAppName %>.fonts', [
  'ui.state'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'fonts', {
    url: '/fonts',
    views: {
      "main": {
        controller: 'FontsCtrl',
        templateUrl: 'fonts/fonts.tpl.html'
      }
    },
    data:{ pageTitle: 'Fonts' }
  });
})

.controller( 'FontsCtrl', function FontsCtrl( $scope ) {
})

;
