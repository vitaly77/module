/*
 * Модуль для контекстного меню.
 * При иницилизации ожидает данные в виде:
 * {
 *     id: "id_меню",
 *     items: [
 *         {
 *             title: "Текст на кнопке",
 *             link: "ссылка, которая отработает при нажатии",
 *             callback: function() {
 *                 функция, который отработает при нажатии
 *             }
 *         },
 *         {
 *             title: "Текст на второй кнопке"
 * 			   ...
 *         }
 *     ]
 * }
 * 
 * Вернет объект меню с двумя методами и одним свойством:
 * show - покажет меню
 * hide - скроет меню
 * node - указатель на DOM элемент меню
 * 
 * Пример:
 * var menu = contextMenu(данные_для_создания_меню);
 * menu.show();
 * menu.hide();
 * menu.node.appendChild(DOM_элемент);
 * 
 * Модуль требует наличия в документе следующего HTML кода:
 * <div class="context_menu_table" id="context_menu_table">
 *     <div class="context_menu_tr">
 *         <div class="context_menu_td" id="context_menu_td"></div>
 *     </div>
 * </div>
 * 
 */
 (function(global) {
    global = global || window;
    global.StalinGrad = global.StalinGrad || {};
    global.StalinGrad.module = global.StalinGrad.module || {};
    global = global.StalinGrad.module;

    var module = {
        activeItem:null,
        isShow: false,
        node:{},
        data:{},
        prefix:"context_menu_",
        setNode:function() {
            this.node.table = document.getElementById((this.prefix + "table"));
            this.node.td = document.getElementById((this.prefix + "td"));
        },
        setEvent:function() {
            var self = this;
            utils.addEvent(self.node.table, "click", function() {
                self.hide();
            });
        },
        hide:function(node) {
            this.isShow = false;
            node = (node) ? node : this.node.table;
            utils.addClass(node, "hidden");
        },
        show:function(node) {
            var self = this;
            utils.removeClass(self.node.table, "hidden");
            if(!node) return false;
            if(self.activeItem) self.hide(self.activeItem);
            utils.removeClass(node, "hidden");
            self.activeItem = node;
            this.isShow = true;
        },
        createContainer:function(id) {
            var self = this,
                node = document.createElement("DIV");
            node.setAttribute("class", (self.prefix + id + " hidden"));
            self.node.table.appendChild(node);
            return node;
        },
        getCallback:function(item) {
            return function(event) {
                utils.stopEvent(event);
                item.callback && item.callback();
                if(item.link) window.location.href = item.link;
            };
        },
        createMenu:function(data) {
            var self = this,
                item = {
                    node:self.createContainer(data.id)
                };
            for(var i = 0, l = data.items.length; i < l; i++) {
                var node = document.createElement("DIV");
                node.setAttribute("class", (self.prefix + "item"));
                node.innerHTML = data.items[i].title || "";
                utils.addEvent(node, "click", self.getCallback(data.items[i]));
                item.node.appendChild(node);
            }

            self.data[data.id] = item;
            return new menu(item.node);
        },
        init:function() {
            var self = this;
            if(self.node.table) return false;
            self.setNode();
            self.setEvent();
        }
    };


    function menu(node) {
        this.node = node;
        this.isShow = false;
    }

    menu.prototype.show = function() {
        module.show(this.node);
    };
    menu.prototype.hide = function() {
        module.hide();
    };
    menu.prototype.toggle = function() {
        if(this.isShow && module.isShow) {
            this.isShow = false;
            module.hide();
        } else {
            this.isShow = true;
            module.show(this.node);
        }
    };

    global.contextMenu = function(data) {
        module.init();
        return module.createMenu(data);
    }
})(window);