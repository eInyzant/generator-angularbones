(function() {
  
  'use strict';

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }

  function run() {
  }

  function AppController($scope) {
    $scope.$on('$stateChangeSuccess', function(event, toState){
      if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | <%= scriptAppName %>' ;
      }
    });
  }

  angular
    .module('<%= scriptAppName %>', [
      'templates-app',
      'templates-common'<% if(animateModule) { %>,
      'ngAnimate'<% } %>,
      'ui.router',
      'ui.router.state'<% if(angularFoundation) { %>,
      'mm.foundation'<% } %><% if(angularUiBootstrap) {%>,
      'ui.bootstrap'<% } %>
    ])
    .config(config)
    .run(run)
    .controller('AppController', AppController)
  ;

})();
