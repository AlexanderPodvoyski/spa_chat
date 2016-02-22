/*
* spa.js
* Модуль корневого пространства имен
*/

/*jslint 
  devel  : true, browser : true, continue : true,
  newcap : true, indent  : 2,    maxerr   : 50,
  regexp : true, nomen   : true, plusplus : true,
  white  : true, sloppy  : true, vars     : true
*/

/*global $, spa */

var spa = (function () {
  var initModule = function($container) {
    spa.shell.initModule( $container );
  };
  return { initModule: initModule };
}());