var Constants = Constants || {};


/* Urls */
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
var API_BASE_URL = '/userportal/api/proxy/';
var API_BASE_SERVICE_URL = '/userportal/api/proxy/service/';
var API_BASE_DATA_MANAGEMENT_URL = '/userportal/api/proxy/datamanagement';
var API_BASE_DISCOVERY_URL = '/userportal/api/proxy/discovery';


/* stream status */
Constants.STREAM_STATUS_DRAFT='draft';
Constants.STREAM_STATUS_REQ_INST='req_inst';
Constants.STREAM_STATUS_INST='inst';
Constants.STREAM_STATUS_REQ_UNINST='req_uninst';
Constants.STREAM_STATUS_UNINST='uninst';

/* virtual entity */
Constants.VIRTUALENTITY_TYPE_INTERNAL_ID = 0;
Constants.VIRTUALENTITY_TYPE_DEVICE_ID = 1;
Constants.VIRTUALENTITY_TYPE_TWITTER_ID = 3;

Constants.VIRTUALENTITY_CATEGORY_NONE = 999;

/* Lifecycle */
Constants.LIFECYCLE_STREAM_REQ_INST = 'LIFECYCLE_STREAM_REQ_INST';
Constants.LIFECYCLE_STREAM_REQ_UNINST = 'LIFECYCLE_STREAM_REQ_UNINST';
Constants.LIFECYCLE_STREAM_NEW_VERSION = 'LIFECYCLE_STREAM_NEW_VERSION';

/* Validation */
Constants.VALIDATION_PATTERN_INTEGER = /^(0|\-?[1-9][0-9]*)$/; // integer positive and negative, for only positive use /^\d+$/;
Constants.VALIDATION_PATTERN_FLOAT = /^\s*[-+]?(\d*\.?\d+|\d+\.)(e[-+]?[0-9]+)?\s*$/i;
Constants.VALIDATION_PATTERN_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
Constants.VALIDATION_PATTERN_NO_SPACE = /^(?!.*(?:[ ]))/;
Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY = /^(?!.*(?:[ *./#<>àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]))/;
Constants.VALIDATION_PATTERN_CODE_STREAM =        /^(?!.*(?:[ *./#<>àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ-]))/;
Constants.VALIDATION_PATTERN_ACCENT =        /.*[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ].*/;




/* Numero di elementi nella Error Log */
Constants.MAX_NR_ERROR_LOGS = 30;

Constants.WEBSOCKET_CONNECTING = 'Connecting';
Constants.WEBSOCKET_CONNECTED = 'Connected';
Constants.WEBSOCKET_NOT_CONNECTED = 'Not Connected';

/* discovery */
Constants.DISCOVERY_FIELD_TITLE = 'DISCOVERY_FIELD_TITLE';
Constants.DISCOVERY_FIELD_TAG = 'DISCOVERY_FIELD_TAG';
Constants.DISCOVERY_FIELD_LICENSE = 'DISCOVERY_FIELD_LICENSE';
Constants.DISCOVERY_FIELD_TENANT = 'DISCOVERY_FIELD_TENANT';
Constants.DISCOVERY_FIELD_FPS = 'DISCOVERY_FIELD_FPS';
Constants.DISCOVERY_FIELD_UNIT_OF_MEASUREMENT = 'DISCOVERY_FIELD_UNIT_OF_MEASUREMENT';

Constants.DISCOVERY_FIELD_STCODE = 'DISCOVERY_FIELD_STCODE';
Constants.DISCOVERY_FIELD_STNAME = 'DISCOVERY_FIELD_STNAME';
Constants.DISCOVERY_FIELD_STDESC = 'DISCOVERY_FIELD_STDESC';

Constants.DEFAULT_SIDDHI = 'from outputStream#window.time(30 sec) \n select count(time) as numEventsLast30Sec \n output last every 2 sec \n insert into tempOutputStat for all-events; \n from tempOutputStat#window.length(1) \n select numEventsLast30Sec,"" as lastMessage,"" as lastUpdate \n output snapshot every 2 sec insert into outputStat for all-events'; 
var operationNuberList=[
                        {key:" = ",value:" eq "},
                        {key:" != ",value:" ne "},
                        {key:" < ",value:" lt "},
                        {key:" > ",value:" gt "},
                        {key:" <= ",value:" le "},
                        {key:" >= ",value:" ge "}];


var operationStringList=[
                         {key:" = ",value:" eq "},
                         {key:" != ",value:" ne "},
                         {key:" contains ",value:" substringof "},
                         {key:" startswith ",value:" startswith "},
                         {key:" endswith ",value:" endswith "}];


Constants.DISCOVERY_FIELDS = [
                              {key:Constants.DISCOVERY_FIELD_TITLE, api_key: 'datasetName', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_TAG, api_key: 'tags', discrete: true,visible:true},
                              {key:Constants.DISCOVERY_FIELD_LICENSE, api_key: 'license', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_TENANT, api_key: 'tenantCode', discrete: true,visible:true},
                              {key:Constants.DISCOVERY_FIELD_FPS, api_key: 'fps', discrete: false,visible:true},
                              {key:Constants.DISCOVERY_FIELD_UNIT_OF_MEASUREMENT, api_key: 'measureUnit', discrete: true,visible:true},
//                              {key:Constants.DISCOVERY_FIELD_STCODE, api_key: 'streamCode', discrete: false,visible:true},
//                              {key:Constants.DISCOVERY_FIELD_STNAME, api_key: 'streamName', discrete: false,visible:false},
//                              {key:Constants.DISCOVERY_FIELD_STDESC, api_key: 'streamDescription', discrete: false,visible:false}
                              ];
Constants.DISCOVERY_FIELD_OPERATIONS={
		datasetName:operationStringList,
		tags:operationStringList,
		license:operationStringList,
		tenantCode:operationStringList,
		measureUnit:operationStringList,
		fps:operationNuberList
};

Constants.BULK_DATASET_MAX_FILE_SIZE = 10000000;
Constants.STREAM_ICON_MAX_FILE_SIZE = 500000;
Constants.DATASET_ICON_MAX_FILE_SIZE = 500000;

Constants.LINE_CHART_COLORS = ["#004586","#0084d1", "#d01e2a", "#f37a1f", "#f3c414", "#3d9e00", "#a6d615","#8f69c2","#e4477e"];

Constants.TWITTER_GEO_SEARCH_RADIUS_UNIT = {"mi":"miles","km":"kilometers"};

Constants.OPENDATA_LANGUAGES = {
		"el":"ελληνικά",
		"en":"English",
		"es":"Español",
		"fr":"Français",
		"it":"Italiano",
		"sl":"Slovenščina",
		"sr":"Српски"
};

Constants.ODATA_MAX_RESULT_SORTABLE = 100000;

