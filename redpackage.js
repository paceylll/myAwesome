/*后续应该添加监听页面隐藏暂停创建红包的逻辑*/
; (function ($) {
  var utils = {
    getRandomIntBetween: function (start, end) {
      return Math.floor(Math.random() * (end - start) + start);
    },
    nextTick: function(fn) {
      setTimeout(fn, 0);
    },
    noop: function () { }
  };

  var RedpackageRain = function (option) {
    this.config = $.extend({
      speedX: 0,
      speedY: 5,
      throttleTime: 400,
      totalTime: 5,
      width: [40, 60],
      itemImgUrl: "./test.png",
      itemClassName: "discount-rain-item",
      wrapClassName: "wrap-rain",
      multiple: 1.5,
      offset: 10
    }, option);
    this.tapItemCallback = option.tapItemCallback || utils.noop;
    this.finishRainning = option.finishRainning || utils.noop;
    this.$wrap = $('<div class="' + this.config.wrapClassName + '"></div>');
    this.$wrap.css({
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 999
    });
    this.timer = null;
    this.isDown = this.config.speedX === 0;
    this.init();
  };

  var WINDOW_HEIGHT = $(window).height();
  var WINDOW_WIDTH = $(window).width();

  $.extend(RedpackageRain.prototype, {
    init: function () {
      var config = this.config;
      this.$wrap.on("touchstart", "." + config.itemClassName, this.tapItemCallback)
      this.sustaineCreateItem(config.totalTime);
      return this;
    },
    addItem: function () {
      var config = this.config,
        self = this,
        speedX = config.speedX / 100,
        speedY = config.speedY / 10,
        rotate = utils.getRandomIntBetween(-45, 45),
        item = $("<div class='" + config.itemClassName + "'></div>"),
        _width = config.width,
        width = utils.getRandomIntBetween(_width[0], _width[1]),
        height = width * config.multiple,
        left = utils.getRandomIntBetween(10, 90),
        top = this.isDown ? 0 : WINDOW_HEIGHT;

      item.css({
        transformOrigin: "center center",
        width: width + "px",
        height: height + "px",
        left: left + "%",
        top: top,
        position: "absolute",
        backgroundImage: "url(" + config.itemImgUrl + ")",
        backgroundPosition: "center center",
        backgroundSize: "100% 100%",
      });

      this.$wrap.append(item);
      $("body").append(this.$wrap);
      var positionX = 0, positionY = 0;
      var random = utils.getRandomIntBetween(-10, 10);
      function changePosition() {
        positionX += random * speedX;
        positionY += speedY;
        item.css({ transform: self._makeTransform(positionX, positionY, rotate) });
        loop();
      }
      function loop() {
        if (self._shouldStop(positionX, positionY)) {
          item.remove();
          if ($("." + self.config.itemClassName).length === 0) {
            utils.nextTick(self.finishRainning);
          }
          return;
        }
        requestAnimationFrame(changePosition);
      }
      changePosition();
      return this;
    },
    _makeTransform: function (x, y, rotate) {
      y = this.isDown ? y : (-y);
      var rotate = " rotate(" + rotate + "deg)";
      var translateX = " translateX(" + x + "px)";
      var translateY = " translateY(" + y + "px)";
      return translateX + translateY + rotate;
    },
    _shouldStop: function (positionX, positionY) {
      return Math.abs(positionY) >= WINDOW_HEIGHT || Math.abs(positionX) >= WINDOW_WIDTH;
    },
    sustaineCreateItem: function (interval) {
      var end = +new Date + interval * 1000, self = this;
      loopAddItem();
      function loopAddItem() {
        self.clearTimer(self.timer);
        self.addItem();
        if (+new Date >= end) return;
        self.timer = setTimeout(loopAddItem, self.config.throttleTime);
      }
      return this;
    },
    clearTimer: function (timer) {
      clearTimeout(timer);
      timer = null;
      return this;
    },
    destroy: function () {
      this.$wrap.remove();
      this.clearTimer(this.timer);
      return this;
    }
  });

  $(function () {
    new RedpackageRain({
      totalTime: 5,
      throttleTime: 2000,
      speedX: 2,
      tapItemCallback: function () {
        alert(1)
      },
      finishRainning: function () {
        alert(222);
      }
    });
  })

})(this.jQuery);