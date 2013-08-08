/*
 * Модуль всплывающих окон.
 *
 * Требует наличия следующего HTML кода:
 * <div class="popup_window_table__hidden" id="popup_window_table">
 *     <div class="popup_window_tr">
 *         <div class="popup_window_td" id="popup_window_td">
 *             <!-- Далее список всплывающих окон -->
 *             <div class="popup_window_item__hidden" id="window_1">Пример окна раз</div>
 *             <div class="popup_window_item__hidden" id="window_2">Пример окна два</div>
 *             <div class="popup_window_item__hidden" id="window_3">Пример окна три</div>
 *             ...
 *
 *         </div>
 *     </div>
 * </div>
 *
 * Пример использования:
 * var win1 = StalinGrad.module.popupWindow("window_1");    // При создание нового окна, требуется ID html элемента
 * var win2 = StalinGrad.module.popupWindow("window_2");
 * var win3 = StalinGrad.module.popupWindow("window_3");
 *
 * Каждое окно обладает следующим API:
 * show() - покажет окно
 * hide() - скроет окно
 *
 * Если было открыто несколько окон, например так:
 * win1.show();
 * win2.show();
 * То при открытии - каждое новое окно скрывает прошлое, при закрытие - каждое закрытое, востанавливает прошлое окно.
 * Тоесть в модуле имеется стек, который помнит в каком порядке открывали окна.
 *
 */

(function (global) {
    global = global || window;
    global.StalinGrad = global.StalinGrad || {};
    global.StalinGrad.module = global.StalinGrad.module || {};
    global = global.StalinGrad.module;

    var module = {
        isShow:false,
        node:{},
        stack:[],
        prefix:"popup_window_",
        setNode:function () {
            var self = this;
            self.node.table = document.getElementById((self.prefix + "table"));
            self.node.td = document.getElementById((self.prefix + "td"));
        },
        setEvent:function () {
            var self = this;
            utils.addEvent(self.node.table, "click", function () {
                self.closeTable();
            });
        },
        closeTable:function () {
            var self = this;
            self.isShow = false;
            self.replaceView(self.node.table, "table__hidden", "table");
            while (self.stack.length) self.close(self.stack[0]);
        },
        close:function (data) {
            var self = this;
            for (var i = 0, l = self.stack.length; i <= l; i++) {
                if (self.stack[i].id == data.id) {
                    self.replaceView(self.stack[i].node, "item__hidden", "item");
                    self.stack.splice(i, 1);
                    break;
                }
            }
            if (self.isShow) {
                if (self.stack.length === 0) self.closeTable();
                else self.show(self.stack[(self.stack.length - 1)]);
            }
        },
        hide:function (data) {
            this.replaceView(data.node, "item__hidden", "item");
        },
        show:function (data) {
            var self = this;
            if (!data) return false;

            var index = self.stack.length - 1;
            if (index >= 0) {
                if (self.stack[index].id != data.id) {
                    self.stack.push(data);
                    self.hide(self.stack[index]);
                }
            } else self.stack.push(data);

            self.replaceView(data.node, "item", "item__hidden");
            if (!self.isShow) self.replaceView(self.node.table, "table", "table__hidden");
            self.isShow = true;
        },
        replaceView:function (node, addClass, removeClass) {
            utils.addClass(node, (this.prefix + addClass));
            utils.removeClass(node, (this.prefix + removeClass));
        },
        createWindow:function (id) {
            var self = this;
            var node = document.getElementById(id),
                button = document.createElement("SPAN");
            button.setAttribute("class", (self.prefix + "item_close"));
            button.innerHTML = "x";
            node.appendChild(button);
            var data = {
                id:id,
                node:node
            };
            utils.addEvent(button, "click", function () {
                self.close(data);
            });
            utils.addEvent(node, "click", function (event) {
                utils.stopEvent(event);
            });
            return new popup(data);
        },
        init:function () {
            var self = this;
            if (self.node.table) return false;
            self.setNode();
            self.setEvent();
        }
    };


    function popup(data) {
        var self = this;
        self.id = data.id;
        self.node = data.node;
    }

    popup.prototype.show = function () {
        module.show({
            id:this.id,
            node:this.node
        });
    };
    popup.prototype.hide = function () {
        module.hide({
            id:this.id,
            node:this.node
        });
    };

    global.popupWindow = function (id) {
        module.init();
        return module.createWindow(id);
    }
})(window);