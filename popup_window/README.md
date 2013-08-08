# Модуль всплывающих окон.

Требует наличия следующего HTML кода:
<code>
&lt;div class="popup_window_table__hidden" id="popup_window_table">
    &lt;div class="popup_window_tr">
        &lt;div class="popup_window_td" id="popup_window_td">
            &lt;!-- Далее список всплывающих окон -->
            &lt;div class="popup_window_item__hidden" id="window_1">Пример окна раз&lt;/div>
            &lt;div class="popup_window_item__hidden" id="window_2">Пример окна два&lt;/div>
            &lt;div class="popup_window_item__hidden" id="window_3">Пример окна три&lt;/div>
            ...

        &lt;/div>
    &lt;/div>
&lt;/div>
</code>

Пример использования:
<code>
var win1 = StalinGrad.module.popupWindow("window_1");    // При создание нового окна, требуется ID html элемента
var win2 = StalinGrad.module.popupWindow("window_2");
var win3 = StalinGrad.module.popupWindow("window_3");
</code>

Каждое окно обладает следующим API:
<code>
show() - покажет окно
hide() - скроет окно
</code>

Если было открыто несколько окон, например так:
<code>
win1.show();
win2.show();
</code>

То при открытии - каждое новое окно скрывает прошлое, при закрытие - каждое закрытое, востанавливает прошлое окно.
Тоесть в модуле имеется стек, который помнит в каком порядке открывали окна.
