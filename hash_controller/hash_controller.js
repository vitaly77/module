/*
 * Модуль, который следит за состоянием хэша страницы. Проверка на изменение - каждые 200 миллисекунд.
 * Ожидает начало хэша с #! т.к. поисковики ищут этот параметр на Ajax сайтах.
 *
 * Слушает события:
 * "hash_controller_init" - инициализация модуля. Ожидает объект с параметрами, которые будут установленны как параметры
 *                          по умолчанию при запуске страницы.
 * "hash_controller_add" - добавляет новый параметр в хэш. Если такой параметр в хэше уже существует - перезатирает
 *                         параметр. Ожидает объект с параметрами. Например:
 * {
 *     page: "main"
 * }
 *
 * "hash_controller_remove" - Удаление всех параметров из хэша и замену их новыми параметрами.
 *                            Ожидает объект с параметрами. Например:
 * {
 *     page: "main"
 * }
 *
 * Публикует события:
 * "hash_controller_update" - вернет объект с параметрами из хэша. Событие публикуется при изменении хэша страницы.
 *
 */

(function(global) {
	global = global || window;

	var module = {
		hash: "",
		time: 200,
		timer: null,
		params: {},
		defaultParams: {},
		check: function() {
			var self = this;
			var hash = window.location.hash;
			hash = hash.replace("#!", "");
			hash = hash.replace("#", "");
			if(hash == self.hash) return false;
			self.hash = hash;
			var data = self.getParams(hash);
			utils.event.trigger("hash_controller_update", data);
		},
		getParams: function(hash) {
			if(hash == "") return this.defaultParams;
			hash = hash.split("&");
			for (var i = 0, l = hash.length; i < l; i++) {
				var item = hash[i].split("=");
				if(item.length == 2) this.params[item[0]] = item[1];
			}
			return this.params;
		},
		setHash: function() {
			var params = this.params,
				hash = "#!";
			for (var item in params) hash += item + "=" + params[item] + "&";
			window.location.hash = hash.replace(/\&$/, "");
		},
		addData: function(data) {
			if(!data) return false;
			for (var item in data) this.params[item] = data[item];
			this.setHash();
		},
		removeData: function(data) {
			if(!data) return false;
			var params = this.params;
			for (var item in data) if(params[item]) delete params[item];
			this.setHash();
		},
		init: function(data) {
			var self = this;
			clearInterval(self.timer);
			self.defaultParams = data || {};
			self.check();
			if(self.hash == "" && data) self.addData(data);
			self.timer = setInterval(function() {
				self.check();
			}, self.time);
		}
	};

	utils.event.listen("hash_controller_add", function(data) {
		module.addData(data);
	});

	utils.event.listen("hash_controller_remove", function(data) {
		module.removeData(data);
	});

	utils.event.listen("hash_controller_init", function(data) {
		module.init(data);
	});
})(utils);