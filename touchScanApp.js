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
		this.guideText = "长按";
		this.$body = "body";
		this.touchStartCallBack = utils.throttle(options.touchStartCallBack);
		this.initMainSectionElems().init();
	};

	touchScanQrCodeApp.prototype = {
		constructor: touchScanQrCodeApp,

		init: function () {
			utils.cacaheImgs(this.data);
			this.renderTaskSection()
				.unbindTaskItemevent().bindTaskItemevent()
				.unbindDialogEvent().bindDialogEvent();
			return this;
		},

		initMainSectionElems: function () {
			var domList = ["dialog", "diaContent", "touchPanel", 
			"taskItem", "progress", "adText", "diaClose"];
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

		bindTaskItemevent: function () {
			var self = this, time = 0;
			$(this.$taskItem).on("touchstart", function (ev) {
				time = +new Date;
				self.panelTouchStart(ev);
			}).on("touchmove", function () {
				self.panelTouchMove();
			}).on("touchend", function (ev) {
				self.panelTouchEnd();
				var timeEnd = +new Date;
				if (timeEnd - time < 150) { self.showDialog(ev); }
			})
			return this;
		},

		unbindTaskItemevent: function () {
			$(this.$taskItem).off("touchstart").off("touchmove").off("touchend");
			return this;
		},

		bindDialogEvent: function () {
			var self = this;
			$(this.$diaContent).on("touchstart", function () {
				self.dialogTouchStart();
			}).on("touchmove", function () {
				self.dialogTouchMove();
			}).on("touchend", function () {
				self.dialogTouchEnd();
			})
			return this;
		},

		unbindDialogEvent: function () {
			$(this.$dialog).off("touchstart").off("touchmove").off("touchend");
			return this;
		},

		panelTouchStart: function (ev) {
			this.showTouchPanel(ev).showProgress();
			var cb = this.touchStartCallBack;
			typeof cb === 'function' && cb();
			return this;
		},

		panelTouchMove: function () {
			this.hideTouchPanel().hideProgress();
			return this;
		},

		panelTouchEnd: function () {
			this.hideTouchPanel().hideProgress();
			return this;
		},

		dialogTouchStart: function () {
			$(this.$diaContent).addClass("hide");
			$(this.$dialog).find("img").removeClass("hide");
			return this;
		},

		dialogTouchMove: function () {
			$(this.$diaContent).removeClass("hide");
			$(this.$dialog).find("img").addClass("hide");
			return this;
		},

		dialogTouchEnd: function () {
			$(this.$diaContent).removeClass("hide");
			$(this.$dialog).find("img").addClass("hide");
			return this;
		},

		showTouchPanel: function (ev) {
			var target = $(ev.target), src = target.data("src"),
				$panel = $(this.$touchPanel);
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
			var className = this.className, self = this,
				dialog = '\
				<div class="hide ' + className.dialog + '">\
					<div class="' + className.diaContent + '">xxxx</div>\
					<img class="hide" src="" />\
					<p> ' + this.guideText + '</p>\
					<em class="' + className.diaClose + '">x</em>\
				</div>\
				';
			$(this.$body).append(dialog);
			$(document).on("click", this.$diaClose, function() {
				self.hideDialog();
			});
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
			this.renderTaskItem().unbindTaskItemevent().bindTaskItemevent();
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
				adText: 'adText',
				diaClose: 'close',
				diaContent: 'diaContent'
			};
		var app = new touchScanQrCodeApp({
			el: "#app",
			data: data,
			className: className,
			touchStartCallBack: function () {
				// app.updateTaskItem(data);
			}
		});
	})

})(this, this.jQuery);