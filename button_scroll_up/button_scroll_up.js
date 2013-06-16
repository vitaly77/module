/*
 * Модуль, который добавляет полосу прокрутки на страницу слева. Аналог полосы прокрутки вконтакте или на хабре.
 * Если страница достаточно большая, и пользователь отмотал на 1.5 экрана вниз - при наведение указателя в левый край
 * документа - появится полоска скролла вверх, которая пропадет сразу, после завершения действия.
 * Требует подключенный CSS файл со стилями.
 * Создает DOM объект прокрутки (DIV элемент).
 *
 */

(function() {
	var module = {
		node: null,
		timer: null,
		isShow: false,
		createNode: function() {
			this.node = utils.create("DIV", {
				className: "button_scroll_up__hidden",
				innerHTML: "<img src=\"data:image/gif;base64,R0lGODlhDgAHAPEAAAAAAEVojgAAAAAAACH5BAEAAAIALAAAAAAOAAcAAAgfAAUIHBggwMCDBwsWRJhQ4UKGDh0ijBiRIMWKFy8GBAA7\" />"
			}, document.body);
		},
		setEvent: function() {
			var self = this;
			utils.addEvent(self.node, "click", function() {
				window.scrollTo(0, 0);
			});
			utils.addEvent(document, "scroll", function() {
				clearInterval(self.timer);
				self.timer = setTimeout(function() {
					self.inspect();
				}, 200);
			});
		},
		inspect: function() {
			var self = this;
			var size = self.getScroll();
			if((size.scroll > (size.height * 0.4)) && (!self.isShow)) {
				self.isShow = true;
				self.show();
			} else if((size.scroll < (size.height * 0.4)) && (self.isShow)) {
				self.isShow = false;
				self.hide();
			}
		},
		getScroll: function() {
			var d = document,
				w = window;
			var de = d.documentElement,
				db = d.body;
			return {
				"scroll": (w.pageYOffset ? w.pageYOffset : (de.scrollTop ? de.scrollTop : db.scrollTop)),
				"height": de.clientHeight
			};
		},
		show: function() {
			this.replaceClass("button_scroll_up__hidden", "button_scroll_up");
		},
		hide: function() {
			this.replaceClass("button_scroll_up", "button_scroll_up__hidden");
		},
		replaceClass: function(remove, add) {
			var node = this.node;
			utils.removeClass(node, remove);
			utils.addClass(node, add);
		},
		init: function() {
			var self = this;
			self.createNode();
			if(self.node) self.setEvent();
		}
	};

	utils.addEvent(document, "DOMContentLoaded", function() {
		module.init();
	}, false);
})();