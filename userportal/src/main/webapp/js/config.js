/****************************************************************************************************************/
/*                                                                                                              */
/*    WARNING: this file is for local developing: don't use it. Use /resources/environment/config.propreties    */
/*                                                                                                              */
/****************************************************************************************************************/

'use strict';

/* Config */
var appConfig = angular.module('userportal.config', []);


var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://tst-stream.smartdatanet.it/ws/');
appConfig.constant('WEB_SOCKET_USER', 'guest');
appConfig.constant('WEB_SOCKET_SECRET', 'guest');

//var API_BASE_URL = 'http://userportal.smartdatanet.it/userportal/api/proxy/';
//appConfig.constant('WEB_SOCKET_BASE_URL', 'ws://stream.smartdatanet.it/ws/');
//appConfig.constant('WEB_SOCKET_USER', 'guest');
//appConfig.constant('WEB_SOCKET_SECRET', 'Aekieh6F');

var Constants = Constants || {};

Constants.API_STREAM_TAGS_URL=API_BASE_URL+'misc/streamtags/';
Constants.API_TENANT_LIST_URL=API_BASE_URL+'tenants/';
Constants.API_STREAM_URL=API_BASE_URL+'streams/';
Constants.API_STREAM_DATATYPE_URL=API_BASE_URL+'misc/datatype/';
Constants.API_VIRTUALENTITY_LIST_URL=API_BASE_URL+'virtualentities/';
Constants.API_STREAM_DOMAINS_URL=API_BASE_URL+'misc/streamdomains/';
Constants.API_LIFECYCLE_STREAM_NEW_VERSION=API_BASE_URL+'lifecycle/streams/newversion/';
Constants.API_VIRTUALENTITY_URL=API_BASE_URL+'virtualentities/';
Constants.API_STREAM_LIST_URL=API_BASE_URL+'streams/';
Constants.API_VIRTUALENTITY_CATEGORIES_URL=API_BASE_URL+'misc/category/';
Constants.API_STREAM_PHENOMENOM_URL=API_BASE_URL+'misc/phenomenon/';
Constants.API_LIFECYCLE_STREAM_REQ_UNINST=API_BASE_URL+'lifecycle/streams/requninst/';
Constants.API_LIFECYCLE_STREAM_REQ_INST=API_BASE_URL+'lifecycle/streams/reqinst/';
Constants.API_STREAM_COMPONENT_URL=API_BASE_URL+'streams/components/';
Constants.API_STREAM_UNIT_OF_MESAUREMENT_URL=API_BASE_URL+'misc/measureunits/';
Constants.API_VIRTUALENTITY_TYPES_URL=API_BASE_URL+'misc/types/';
Constants.API_INFO_URL='http://localhost:8080/userportal/api/info';

