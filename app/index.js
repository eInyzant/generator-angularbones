'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var angularUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.option('app-suffix', {
    desc: 'Allow a custom suffix to be added to the module name',
    type: String,
    required: 'false'
  });
  this.scriptAppName = this.appname + angularUtils.appName(this);

  args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'src/app';
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee', {
      desc: 'Generate CoffeeScript instead of JavaScript'
    });

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  this.hookFor('angularbones:common', {
    args: args
  });

  //this.hookFor('angularbones:main', {
    //args: args
  //});

  this.on('end', function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: this._injectDependencies.bind(this)
    });

    var enabledComponents = [];

    if (this.resourceModule) {
      enabledComponents.push('angular-resource/angular-resource.js');
    }

    if (this.cookiesModule) {
      enabledComponents.push('angular-cookies/angular-cookies.js');
    }

    if (this.sanitizeModule) {
      enabledComponents.push('angular-sanitize/angular-sanitize.js');
    }

    if (this.routeModule) {
      enabledComponents.push('angular-route/angular-route.js');
    }

  });

  this.pkg = require('../package.json');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(
      'Out of the box I include Bootstrap and some AngularJS recommended modules.\n'
    );
  }
};

Generator.prototype.askForAppName = function askForAppName() {
  var cb = this.async();

  this.prompt([{
    type: 'input',
    name: 'appname',
    message: 'What is the name of your app?',
    default: this.appname
  }], function (props) {
    this.appname = this._.camelize(this._.slugify(this._.humanize(props.appname)));

    cb();
  }.bind(this));
};

Generator.prototype.askForAppVersion = function askForAppVersion() {
  var cb = this.async();

  this.prompt([{
    type: 'input',
    name: 'appversion',
    message: 'What is the version of your app?',
    default: "0.0.1"
  }], function (props) {
    this.appversion = props.appversion;

    cb();
  }.bind(this));
};

Generator.prototype.askForAuthor = function askForAuthor() {
  var cb = this.async();

  this.prompt([{
    type: 'input',
    name: 'author',
    message: 'What is the name of the author?',
    default: "Erwan INYZANT - Garden Media"
  }], function (props) {
    this.author = props.author;

    cb();
  }.bind(this));
};

Generator.prototype.askForHomepage = function askForHomepage() {
  var cb = this.async();

  this.prompt([{
    type: 'input',
    name: 'homepage',
    message: 'What is the homepage of the app?',
    default: "http://www.garden-media.fr"
  }], function (props) {
    this.homepage = props.homepage;

    cb();
  }.bind(this));
};

Generator.prototype.askForLicenceType = function askForLicenceType() {
  var cb = this.async();

  console.log(chalk.yellow.bold('\nVisit http://choosealicense.com/ should help you choose your licence\n'));
  this.prompt([{
    type: 'input',
    name: 'licence_type',
    message: 'What is the licence type of the app?',
    default: "MIT"
  }], function (props) {
    this.licence_type = props.licence_type;

    cb();
  }.bind(this));
};

Generator.prototype.askForLicenceUrl = function askForLicenceUrl() {
  var cb = this.async();

  this.prompt([{
    type: 'input',
    name: 'licence_url',
    message: 'What is the licence url?',
    default: "http://en.wikipedia.org/wiki/MIT_License"
  }], function (props) {
    this.licence_url = props.licence_url;

    cb();
  }.bind(this));
};

Generator.prototype.askForSass = function askForSass() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'sass',
    message: 'Would you like to Sass?',
    default: true
  }], function (props) {
    this.sass = props.sass;

    cb();
  }.bind(this));
};

Generator.prototype.askForBootstrap = function askForBootstrap() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'bootstrap',
    message: 'Would you like to include Bootstrap?',
    default: true
  }], function (props) {
    this.bootstrap = props.bootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForAngularUiBootstrap = function askForAngularUiBootstrap() {
  var cb = this.async();
  var bootstrap = this.bootstrap;

  this.prompt([{
    type: 'confirm',
    name: 'angularUiBootstrap',
    message: 'Would you like to use Angular UI Bootstrap?',
    default: true,
    when: function(props) {
      return bootstrap;
    }
  }], function (props) {
    this.angularUiBootstrap = props.angularUiBootstrap;

    cb();
  }.bind(this));
};

Generator.prototype.askForFonts = function askForFonts() {
  this.hasFont = false;
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'fonts',
    message: 'Which fonts would you like to use?',
    choices: [{
      value: 'glyphicons',
      name: 'glyphicons',
      checked: true,
    }, {
      value: 'fontawesome',
      name: 'fontawesome',
      checked: true
    }, {
      value: 'foundationicons',
      name: 'foundationicons',
      checked: true
    }, {
      value: 'ionicons',
      name: 'ionicons',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.fonts.indexOf(mod) !== -1; };
    this.glyphicons = hasMod('glyphicons');
    this.fontawesome = hasMod('fontawesome');
    this.foundationicons = hasMod('foundationicons');
    this.ionicons = hasMod('ionicons');

    var fonts = [];

    if (this.glyphicons) {
      fonts.push("'glyphicons'");
    }

    if (this.fontawesome) {
      fonts.push("'fontawesome'");
    }

    if (this.foundationicons) {
      fonts.push("'foundationicons'");
    }
    if (this.ionicons) {
      fonts.push("'ionicons'");
    }

    if (fonts.length) {
      this.hasFont = true;
      this.env.options.fonts = '\n    ' + fonts.join(',\n    ') + '\n  ';
    }

    cb();
  }.bind(this));
};


