var <%= scriptAppName %>CssFramework = angular.module( '<%= scriptAppName %>.cssFramework', [
  'ui.router.state'
]);

<%= scriptAppName %>CssFramework.config(function config( $stateProvider ) {
  $stateProvider.state( 'cssFramework', {
    url: '/cssFramework',
    views: {
      "main": {
        controller: 'CssFrameworkCtrl',
        templateUrl: 'cssFramework/cssFramework.tpl.html'
      }
    },
    data:{ pageTitle: 'Css Framework' }
  });
});
