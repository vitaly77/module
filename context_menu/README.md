# Контекстное меню

Модуль для контекстного меню.
При иницилизации ожидает данные в виде:
<pre>
{
    id: "id_меню",
    items: [
        {
            title: "Текст на кнопке",
            link: "ссылка, которая отработает при нажатии",
            callback: function() {
                callback, который отработает при нажатии
            }
        },
        {
            title: "Текст на второй кнопке"
			...
        }
    ]
}
</pre>

Вернет объект меню с двумя методами и одним свойством:
show - покажет меню
hide - скроет меню
node - указатель на DOM элемент меню

Пример:
<code>
var myMenu = contextMenu(данные_для_создания_меню);
myMenu.show();
myMenu.hide();
myMenu.node.appendChild(DOM_элемент);
</code>

Модуль требует наличия в документе следующего HTML кода:
<div class="context_menu_table" id="context_menu_table">
    <div class="context_menu_tr">
        <div class="context_menu_td" id="context_menu_td"></div>
    </div>
</div>
