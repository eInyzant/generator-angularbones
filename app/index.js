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

  this.hookFor('angularbones:main', {
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

Generator.prototype.askForPlaceholders = function askForPlaceholders() {
  var cb = this.async();

  this.prompt([{
    type: 'confirm',
    name: 'placeholders',
    message: 'Would you like to use Angular Placeholders?',
    default: true
  }], function (props) {
    this.placeholders = props.placeholders;

    cb();
  }.bind(this));
};

Generator.prototype.askForFontAwesome = function askForFontAwesome() {
  var cb = this.async();
  var bootstrap = this.bootstrap;

  this.prompt([{
    type: 'confirm',
    name: 'fontawesome',
    message: 'Would you like to use Font Awesome?',
    default: false,
    when: function(props) {
      return !bootstrap;
    }
  }], function (props) {
    this.fontawesome = props.fontawesome;

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

Generator.prototype._injectDependencies = function _injectDependencies() {
  var howToInstall =
    '\nAfter running `npm install & bower install`, create your custom-bootstrap.scss' +
    '\nfile by running:' +
    '\n' +
    chalk.yellow.bold('\n  grunt bootstrapInstall');
    console.log(howToInstall);
};
