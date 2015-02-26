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
	SAVE_DRAFT: 'Salva bozza',
	COMING_SOON: 'Coming soon...', 
	WARNING: 'Attenzione', 
	WARNING_SUBTITLE: 'Per proseguire &egrave; necessario correggere le seguenti segnalazioni',
	LOADING: 'Attendere prego...',
	YES: 'Si',
	NO: 'No',
	OK: 'Ok',
	BACK: 'Indietro',

	/* main menu */
	MENU_HOME : 'Home',
	MENU_DASHBOARD : 'Monitoraggio',
	MENU_MANAGEMENT : 'Gestione',
	MENU_DISCOVERY : 'Cerca',
	MENU_MARKET : 'Market',
	MENU_STORE : 'Store',
	MENU_LANG_EN : 'Inglese',
	MENU_LANG_IT : 'Italiano',
	MENU_SING_IN: 'Accedi',
	MENU_SING_OUT: 'Esci',
	
	/* Entity */
	STREAM: 'Stream',
	TENANT: 'Organizzazione',
	VIRTUALENTITY: 'Smart Object', 
	DATASET: 'Dataset',
	
	/* STREAM */
	STREAM_FIELD_ID_STREAM: 'ID Stream',
	STREAM_FIELD_ID_VIRTUAL_ENTITY: 'ID Smart Object',
	STREAM_FIELD_NAME: 'Nome',
	STREAM_FIELD_DESCRIPTION:'Descrizione',	
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
	STREAM_FIELD_DOMAIN: 'Ambito tematico',
	STREAM_FIELD_LICENCE: 'Licenza',
	STREAM_FIELD_DISCLAIMER : 'Restrizioni contenute in licenza',
	STREAM_FIELD_COPYRIGHT : 'Copyright',
	STREAM_FIELD_VISIBILITY: 'Visibilit&agrave;',
	STREAM_FIELD_TAGS : 'Tags',
	STREAM_FIELD_FPS : 'FPS',
	STREAM_FIELD_CREATION_DATE: 'Creato',
	STREAM_FIELD_LASTUPDATE: 'Modificato',
	STREAM_FIELD_EVENTS : 'Eventi',
	STREAM_FIELD_VERSION : 'Versione installata',
	STREAM_FIELD_IN_STORE: 'Nello store',
	STREAM_FIELD_ICON: 'Icona per lo store',
	
	STREAM_INPUT_FIELDS: 'Definizione stream in ingresso',
	STREAM_NEW_DEFINITION: 'Smart Object ',
	STREAM_AGGREGATE_DEFINITION: 'Stream esistenti',
	STREAM_TYPE_DEFINITION: 'Creazione da ',
	STREAM_FIELDSET: 'Internal Stream Definition',
	STREAM_FIELD_COMPONENTS_OUTPUT: 'Componenti stream in uscita',
	STREAM_INTERNAL_SELECTED_STREAM: 'Stream Selezionati',
	
	STREAM_SIDDHI_QUERY_SUCCESS: "La query Siddhi e' valida.",
	STREAM_SIDDHI_QUERY: "Query SIDDHI ",
	STREAM_SIDDHI_QUERY_DEFAULT:"Query aggiunta in fondo:",
	STREAM_SIDDHI_VALIDATE_BUTTON:'Valida',
	STREAM_SIDDHI_PLEASE_VALIDATE:'Validare la query siddhi prima di continuare!',
	STREAM_SIDDHI_PLEASE_OUTPUTSTREAM:'Inserire il parametro "outputStream" nella query.',
	STREAM_SIDDHI_INSERT_COMPONENT:"Prima di validare e' neccessario inserire le componenti del nuovo stream",

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
	USER_FIELD_ACCEPT:'Termini',
	USER_FIELD_PRIVACY: 'Informativa',
	USER_FIELD_RESPONSABILITY: 'Disponibilit&agrave; dei Dati',
	USER_FIELD_ACCEPT_YES:'Accetto ',
	USER_FIELD_ACCEPT_NO:'Non Accetto ',
	
	//USER_FIELD_ACCEPT_PRIVACY:'Dopo aver preso visione dell\'informativa sulla Privacy ai sensi dell\'art. 13 del D.Lgs 196/2013, autorizzo il CSI Piemonte al trattamento dei dati personali qui inseriti con le modalit&agrave; e per le finalit&agrave; in essa contenute',
	USER_FIELD_ACCEPT_PRIVACY:'<p><strong>INFORMATIVA PRIVACY AI SENSI DELL\'ART. 13 DEL D.LGS. 196/2003</strong></p> '+
		'<p>Il trattamento dei dati personali forniti dall\'Utente con la compilazione del form, &egrave; disciplinato dal D.Lgs. n. 196/2003 (Codice in materia di protezione dei dati personali) e s.m.i.</p> '+
		'<p>Ai sensi dell\'art. 13 del D.Lgs. 196/2003, CSI-Piemonte informa pertanto, di quanto segue:</p> '+
		'<ol type=\'a\'> '+
		'<li> i dati saranno trattati, in base a principi di correttezza, liceit&agrave; e trasparenza, al solo fine di associare un referente ai dati forniti alla Piattaforma SDP;</li> '+
		'<li> il conferimento dei dati ed il consenso al trattamento sono liberi e facoltativi. Tuttavia l\'eventuale rifiuto  comporter&agrave; l\'impossibilit&agrave; per CSI Piemonte di raggiungere la finalit&agrave; suindicata;</li> '+
		'<li> i dati saranno trattati sia con sistemi automatizzati sia manualmente, e, in ogni caso, a tutela e garanzia della riservatezza dei dati forniti in modo da ridurre al minimo la soglia di rischio di accessi abusivi, furti o manomissioni dei dati stessi, in conformit&agrave; a quanto previsto dagli artt. 31 ss del D.Lgs. n. 196/2003 e s.m.i. e dall\'Allegato B allo stesso decreto;</li> '+
		'<li> i dati saranno trattati da personale "Incaricato" ai sensi dell\'art. 4, comma 1, lett. h) del Codice Privacy previa adeguate istruzioni operative, per il tempo strettamente necessario al raggiungimento delle finalit&agrave; suindicate;</li> '+
		'<li> i dati non saranno oggetto di comunicazione a terzi e diffusione, fatti salvi gli obblighi di legge nazionale e comunitaria;</li> '+
		'<li> il Titolare del trattamento &egrave; CSI-Piemonte, con sede in corso Unione Sovietica 216, Torino;</li> '+
		'<li> CSI-Piemonte ha nominato i Responsabili interni per il trattamento dei dati personali. L\'elenco completo e aggiornato di tali Responsabili e delle rispettive; funzioni pu&ograve; essere richiesto al Titolare scrivendo all\'indirizzo e-mail privacy@csi.it;</li> '+
		'<li> in relazione al trattamento dei dati che lo riguardano l\'interessato ha diritto ad ottenere le informazioni previste dall\'articolo 7 del decreto in oggetto. Potr&agrave; avvalersi dei diritti di cui all\'art. 7 del D.Lgs. n. 196/2003 e s.m.i. (tra cui quelli di ottenere dal Titolare, anche per il tramite dei Responsabili o degli Incaricati, la conferma dell\'esistenza o meno dei suoi dati personali e la loro messa a disposizione in forma intelligibile; di avere conoscenza della logica e delle finalit&agrave; su cui si basa il trattamento; di ottenere la cancellazione, la trasformazione in forma anonima o il blocco dei dati trattati in violazione di legge, nonch&eacute; l\'aggiornamento, la rettificazione o, se vi &egrave; interesse, l\'integrazione dei dati; di opporsi per motivi legittimi al trattamento stesso) rivolgendosi al Titolare, CSI- Piemonte Corso Unione Sovietica 216 Torino; e-mail: privacy@csi.it, tel. 011-3168111.</li> '+
		'</ol>',
	
	USER_FIELD_ACCEPT_STREAM_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle "Linee guida per l\'integrazione in Smart Data Net", dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione degli altri fruitori della piattaforma lo stream conferito- nonch&eacute; sue eventuali elaborazioni -  senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',
	USER_FIELD_ACCEPT_DATASET_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle "Linee guida per l\'integrazione in Smart Data Net", dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione degli altri fruitori della piattaforma il dataset conferito- nonch&eacute; sue eventuali elaborazioni -  senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',

	/* Creator of Stream PlaceHolder */
	USER_FIELD_NAME_PLACEHOLDER:'Nome',
	USER_FIELD_SURNAME_PLACEHOLDER:'Cognome',
	USER_FIELD_EMAIL_PLACEHOLDER : 'Tua@Email',

	/* Virtual Entity */
	VIRTUALENTITY_FIELD_ID: 'ID Smart Object',
	VIRTUALENTITY_FIELD_CODE: 'Codice',
	VIRTUALENTITY_FIELD_ID_TENANT : 'Id organizzazione',
	VIRTUALENTITY_FIELD_TENANT_CODE:"Codice organizzazione",
	VIRTUALENTITY_FIELD_TYPE:'Tipo',
	VIRTUALENTITY_FIELD_CATEGORY: 'Categoria',
	VIRTUALENTITY_FIELD_NAME: 'Nome',
	VIRTUALENTITY_FIELD_DESCRIPTION: 'Descrizione',
	VIRTUALENTITY_FIELD_CATEGORY_ID: 'ID categoria',
	VIRTUALENTITY_FIELD_TYPE_ID: 'ID Tipo',
	VIRTUALENTITY_FIELD_STREAMS_COUNT: 'Numero di stream',
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
		
	/* Dataset */
	DATASET_FIELD_ID: 'ID',
	DATASET_FIELD_VERSION: 'Versione',
	DATASET_FIELD_CONFIGDATA_ID: 'Id Dataset',
	DATASET_FIELD_CONFIGDATA_CODE: 'Codice',
	DATASET_FIELD_CONFIGDATA_TENANT: 'Organizzazione',
	DATASET_FIELD_CONFIGDATA_COLLECTION: 'Collection',
	DATASET_FIELD_CONFIGDATA_TYPE: 'Tipo',
	DATASET_FIELD_CONFIGDATA_SUBTYPE: 'Sottotipo',
	DATASET_FIELD_CONFIGDATA_DATAVERSION: 'Versione',
	DATASET_FIELD_METADATA_NAME: 'Nome',
	DATASET_FIELD_METADATA_DESCRIPTION: 'Descrizione',
	DATASET_FIELD_METADATA_DISCLAIMER: 'Restrizioni contenute in licenza',
	DATASET_FIELD_METADATA_LICENSE: 'Licenza',
	DATASET_FIELD_METADATA_COPYRIGHT: 'Copyright',
	DATASET_FIELD_METADATA_VISIBILITY: 'Visibilit&agrave;',
	DATASET_FIELD_METADATA_REGISTRATIONDATE: 'Data registrazione',
	DATASET_FIELD_METADATA_DATADOMAIN: 'Dominio',
	DATASET_FIELD_METADATA_FPS: 'FPS',
		
	DATASET_FIELD_METADATA_STARTINGESTIONDATE: 'Inizio caricamento',
	DATASET_FIELD_METADATA_ENDINGESTIONDATE: 'Fine caricamento',
	DATASET_FIELD_METADATA_IMPORTFILETYPE: 'Tipo file',
	DATASET_FIELD_METADATA_DATASETSTATUS: 'Stato',
	DATASET_FIELD_METADATA_TAGS: 'Tag',
	DATASET_FIELD_METADATA_FIELDS: 'Campi',
	DATASET_FIELD_METADATA_FIELD_NAME: 'Nome',
	DATASET_FIELD_METADATA_FIELD_ALIAS: 'Alias',
	DATASET_FIELD_METADATA_FIELD_DATATYPE: 'Tipo dato',
	DATASET_FIELD_METADATA_FIELD_DATATYPE_FORMAT: 'Formato data', 
	DATASET_FIELD_METADATA_FIELD_SOURCE_COLUMN: 'Sorgente',
	DATASET_FIELD_METADATA_FIELD_IS_KEY: 'Chiave',
	DATASET_FIELD_METADATA_FIELD_UNIT: 'Unit&agrave; di misura',
	
	/* Cookie */
	COOKIE_MESSAGE: 'Questo sito fa uso di cookie per migliorare l\'esperienza di navigazione degli utenti. Proseguendo nella navigazione si accetta l\'uso dei cookie.',
	COOKIE_ACCEPT: 'Ok',
	COOKIE_DECLINE: 'Non Accetto',

	/* Dataset placeholder */
	DATASET_FIELD_NAME_PLACEHOLDER : 'es. musei torino 2015',
	DATASET_FIELD_METADATA_FIELD_IS_KEY_PLACEHOLDER: 'key',
	
	
	/* Stream tags */
	AGRICULTURE: 'Agricoltura',
	ENERGY: 'Energia',
	ENVIRONMENT: 'Ambiente',
	HEALTH: 'Salute',
	SCHOOL: 'Scuola',
	SECURITY: 'Sicurezza',
	TRANSPORT: 'Trasporti',

	
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
	QUALITY: 'Qualita\'',
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
	VALIDATION_PATTERN_UUID_TOOLTIP: 'Il codice inserito non e\' conforme al pattern: 8-4-4-4-12 numeri esadecimali',
	VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP: 'Il codice inserito non puo\' contenere spazi o i caratteri  * . / # ',
	VALIDATION_PATTERN_MAXLENGTH_TOOLTIP: 'Valore troppo lungo',
	VALIDATION_PATTERN_NO_SPACE_TOOLTIP: 'Il valore deve essere senza spazi',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Inserire un valore decimale utilizzando il punto come separatore',
	
	/* stream status */
	draft:'Bozza',
    req_inst:'Installazione in corso',
    inst:'Installato',
    req_uninst:'Disinstallazione in corso',
    uninst:'Disinstallato e storicizzato',
	
	/* Virtual Entity List */
	VIRTUALENTITY_LIST_CODE_FILTER: 'Filtra per codice',
	VIRTUALENTITY_LIST_STATUS_FILTER: 'Filtra per stato',

	/* Dataset List */
	DATASET_LIST_NAME_FILTER: 'Filtra per nome',
	DATASET_LIST_STATUS_FILTER: 'Filtra per stato',

	/* Home page */
	HOME_TITLE: 'Yucca Platform',
	HOME_SUBTITLE: 'Registra smart object e definisci gli stream trasmessi',
	HOME_INTRO_HTML: 'Informazioni dal mondo che ci circonda e soluzioni open: sono questi i punti distintivi della Piattaforma messa a disposizione da Regione Piemonte per l\'Ecosistema Smart Data Net',
	HOME_START_BUTTON_DESC: 'Accedi con la tua utenza',
	HOME_START_BUTTON: 'Accedi',
	HOME_START_DEMO_BUTTON_DESC: '',
	HOME_START_DEMO_BUTTON: 'Oppure prova la piattaforma come anomimo sul tenant SandBox', 
	HOME_LOGGED_IN_WELCOME: 'Benvenuto, ',
	HOME_START_LOGGED_IN_BUTTON: 'Vai ai tuoi stream',
	HOME_MAP_INTRO: 'Sensori attualmente attivi sul territorio',
	HOME_STATISTIC_PANEL_TITLE: 'Cosa c\'&egrave; nella piattaforma',
	HOME_STATISTIC_TOTAL_DATA: 'dati  disponibili',
	HOME_STATISTIC_TOTAL_DATA_TIP: 'Totale dei dati  disponibili: ',
	HOME_STATISTIC_TODAY_DATA: 'dati registrati ieri',
	HOME_STATISTIC_TODAY_DATA_TIP: 'Totale dei dati  registrati oggi: ',
	HOME_STATISTIC_VIRTUALOBJECT_DATA: 'dati da smart object',
	HOME_STATISTIC_VIRTUALOBJECT_DATA_TIP: 'Totale dei dati ricevuti dagli Smart Object: ',
	HOME_STATISTIC_TENANT: 'Organizations',	
	HOME_STATISTIC_VIRTUALENTITY: 'Active Smart Objects',	
	HOME_STATISTIC_STREAM: 'Online streams',	
	HOME_OPERATION_PANEL_TITLE:'Cosa puoi fare con la piattaforma',
	HOME_ROLE_DEVELOPER: 'developer',
	HOME_ROLE_DEVELOPER_INTRO: 'Puoi creare stream composti da altri stream gi&agrave; esistenti',
	HOME_ROLE_PUBLISHER: 'publisher',
	HOME_ROLE_PUBLISHER_INTRO: 'Puoi creare e gestire Stream, Smart Object e Dataset',
	HOME_ROLE_SUBSCRIBER: 'subscriber',
	HOME_ROLE_SUBSCRIBER_INTRO: 'Puoi usare i dati disponibili nella piattaforma',

	HOME_ACTION_DEVELOPER_SEP_1: 'oppure elabora un nuovo stream',
	HOME_ACTION_PUBLISHER_SEP_1: 'oppure aggiungi direttamente gli oggetti',
	HOME_ACTION_SUBSCRIBER_SEP_1: 'oppure cerca gli stream e i dati nello store',
	
	HOME_ACTION_DASHBOARD: 'Monitoraggio Stream',
	HOME_ACTION_MANAGEMENT: 'Gestione',

	HOME_ACTION_NEW_STREAM_INTERNAL: 'Crea Stream Composti',
	HOME_ACTION_NEW_VIRTUAL_ENTITY: 'Crea Smart Object',
	HOME_ACTION_NEW_STREAM: 'Crea Stream',
	HOME_ACTION_NEW_DATASET: 'Crea Dataset',
	HOME_ACTION_SEARCH: 'Cerca un Dataset',
	HOME_ACTION_STORE: 'Accedi allo store',

	
	
	HOME_SEARCH_TITLE: 'Cerca un dataset',
	HOME_STORE_TITLE: 'Accedi allo store',
	
	
	HOME_HOWTO_TITLE: 'Come posso usare la piattaforma?',
	HOME_HOWTO_TEXT_HTML: '<li>' + 
							'	<span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/virtualentities/{{tenant}}">Configura</a> i tuoi sensori e invia i dati utilizzando il tuo tenant o il tenant di prova <strong>Sandbox</strong> ' +
							'	</li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/streams">Fruisci</a> di tutti gli stream disponibili via <strong>Websocket</strong> o <strong>MQTT</strong></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/main/overview">Monitora</a> i tuoi stream nella dashboard </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/datasets/sandbox">Importa</a> i tuoi <strong>dataset bulk</strong> tramite upload</li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/discovery">Cerca e fruisci</a> di tutti i dati storicizzati e dei dataset tramite <strong>API OData</strong> </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/streams/sandbox">Crea stream</a> derivati da uno o pi&ugrave; stream aggiungendo <strong>logiche personalizzate in SiddhiQL</strong></li>' +
							'<li class="mute"><span class="glyphicon glyphicon-unchecked"></span> &nbsp;Crea stream derivati in maniera semplice attraverso wizard guidati (coming soon...)</li>',
							
	/* Dashboard */
	DASHBOARD_TITLE : 'Area monitoraggio stream',
	
	DASHBOARD_SECTION_OVERVIEW: 'Overview',
	DASHBOARD_SECTION_EXAMPLE: 'Esempio',
	DASHBOARD_SECTION_TRAFFIC: 'Traffic',
	
	DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR: 'Tenant not configured', 

	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Stream',
	DASHBOARD_STREAM_LIST_VIRTUALENTITY_CODE: 'Smart Object',
	DASHBOARD_STREAM_LIST_TENANT : 'Organizzazione',
	DASHBOARD_STREAM_LIST_EVENTS : 'Num. eventi ultima mezz\'ora',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Data registrazione',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Aggiornamento',
	DASHBOARD_STREAM_LIST_STATUS : 'Stato',
	
	/* Dashboard home */
	DASHBOARD_DASHBOARD_BUTTON: 'Dashboard',
	DASHBOARD_STREAMS_BUTTON: 'Lista stream',
	DASHBOARD_ERROR_LOG_BUTTON: 'Error log', 

	//DASHBOARD_STREAM_TITLE: 'Stream <strong>{{stream_name}}</strong>',
	DASHBOARD_STREAM_TITLE: 'Stream ',
	DASHBOARD_STREAM_DETAIL_TITLE : 'Dettagli',
	DASHBOARD_STREAM_DETAIL_TABLE_KEY : 'Campo',
	DASHBOARD_STREAM_DETAIL_TABLE_VALUE : 'Valore',
	DASHBOARD_STREAM_DETAIL_OTHER_CONFIUGURATION: 'Altre configurazioni',

	DASHBOARD_STREAM_DATA_CHART_TITLE: 'Ultimi 30 dati', 
	

	DASHBOARD_STREAM_REALTIME_FPS: 'FPS', 
	DASHBOARD_STREAM_REALTIME_SEC_BTW_EVENTS: 'Sec. tra eventi', 
	DASHBOARD_STREAM_REALTIME_FPM: 'FPM', 
	DASHBOARD_STREAM_REALTIME_MIN_BTW_EVENTS: 'Min. tra eventi', 
	
	
	DASHBOARD_STREAM_DATA_FILTER_CHART_LABEL: 'Seleziona le serie da visualizzare', 
	DASHBOARD_STREAM_DATA_MAIN_INFO_TITLE: 'Informazioni Principali', 
	DASHBOARD_STREAM_DATA_DETAIL_INFO_TITLE: 'Informazioni di Dettaglio', 
	DASHBOARD_STREAM_DATA_SHARE_INFO_TITLE: 'Informazioni di Condivisione', 

	DASHBOARD_STREAM_REALTIME_STATISTIC_TITLE: 'Statistiche', 
	
	DASHBOARD_STREAM_WS_URL_TITLE : 'URL Web Socket',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TITLE : 'Numero di eventi negli ultimi 30 sec',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_TIME : 'Ora',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_COUNT : 'Eventi',
	DASHBOARD_STREAM_WS_LASTMESSAGE_PANEL_TITLE : 'Ultimo messaggio ricevuto',
	DASHBOARD_STREAM_WS_LASTMESSAGE_NOT_RECEIVED: 'Non sono ancora arrivati nuovi messaggi, viene visualizzato l\'ultimo messaggio registrato (se presente)', 
	DASHBOARD_STREAM_WS_LASTERROR_PANEL_TITLE : 'Ultimi errori ricevuti',
	DASHBOARD_STREAM_WS_LASTMESSAGE_REFRESH_BUTTON : 'Aggiorna',

	DASHBOARD_STREAM_WS_STATISTICS_TIME_TABLE_TITLE : '# Eventi',
	DASHBOARD_STREAM_WS_ERROR_TIME_TABLE_TITLE : '# Errori',
	
	DASHBOARD_STREAM_SYSTEM_STATUS : 'System Status',

	DASHBOARD_ERROR_LOG_TITLE: 'Error log',
	DASHBOARD_ERROR_LOG_SUBTITLE: 'Messaggi inviati dagli stream che hanno generato un errore',
	DASHBOARD_ERROR_LOG_INTRO: 'Si possono visualizzare messaggi di errori indefiniti e non associati a un tenant specifico, o messaggi di errore in cui &egrave; identificato un tenant. Vengono visualizzati gli ultimi 3 messaggi ricevuti, &egrave; possibile aggiornare i messaggi tramite il bottone refresh',
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
    MANAGEMENT_MENU_STREAMS: 'Stream',
    MANAGEMENT_MENU_VIRTUAL_ENTITIES: 'Smart Object',
    MANAGEMENT_MENU_DATASET: 'Dataset',
    
    MANAGEMENT_DESCRIPTION_ON_STORE_HINT: 'Scegli con cura, sar&agrave; utilizzato nello store',

    /* Management Stream  */
	MANAGEMENT_DASHBOARD_SUBTITLE: 'Dashboard',
	MANAGEMENT_DASHBOARD_TENANT_PANEL_TITLE: 'Informazioni sull\'organizzazione',
    /* Management Stream  */
	MANAGEMENT_STREAM_SUBTITLE: 'Stream',

	/* Management Stream List */
	MANAGEMENT_STREAM_LIST_NEW_STREAM : 'Nuovo',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Modifica',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Elimina',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'Per abilitare la modifica selezionare un solo stream',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'Per abilitare l\'eliminazione selezionare almeno uno stream',
	
	/* view stream */
	MANAGEMENT_VIEW_STREAM: 'Stream',
	MANAGEMENT_VIEW_STREAM_INSTALL_BUTTON: 'Richiedi Installazione',
	MANAGEMENT_VIEW_STREAM_UNINSTALL_BUTTON: 'Richiedi Disinstallazione',
	MANAGEMENT_VIEW_STREAM_NEWVERSION_BUTTON: 'Crea Nuova Versione',
	MANAGEMENT_VIEW_STREAM_HISTORICAL_BUTTON: 'Storico',
	MANAGEMENT_VIEW_STREAM_DELETE_BUTTON: 'Elimina',
	MANAGEMENT_VIEW_STREAM_EDIT_BUTTON: 'Modifica',
	MANAGEMENT_VIEW_STREAM_LIFECYCLE_OK_INFO: 'Ok',

	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Crea',
	MANAGEMENT_NEW_STREAM_VIRTUALENTITY_PLACEHOLDER : 'Scegli uno Smart Object...',
	MANAGEMENT_NEW_STREAM_SUBTITLE: 'Nuovo stream',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER: 'Registra',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR: 'Richiedente',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL: 'Dettagli',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS: 'Componenti',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE: 'Condividi',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER_TITLE: 'Registra lo Stream',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR_TITLE: 'Inserisci le informazioni del richiedente',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL_TITLE: 'Inserisci i dettagli',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS_TITLE: 'Descrivi le componenti',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE_TITLE: 'Definisci la modalit&agrave; di diffusione',
	MANAGEMENT_NEW_STREAM_WIZARD_NEXT:'Prosegui',
		
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Modifica ', 
	MANAGEMENT_EDIT_STREAM_TAG_PLACEHOLDER: 'Scegli uno o pi&ugrave; tag...',
	MANAGEMENT_EDIT_STREAM_DOMAIN_PLACEHOLDER: 'Scegli un dominio...',
	MANAGEMENT_EDIT_STREAM_COMPONENT_EXAMPLE_TITLE: 'Esempio',
	MANAGEMENT_EDIT_STREAM_UNIT_OF_MEASUREMENT_PLACEHOLDER: 'Scegli...',
	MANAGEMENT_EDIT_STREAM_PHENOMENOM_PLACEHOLDER: 'Scegli...',
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Leggi da Stream',
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
	MANAGEMENT_EDIT_STREAM_DATA_SAVED_INFO : 'Stream salvato',
	
	MANAGEMENT_EDIT_STREAM_GENERAL_INFO: 'Informazioni Principali',
	MANAGEMENT_EDIT_STREAM_OTHER_INFO: 'Informazioni aggiuntive',
	MANAGEMENT_EDIT_STREAM_SETTINGS: 'Settings',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_DROPAREA: 'Rilascia qui l\'icona',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_BUTTON_LOAD_FILE: 'Oppure clicca qui per selezionare ',
	
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TITLE: 'Attenzione',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED: 'Il campo \'Nome\' e\' obbligatorio',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE: 'Il campo \'Nome\' deve essere univoco per stream ',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED: 'Il campo \'tipo di dato\' e\' obbligatorio',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED: 'Il campo \'tolleranza\' e\' obbligatorio',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER: 'Il campo \'tolleranza\' deve essere numerico',
	MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS: 'Inserire almeno un componente',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE: 'Il campo \'Nome\' non puo\' contenere spazi',
    
		/* Management Virtual Entity  */
	MANAGEMENT_VIRTUALENTITY_SUBTITLE: 'Smart Object',

	/* Management Stream List */
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY : 'Crea nuovo Smart Object ',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_APP : 'App',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_DEVICE : 'Device',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_FEED : 'Feed',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY : 'Modifica',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY : 'Cancella',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY_BUTTON_HINT: 'Per abilitare la modifica selezionare un solo Smart Object',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY_BUTTON_HINT: 'Per abilitare la cancellazione selezionare almeno uno Smart Object',
  
	/* Management new Virtual Entity  */
	MANAGEMENT_NEW_VIRTUALENTITY_SUBTITLE: 'Nuovo Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_CREATE_BUTTON: 'Crea Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_GENERATE_UUID_BUTTON: 'Genera',	
	MANAGEMENT_NEW_VIRTUALENTITY_TYPE_PLACEHOLDER: 'Scegli...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_PLACEHOLDER: 'Scegli...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CODE_HINT: 'Solo per i device', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_HINT: 'Solo per i device', 
	
	/* Management edit Virtual Entity  */
	MANAGEMENT_EDIT_VIRTUAL_ENTITY_SUBTITLE: 'Modifica ',
	MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO: 'Smart Object Salvato',
		
	MANAGEMENT_EDIT_VIRTUALENTITY_GENERAL: 'Informazioni Principali',
	MANAGEMENT_EDIT_VIRTUALENTITY_COLLOCATION: 'Collocazione',
	MANAGEMENT_EDIT_VIRTUALENTITY_OTHER_INFO: 'Informazioni Aggiuntive',
	MANAGEMENT_EDIT_VIRTUALENTITY_FINISH_BUTTON: 'Fine modifica',
	MANAGEMENT_EDIT_VIRTUALENTITY_SAVE_BUTTON: 'Salva',

	MANAGEMENT_VIEW_VIRTUALENTITY_HISTORICAL_BUTTON: 'Versioni storicizzate',
	MANAGEMENT_VIEW_VIRTUALENTITY_DELETE_BUTTON: 'Elimina',
	MANAGEMENT_VIEW_VIRTUALENTITY_EDIT_BUTTON: 'Modifica',
	MANAGEMENT_VIEW_VIRTUALENTITY_INSTALL_BUTTON: 'Installa',
	
	/* Management dataset */
	MANAGEMENT_DATASET_SUBTITLE: 'Dataset',
	MANAGEMENT_DATASET_LIST_NEW_DATASET: 'Carica nuovo Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET_BUTTON_HINT: 'Per abilitare la modifica selezionare un solo Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET: 'Modifica',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET_BUTTON_HINT: 'Per abilitare la cancellazione selezionare almeno un Dataset',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET: 'Cancella',
	
	MANAGEMENT_VIEW_DATASET_EDIT_BUTTON: 'Modifica',
	MANAGEMENT_VIEW_DATASET_DOWNLOAD_BUTTON: 'Scarica',
	MANAGEMENT_VIEW_DATASET_ADD_DATA_BUTTON: 'Aggiungi dati',
	MANAGEMENT_VIEW_DATASET_DATA_URLS: 'Accesso ai dati',
	
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER: 'Registra',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION: 'Posizione',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL: 'Altre informazioni',

	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER_TITLE: 'Registra lo Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION_TITLE: 'Descrivi la posizione',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL_TITLE: 'Completa i campi aggiuntivi',

	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_CREATE_BUTTON : 'Crea',
	MANAGEMENT_NEW_DATASET_TITLE: 'Nuovo Dataset',
	MANAGEMENT_NEW_DATASET_START_SUBTITLE: 'Identificativo',
	MANAGEMENT_NEW_DATASET_REQUESTOR_SUBTITLE: 'Richiedente',
	MANAGEMENT_NEW_DATASET_METADATA_SUBTITLE: 'Metadati',
	MANAGEMENT_NEW_DATASET_UPLOAD_SUBTITLE: 'Upload del File',
	MANAGEMENT_NEW_DATASET_COLUMNS_SUBTITLE: 'Campi',
	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_WIZARD_PREV: 'Back', 
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT: 'Next', 
	MANAGEMENT_NEW_DATASET_WIZARD_END: 'Upload dataset',
	
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_DROPAREA: 'Rilascia il file da caricare',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_OR: 'Oppure',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_BUTTON_LOAD_FILE: 'Clicca qui per selezionare ',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_FORMAT: 'Formato',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_ENCODING: 'Encoding',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SEPARATOR: 'Separatore',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_MAX_SIZE: 'Dimensione massima dei file supportata: ',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_TITLE: 'Attenzione',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_FILE_TOO_BIG: 'La dimensione del file selezionato supera la quota limite',
	
	MANAGEMENT_NEW_DATASET_SKIP_COLUMN_HINT: 'Salta colonna', 
	MANAGEMENT_NEW_DATASET_MOVE_COLUMN_HINT: 'Modifica ordine colonne',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW: 'Salta la prima riga',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW_HELP: 'Nel caso la prima riga sia l\'intestazione', 
	MANAGEMENT_NEW_DATASET_COLUMNS_TITLE: 'Colonne da importare',
	MANAGEMENT_NEW_DATASET_COLUMNS_INTRO: 'Selezionare le colonne di cui si vogliono importare i dati. E\' possibile cambiare l\'ordine di importazione', 

	/* Management upload dataset*/
	MANAGEMENT_UPLOAD_DATASET_SUBTITLE: 'Carica dati',
	MANAGEMENT_EDIT_DATASET_SUBTITLE: 'Modifica ', 
	MANAGEMENT_EDIT_DATASET_TAG_PLACEHOLDER: 'Scegli uno o pi&ugrave; tag...',
	MANAGEMENT_EDIT_DATASET_UPLOAD_ICON_DROPAREA: 'Rilascia qui l\'icona',
	MANAGEMENT_EDIT_DATASET_DOMAIN_PLACEHOLDER: 'Scegli un dominio...',
	MANAGEMENT_EDIT_STREAM_DATATYPE_PLACEHOLDER: 'Scegli...',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA_LABEL: 'Salva dati',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA: 'Salva',
	MANAGEMENT_EDIT_DATASET_DONT_SAVE_DATA: 'Non salvare',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PUBLIC: 'Pubblico',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PRIVATE: 'Privato',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE_LABEL: 'Pubblicazione nello store',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE: 'Pubblica',
	MANAGEMENT_EDIT_DATASET_NOT_PUBLISH_ON_STORE: 'Non Pubblicare',
	MANAGEMENT_EDIT_DATASET_SAVE_BUTTON: 'Salva',
	MANAGEMENT_EDIT_DATASET_FINISH_BUTTON: 'Fine modifica', 
	MANAGEMENT_EDIT_DATASET_ADD_TAG : 'Aggiungi tag', 
	MANAGEMENT_EDIT_DATASET_DATA_SAVED_INFO : 'Dataset salvato',
	MANAGEMENT_EDIT_DATASET_LEGAL_INFO: 'Informazioni Legali', 
	
	MANAGEMENT_EDIT_DATASET_API_URL: 'Url accesso API', 
	
	MANAGEMENT_EDIT_DATASET_GENERAL_INFO: 'Informazioni generali',
	MANAGEMENT_EDIT_DATASET_COLUMNS: 'Definizione struttura dato',
	MANAGEMENT_EDIT_DATASET_COLUMNS_HELP: 'Per la struttura del dato &eacute; possibile modificare solo gli alias delle colonne',

	MANAGEMENT_EDIT_DATASET_OTHER_INFO: 'Informazioni aggiuntive',
	MANAGEMENT_EDIT_DATASET_SETTINGS: 'Settings',
	
	MANAGEMENT_EDIT_DATASET_ERROR_COMPONENT_TITLE: 'Attenzione',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_REQUIRED: 'Il campo \'codice\' obbligatorio',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_UNIQUE: 'Il campo \'codice\' deve essere univoco per Dataset ',
	
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN: 'Sono presenti degli errori',
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN_NUM_ERR: 'Numero di errori',
	
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SUBTITLE: 'Aggiunta dati',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_FINISH_BUTTON: 'Fine aggiunta dati',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_UPLOAD_BUTTON: 'Carica dati',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO: 'Dati caricati: ', 
		
	/* Choose tenant temp */
	MANAGEMENT_CHOOSE_TENANT_SUBTITLE: 'Scegli un organizzazione',
	MANAGEMENT_CHOOSE_TENANT_WARNING: 'Pagina temporanea in attesa del sistema di autenticazione',
	MANAGEMENT_CHOOSE_TENANT_TITLE: 'Scegli un organizzazione',
	
	/* Discovery */
	DISCOVERY_TITLE: 'Cerca',
	DISCOVERY_FILTER_SIMPLESEARCH_LABEL: 'Cerca',
	DISCOVERY_SIMPLESEARCH_MENU: 'Ricerca semplice',
	DISCOVERY_ADVANCEDSEARCH_MENU: 'Ricerca avanzata',
	DISCOVERY_FILTER_SIMPLESEARCH_PLACEHOLDER: 'e.g. acqua oppure tags:AIR',
	DISCOVERY_FILTER_SIMPLESEARCH_HELP: 'Sono attivi gli operatori di ricerca  <strong>tags</strong>, <strong>licence</strong>, <strong>idDataset</strong>, <strong>tenantCode</strong>, <strong>dataDomain</strong>, <strong>fps</strong> ,<br>'+
	' <strong>datasetName</strong>, <strong>visibility</strong>, <strong>measureUnit</strong>, <strong>smartOCode</strong>, <strong>streamCode</strong>, <strong>streamName</strong>, <strong>streamDescription</strong> per utilizzarli <i>operatore<strong>:</strong><i>valore</i> ',
	DISCOVERY_FILTER_ADVANCED_FILTER_LABEL: 'Filtro', 
	DISCOVERY_FILTER_SEARCH_BUTTON: 'Cerca',
	
	DISCOVERY_FILTER_ADVANCED_FIELD_PLACEHOLDER: 'Scegli un campo',
	
	DISCOVERY_RESULTS_SIZE_LABEL: 'Numero di risultati: ',
	DISCOVERY_RESULTS_NO_DATA_FOUND: 'La ricerca non ha prodotto risultati',
	
	DISCOVERY_BACK_FILTER_LABEL: 'Torna ai filtri di ricerca',
	DISCOVERY_BACK_RESULT_LABEL: 'Torna ai risultati',
	
	DISCOVERY_RESULTS_TITLE: 'Esito ricerca',
	DISCOVERY_RESULTS_DETAIL_BUTTON: 'Dettaglio',
	
	DISCOVERY_DETAIL_DATASET_GENERAL_INFO: 'Informazioni Principali',
	DISCOVERY_DETAIL_DATASET_LEGAL_INFO: 'Informazioni Legali',
	DISCOVERY_DETAIL_DATASET_STREAM_INFO: 'Stream',
	DISCOVERY_DETAIL_DATASET_SMART_OBJECT_INFO: 'Smart Object',
	DISCOVERY_DETAIL_DATASET_COLUMNS: 'Definizione struttura dato',
	DISCOVERY_DETAIL_ACCESS_DATA_TITLE: 'Accesso ai dati', 
	DISCOVERY_DETAIL_ACCESS_DATA_API: 'Url di accesso alle API OData',
	DISCOVERY_DETAIL_ACCESS_DATA_STREAM: 'Url di accesso alle API Stream',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET: 'Fruzione dello stream in real time con web socket',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_SERVER_URL_LABEL: 'Server URL',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_TOPIC_LABEL: 'Topic', 
	DISCOVERY_DETAIL_OPEN_DASHBOARD_STREAM: 'Monitoraggio Stream', 
		

	/* Discovery fields */
	DISCOVERY_FIELD_TITLE: 'Nome',
	DISCOVERY_FIELD_TAG: 'Tag',
	DISCOVERY_FIELD_LICENSE: 'Licenza',
	DISCOVERY_FIELD_TENANT: 'Organizzazione',
	DISCOVERY_FIELD_FPS: 'FPS',
	DISCOVERY_FIELD_UNIT_OF_MEASUREMENT: 'Unit&agrave; di Misura',
	DISCOVERY_FIELD_STCODE:'StreamCode',
	DISCOVERY_FIELD_VE_NAME:'Nome Smart Object',
	DISCOVERY_FIELD_VE_CODE:'Codice Smart Object',
	
	DISCOVERY_FIELD_STNAME:'StreamName',
	DISCOVERY_FIELD_STDESC:'StreamDescription',
	
	/* Market */
	MARKET_TITLE: 'Market',

	/* Store */
	STORE_TITLE: 'Store',
	
	/* Info */
	INFO_TITLE: 'About userportal', 
	INFO_INTRO: '<p>La <strong>Yucca Platform</strong> &egrave; stata realizzata completamente utilizzando tecnologie <strong>Open Source</strong></p><p>Il codice sorgente &egrave; disponibile su github <a href="https://github.com/csipiemonte" target="_blank">github.com/csipiemonte</a>',
	INFO_MAIN_FRAMEWORK_TITLE: 'Created with',
	INFO_LIBRARIES_TITLE: 'Presentation and libraries',
	INFO_SOURCE_TOOL_TITLE: 'Source code and build tools',

};
