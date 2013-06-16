/*
 * Модуль всплывающих окошек. Его задача заменить стандартный alert и confirm на красивые окна.
 * Слушает события:
 * "message_show" - показать сообщение. Также ждет получение строки сообщения, которую он должен показать.
 * "message_hide" - спрятать сообщение.
 * "message_confirm" - показать confirm. Ждет объект:
 *
 * {
 *     message: "Are you adult?"        // сообщение, которое будет показано
 *     ok: "Yes"                        // текст на кнопке согласия, по умолчанию ok
 *     cancel: "No"                     // текст на кнопке отмены, по умолчанию cancel
 *     callback: function(status) {}    // функция, которая будет вызвана после ответа пользователя. Функции будет передан статус выбора. TRUE - пользователь подтвердил вопрос. FALSE - пользователь отказался.
 * }
 *
 * Инициализируется по событию DOMContentLoaded
 * Ожидает наличие следующего кода на HTML в документе:
 *
 * <table cellspacing="0" cellpadding="0" class="message_table hidden" id="js_message_table">
 *     <tr class="message_tr">
 *         <td class="message_td">
 *             <div class="message_container" id="js_message_container">
 *                 <div class="message_close" id="js_message_close">x</div>
 *                 <div class="message_info" id="js_message_info"></div>
 *                 <div class="message_options hidden" id="js_message_options"></div>
 *                 <div class="message_button hidden" id="js_message_ok">Ok</div>
 *                 <div class="message_button hidden" id="js_message_cancel">Cancel</div>
 *             </div>
 *         </td>
 *     </tr>
 * </table>
 *
 */

(function(global) {
	global = global || window;
	var module = {
		node: {},
		prefix: "js_message_",
		callback: null,
		set: function(message) {
			var self = this;
			if(!self.node.info) return false;
			self.node.info.innerHTML = message || "";
			self.show(message);
		},
		setButton: function(data) {
			var self = this,
				set = function(id, text) {
					var node = self.node[id];
					if(!node) return false;
					node.innerHTML = text;
					utils.removeClass(node, "hidden");
				};
			set("ok", (data.ok || "ok"));
			set("cancel", (data.cancel || "cancel"));
			self.callback = data.callback || null;
		},
		show: function(url) {
			if(this.node.table) utils.removeClass(this.node.table, "hidden");
		},
		hide: function() {
			var node = this.node,
				set = function(id) {
					if(node[id]) {
						utils.addClass(node[id], "hidden");
					}
				};
			set("table");
			set("ok");
			set("cancel");
		},
		setNode: function() {
			var self = this,
				set = function(id) {
					self.node[id] = document.getElementById((self.prefix + id));
					if(self.node[id]) self.node[id].removeAttribute("id");
				};
			set("table");
			set("container");
			set("close");
			set("info");
			set("ok");
			set("cancel");
		},
		setEvent: function() {
			var self = this;
			var node = self.node;
			var set = function(id, type) {
				if(!node[id]) return false;
				utils.addEvent(node[id], "click", function(event) {
					utils.stopEvent(event);
					self.hide();
					self.callback && self.callback(type);
				});
			};

			set("table", false);
			set("close", false);
			set("cancel", false);
			set("ok", true);

			if(!node.container) return false;
			utils.addEvent(node.container, "click", function(event) {
				utils.stopEvent(event);
			});
		},
		init: function() {
			var self = this;
			self.setNode();
			self.setEvent();
		}
	};

	var message = function(message) {
		module.set(message);
	};

	var confirm = function(data) {
		module.setButton(data);
		module.set(data.message);
	};

	global.message = {
		"show": message,
		"confirm": confirm
	};

	utils.event.listen("message_show", message);
	utils.event.listen("message_confirm", confirm);

	utils.event.listen("message_hide", function() {
		module.hide();
	});

	utils.addEvent(document, "DOMContentLoaded", function() {
		module.init();
	}, false);
})(utils)