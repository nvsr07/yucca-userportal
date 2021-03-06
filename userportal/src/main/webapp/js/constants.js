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
Constants.DATABASE_IMPORT_SOURCEFILE_MAX_FILE_SIZE = 1000000;

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

Constants.OPENDATA_UPDATE_FREQUENCY = ["TRIENNIAL", "BIENNAL", "ANNUAL","ANNUAL_2","ANNUAL_3","QUARTERLY","BIMONTHLY","MONTHLY","MONTHLY_2","BIWEEKLY","MONTHLY_3","WEEKLY","WEEKLY_2","WEEKLY_3","DAILY","UPDATE_CONT","IRREG","UNKNOWN","OTHER","DAILY_2","CONT","NEVER","OP_DATPRO"];

Constants.ODATA_MAX_RESULT_SORTABLE = 100000;

// license
Constants.STREAM_FIELD_METADATA_LICENCE_CCBY = 'CC BY 4.0';
Constants.STREAM_FIELD_METADATA_LICENCE_CC0 = 'CC 0 1.0';


// html hint
Constants.HELP_HINT_DATE_FORMAT_TABLE = '<div><table class="table table-supercondensed table-dateformat-help">'+
'	<thead>'+
'		<tr><th>Letter</th><th>Date or Time</th><th>Presentation</th><th>Examples</th></tr>'+
'	</thead>'+
'	<tbody>'+
'		<tr><td><strong>G</strong></td><td>Era designator</td><td>Text</td><td><strong>AD</strong></td></tr>'+
'		<tr><td><strong>y</strong></td><td>Year</td><td>Year</td><td><strong>1996</strong>;<strong>96</strong></td></tr>'+
'		<tr><td><strong>M</strong></td><td>Month in year</td><td>Month</td><td><strong>July</strong>; <strong>Jul</strong>; <strong>07</strong></td></tr>'+
'		<tr><td><strong>w</strong></td><td>Week in year</td><td>Number</td><td><strong>27</strong></td></tr>'+
'		<tr><td><strong>W</strong></td><td>Week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
'		<tr><td><strong>D</strong></td><td>Day in year</td><td>Number</td><td><strong>189</strong></td></tr>'+
'		<tr><td><strong>d</strong></td><td>Day in month</td><td>Number</td><td><strong>10</strong></td></tr>'+
'		<tr><td><strong>F</strong></td><td>Day of week in month</td><td>Number</td><td><strong>2</strong></td></tr>'+
'		<tr><td><strong>E</strong></td><td>Day in week</td><td>Text</td><td><strong>Tuesday</strong>; <strong>Tue</strong></td></tr>'+
'		<tr><td><strong>a</strong></td><td>Am/pm marker</td><td>Text</td><td><strong>PM</strong></td></tr>'+
'		<tr><td><strong>H</strong></td><td>Hour in day (0-23)</td><td>Number</td><td><strong>0</strong></td></tr>'+
'		<tr><td><strong>k</strong></td><td>Hour in day (1-24)</td><td>Number</td><td><strong>24</strong></td></tr>'+
'		<tr><td><strong>K</strong></td><td>Hour in am/pm (0-11)</td><td>Number</td><td><strong>0</strong></td></tr>'+
'		<tr><td><strong>h</strong></td><td>Hour in am/pm (1-12)</td><td>Number</td><td><strong>12</strong></td></tr>'+
'		<tr><td><strong>m</strong></td><td>Minute in hour</td><td>Number</td><td><strong>30</strong></td></tr>'+
'		<tr><td><strong>s</strong></td><td>Second in minute</td><td>Number</td><td><strong>55</strong></td></tr>'+
'		<tr><td><strong>S</strong></td><td>Millisecond</td><td>Number</td><td><strong>978</strong></td></tr>'+
'		<tr><td><strong>z</strong></td><td>Time zone</td><td>General time zone</td><td><strong><span title="Pacific Standard Time; PST; GMT-08:00">Pacific Standard Time; PST; &hellip;</td></tr>'+
'		<tr><td><strong>Z</strong></td><td>Time zone</td><td>RFC 822 time zone</td><td><strong>-0800</strong></td>'+
'	</tbody>'+
'</table>' + 
'   </div>'+
'   <div class="alert">For detail refer to <a href="http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html" target="_blank" class="alert-link">Java Date Format</a></div>' +
'   <div class="alert alert-info"><strong><i class="glyphicon glyphicon-time"></i></strong>&nbsp;Default timezone <strong>Europe/Rome</strong></div>';


// domain icon
Constants.DOMAIN_ICON_MAP= {
		"TRADE":"\ue800",
		"TRANSPORT":"\ue801",
		"CULTURE":"\ue802", 
		"ECONOMY_FINANCES_TAXES":"\ue803", 
		"AGRICULTURE":"\ue804", 
		"EMPLOYMENT_TRAINING":"\ue805", 
		"ENERGY":"\ue806", 
		"ENVIRONMENT":"\ue807", 
		"GOVERNMENT":"\ue808", 
		"HEALTH":"\ue809", 
		"POPULATION_SOCIAL_ISSUE":"\ue80a", 
		"PRODUCTION":"\ue80b", 
		"SCHOOL":"\ue80c",
		"SCIENCE_TECHNOLOGY":"\ue80d", 
		"SECURITY":"\ue80e", 
		"SMART_COMMUNITY":"\ue80f",
		"TERRITORY":"\ue810", 
		"TOURISM_SPORT":"\ue811"
};




