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

/* discovery */
Constants.DISCOVERY_FIELD_TITLE = 'DISCOVERY_FIELD_TITLE';
Constants.DISCOVERY_FIELD_TAG = 'DISCOVERY_FIELD_TAG';
Constants.DISCOVERY_FIELD_LICENSE = 'DISCOVERY_FIELD_LICENSE';
Constants.DISCOVERY_FIELD_TENANT = 'DISCOVERY_FIELD_TENANT';
Constants.DISCOVERY_FIELD_FPS = 'DISCOVERY_FIELD_FPS';
Constants.DISCOVERY_FIELD_UNIT_OF_MEASUREMENT = 'DISCOVERY_FIELD_UNIT_OF_MEASUREMENT';

Constants.DISCOVERY_FIELDS = [
                              {key:Constants.DISCOVERY_FIELD_TITLE, api_key: 'datasetName', discrete: false},
                              {key:Constants.DISCOVERY_FIELD_TAG, api_key: 'tags', discrete: true},
                              {key:Constants.DISCOVERY_FIELD_LICENSE, api_key: 'license', discrete: false},
                              {key:Constants.DISCOVERY_FIELD_TENANT, api_key: 'tenantCode', discrete: true},
                              {key:Constants.DISCOVERY_FIELD_FPS, api_key: 'fps', discrete: false},
                              {key:Constants.DISCOVERY_FIELD_UNIT_OF_MEASUREMENT, api_key: 'measureUnit', discrete: true},
                              ];

Constants.BULK_DATASET_MAX_FILE_SIZE = 10000000;


