(function() {
  'use strict';

  /**
   * ngInject
   */
  function AboutController($scope, AboutService) {
    AboutService.getAboutData(function(data) {
      $scope.aboutData = data;
    });
  }

  angular
    .module('<%= scriptAppName %>')
    .controller('AboutController', AboutController)
  ;

})();
