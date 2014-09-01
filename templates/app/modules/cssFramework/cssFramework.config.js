(function() {
  'use strict';

  /**
   * ngInject
   */
  function config($stateProvider) {
    $stateProvider.state( 'cssFramework', {
      url: '/cssFramework',
      views: {
        'main': {
          controller: 'CssFrameworkController',
          templateUrl: 'cssFramework/cssFramework.tpl.html'
        }
      },
      data:{ pageTitle: 'Css Framework' }
    });
  }

  angular
    .module('<%= scriptAppName %>')
    .config(config)
  ;

})();
