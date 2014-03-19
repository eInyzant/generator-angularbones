<%= scriptAppName %>Anchor.service('AnchorService', ['$location', '$anchorScroll',
  function($location, $anchorScroll) {
    this.timer = null;
    this.from = 0;
    this.to = 0;
    this.delta = 0;
    this.factor = 0;
    this.duration = 200;
    this.start = 0;

    this.goTo = function(elementId) {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash(elementId);
   
      // call $anchorScroll()
      $anchorScroll();
    };

    this.scrollTo = function(elementId, duration) {
      $location.hash(elementId);

      this.from = this.currentYPosition();
      this.to = this.elmYPosition(elementId);
      this.delta  = this.to - this.from; // Y-offset difference
      this.duration = duration || 200;              // default 1 sec animation
      this.start = Date.now();                       // get start time
      
      if (this.timer) {
        clearInterval(this.timer); // stop any running animations
      }

      var that = this;
      this.timer = setInterval(function() {
        var y;
        that.factor = (Date.now() - that.start) / that.duration; // get interpolation factor
        if( that.factor >= 1 ) {
          clearInterval(that.timer); // stop animation
          that.factor = 1;           // clip to max 1.0
        } 
        y = that.factor * that.delta + that.from;
        window.scrollBy(0, y - that.currentYPosition());
      }, 10);
      return this.timer;
      
    };

    this.currentYPosition = function() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) { return self.pageYOffset; }
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop) {
          return document.documentElement.scrollTop;
      }
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) { return document.body.scrollTop; }
      return 0;
    };

    this.elmYPosition = function(elementId) {
      var elm = document.getElementById(elementId);
      var y = elm.offsetTop;
      var node = elm;
      while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
      } return y;
    };
  }
]);
