/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',
  src_dir: 'src',
  app_dir: 'src/app',
  common_dir: 'src/common',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ]<% if (sass) { %>,
    sass: ['src/**/*.{scss,sass}']<% } %>,
    css: ['src/assets/styles/**/*.css']
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/angular/angular.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js'<%if (angularUiBootstrap) { %>,
      'vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js'<% } %><% if (resourceModule) { %>,
      'vendor/angular-resource/angular-resource.min.js'<% } %><% if (cookiesModule) { %>,
      'vendor/angular-cookies/angular-cookies.min.js'<% } %><% if (sanitizeModule) { %>,
      'vendor/angular-sanitize/angular-sanitize.min.js'<% } %><% if (routeModule) { %>,
      'vendor/angular-ui-utils/modules/route/route.js'<% } %><% if (placeholders) { %>,
      'vendor/bower-angular-placeholders/angular-placeholders.min.js'<% } %>
    ],
    map: [
      'vendor/angular/angular.min.js.map'<% if(resourceModule) { %>,
      'vendor/angular-resource/angular-resource.min.js.map'<% } %><% if (cookiesModule) { %>,
      'vendor/angular-cookies/angular-cookies.min.js.map'<% } %><% if(sanitizeModule) { %>,
      'vendor/angular-sanitize/angular-sanitize.min.js.map'<% } %>
    ],
    css: [
      <% if(!sass) { %><% if (bootstrap) { %>
      'vendor/bootstrap/dist/css/bootstrap.min.css',<% } %><% if (hasFont) { %><% if(!bootstrap && glyphicons) { %>
      'vendor/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css',<% } %><% if (fontawesome) { %>
      'vendor/fontawesome/css/font-awesome.min.css',<% } %><% if (foundationicons) { %>
      'vendor/foundation-icons/foundation_icons_accessibility/stylesheet/accessibility_foundicons.css',
      'vendor/foundation-icons/foundation_icons_general/stylesheet/general_foundicons.css',
      'vendor/foundation-icons/foundation_icons_general_enclosedy/stylesheet/general_enclosed_foundicons.css',
      'vendor/foundation-icons/foundation_icons_social/stylesheet/social_foundicons.css',<% } %><% if(ionicons) { %>
      'vendor/ionicons/css/ionicons.min.css'<% } %><% } %>
      <% } %>
    ]<% if (sass) { %>,
    sass: [
    ]<% } %>,
    assets: [
    ]
  },
};
