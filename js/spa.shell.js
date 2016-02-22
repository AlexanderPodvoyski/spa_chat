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
      `
    };
  var
    stateMap = { $$container : null },
    jqueryMap = {},

    setJqueryMap, initModule;
  //----------------- КОНЕЦ ПЕРЕМЕННЫХ В ОБЛАСТИ ВИДИМОСТИ МОДУЛЯ

  //----------------- НАЧАЛО СЛУЖЕБНЫХ МЕТОДОВ -------------------
  //----------------- КОНЕЦ СЛУЖЕБНЫХ МЕТОДОВ --------------------

  //----------------- НАЧАЛО МЕТОДОВ DOM -------------------------
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = { $container: $container };
  };
  //----------------- КОНЕЦ МЕТОДОВ DOM --------------------------

  //----------------- НАЧАЛО ОБРАБОТЧИКОВ СОБЫТИЙ ----------------
  //----------------- КОНЕЦ ОБРАБОТЧИКОВ СОБЫТИЙ -----------------

  //----------------- НАЧАЛО ОТКРЫТЫХ МЕТОДОВ --------------------
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
  };

  return { initModule: initModule };
  //----------------- КОНЕЦ ОТКРЫТЫХ МЕТОДОВ ---------------------
}());
































