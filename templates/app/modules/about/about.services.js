(function() {
  'use strict';

  /**
   * ngInject
   */
  function AboutService($http) {

    this.getAboutData = function(callback) {
      $http({
        method:'GET',
        url:'/assets/json/about.json'
      }).success(function(data) {
        callback(data);
        return true;
      });
    };

    return this;
  }

  angular
    .module('<%= scriptAppName %>')
    .service('AboutService', AboutService)
  ;
    
})();
