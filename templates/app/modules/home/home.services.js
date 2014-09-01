(function() {
  'use strict';

  /**
   * ngInject
   */
  function HomeService() {
  }

  angular
    .module('<%= scriptAppName %>')
    .service('HomeService', HomeService)
  ;

})();
