/****************************************************************************************************************/
/*                                                                                                              */
/*    WARNING: this file is for local developing: don't use it. Use /resources/environment/config.propreties    */
/*                                                                                                              */
/****************************************************************************************************************/

'use strict';

/* Config */
var appConfig = angular.module('userportal.config', []);
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
//var API_BASE_URL = '/userportal/api/proxy/';
/*
appConfig.constant('DASHBOARD_API_STREAM_LIST_URL', API_BASE_URL+'streams/');
appConfig.constant('DASHBOARD_API_STREAM_URL', API_BASE_URL+'streams/');
appConfig.constant('DASHBOARD_API_STREAM_COMPONENT_URL', API_BASE_URL+'streams/components/');
appConfig.constant('DASHBOARD_API_VIRTUALENTITY_LIST_URL', API_BASE_URL+'virtualentities/');
appConfig.constant('DASHBOARD_API_VIRTUALENTITY_URL', API_BASE_URL+'virtualentities/');

appConfig.constant('DASHBOARD_API_VIRTUALENTITY_CATEGORIES_URL', API_BASE_URL+'misc/category/');
appConfig.constant('DASHBOARD_API_VIRTUALENTITY_TYPES_URL', API_BASE_URL+'misc/types/');
appConfig.constant('DASHBOARD_API_STREAM_TAGS_URL', API_BASE_URL+'misc/tags/');
appConfig.constant('DASHBOARD_API_STREAM_DOMAINS_URL', API_BASE_URL+'misc/domains/');
appConfig.constant('DASHBOARD_API_TENANT_LIST_URL',API_BASE_URL+'tenants/');
*/

appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://tst-stream.smartdatanet.it/ws/');
appConfig.constant('WEB_SOCKET_USER', 'guest');
appConfig.constant('WEB_SOCKET_SECRET', 'guest');
