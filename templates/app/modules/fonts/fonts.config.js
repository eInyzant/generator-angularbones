(function() {
  'use strict';

  /**
   * ngInject
   */
  function config($stateProvider) {
    $stateProvider.state( 'fonts', {
      url: '/fonts',
      views: {
        'main': {
          controller: 'FontsController',
          templateUrl: 'fonts/fonts.tpl.html'
        }
      },
      data:{ pageTitle: 'Fonts' }
    });
  }

  angular
    .module('<%= scriptAppName %>')
    .config(config)
  ;

})();
