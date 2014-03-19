var <%= scriptAppName %>About = angular.module( '<%= scriptAppName %>.about', [
  'ui.router.state'<% if(placeholders) { %>,
  'placeholders'<% } %>
]);

<%= scriptAppName %>About.config(function config( $stateProvider ) {
  $stateProvider.state( 'about', {
    url: '/about',
    views: {
      "main": {
        controller: 'AboutCtrl',
        templateUrl: 'about/about.tpl.html'
      }
    },
    data:{ pageTitle: 'About Angular Bones Generator?' }
  });
});
