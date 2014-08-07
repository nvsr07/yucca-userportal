/******************************************************************************************************************************************/
/*                                                                                                                                        */
/*    WARNING: this file is for local developing: don't use it. Use /main/java/it/csi/sdp/userportal/i18n/MessagesBundle_en.properties    */
/*                                                                                                                                        */
/******************************************************************************************************************************************/

var translations_en = {
	
	LANG_KEY: 'en', 
	
	/*common */
	CANCEL : 'Cancel',
	SAVE: 'Save',
	
	/* main menu */
	MENU_DASHBOARD : 'Dashboard',
	MENU_MANAGEMENT : 'Management',
	MENU_MARKET : 'Market',
	MENU_STORE : 'Store',
	MENU_LANG_EN : 'English',
	MENU_LANG_IT : 'Italian',
	
	/* Entity */
	STREAM: 'Stream',
	TENANT: 'Tenant',
	VIRTUALENTITY: 'Virtual Entity', 
	
	/* STREAM */
	STREAM_FIELD_ID_STREAM : 'ID Stream',
	STREAM_FIELD_ID_VIRTUAL_ENTITY: 'ID Virtual Entity',
	STREAM_FIELD_NAME : 'Name',
	STREAM_FIELD_CODE : 'Code',
	STREAM_FIELD_TENANT_CODE : 'Code',
	STREAM_FIELD_TENANT_NAME : 'Name',
	STREAM_FIELD_STATUS : 'Status',
	STREAM_FIELD_MESSAGE_SIZE : 'Message Size',
	STREAM_FIELD_MESSAGE_SIZE_AVERAGE : 'Average',
	STREAM_FIELD_MESSAGE_SIZE_MIN : 'Min',
	STREAM_FIELD_MESSAGE_SIZE_MAX : 'Max',
	STREAM_FIELD_NUM_EVENTS_QUEUED : 'Num. of queued events',
	STREAM_FIELD_VIRTUALENTITY_CODE: 'Code', 
	STREAM_FIELD_VIRTUALENTITY_NAME: 'Name', 
	STREAM_FIELD_VIRTUALENTITY_TYPE: 'Type', 
	STREAM_FIELD_VIRTUALENTITY_DESCRIPTION : 'Description',
	STREAM_FIELD_COMPONENTS : 'Components',
	STREAM_FIELD_COMPONENTS_ID: 'ID',
	STREAM_FIELD_COMPONENTS_NAME: 'Name',
	STREAM_FIELD_COMPONENTS_UNIT_OF_MEASUREMENT : 'Unit of measurement',
	STREAM_FIELD_COMPONENTS_TOLERANCE: 'Tolerance',
	STREAM_FIELD_COMPONENTS_PHENOMENON: 'Phenomenon',
	STREAM_FIELD_COMPONENTS_DATA_TYPE : 'Data type',
	STREAM_FIELD_COMPONENTS_DESCRIPTION : 'Description',
	STREAM_FIELD_DOMAIN : 'Domain',
	STREAM_FIELD_LICENCE : 'Licence',
	STREAM_FIELD_DISCLAIMER : 'Disclaimer',
	STREAM_FIELD_COPYRIGHT : 'Copyright',
	STREAM_FIELD_VISIBILITY : 'Visibility',
	STREAM_FIELD_TAGS : 'Tags',
	STREAM_FIELD_FPS : 'FPS',
	STREAM_FIELD_LASTUPDATE : 'Lastupdate',
	STREAM_FIELD_EVENTS : 'Events',
	STREAM_FIELD_VERSION : 'Installed Version',
	
	/* nuovi campi da verificare */
	/* Stream List */
	STREAM_LIST_TENANT_FILTER : 'Filter by tenant',
	STREAM_LIST_NAME_FILTER : 'Filter by name',
	STREAM_LIST_CODE_FILTER : 'Filter by code',
	STREAM_LIST_STATUS_FILTER : 'Filter by status',
	STREAM_LIST_LASTUPDATE_FILTER : 'Filter by lastupdate',


	/* Dashboard */
	DASHBOARD_TITLE : 'Dashboard streams monitoring',
	
	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Stream Name',
	DASHBOARD_STREAM_LIST_TENANT : 'Tenant',
	DASHBOARD_STREAM_LIST_EVENTS : 'Events in the last 30 min.',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Registration date',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Lastupdate',
	DASHBOARD_STREAM_LIST_STATUS : 'Status',

	// DASHBOARD_STREAM_TITLE: 'Stream <strong>{{stream_name}}</strong>',
	DASHBOARD_STREAM_TITLE : 'Stream ',
	DASHBOARD_STREAM_DETAIL_TITLE : 'Details',
	DASHBOARD_STREAM_DETAIL_TABLE_KEY : 'Field',
	DASHBOARD_STREAM_DETAIL_TABLE_VALUE : 'Value',
	DASHBOARD_STREAM_DETAIL_OTHER_CONFIUGURATION: 'Other configuration',

	DASHBOARD_STREAM_REALTIME_STATISTIC_TITLE: 'Statistics', 
	
	DASHBOARD_STREAM_WS_URL_TITLE : 'Web Socket Url',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TITLE : 'Number of Events in the last 30 sec',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_TIME : 'Time',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_COUNT : 'Events',
	DASHBOARD_STREAM_WS_LASTMESSAGE_PANEL_TITLE : 'Last message received',
	DASHBOARD_STREAM_WS_LASTMESSAGE_REFRESH_BUTTON : 'Refresh',

	DASHBOARD_STREAM_WS_STATISTICS_TIME_TABLE_TITLE : '# Events',
	DASHBOARD_STREAM_WS_ERROR_TIME_TABLE_TITLE : '# Errors',
	
	DASHBOARD_STREAM_SYSTEM_STATUS : 'System Status',

	DASHBOARD_ERROR_LOG_TITLE: 'Error log',
	DASHBOARD_ERROR_LOG_SUBTITLE: 'Messages sent by the streams that have generated an error',
	DASHBOARD_ERROR_LOG_INTRO: 'Is possible to see error messages not associated with a specific tenant, or error messages in which the tenant is identified. There are displayed the last 3 messages received, is possible  update messages via the refresh button',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_TITLE: 'Choose the errors to view',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_SUBTITLE: '',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_ITEM: 'Platform',

	/* Management */
	MANAGEMENT_TITLE: 'Management',
    MANAGEMENT_MENU_DASHBOARD: 'Dashboard',
    MANAGEMENT_MENU_STREAMS: 'Streams',
    MANAGEMENT_MENU_VIRTUAL_ENTITIES: 'Virutal entities',
    MANAGEMENT_MENU_DATASET: 'Dataset',

    /* Management Stream  */
	MANAGEMENT_STREAM_SUBTITLE: 'Streams',

	/* Management Stream List */
	MANAGEMENT_STREAM_LIST_NEW_STREAM : 'New',
	MANAGEMENT_STREAM_LIST_NEW_STREAM_FROM_VIRTUALENTITY : 'From Virtual Entity',
	MANAGEMENT_STREAM_LIST_NEW_STREAM_INTERNAL : 'Internal',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Edit',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Delete',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'To enable editing select a single stream',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'To enable deleting select at least one stream',
	
	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Create',
	MANAGEMENT_NEW_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'New Stream from Virtual Entity',
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Edit Stream', 
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Read from Stream',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA_LABEL: 'Save data',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA: 'Save',
	MANAGEMENT_EDIT_STREAM_DONT_SAVE_DATA: 'Don\'t save',
	MANAGEMENT_EDIT_STREAM_VISIBIITY_PUBLIC: 'Public',
	MANAGEMENT_EDIT_STREAM_VISIBIITY_PRIVATE: 'Private',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE_LABEL: 'Publication in the Store',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE: 'Published',
	MANAGEMENT_EDIT_STREAM_NOT_PUBLISH_ON_STORE: 'Not Published',
	MANAGEMENT_EDIT_STREAM_SAVE_AS_DRAFT_BUTTON: 'Save as draft',
	MANAGEMENT_EDIT_STREAM_FINISH_BUTTON: 'Finish editing', 
	MANAGEMENT_EDIT_STREAM_INSTALL_BUTTON: 'Install',
	MANAGEMENT_EDIT_STREAM_ADD_TAG : 'Add tag', 
	
	MANAGE_EDIT_STREAM_DATA_SAVED_INFO : 'Stream saved',

    
};