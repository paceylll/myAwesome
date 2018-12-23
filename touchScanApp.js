; (function (global, $) {
	var utils = {
		cacaheImgs: function (list) {
			if (list.length === 0) return this;
			var urls = list.slice(), img = new Image(), self = this;
			img.onload = function () {
				self.cacaheImgs(urls);
			};
			img.src = urls.pop().url;
			return this;
		},
		nextTick: function (fn, num) {
			num = num || 0;
			setTimeout(fn, num);
		},
		throttle: function (fn, gapTime) {
			if (typeof fn !== 'function') return;
			var _lastTime = null, gapTime = gapTime || 3000;
			return function () {
				var _nowTime = + new Date();
				if (_nowTime - _lastTime > gapTime || !_lastTime) {
					var result = fn();
					_lastTime = _nowTime;
					return result;
				}
			}
		}
	};

	var touchScanQrCodeApp = function (options) {
		this.el = $(options.el);
		this.data = options.data;
		this.className = $.extend(options.className);
		this.adTitleText = "title";
		this.$body = "body";
		this.touchStartCallBack = utils.throttle(options.touchStartCallBack);
		this.initMainSectionElems().init();
	};

	touchScanQrCodeApp.prototype = {
		constructor: touchScanQrCodeApp,

		init: function () {
			utils.cacaheImgs(this.data);
			this.renderTaskSection().unbindTaskItemEvents()
				.bindTaskItemEvents().unbindDialogEvent().bindDialogEvent();
			return this;
		},

		initMainSectionElems: function () {
			var domList = ["dialog", "touchPanel", "taskItem", "progress", "adText"];
			domList.forEach(function (item) {
				this["$" + item] = "." + this.className[item];
			}.bind(this))

			this.el.append("<div class='taskWrap'></div>");
			this.$taskWrap = ".taskWrap";

			return this;
		},

		makeTaskItemHtmlStr: function () {
			var data = this.data.slice(), className = this.className.taskItem;
			str = "";
			data.forEach(function (item) {
				str += '\
					<div data-src="' + item.url + '" class="' + className + '">\
					</div>\
				';
			})
			return str;
		},

		makeAdTitleHtmlStr: function () {
			var className = this.className,
				str = '\
				<h1 class="' + className.adTitle + '">\
					<p class="' + className.adText + '">' + this.adTitleText + '</p>\
					<div class="width0 ' + className.progress + '"><div>\
				</h1>\
				';
			return str;
		},

		renderAdTitle: function () {
			this.el.prepend(this.makeAdTitleHtmlStr());
			return this;
		},
		renderTaskItem: function () {
			$(this.$taskWrap).html(this.makeTaskItemHtmlStr());
			return this;
		},

		renderTaskSection: function () {
			this.renderTaskItem().renderAdTitle().renderTouchPanel().renderDialog();
			return this;
		},

		renderTouchPanel: function () {
			var panel = '\
			<div class="hide ' + this.className.touchPanel + '">\
				<img src="" />\
			</div>\
			';
			this.el.append(panel);
			return this;
		},

		bindTaskItemEvents: function () {
			var self = this, time = 0;
			$(this.$taskItem).on("touchstart", function (ev) {
				time = +new Date;
				self.touchStart(ev);
			}).on("touchmove", function () {
				self.touchMove();
			}).on("touchend", function (ev) {
				self.touchEnd();
				var timeEnd = +new Date;
				if (timeEnd - time < 150) { self.showDialog(ev); }
			})
			return this;
		},

		unbindTaskItemEvents: function () {
			$(this.$taskItem).off("touchstart").off("touchmove").off("touchend");
			return this;
		},

		touchStart: function (ev) {
			this.showTouchPanel(ev).showProgress();
			var cb = this.touchStartCallBack;
			typeof cb === 'function' && cb();
			return this;
		},

		touchMove: function () {
			this.hideTouchPanel().hideProgress();
			return this;
		},

		touchEnd: function () {
			this.hideTouchPanel().hideProgress();
			return this;
		},

		showTouchPanel: function (ev) {
			var target = $(ev.target), src = target.data("src"), $panel = $(this.$touchPanel);
			$(this.$touchPanel).find("img").attr("src", src);
			utils.nextTick(function () {
				$panel.removeClass("hide");
			});
			return this;
		},

		hideTouchPanel: function () {
			utils.nextTick(function () {
				$(this.$touchPanel).addClass("hide");
			}.bind(this));
			return this;
		},

		renderDialog: function () {
			var dialog = '\
			<div class="hide ' + this.className.dialog + '">\
				<img src="" />\
			</div>\
			';
			$(this.$body).append(dialog);
			return this;
		},

		showDialog: function (ev) {
			var $dialog = $(this.$dialog), src = $(ev.target).data("src");
			$dialog.find("img").attr("src", src);
			utils.nextTick(function () {
				$dialog.removeClass("hide");
			});
			return this;
		},

		hideDialog: function () {
			$(this.$dialog).addClass("hide");
			return this;
		},

		bindDialogEvent: function () {
			var $dialog = $(this.$dialog);
			$dialog.on("touchstart", function () {

			})
			return this;
		},

		unbindDialogEvent: function () {

			return this;
		},

		showProgress: function () {
			$(this.$adText).addClass("hide");
			$(this.$progress).removeClass("width0").addClass("width60");
			return this;
		},

		hideProgress: function () {
			$(this.$progress).removeClass("width60").addClass("width0");
			utils.nextTick(function () {
				$(this.$adText).removeClass("hide");
			}.bind(this), 400)
			return this;
		},

		updateTaskItem: function (data) {
			this.data = data;
			this.renderTaskItem().unbindTaskItemEvents().bindTaskItemEvents();
			return this;
		}
	};

	global.touchScanQrCodeApp = touchScanQrCodeApp;

	$(function () {
		var data = [
			{ url: "test.png" },
			{ url: "test2.jpeg" }
		],
			className = {
				taskItem: 'taskItem',
				adTitle: "adTitle noselect",
				touchPanel: 'touchPanel',
				dialog: 'dialog',
				progress: 'progress',
				adText: 'adText'
			};
		var app = new touchScanQrCodeApp({
			el: "#app",
			data: data,
			className: className,
			touchStartCallBack: function () {
				app.updateTaskItem(data);
			}
		});
	})

})(this, this.jQuery);