/****************************************************************************************************************/
/*                                                                                                              */
/*    WARNING: this file is for local developing: don't use it. Use /resources/environment/config.propreties    */
/*                                                                                                              */
/****************************************************************************************************************/

'use strict';

/* Config */
var appConfig = angular.module('userportal.config', []);
//appConfig.constant('API_BASE_URL', 'http://tst-sdnet-intapi1.sdp.csi.it/wso001/services/');
var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
//var API_BASE_URL = '/userportal/api/proxy/';
appConfig.constant('DASHBOARD_API_STREAM_LIST_URL', API_BASE_URL+'streams/');
appConfig.constant('DASHBOARD_API_STREAM_URL', API_BASE_URL+'streams/');

//appConfig.constant('DASHBOARD_API_STREAM_LIST_URL', 'http://dev-www.dati.piemonte.it/demo/sdp/streamsList2.php?callback=JSON_CALLBACK');
//appConfig.constant('DASHBOARD_API_STREAM_URL','http://dev-www.dati.piemonte.it/demo/sdp/stream.php?callback=JSON_CALLBACK&id_stream=');
appConfig.constant('DASHBOARD_API_TENANT_LIST_URL','http://dev-www.dati.piemonte.it/demo/sdp/tenantsList.php?callback=JSON_CALLBACK');

appConfig.constant('DASHBOARD_API_VIRTUALENTITIY_LIST_URL', API_BASE_URL+'virtualentities/');


appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://tst-sdnet-esbin1.sdp.csi.it/ws/');
appConfig.constant('WEB_SOCKET_USER', 'guest');
appConfig.constant('WEB_SOCKET_SECRET', 'guest');
