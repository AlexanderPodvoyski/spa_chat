/*
 * spa.shell.js
 * Модуль Shell для Spa
 */

/*jslint
 devel  : true, browser : true, continue : true,
 newcap : true, indent  : 2,    maxerr   : 50,
 regexp : true, nomen   : true, plusplus : true,
 white  : true, sloppy  : true, vars     : true
 */

/*global $, spa */

spa.shell = (function() {
  //----------------- НАЧАЛО ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ
  var
    configMap = {
      main_html: `
        <div class="spa-shell-head">
          <div class="spa-shell-head-logo"></div>
          <div class="spa-shell-head-acct"></div>
          <div class="spa-shell-head-search"></div>
        </div>
        <div class="spa-shell-main">
          <div class="spa-shell-main-nav"></div>
          <div class="spa-shell-main-content"></div>
        </div>
        <div class="spa-shell-foot"></div>
        <div class="spa-shell-chat"></div>
        <div class="spa-shell-modal"></div>
      `,
      chat_extend_time: 1000,
      chat_retract_time: 300,
      chat_extend_height: 450,
      chat_retract_height: 15,
      chat_extended_title: 'Click to retract',
      chat_retracted_title: 'Click to extended',
      template_html: '<div class="spa-slider"><\/div>'
    };
  var
    stateMap = {
      $container : null,
      is_chat_retracted : true
    },
    jqueryMap = {},

    setJqueryMap, toggleChat, initModule;
  //----------------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ

  //----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
  //----------------- КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ --------------------

  //----------------- НАЧАЛО МЕТОДОВ DOM -------------------------
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
  };

  toggleChat = function (do_extend, callback) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = ! is_open && ! is_closed;

      if (is_sliding) return false;

      if (do_extend) {
        jqueryMap.$chat.animate(
          { height: configMap.chat_extend_height },
          configMap.chat_extend_time,
          function() {
            jqueryMap.$chat.attr(
              'title', configMap.chat_extended_title
            );
            stateMap.is_chat_retracted = false;
            if (callback){ callback(jqueryMap.$chat) }
          }
        );
        return true;
      }

    jqueryMap.$chat.animate(
      { height: configMap.chat_retract_height },
      configMap.chat_retract_time,
      function() {
        jqueryMap.$chat.attr(
          'title', configMap.chat_retracted_title
        );
        stateMap.is_chat_retracted = true;
        if (callback){ callback(jqueryMap.$chat) }
      }
    );
    return true;
  };


  //----------------- КОНЕЦ МЕТОДОВ DOM --------------------------

  //----------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ ----------------
 onClickChat = function(event) {
   toggleChat(stateMap.is_chat_retracted);
   return false;
 }
  //----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

  //----------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ --------------------
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    // инициализировать окно чата и привязать обработчик щелчка
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr('title', configMap.chat_retracted_title)
      .on('click', onClickChat);
  };

  return { initModule: initModule };
  //----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ ---------------------
}());
