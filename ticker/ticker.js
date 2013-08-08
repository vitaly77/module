/*
 * Модуль бегущей ленты новостей.
 * Выводит информацию в столбик (как убийства в CS)
 *
 * Требует наличия HTML кода:
 * <div class="ticker_container" id="ticker_killings"></div>
 *
 * При инициализации ждет объект с данными:
 * {
 *     id: "ID_элемента"    // ID элемента контейнера, по умолчанию "ticker_killings"
 *     limit: 5             // количество сообщений в контейнере, по умолчанию пять
 *     time: 5000           // время, в милиссекундах, показа одного сообщения
 * }
 */
 
(function(global) {
    global = global || window;
    global.StalinGrad = global.StalinGrad || {};
    global.StalinGrad.module = global.StalinGrad.module || {};
    global = global.StalinGrad.module;
	
	var ticker = function(data) {
		data = data || {};
		data.id = data.id || "ticker_killings";
		var self = this;
		self.node = document.getElementById(data.id);
		if(!self.node) return false;
		self.index = 0;
		self.limit = data.limit || 5;
		self.time = data.time || 5000;
		self.arrayMessage = [];
	}
	
	ticker.prototype.add = function(message) {
		if(!message) return false;
		var self = this;
		self.index++;
		if(self.index > self.limit) self.remove();
		if(typeof message == "string") {
			var node = document.createElement("DIV"),
                nodeBR = document.createElement("BR");
			node.className = "ticker_item";
			node.innerHTML = message;
			message = node;
		}
		self.node.appendChild(message);
        self.node.appendChild(nodeBR);
		var timer = setTimeout(function() {
			 self.remove();
		}, self.time);
		self.arrayMessage.push({
			timer: timer,
			node: message,
            nodeBR: nodeBR
		});
	}
	
	ticker.prototype.remove = function() {
		var self = this,
			object = self.arrayMessage.shift();
		if(!object) return false;
		self.node.removeChild(object.node);
        self.node.removeChild(object.nodeBR);
		self.index--;
		clearTimeout(object.timer);
	}
	
    global.ticker = function(data) {
        return new ticker(data);
    };
})(window);