Generator.prototype.askForPlaceholders = function askForPlaceholders() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'placeholders',
    message: 'Would you like to use Angular Placeholders?',
    default: true
  }], function (props) {
    this.placeholders = props.placeholders;
    this.env.options.placeholders = this.placeholders;

    cb();
  }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'modules',
    message: 'Which modules would you like to include?',
    choices: [{
      value: 'resourceModule',
      name: 'angular-resource.js',
      checked: true
    }, {
      value: 'cookiesModule',
      name: 'angular-cookies.js',
      checked: true
    }, {
      value: 'sanitizeModule',
      name: 'angular-sanitize.js',
      checked: true
    }, {
      value: 'routeModule',
      name: 'angular-route.js',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');
    this.routeModule = hasMod('routeModule');

    var angMods = [];

    if (this.cookiesModule) {
      angMods.push("'ngCookies'");
    }

    if (this.resourceModule) {
      angMods.push("'ngResource'");
    }
    if (this.sanitizeModule) {
      angMods.push("'ngSanitize'");
    }
    if (this.routeModule) {
      angMods.push("'ngRoute'");
      this.env.options.ngRoute = true;
    }

    if (angMods.length) {
      this.env.options.angularDeps = '\n    ' + angMods.join(',\n    ') + '\n  ';
    }

    cb();
  }.bind(this));
};

Generator.prototype.createIndexHtml = function createIndexHtml() {
  this.insertStyles = '<!-- compiled CSS --><% styles.forEach(function(file){ %><link rel="stylesheet" type="text/css" href="<%= file %>" /><% }); %>';
  this.insertScripts = '<!-- compiled JavaScript --><% scripts.forEach( function ( file ) { %><script type="text/javascript" src="<%= file %>"></script><% }); %>';

  this.template('../../templates/common/index.html', 'src/index.html');
};

Generator.prototype.packageFiles = function () {
  this.coffee = this.env.options.coffee;

  this.copy('../../templates/common/_bowerrc', '.bowerrc');
  this.template('../../templates/common/_bower.json', 'bower.json');
  this.template('../../templates/common/_package.json', 'package.json');
  this.template('../../templates/common/build.config.js', 'build.config.js');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};

Generator.prototype.applicationFiles = function() {
  if (this.sass) {
    this.copy('../../templates/app/modules/home/home.css', './src/app/home/home.scss');
    this.copy('../../templates/app/modules/about/about.css', './src/app/about/about.scss');
    if (this.hasFont) {
      this.copy('../../templates/app/modules/fonts/fonts.css', './src/app/fonts/fonts.scss');
    }
  } else {
    this.copy('../../templates/app/modules/home/home.css', './src/app/home/home.css');
    this.copy('../../templates/app/modules/about/about.css', './src/app/about/about.css');
    if (this.hasFont) {
      this.copy('../../templates/app/modules/fonts/fonts.css', './src/app/fonts/fonts.css');
    }
  }
  // Application files :
  this.template('../../templates/app/app.js', './src/app/app.js');
  this.template('../../templates/app/app.spec.js', './src/app/app.spec.js');

  // Home Module
  this.template('../../templates/app/modules/home/home.js', './src/app/home/home.js');
  this.template('../../templates/app/modules/home/home.spec.js', './src/app/home/home.spec.js');

  // About Module
  this.template('../../templates/app/modules/about/_about.tpl.html', './src/app/about/about.tpl.html');
  this.template('../../templates/app/modules/about/about.js', './src/app/about/about.js');

  if (this.hasFont) {
    // Fonts Module
    this.template('../../templates/app/modules/fonts/_fonts.tpl.html', './src/app/fonts/fonts.tpl.html');
    this.template('../../templates/app/modules/fonts/fonts.js', './src/app/fonts/fonts.js');
  }

};
Generator.prototype.assetsFiles = function() {
  // assets
  if (this.sass) {
    this.template('../../templates/assets/sass/_main.scss', './src/sass/main.scss');
    this.template('../../templates/assets/sass/_custom-variables.scss', './src/sass/custom-variables.scss');
    if (this.bootstrap) {
      this.directory('../../templates/assets/sass/bootstrap', './src/sass/.');
    }
  } else {
    this.template('../../templates/assets/sass/_main.scss', './src/assets/styles/main.css');
  }

    this.template('../../templates/assets/templates/header/_menu.tpl.html', './src/assets/templates/header/menu.tpl.html');
};

Generator.prototype._injectDependencies = function _injectDependencies() {
    var howToInstall = '\n###########################';
    howToInstall += '\n########## END ############';
    howToInstall += '\n###########################';
    howToInstall += chalk.yellow.bold('\nInstallation is complete!');
    howToInstall += '\nBe sure to run `npm install & bower install` if it failed (should be automatic)';
    if (this.hasFont) {
      howToInstall += '\n\nTo complete your installation you must install font files by running:';
      howToInstall += chalk.green.bold('\ngrunt install');
    }
    howToInstall += '\n\nTo start your application :';
    howToInstall += chalk.green.bold('\ngrunt watch');
    howToInstall += '\n###########################';
    howToInstall += '\n###########################';
    console.log(howToInstall);
};
