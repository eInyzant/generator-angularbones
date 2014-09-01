(function() {
  'use strict';


  /**
   * ngInject
   */
  function config($stateProvider) {
    $stateProvider.state( 'home', {
      url: '/home',
      views: {
        'main': {
          controller: 'HomeController',
          templateUrl: 'home/home.tpl.html'
        }
      },
      data:{ pageTitle: 'Home' }
    });
  }

  angular
    .module('<%= scriptAppName %>')
    .config(config)
  ;


})();
