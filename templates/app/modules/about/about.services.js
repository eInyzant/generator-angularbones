<%= scriptAppName %>About.service('AboutService', ['$http',
  function($http) {
    this.getAboutData = function(callback) {
      $http({
        method:"GET",
        url:"/assets/json/about.json"
      }).success(function(data) {
        callback(data);
        return true;
      });
    };
  }
]);
