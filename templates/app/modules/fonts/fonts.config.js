var <%= scriptAppName %>Fonts = angular.module( '<%= scriptAppName %>.fonts', [
  'ui.router.state'
]);

<%= scriptAppName %>Fonts.config(function config( $stateProvider ) {
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
});
