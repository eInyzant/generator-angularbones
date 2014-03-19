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

Generator.prototype.askForCssFramework = function askForCssFramework() {
  this.hasCssFramework = false;
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'css',
    message: 'Would your like to include a Css Framework?',
    choices: [{
      value: 'bootstrap',
      name: 'Bootstrap Twitter 3',
      checked: true
    }, {
      value: 'normalize',
      name: 'Normalize.css (Already included in bootstrap twitter)',
      checked: false,
    }, {
      value: 'foundation',
      name: 'Zurb Foundation 5',
      checked: false
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasCss = function (css) { return props.css.indexOf(css) !== -1; };
    this.bootstrap = hasCss('bootstrap');
    this.normalize = hasCss('normalize');
    this.foundation = hasCss('foundation');

    var css = [];

    if (this.bootstrap) {
      css.push("'bootstrap'");
    }

    if (this.normalize) {
      css.push("'normalize'");
    }

    if (this.foundation) {
      css.push("'foundation'");
    }

    if (css.length) {
      this.hasCssFramework = true;
      this.env.options.css = '\n    ' + css.join(',\n    ') + '\n  ';
    }

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

Generator.prototype.askForAngularFoundation = function askForAngularFoundation() {
  var cb = this.async();
  var foundation = this.foundation;

  this.prompt([{
    type: 'confirm',
    name: 'angularFoundation',
    message: 'Would you like to use Angular Foundation?',
    default: true,
    when: function(props) {
      return foundation;
    }
  }], function (props) {
    this.angularFoundation = props.angularFoundation;

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
      value: 'fontawesome',
      name: 'fontawesome',
      checked: true
    }, {
      value: 'glyphicons',
      name: 'glyphicons',
      checked: false,
    }, {
      value: 'foundationicons',
      name: 'foundationicons',
      checked: false
    }, {
      value: 'ionicons',
      name: 'ionicons',
      checked: false
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
      value: 'animateModule',
      name: 'angular-animate.js',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.resourceModule = hasMod('resourceModule');
    this.cookiesModule = hasMod('cookiesModule');
    this.sanitizeModule = hasMod('sanitizeModule');
    this.animateModule = hasMod('animateModule');

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
    if (this.animateModule) {
      angMods.push("'ngAnimate'");
      this.env.options.ngAnimte = true;
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
  this.template('../../templates/common/_package.json', './src/assets/json/about.json');
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
    if (this.hasCssFramework) {
      this.copy('../../templates/app/modules/cssFramework/cssFramework.css', './src/app/cssFramework/cssFramework.scss');
    }
  } else {
    this.copy('../../templates/app/modules/home/home.css', './src/app/home/home.css');
    this.copy('../../templates/app/modules/about/about.css', './src/app/about/about.css');
    if (this.hasFont) {
      this.copy('../../templates/app/modules/fonts/fonts.css', './src/app/fonts/fonts.css');
    }
    if (this.hasCssFramework) {
      this.copy('../../templates/app/modules/cssFramework/cssFramework.css', './src/app/cssFramework/cssFramework.css');
    }
  }
  // Application files :
  this.template('../../templates/app/app.js', './src/app/app.js');
  this.template('../../templates/app/app.spec.js', './src/app/app.spec.js');

  // Home Module
  this.template('../../templates/app/modules/home/home.config.js', './src/app/home/home.config.js');
  this.template('../../templates/app/modules/home/home.ctrl.js', './src/app/home/home.ctrl.js');
  this.template('../../templates/app/modules/home/home.services.js', './src/app/home/home.services.js');
  this.template('../../templates/app/modules/home/home.spec.js', './src/app/home/home.spec.js');

  // About Module
  this.template('../../templates/app/modules/about/_about.tpl.html', './src/app/about/about.tpl.html');
  this.template('../../templates/app/modules/about/about.config.js', './src/app/about/about.config.js');
  this.template('../../templates/app/modules/about/about.ctrl.js', './src/app/about/about.ctrl.js');
  this.template('../../templates/app/modules/about/about.services.js', './src/app/about/about.services.js');

  // Fonts Module
  if (this.hasFont) {
    this.template('../../templates/app/modules/fonts/_fonts.tpl.html', './src/app/fonts/fonts.tpl.html');
    this.template('../../templates/app/modules/fonts/fonts.config.js', './src/app/fonts/fonts.config.js');
    this.template('../../templates/app/modules/fonts/fonts.ctrl.js', './src/app/fonts/fonts.ctrl.js');
  }

  // CssFramework Module
  if (this.hasCssFramework) {
    this.template('../../templates/app/modules/cssFramework/_cssFramework.tpl.html', './src/app/cssFramework/cssFramework.tpl.html');
    this.template('../../templates/app/modules/cssFramework/cssFramework.config.js', './src/app/cssFramework/cssFramework.config.js');
    this.template('../../templates/app/modules/cssFramework/cssFramework.ctrl.js', './src/app/cssFramework/cssFramework.ctrl.js');
  }

  // Common Modules 
  // Anchor Service 
  this.template('../../templates/app/common/anchor/anchor.config.js', './src/common/anchor/anchor.config.js');
  this.template('../../templates/app/common/anchor/anchor.services.js', './src/common/anchor/anchor.services.js');

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
    howToInstall += chalk.yellow.bold('\nInstallation is');
    if (this.hasFont) {
      howToInstall += chalk.red.bold(' ALMOST');
    }
    howToInstall += chalk.yellow.bold(' complete!');
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
