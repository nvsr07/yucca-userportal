/****************************************************************************************************************/
/*                                                                                                              */
/*    WARNING: this file is for local developing: don't use it. Use /resources/environment/config.propreties    */
/*                                                                                                              */
/****************************************************************************************************************/

'use strict';

/* Config */
var appConfig = angular.module('userportal.config', []);
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';


appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://tst-stream.smartdatanet.it/ws/');
appConfig.constant('WEB_SOCKET_USER', 'guest');
appConfig.constant('WEB_SOCKET_SECRET', 'guest');
