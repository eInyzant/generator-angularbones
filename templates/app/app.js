angular.module( '<%= scriptAppName %>', [
  'templates-app',
  'templates-common',
  '<%= scriptAppName %>.home',
  '<%= scriptAppName %>.about'<% if(hasFont) { %>,
  '<%= scriptAppName %>.fonts'<% } %>,
  'ui.state',
  'ui.route'<% if(angularUiBootstrap) {%>,
  'ui.bootstrap'<% } %>
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | <%= scriptAppName %>' ;
    }
  });
})

;

