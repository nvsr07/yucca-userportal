var Constants = Constants || {};


/* Urls */
//var API_BASE_URL = 'http://localhost:8080/userportal/api/proxy/';
var API_BASE_URL = '/userportal/api/proxy/';
/*
Constants.API_STREAM_LIST_URL=API_BASE_URL+'streams/';
Constants.API_STREAM_URL=API_BASE_URL+'streams/';
Constants.API_STREAM_COMPONENT_URL=API_BASE_URL+'streams/components/';
Constants.API_VIRTUALENTITY_LIST_URL=API_BASE_URL+'virtualentities/';
Constants.API_VIRTUALENTITY_URL=API_BASE_URL+'virtualentities/';

Constants.API_VIRTUALENTITY_CATEGORIES_URL=API_BASE_URL+'misc/category/';
Constants.API_VIRTUALENTITY_TYPES_URL=API_BASE_URL+'misc/types/';
Constants.API_STREAM_TAGS_URL=API_BASE_URL+'misc/streamtags/';
Constants.API_STREAM_DOMAINS_URL=API_BASE_URL+'misc/streamdomains/';
Constants.API_STREAM_UNIT_OF_MESAUREMENT_URL=API_BASE_URL+'misc/measureunits/';
Constants.API_STREAM_PHENOMENOM_URL=API_BASE_URL+'misc/phenomenon/';
Constants.API_STREAM_DATATYPE_URL=API_BASE_URL+'misc/datatype/';

Constants.API_LIFECYCLE_STREAM_REQ_INST=API_BASE_URL+'lifecycle/streams/reqinst/';
Constants.API_LIFECYCLE_STREAM_NEW_VERSION=API_BASE_URL+'lifecycle/streams/newversion/';
Constants.API_LIFECYCLE_STREAM_REQ_UNINST=API_BASE_URL+'lifecycle/streams/requninst/';
  

Constants.API_TENANT_LIST_URL=API_BASE_URL+'tenants/';

*/

/* stream status */
Constants.STREAM_STATUS_DRAFT='draft';
Constants.STREAM_STATUS_REQ_INST='req_inst';
Constants.STREAM_STATUS_INST='inst';
Constants.STREAM_STATUS_REQ_UNINST='req_uninst';
Constants.STREAM_STATUS_UNINST='uninst';

/* virtual entity */
Constants.VIRTUALENTITY_TYPE_INTERNAL_ID = 0;
Constants.VIRTUALENTITY_TYPE_DEVICE_ID = 1;

/* Lifecycle */
Constants.LIFECYCLE_STREAM_REQ_INST = 'LIFECYCLE_STREAM_REQ_INST';
Constants.LIFECYCLE_STREAM_REQ_UNINST = 'LIFECYCLE_STREAM_REQ_UNINST';
Constants.LIFECYCLE_STREAM_NEW_VERSION = 'LIFECYCLE_STREAM_NEW_VERSION';

/* Validation */
Constants.VALIDATION_PATTERN_INTEGER = /^(0|\-?[1-9][0-9]*)$/; // integer positive and negative, for only positive use /^\d+$/;
Constants.VALIDATION_PATTERN_FLOAT = /^\s*[-+]?(\d*\.?\d+|\d+\.)(e[-+]?[0-9]+)?\s*$/i;
Constants.VALIDATION_PATTERN_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;



/* Numero di elementi nella Error Log */
Constants.MAX_NR_ERROR_LOGS = 30;


Constants.WEBSOCKET_CONNECTING = 'Connecting';
Constants.WEBSOCKET_CONNECTED = 'Connected';
Constants.WEBSOCKET_NOT_CONNECTED = 'Not Connected';
