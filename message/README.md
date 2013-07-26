# Модуль всплывающих окошек.

Его задача заменить стандартный alert и confirm на красивые окна.
Слушает события:
<code>message_show</code> - показать сообщение. Также ждет получение строки сообщения, которую он должен показать.
<code>message_hide</code> - спрятать сообщение.
<code>message_confirm</code> - показать confirm. Ждет объект:
<pre>
{
    message: "Are you adult?"        // сообщение, которое будет показано
    ok: "Yes"                        // текст на кнопке согласия, по умолчанию ok
    cancel: "No"                     // текст на кнопке отмены, по умолчанию cancel
    callback: function(status) {}    // функция, которая будет вызвана после ответа пользователя. Функции будет передан статус выбора. TRUE - пользователь подтвердил вопрос. FALSE - пользователь отказался.
}
</pre>

Инициализируется по событию DOMContentLoaded
Ожидает наличие следующего кода на HTML в документе:
<pre><code>
&lt;table cellspacing="0" cellpadding="0" class="message_table hidden" id="js_message_table">
    &lt;tr class="message_tr">
        &lt;td class="message_td">
            &lt;div class="message_container" id="js_message_container">
                &lt;div class="message_close" id="js_message_close">x&lt;/div>
                &lt;div class="message_info" id="js_message_info">&lt;/div>
                &lt;div class="message_options hidden" id="js_message_options">&lt;/div>
                &lt;div class="message_button hidden" id="js_message_ok">Ok&lt;/div>
                &lt;div class="message_button hidden" id="js_message_cancel">Cancel&lt;/div>
            &lt;/div>
        &lt;/td>
    &lt;/tr>
&lt;/table>
</code></pre>