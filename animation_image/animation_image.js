/*
 * Модуль анимации.
 * Модуль нужен для создания анимации смены картинок. Ожидает на входе массив URL`ов картинок и подставляет их "по кругу" с задержкой несколько миллисекунд.
 *
 * Чтобы создать оъект управления с анимацией картинок, используйте конструкцию вида:
 * var temp = Stalingrad.animation.image();
 *
 * Метод image() ожидает объект с параметрами:
 * {
 *     id: "ID_элемента_страницы",        // ID картинки, у которой будет меняться атрибут SRC. По умолчанию "animation_image"
 *     images: [ "URL_картинки" ],        // Массив URL`ов картинок, которые будут проигрываться. По умолчанию пустой массив
 *     prefix: "images/movie/",           // Префикс, который подставляется в начало URL`ов. По умолчанию "images/'
 *     endIndex: число,                   // Индекс элемента массива картинок, на котором должна останавливаться анимация. По умолчанию 0
 *     time: время_в_милисекундах         // Время в милисекундах для печати одной буквы.
 * }
 *
 * Зачем нужен параметр endIndex.
 * Например, вы делаете анимацию говорящего персонажа. На первом кадре рот у него закрыт. Когда вы решите остановить анимацию, логично, что на последнем кадре, который останется на экране - рот у персонажа тоже будет закрыт. А без этого индекса - анимация может быть прервана в момент, когда рот в открытом состоянии, и такой кадр будет смотреться довольно странно.
 *
 * Модуль имеет следующий API:
 * play() - начать проигрывать анимацию
 * stop() - остановить анимацию
 * next() - следующий кадр
 * back() - предидущий кадр
 * set() - определенный кадр. Ожидает один аргумент - число, которое означает индекс URL`а в массиве URL`ов, который мы проигрываем. По умолачанию 0.
 *
 * Пример использования:
 * var x = animation.image([
 *     "1.jpg",
 *     "2.jpg"
 * ]);
 * x.play();
 *
 */
(function (global) {
    global = global || window;
    global.StalinGrad = global.StalinGrad || {};
    global.StalinGrad.animation = global.StalinGrad.animation || {};
    global = global.StalinGrad.animation;

    var module = function (data) {
        var self = this;
        data = data || {};
        self.node = document.getElementById((data.id || "animation_image"));
        self.images = data.images || [];
        if (data instanceof Array) self.images = data;
        self.count = self.images.length || 0;
        self.prefix = data.prefix || "images/";
        self.index = 0;
        self.time = data.time || 100;
        self.timer = null;
        self.endIndex = data.endIndex || 0;
        self._preload();
    };

    var prototype = {
        _preload: function () {
            var self = this;
            for (var i = 0, l = self.images; i < l; i++) (new Image()).src = self.prefix + self.images[i];
        },
        _render: function () {
            var self = this;
            if (self.index >= self.count) self.index = 0;
            if (self.index < 0) self.index = self.count || 0;
            if (self.node) self.node.setAttribute("src", (self.prefix + self.images[self.index]));
        },
        set: function (index) {
            this.index = index || 0;
            this._render();
        },
        next: function () {
            this.index++;
            this._render();
        },
        back: function () {
            this.index--;
            this._render();
        },
        play: function () {
            var self = this;
            self.stop();
            if (self.count) self.timer = setInterval(function () {
                self.next();
            }, self.time);
        },
        stop: function () {
            var self = this;
            clearInterval(self.timer);
            if(self.endIndex || self.endIndex === 0) self.set(self.endIndex);
        }
    };

    for (var index in prototype) module.prototype[index] = prototype[index];

    global.image = function (data) {
        return new module(data);
    }
})(window);