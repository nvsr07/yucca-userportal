/******************************************************************************************************************************************/
/*                                                                                                                                        */
/*    WARNING: this file is for local developing: don't use it. Use /main/java/it/csi/sdp/userportal/i18n/MessagesBundle_it.properties    */
/*                                                                                                                                        */
/******************************************************************************************************************************************/

var translations_it = {
	
	LANG_KEY: 'it', 
	
	/*common */
	CANCEL : 'Annulla',
	SAVE: 'Salva',
	
	/* main menu */
	MENU_DASHBOARD : 'Monitoraggio',
	MENU_MANAGEMENT : 'Gestione',
	MENU_MARKET : 'Market',
	MENU_STORE : 'Store',
	MENU_LANG_EN : 'Inglese',
	MENU_LANG_IT : 'Italiano',
	
	/* Entity */
	STREAM: 'Flusso',
	TENANT: 'Organizzazione',
	VIRTUALENTITY: 'Virtual Entity', 
	
	/* STREAM */
	STREAM_FIELD_ID_STREAM: 'ID Flusso',
	STREAM_FIELD_ID_VIRTUAL_ENTITY: 'ID Virtual Entity',
	STREAM_FIELD_NAME: 'Nome',
	STREAM_FIELD_CODE: 'Code',
	STREAM_FIELD_TENANT_CODE : 'Code',
	STREAM_FIELD_TENANT_NAME : 'Name',
	STREAM_FIELD_STATUS: 'Stato',
	STREAM_FIELD_MESSAGE_SIZE: 'Dimensione Messaggio',
	STREAM_FIELD_MESSAGE_SIZE_AVERAGE: 'Media',
	STREAM_FIELD_MESSAGE_SIZE_MIN: 'Minima',
	STREAM_FIELD_MESSAGE_SIZE_MAX: 'Massima',
	STREAM_FIELD_NUM_EVENTS_QUEUED: 'Numero di eventi accodati',
	STREAM_FIELD_VIRTUALENTITY_CODE: 'Codice', 
	STREAM_FIELD_VIRTUALENTITY_NAME: 'Nome', 
	STREAM_FIELD_VIRTUALENTITY_TYPE: 'Tipo', 
	STREAM_FIELD_DESCRIPTION: 'Descrizione',
	STREAM_FIELD_COMPONENTS: 'Componenti',
	STREAM_FIELD_COMPONENTS_ID: 'ID',
	STREAM_FIELD_COMPONENTS_NAME: 'Nome',
	STREAM_FIELD_COMPONENTS_UNIT_OF_MEASUREMENT: 'Unit&agrave; di misura',
	STREAM_FIELD_COMPONENTS_TOLERANCE: 'Tolleranza',
	STREAM_FIELD_COMPONENTS_PHENOMENON: 'Fenomeno',
	STREAM_FIELD_COMPONENTS_DATA_TYPE: 'Tipo di dato',
	STREAM_FIELD_COMPONENTS_DESCRIPTION: 'Descrizione',
	STREAM_FIELD_DOMAIN: 'Dominio',
	STREAM_FIELD_LICENCE: 'Licenza',
	STREAM_FIELD_DISCLAIMER : 'Disclaimer',
	STREAM_FIELD_COPYRIGHT : 'Copyright',
	STREAM_FIELD_VISIBILITY: 'Visibilit&agrave;',
	STREAM_FIELD_TAGS : 'Tags',
	STREAM_FIELD_FPS : 'FPS',
	STREAM_FIELD_LASTUPDATE: 'Aggiornamento',
	STREAM_FIELD_EVENTS : 'Eventi',
	STREAM_FIELD_VERSION : 'Versione installata',
	
	/* Stream List */
	STREAM_LIST_TENANT_FILTER : 'Filtra per organizzazione',
	STREAM_LIST_NAME_FILTER : 'Filtra per nome',
	STREAM_LIST_CODE_FILTER : 'Filter per codice',
	STREAM_LIST_STATUS_FILTER : 'Filtra per stato',
	STREAM_LIST_LASTUPDATE_FILTER : 'Filtra per aggiornamento',
	
	/* Virtual Entity */
	VIRTUALENTITY_FIELD_ID: 'ID Virtual Entity',
	VIRTUALENTITY_FIELD_CODE: 'Codice',
	VIRTUALENTITY_FIELD_ID_TENANT : 'Id organizzazione',
	VIRTUALENTITY_FIELD_TENANT_CODE:"Codice organizzazione",
	VIRTUALENTITY_FIELD_TYPE : 'Tipo',
	VIRTUALENTITY_FIELD_CATEGORY: 'Categoria',
	VIRTUALENTITY_FIELD_NAME: 'Nome',
	VIRTUALENTITY_FIELD_DESCRIPTION: 'Descrizione',
	VIRTUALENTITY_FIELD_CATEGORY_ID: 'ID categoria',
	VIRTUALENTITY_FIELD_TYPE_ID: 'Tipo',
	VIRTUALENTITY_FIELD_STREAMS_COUNT: 'Numero di flussi',
	VIRTUALENTITY_FIELD_STATUS: 'Stato',
	/* new */
	VIRTUALENTITY_FIELD_POSITION_TYPE: 'Posizione',
	VIRTUALENTITY_FIELD_POSITION_TYPE_STATIC: 'Statico',
	VIRTUALENTITY_FIELD_POSITION_TYPE_MOBILE: 'Mobile',
	VIRTUALENTITY_FIELD_POSITION: 'Posizione',
	VIRTUALENTITY_FIELD_LATITUDE: 'Latitudine',
	VIRTUALENTITY_FIELD_LONGITUDE: 'Longitudine',
	VIRTUALENTITY_FIELD_ELEVATION: 'Altitudine', 
	VIRTUALENTITY_FIELD_ESPOSITION: 'Esposizione',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR: 'Interno',
	VIRTUALENTITY_FIELD_ESPOSITION_OUTDOOR: 'Esterno',
	VIRTUALENTITY_FIELD_INDOOR_BUILDING: 'Edificio',
	VIRTUALENTITY_FIELD_INDOOR_ROOM: 'Stanza',
	VIRTUALENTITY_FIELD_CREATION_DATE: 'Data creazione',
	VIRTUALENTITY_FIELD_MODEL: 'Modello',
	VIRTUALENTITY_FIELD_SUPPLY: 'Alimentazione',
	VIRTUALENTITY_FIELD_SUPPLY_AUTO: 'Auto',
	VIRTUALENTITY_FIELD_SUPPLY_NETWORK: 'Network',
	VIRTUALENTITY_FIELD_ADMIN_URI: 'URI Amministrazione',
	VIRTUALENTITY_FIELD_SOFTWARE_VERSION: 'Versione Software',
	
	
	
	/* Virtual Entity List */
	VIRTUALENTITY_LIST_CODE_FILTER: 'Filter by code',
	VIRTUALENTITY_LIST_STATUS_FILTER: 'Filter by status',


	/* Dashboard */
	DASHBOARD_TITLE : 'Area monitoraggio flussi',
	
	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Nome Flusso',
	DASHBOARD_STREAM_LIST_TENANT : 'Organizzazione',
	DASHBOARD_STREAM_LIST_EVENTS : 'Num. eventi ultima mezz\'ora',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Data registrazione',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Aggiornamento',
	DASHBOARD_STREAM_LIST_STATUS : 'Stato',

	//DASHBOARD_STREAM_TITLE: 'Flusso <strong>{{stream_name}}</strong>',
	DASHBOARD_STREAM_TITLE: 'Flusso ',
	DASHBOARD_STREAM_DETAIL_TITLE : 'Dettagli',
	DASHBOARD_STREAM_DETAIL_TABLE_KEY : 'Campo',
	DASHBOARD_STREAM_DETAIL_TABLE_VALUE : 'Valore',
	DASHBOARD_STREAM_DETAIL_OTHER_CONFIUGURATION: 'Altre configurazioni',

	DASHBOARD_STREAM_REALTIME_STATISTIC_TITLE: 'Statistiche', 
	
	DASHBOARD_STREAM_WS_URL_TITLE : 'URL Web Socket',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TITLE : 'Numero di eventi negli ultimi 30 sec',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_TIME : 'Ora',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_COUNT : 'Eventi',
	DASHBOARD_STREAM_WS_LASTMESSAGE_PANEL_TITLE : 'Ultimo messaggio ricevuto',
	DASHBOARD_STREAM_WS_LASTMESSAGE_REFRESH_BUTTON : 'Aggiorna',

	DASHBOARD_STREAM_WS_STATISTICS_TIME_TABLE_TITLE : '# Eventi',
	DASHBOARD_STREAM_WS_ERROR_TIME_TABLE_TITLE : '# Errori',
	
	DASHBOARD_STREAM_SYSTEM_STATUS : 'System Status',

	DASHBOARD_ERROR_LOG_TITLE: 'Error log',
	DASHBOARD_ERROR_LOG_SUBTITLE: 'Messaggi inviati dai flussi che hanno generato un errore',
	DASHBOARD_ERROR_LOG_INTRO: 'Si possono visualizzare messaggi di errori indefiniti e non associati a un tenant specifico, o messaggi di errore in cui &eacute; identificato un tenant. Vengono visualizzati gli ultimi 3 messaggi ricevuti, &eacute; possibile aggiornare i messaggi tramite il bottone refresh',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_TITLE: 'Seleziona gli errori da visualizzare',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_SUBTITLE: '',
	DASHBOARD_ERROR_LOG_TENANT_MENU_PLATFORM_ITEM: 'Platform',

	/* Management */
	MANAGEMENT_TITLE: 'Gestione',
    MANAGEMENT_MENU_DASHBOARD: 'Dashboard',
    MANAGEMENT_MENU_STREAMS: 'Flussi',
    MANAGEMENT_MENU_VIRTUAL_ENTITIES: 'Virutal entities',
    MANAGEMENT_MENU_DATASET: 'Dataset',

    /* Management Stream  */
	MANAGEMENT_DASHBOARD_SUBTITLE: 'Dashboard',
	MANAGEMENT_DASHBOARD_TENANT_PANEL_TITLE: 'Informazioni sull\'organizzazione',
    /* Management Stream  */
	MANAGEMENT_STREAM_SUBTITLE: 'Flussi',

	/* Management Stream List */
	MANAGEMENT_STREAM_LIST_NEW_STREAM : 'Nuovo',
	MANAGEMENT_STREAM_LIST_NEW_STREAM_FROM_VIRTUALENTITY : 'Flusso da Virtual Entity',
	MANAGEMENT_STREAM_LIST_NEW_STREAM_INTERNAL : 'Flusso interno',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Modifica',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Elimina',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'Per abilitare la modifica selezionare un solo flusso',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'Per abilitare l\'eliminaizone selezionare almeno flusso',
	
	/* view stream */
	MANAGEMENT_VIEW_STREAM: 'Flusso',

	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Crea',
	MANAGEMENT_NEW_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Nuovo Flusso da Virtual Entity',
	MANAGEMENT_NEW_STREAM_FROM_INTERNAL_SUBTITLE: 'Nuovo Flusso da Internal',
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Modifica ', 
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Leggi da Flusso',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA_LABEL: 'Salva dati',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA: 'Salva',
	MANAGEMENT_EDIT_STREAM_DONT_SAVE_DATA: 'Non salvare',
	MANAGEMENT_EDIT_STREAM_VISIBIITY_PUBLIC: 'Pubblico',
	MANAGEMENT_EDIT_STREAM_VISIBIITY_PRIVATE: 'Privato',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE_LABEL: 'Pubblicazione nello store',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE: 'Pubblica',
	MANAGEMENT_EDIT_STREAM_NOT_PUBLISH_ON_STORE: 'Non Pubblicare',
	MANAGEMENT_EDIT_STREAM_SAVE_AS_DRAFT_BUTTON: 'Salva come bozza',
	MANAGEMENT_EDIT_STREAM_FINISH_BUTTON: 'Fine modifica', 
	MANAGEMENT_EDIT_STREAM_INSTALL_BUTTON: 'Installa',
	MANAGEMENT_EDIT_STREAM_ADD_TAG : 'Aggiungi tag', 
	MANAGE_EDIT_STREAM_DATA_SAVED_INFO : 'Flusso salvato',
	
	MANAGEMENT_EDIT_STREAM_GENERAL_INFO: 'Informazioni generali',
	MANAGEMENT_EDIT_STREAM_OTHER_INFO: 'Informazioni aggiuntive',
	MANAGEMENT_EDIT_STREAM_SETTINGS: 'Settings',
    
		/* Management Virtual Entity  */
	MANAGEMENT_VIRTUALENTITY_SUBTITLE: 'Virtual Entities',

	/* Management Stream List */
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY : 'Nuova',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_APP : 'App',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_DEVICE : 'Device',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_FEED : 'Feed',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY : 'Modifica',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY : 'Cancella',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY_BUTTON_HINT: 'Per abilitare la modifica selezionare una sola Virtual Entity',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY_BUTTON_HINT: 'Per abilitare la cancellazione selezionare almeno una Virtual Entity',
  
	/* Management new Virtual Entity  */
	MANAGEMENT_NEW_VIRTUALENTITY_SUBTITLE: 'Nuova Virtual Entity',
	MANAGEMENT_NEW_VIRTUALENTITY_CREATE_BUTTON: 'Crea Virtual Entity',
	MANAGEMENT_NEW_VIRTUALENTITY_GENERATE_UUID_BUTTON: 'Genera',	
	/* Management edit Virtual Entity  */
	MANAGEMENT_EDIT_VIRTUAL_ENTITY_SUBTITLE: 'Modifica ',
	MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO: 'Virtual Entity Salvata',
		
	MANAGEMENT_EDIT_VIRTUALENTITY_GENERAL: 'Informazioni generali',
	MANAGEMENT_EDIT_VIRTUALENTITY_COLLOCATION: 'Collocazione',
	MANAGEMENT_EDIT_VIRTUALENTITY_OTHER_INFO: 'Informaizoni aggiuntive Info',
	MANAGEMENT_EDIT_VIRTUALENTITY_FINISH_BUTTON: 'Fine modifica',
	MANAGEMENT_EDIT_VIRTUALENTITY_SAVE_BUTTON: 'Salva',

	MANAGEMENT_VIEW_VIRTUALENTITY_HISTORICAL_BUTTON: 'Versioni storicizzate',
	MANAGEMENT_VIEW_VIRTUALENTITY_DELETE_BUTTON: 'Elimina',
	MANAGEMENT_VIEW_VIRTUALENTITY_EDIT_BUTTON: 'Modifica',
	MANAGEMENT_VIEW_VIRTUALENTITY_INSTALL_BUTTON: 'Installa',
	
	/* Choose tenant temp */
	MANAGEMENT_CHOOSE_TENANT_SUBTITLE: 'Scegli un organizzazione',
	MANAGEMENT_CHOOSE_TENANT_WARNING: 'Pagina temporanea in attesa del sistema di autenticazione',
	MANAGEMENT_CHOOSE_TENANT_TITLE: 'Scegli un organizzazione',
	
	/* Market */
	MARKET_TITLE: 'Market',

	/* Store */
	STORE_TITLE: 'Store',

};