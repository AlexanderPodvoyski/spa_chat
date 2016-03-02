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
      anchor_schema_map: {
        chat: {open: true, closed: true}
      },
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
      anchor_map: {},
      is_chat_retracted : true
    },
    jqueryMap = {},

    copyAnchorMap, changeAnchorPart, onHashChange,
    setJqueryMap, toggleChat, initModule;
  //----------------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ

  //----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
  // Возвращает копию сохраненного хэша якорей; минимизация издержек
  // Используем метод jQuery extend() для копирования объекта.
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };
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

  changeAnchorPart = function ( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(), bool_return = true,
      key_name, key_name_dep;
    // Начало объединения изменений в хэше якорей
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {

        // пропустить зависимые ключи
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        // обновить значение независимого ключа
        anchor_map_revise[key_name] = arg_map[key_name];

        // обновить соответствующий зависимый ключ key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep]; }

        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    // Конец объединения изменений в хэше якорей

    // Начало попытки обновления URI. B случае ошибки восстановить исходное состояние
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // восстановить исходное состояние в URI
      $.uriAnchor.setAnchor( stateMap.anchor_map,null,true ); bool_return = false;
    }
    // Конец попытки обновления URI...

    return bool_return;
  };

  //----------------- КОНЕЦ МЕТОДОВ DOM --------------------------

  //----------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ ----------------
  onClickChat = function(event) {
    changeAnchorPart({
      chat: ( stateMap.is_chat_retracted ? 'open' : 'closed')
    });
   return false;
  };

  onHashChange = function(event) {
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_chat_previous, _s_chat_proposed, s_chat_proposed;

    // пытаемся разобрать якорь
    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }

    stateMap.anchor_map = anchor_map_proposed;

    // вспомогательные переменные
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // Начало изменения компонента Chat
    if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed ) {
      s_chat_proposed = anchor_map_proposed.chat;

      if (s_chat_proposed === 'open') {
        toggleChat( true );
      } else if(s_chat_proposed === 'closed') {
        toggleChat( false );
      } else {
        toggleChat( false );
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }

    // Конец изменения компонента Chat
    return false;
  };

  //----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

  //----------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ --------------------
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    $.uriAnchor.configModule({
      schema_map : configMap.anchor_schema_map
    });

    // инициализировать окно чата и привязать обработчик щелчка
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr('title', configMap.chat_retracted_title)
      .on('click', onClickChat);

    $(window)
      .bind('hashchange', onHashChange)
      .trigger('hashchange');
  };

  return { initModule: initModule };
  //----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ ---------------------
}());
