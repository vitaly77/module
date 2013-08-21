/*
 * Модуль анимации.
 * Модуль нужен для создания анимации появляющегося текста. Выводит его по буквам с задержкой несколько миллисекунд.
 *
 * Чтобы создать оъект текста с анимацией, используйте конструкцию вида:
 * var temp = Stalingrad.animation.text();
 *
 * Метод text() ожидает объект с параметрами:
 * {
 *     id: "ID_элемента_страницы",        // ID элемента страницы, в который будет печататься текст. По умолчанию "animation_text"
 *     type: "span",                      // Способ вывода текста. По умолчанию - innerHTML.
 *     text: "Некий_текст_для_печати",    // Текст для печати. По умолчанию пустая строка.
 *     time: время_в_милисекундах         // Время в милисекундах для печати одной буквы.
 * }
 *
 * Кроме задания параметров при инициализации, вы также можете задавать все эти параметры при каждой печати (вызом метода print() из API)
 * Параметры, которые были заданы при иницилизации - становятся параметрами по умолчанию, по отношению к параметрам для конкретной печати.
 *
 * Например:
 * vat a = Stalingrad.animation.text({
 *     text: "Ничего не найдено!"
 * });
 * a.print("Результаты поиска");    // Выведет: "Результаты поиска"
 * a.print();                       // Выведет: "Ничего не найдено!"
 * a.print({                        // Выведет: "Результаты поиска в другой div" в элемент с ID "div-id-2"
 *     id: "div-id-2",
 *     text: ""Результаты поиска в другой div"
 * });
 *
 * Разница в способе вывода текста.
 * Как уже было сказано выше, один и тот же текст может быть выведен двумя разными способами:
 * 1. Через innerHTML. Это довольно быстро, но минус в том, что нельзя навесить стили на каждую букву и при печати каждой буквы - строка перезатирается.
 * 2. Через отдельные <span>`ы. Это более ресурсозатратно, т.к. для вывода каждой буквы нужно создавать свой <span>, но зато - строка не перезатирается при печати и можно навесить стили каждой букве.
 * Для изменения способа печати - указывайте свойство type при создании экземпляра анимированного текста. По умолчанию выбран способ innerHTML
 *
 * Модуль имеет следующий API:
 * print() - напечатает текст. Ожидает один аргумент объект с параметрами или текст, который следует распечатать.
 * clear() - сотрет текст.
 * end() - завершит анимацию, показав весь текст.
 *
 */
(function (global) {
    global = global || window;
    global.StalinGrad = global.StalinGrad || {};
    global.StalinGrad.animation = global.StalinGrad.animation || {};
    global = global.StalinGrad.animation;

    var text = function (data) {
        var self = this;
        data = data || {};
        self.default = {
            id: data.id || data || "animation_text",
            type: data.type || "innerHTML",
            text: data.text || "",
            length: 0,
            time: data.time || 50,
            node: document.getElementById((data.id || "animation_text"))
        };
        self._set(data);
    };

    text.prototype._set = function (data) {
        data = data || {};
        var self = this;
        self.type = data.type || self.default.type;
        self.text = data.text || self.default.text;
        if(typeof data == "string") self.text = data;
        self.length = self.text.length || self.default.length;
        self.index = 0;
        self.time = self.default.time;
        self.node = (data.id) ? (document.getElementById(data.id) || self.default.node) : self.default.node;
    };

    text.prototype.print = function (data) {
        var self = this;
        self._set(data);
        if (self.length) self.timer = setInterval(function () {
            self._update();
        }, self.time);
    };

    text.prototype.clear = function (data) {
        if (this.node) this.node.innerHTML = "";
    };

    text.prototype._renderSpan = function () {
        var self = this,
            node = document.createElement("SPAN");
        node.innerHTML = self.text.slice((self.index - 1), self.index);
        self.node.appendChild(node);
    };

    text.prototype.end = function (data) {
        var self = this;
        clearInterval(self.timer);
        if (!self.node) return false;
        if (self.type == "innerHTML") self.node.innerHTML = self.text;
        else while (self.index < self.length) {
            self.index++;
            self._renderSpan();
        }
    };

    text.prototype._update = function () {
        var self = this;
        self.index++;
        if (self.index > self.length) return clearInterval(self.timer);
        if (!self.node) return false;
        if (self.type == "innerHTML") self.node.innerHTML = self.text.slice(0, self.index);
        else self._renderSpan();
    };

    global.text = function (id) {
        return new text(id);
    }
})(window);