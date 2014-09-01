(function() {
  'use strict';

  /**
   * ngInject
   */
  function config($stateProvider) {
    $stateProvider.state( 'about', {
      url: '/about',
      views: {
        'main': {
          controller: 'AboutController',
          templateUrl: 'about/about.tpl.html'
        }
      },
      data:{ pageTitle: 'About Angular Bones Generator?' }
    });
  }

  angular
    .module('<%= scriptAppName %>')
    .config(config)
  ;

})();
