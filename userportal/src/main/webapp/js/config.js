/****************************************************************************************************************/
/*                                                                                                              */
/*    WARNING: this file is for local developing: don't use it. Use /resources/environment/config.propreties    */
/*                                                                                                              */
/****************************************************************************************************************/

'use strict';

/* Config */
var appConfig = angular.module('userportal.config', []);

appConfig.constant('DASHBOARD_API_STREAM_LIST_URL', 'http://dev-www.dati.piemonte.it/demo/sdp/streamsList.php?callback=JSON_CALLBACK');
appConfig.constant('DASHBOARD_API_STREAM_URL','http://dev-www.dati.piemonte.it/demo/sdp/stream.php?callback=JSON_CALLBACK&id_stream=');
appConfig.constant('DASHBOARD_API_TENANT_LIST_URL','http://dev-www.dati.piemonte.it/demo/sdp/tenantsList.php?callback=JSON_CALLBACK');

appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://tst-sdnet-esbin1.sdp.csi.it/ws/');
appConfig.constant('WEB_SOCKET_USER', 'guest');
appConfig.constant('WEB_SOCKET_SECRET', 'guest');
