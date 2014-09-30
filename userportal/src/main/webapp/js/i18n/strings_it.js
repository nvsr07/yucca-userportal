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
	COMING_SOON: 'Coming soon...', 
	WARNING: 'Attenzione', 

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
	STREAM_FIELD_VIRTUALENTITY_DESCRIPTION : 'Descrizione',
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
	/* Stream placeholder */
	
	STREAM_FIELD_CODE_PLACEHOLDER : 'es. temperatura',
	STREAM_FIELD_NAME_PLACEHOLDER : 'es. temperatura sala',
	STREAM_FIELD_COMPONENTS_ID_PLACEHOLDER: 'es. 1.4',
	STREAM_FIELD_COMPONENTS_NAME_PLACEHOLDER: 'es. wind',
	STREAM_FIELD_COMPONENTS_TOLERANCE_PLACEHOLDER: 'es. 12',
	
	/* Stream List */
	STREAM_LIST_TENANT_FILTER : 'Filtra per organizzazione',
	STREAM_LIST_NAME_FILTER : 'Filtra per nome',
	STREAM_LIST_CODE_FILTER : 'Filter per codice',
	STREAM_LIST_STATUS_FILTER : 'Filtra per stato',
	STREAM_LIST_LASTUPDATE_FILTER : 'Filtra per aggiornamento',
	
	/* Creator of Stream */
	USER_APPLICANT:'Richiedente',
	USER_FIELD_NAME:'Nome Richiedente',
	USER_FIELD_SURNAME:'Cognome Richiedente',
	USER_FIELD_EMAIL : 'Email Richiedente',
	USER_FIELD_ACCEPT:'Accetto i Termini',
	USER_FIELD_PRIVACY_TERMS : "Autorizzo il CSI Piemonte al trattamento dei dati personali con le modalit&agrave; e per le finalit&agrave; in essa contenute dopo aver letto l'informativa Privacy ai sensi dell'art. 13 del D.Lgs. 196/2013",
	USER_FIELD_RESPONSABILITY_TERMS : "Dichiaro sotto la mia responabilit&agrave; che i dati inseriti nella Piattaforma sono sogggetti unicamente a licenze conformi a quanto indicato nelle Linee Guida (link) e sar&ograve; l'unico soggetto a rispondere ad eventuali contestazioni o richieste di risarcimento danni mosse da terzi per violazione dei loro diritti (L. 633/41, D. lgs. 196/03 e s.m.i.).",
	
	USER_FIELD_ACCEPT_YES:'Accetto ',
	USER_FIELD_ACCEPT_NO:'Non Accetto ',
	
	/* Creator of Stream PlaceHolder */
	USER_FIELD_NAME_PLACEHOLDER:'Nome',
	USER_FIELD_SURNAME_PLACEHOLDER:'Cognome',
	USER_FIELD_EMAIL_PLACEHOLDER : 'Tua@Email',

	/* Virtual Entity */
	VIRTUALENTITY_FIELD_ID: 'ID Virtual Entity',
	VIRTUALENTITY_FIELD_CODE: 'Codice',
	VIRTUALENTITY_FIELD_ID_TENANT : 'Id organizzazione',
	VIRTUALENTITY_FIELD_TENANT_CODE:"Codice organizzazione",
	VIRTUALENTITY_FIELD_CATEGORY: 'Categoria',
	VIRTUALENTITY_FIELD_NAME: 'Nome',
	VIRTUALENTITY_FIELD_TYPE:'Tipo',
	VIRTUALENTITY_FIELD_DESCRIPTION: 'Descrizione',
	VIRTUALENTITY_FIELD_CATEGORY_ID: 'ID categoria',
	VIRTUALENTITY_FIELD_TYPE_ID: 'ID Tipo',
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
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR_ADDITIONAL: 'Interno',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR: 'Interno',
	VIRTUALENTITY_FIELD_ESPOSITION_OUTDOOR: 'Esterno',
	VIRTUALENTITY_FIELD_INDOOR_BUILDING: 'Edificio',
	VIRTUALENTITY_FIELD_INDOOR_ROOM: 'Stanza',
	VIRTUALENTITY_FIELD_INDOOR_FLOOR: 'Piano', 
	VIRTUALENTITY_FIELD_CREATION_DATE: 'Data creazione',
	VIRTUALENTITY_FIELD_MODEL: 'Modello',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE: 'Alimentazione',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_AUTO: 'Auto',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_NETWORK: 'Network',
	VIRTUALENTITY_FIELD_ADMIN_URI: 'URI Amministrazione',
	VIRTUALENTITY_FIELD_SOFTWARE_VERSION: 'Versione Software',
		
	/* Stream tags */
	AGRICULTURE: 'Agricoltura',
	ENERGY: 'Energia',
	ENVIRONMENT: 'Ambiente',
	HEALTH: 'Salute',
	SCHOOL: 'Scuola',
	SECURITY: 'Sicurezza',
	TRANSPORT: 'Trasporti',
	/* TODO REMOVE */
	ambiente: 'Ambiente',
	agricoltura: 'Agricoltura',
	qualita_aria: 'Aria',

	
	/* Stream domains */
	AIR: 'Aria',
	CARBON: 'Carbonio',
	CONSUMPTION: 'Consumo',
	DIOXIDE: 'Biossido',
	FIRE: 'Fuoco',
	FOREST: 'Foresta',
	GLACIER: 'Ghiacciaio',
	INDOOR: 'Indoor',
	LAKE: 'Lago',
	LANDSLIDE: 'Frana',
	MONOXIDE: 'Monossido',
	NITROGEN: 'Azoto',
	OZONE: 'Ozono',
	POLLUTION: 'Inquinamento',
	RAIN: 'Pioggia',
	RIVER: 'Fiume',
	SNOW: 'Neve',
	WATER: 'Acqua',
	POWDERS: 'Polveri',
	QUALITY: 'Qualit&agrave;',
	NOISE: 'Rumore',
	OUTDOOR: 'Esterno',
	PRODUCTION: 'Produzione',
	STORM: 'Tempesta',
	GROUND: 'Suolo',
	TRAFFIC: 'Traffico',
	WIND: 'Vento',
	SULPHUR: 'Zolfo',
	VINEYARD: 'Vigneto',
	
	/* Validations */
	VALIDATION_PATTERN_INTEGER_TOOLTIP: 'Solo numeri interi',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Solo numeri decimali',
	VALIDATION_PATTERN_UUID_TOOLTIP: 'Il codice inserito non &ecute; conforme al pattern: 8-4-4-4-12 numeri esadecimali',
	VALIDATION_PATTERN_MAXLENGTH_TOOLTIP: 'Valore troppo lungo',
	
	/* stream status */
	draft:'Bozza',
    req_inst:'Installazione in corso',
    inst:'Installato',
    req_uninst:'Disistallazione in corso',
    uninst:'Disistallato e storicizzato',
	
	/* Virtual Entity List */
	VIRTUALENTITY_LIST_CODE_FILTER: 'Filtra per codice',
	VIRTUALENTITY_LIST_STATUS_FILTER: 'Filtra per stato',

	/* Home page */
	HOME_TITLE: 'Yucca Platform',
	HOME_SUBTITLE: 'Registra il tuo smart object e poi definisci i flussi di dati/stream che lo smart object trasmette',
	HOME_TENANT_TITLE: 'Organizations',	
	HOME_VIRTUALENTITY_TITLE: 'Active Sensor',	
	HOME_STREAM_TITLE: 'Online stream',	
	
	HOME_HOWTO_TITLE: 'Come posso usare la piattaforma?',
	HOME_HOWTO_TEXT_HTML: '<li>' + 
							'	<span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/virtualentities/{{tenant}}">Configura</a> i tuoi sensori e invia i dati utilizzando il tenant <strong>Sandbox</strong> ' +
							'	<span  class="mute">(a breve potrai richiedere un tuo tenant)</span></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/streams">Fruisci</a> di tutti flussi disponibili via <strong>Websocket</strong> o <strong>MQTT</strong></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/main/example">Monitora</a> i tuoi stream nella dashboard </li>' +
							'<li class="mute"><span class="glyphicon glyphicon-unchecked"></span> &nbsp;Crea flussi combinati con logiche di aggregazione (coming soon...)</li>' +
							'<li class="mute"><span class="glyphicon glyphicon-unchecked mute"></span> &nbsp;Fruisci di tutti i dati storicizzati tramite API OData (coming soon...)</li>',
	
	

	/* Dashboard */
	DASHBOARD_TITLE : 'Area monitoraggio flussi',
	
	DASHBOARD_SECTION_OVERVIEW: 'Overview',
	DASHBOARD_SECTION_EXAMPLE: 'Esempio',
	DASHBOARD_SECTION_TRAFFIC: 'Traffic',
	
	DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR: 'Tenant not configured', 

	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Flusso',
	DASHBOARD_STREAM_LIST_VIRTUALENTITY_CODE: 'Virtual Entity',
	DASHBOARD_STREAM_LIST_TENANT : 'Organizzazione',
	DASHBOARD_STREAM_LIST_EVENTS : 'Num. eventi ultima mezz\'ora',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Data registrazione',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Aggiornamento',
	DASHBOARD_STREAM_LIST_STATUS : 'Stato',
	
	/* Dashboard home */
	DASHBOARD_DASHBOARD_BUTTON: 'Dashboard',
	DASHBOARD_STREAMS_BUTTON: 'Lista flussi',
	DASHBOARD_ERROR_LOG_BUTTON: 'Error log', 

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
	DASHBOARD_STREAM_WS_LASTERROR_PANEL_TITLE : 'Ultimi errori ricevuti',
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
	
	DASHBOARD_ERROR_LIST_CODE : 'Codice Errore',
	DASHBOARD_ERROR_LIST_NAME : 'Descrizione',
	DASHBOARD_ERROR_LIST_TENANT : 'Tenant',
	DASHBOARD_ERROR_LIST_DATE : 'Data',

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
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Modifica',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Elimina',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'Per abilitare la modifica selezionare un solo flusso',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'Per abilitare l\'eliminaizone selezionare almeno flusso',
	
	/* view stream */
	MANAGEMENT_VIEW_STREAM: 'Flusso',
	MANAGEMENT_VIEW_STREAM_INSTALL_BUTTON: 'Richiedi Installazione',
	MANAGEMENT_VIEW_STREAM_UNINSTALL_BUTTON: 'Richiedi Disinstallazione',
	MANAGEMENT_VIEW_STREAM_NEWVERSION_BUTTON: 'Crea Nuova Versione',
	MANAGEMENT_VIEW_STREAM_HISTORICAL_BUTTON: 'Storico',
	MANAGEMENT_VIEW_STREAM_DELETE_BUTTON: 'Elimina',
	MANAGEMENT_VIEW_STREAM_EDIT_BUTTON: 'Modifica',
	MANAGEMENT_VIEW_STREAM_LIFECYCLE_OK_INFO: 'Ok',

	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Crea',
	MANAGEMENT_NEW_STREAM_VIRTUALENTITY_PLACEHOLDER : 'Scegli una Virtual Entity...',
	MANAGEMENT_NEW_STREAM_SUBTITLE: 'Nuovo flusso',
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Modifica ', 
	MANAGEMENT_EDIT_STREAM_TAG_PLACEHOLDER: 'Scegli uno o pi&ugrave; tag...',
	MANAGEMENT_EDIT_STREAM_DOMAIN_PLACEHOLDER: 'Scegli un dominio...',
	MANAGEMENT_EDIT_STREAM_COMPONENT_EXAMPLE_TITLE: 'Esempio',
	MANAGEMENT_EDIT_STREAM_UNIT_OF_MEASUREMENT_PLACEHOLDER: 'Scegli...',
	MANAGEMENT_EDIT_STREAM_PHENOMENOM_PLACEHOLDER: 'Scegli...',
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Leggi da Flusso',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA_LABEL: 'Salva dati',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA: 'Salva',
	MANAGEMENT_EDIT_STREAM_DONT_SAVE_DATA: 'Non salvare',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PUBLIC: 'Pubblico',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PRIVATE: 'Privato',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE_LABEL: 'Pubblicazione nello store',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE: 'Pubblica',
	MANAGEMENT_EDIT_STREAM_NOT_PUBLISH_ON_STORE: 'Non Pubblicare',
	MANAGEMENT_EDIT_STREAM_SAVE_AS_DRAFT_BUTTON: 'Salva come bozza',
	MANAGEMENT_EDIT_STREAM_FINISH_BUTTON: 'Fine modifica', 
	MANAGEMENT_EDIT_STREAM_ADD_TAG : 'Aggiungi tag', 
	MANAGEMENT_EDIT_STREAM_DATA_SAVED_INFO : 'Flusso salvato',
	
	MANAGEMENT_EDIT_STREAM_GENERAL_INFO: 'Informazioni generali',
	MANAGEMENT_EDIT_STREAM_OTHER_INFO: 'Informazioni aggiuntive',
	MANAGEMENT_EDIT_STREAM_SETTINGS: 'Settings (coming soon)',
	
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TITLE: 'Attenzione',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED: 'Il campo \'codice\' &ecute; obbligatorio',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE: 'Il campo \'codice\' deve essere univoco per flusso ',
    
		/* Management Virtual Entity  */
	MANAGEMENT_VIRTUALENTITY_SUBTITLE: 'Virtual Entities',

	/* Management Stream List */
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY : 'Crea Virtual Entity',
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
	MANAGEMENT_NEW_VIRTUALENTITY_TYPE_PLACEHOLDER: 'Scegli...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_PLACEHOLDER: 'Scegli...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CODE_HINT: 'Solo per i device', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_HINT: 'Solo per i device', 
	
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
