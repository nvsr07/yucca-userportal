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
	UNDO: 'Undo',
	DELETE: 'Delete',
	EDIT: 'Edit',
	SAVE_DRAFT: 'Save draft',
	COMING_SOON: 'Coming soon...', 
	WARNING: 'Warning', 
	WARNING_TITLE: 'Warning', 
	WARNING_SUBTITLE: 'Please verify',
	LOADING: 'Please wait...',
	YES: 'Yes',
	NO: 'No',
	OK: 'Ok',
	BACK: 'Back',
	CHOOSE: 'Choose...',
	CLOSE: 'Close',
	WAIT: 'Wait...',
	REFRESH: 'Refresh',

	DATE_DAY_PLACEHOLDER: 'dd',
	DATE_MONTH_PLACEHOLDER: 'mm',
	DATE_YEAR_PLACEHOLDER: 'yyyy',
	
	/* languages */
	el:"ελληνικά",
	en:"English",
	es:"Español",
	fr:"Français",
	it:"Italiano",
	sl:"Slovenščina",
	sr:"Српски",
	
	/*opendata*/
	
	OPENDATA_UPDATE_FREQUENCY_TRIENNIAL:'Triennial',
	OPENDATA_UPDATE_FREQUENCY_BIENNAL:'Biennial',
	OPENDATA_UPDATE_FREQUENCY_ANNUAL:'Annual',
	OPENDATA_UPDATE_FREQUENCY_ANNUAL_2:'Semiannual',
	OPENDATA_UPDATE_FREQUENCY_ANNUAL_3:'Three times a year',
	OPENDATA_UPDATE_FREQUENCY_QUARTERLY:'Quarterly',
	OPENDATA_UPDATE_FREQUENCY_BIMONTHLY:'Bimonthly',
	OPENDATA_UPDATE_FREQUENCY_MONTHLY:'Monthly',
	OPENDATA_UPDATE_FREQUENCY_MONTHLY_2:'Semimonthly',
	OPENDATA_UPDATE_FREQUENCY_BIWEEKLY:'Biweekly',
	OPENDATA_UPDATE_FREQUENCY_MONTHLY_3:'Three times a month',
	OPENDATA_UPDATE_FREQUENCY_WEEKLY:'Weekly',
	OPENDATA_UPDATE_FREQUENCY_WEEKLY_2:'Semiweekly',
	OPENDATA_UPDATE_FREQUENCY_WEEKLY_3:'Three times a week',
	OPENDATA_UPDATE_FREQUENCY_DAILY:'Daily',
	OPENDATA_UPDATE_FREQUENCY_UPDATE_CONT:'Continuously updated',
	OPENDATA_UPDATE_FREQUENCY_IRREG:'Irregular',
	OPENDATA_UPDATE_FREQUENCY_UNKNOWN:'Unknown',
	OPENDATA_UPDATE_FREQUENCY_OTHER:'Other',
	OPENDATA_UPDATE_FREQUENCY_DAILY_2:'Twice a day',
	OPENDATA_UPDATE_FREQUENCY_CONT:'Continuous',
	OPENDATA_UPDATE_FREQUENCY_NEVER:'Never',
	OPENDATA_UPDATE_FREQUENCY_OP_DATPRO:'Provisional data',

	/* main menu */
	MENU_HOME : 'Home',
	MENU_DASHBOARD : 'Dashboard',
	MENU_MANAGEMENT : 'Management',
	MENU_DISCOVERY : 'Discovery',
	MENU_MARKET : 'Market',
	MENU_STORE : 'Store',
	MENU_DATAEXPLORER: 'Data Explorer',
	MENU_SUBSCRIPTIONS: 'Subscriptions',
	MENU_LANG_EN : 'English',
	MENU_LANG_IT : 'Italian',
	MENU_SING_IN: 'Sign in',
	MENU_SING_OUT: 'Sign out',
	MENU_RESET_PASSWORD: 'Password reset',
	MENU_MODAL_GET_TRAIL_TENANT: 'Richiedi Trial Tenant',
	MENU_MODAL_GOT_TRAIL_TENANT: 'Trial Tenant to be activated',
	MENU_MODAL_YOUR_TRAIL_TENANT: 'This is your Trial Tenant',
	MENU_MODAL_GET_PERSONAL_TENANT: 'Richiedi Personal Tenant',
	MENU_MODAL_GOT_PERSONAL_TENANT: 'Personal Tenant to be activated',
	MENU_MODAL_YOUR_PERSONAL_TENANT: 'This is your Personal Tenant',
	MENU_MODAL_TRAIL_FULL_TEXT: 'Fill out the form below to request the creation of a trial tenant to perform some test, once made regular checks, you\'ll see it in drop-down list at the top right.',
	MENU_MODAL_PERSONAL_FULL_TEXT: 'Fill out the form below to request the creation of a trial tenant to perform some test, once made regular checks, you\'ll see it in drop-down list at the top right.',
	MENU_MODAL_RESPONSE_TEXT_OK: 'The request for the creation of the tenant with code tenantCode { { } } has been sent , you will receive an email to answer that you provided: ',
	MENU_MODAL_RESPONSE_TEXT_KO: 'We could not handle the request.',
	
	/* Entity */
	STREAM: 'Stream',
	TENANT: 'Tenant',
	VIRTUALENTITY: 'Smart Object', 
	DATASET: 'Dataset',
	
	DCAT : 'Metadata from standard DCAT-AP_IT - <a href="http://www.dati.gov.it">www.dati.gov.it</a>',

	
	/* STREAM */
	STREAM_FIELD_ID_STREAM: 'ID Stream',
	STREAM_FIELD_ID_VIRTUAL_ENTITY: 'ID Smart Object',
	STREAM_FIELD_NAME: 'Name',
	STREAM_FIELD_DESCRIPTION:'Description',
	STREAM_FIELD_CODE: 'Code',
	STREAM_FIELD_TENANT_CODE : 'Code',
	STREAM_FIELD_TENANT_NAME : 'Name',
	STREAM_FIELD_STATUS: 'Status',
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
	STREAM_FIELD_COMPONENTS_SINCE_VERSION: 'Since version',	
	STREAM_FIELD_DOMAIN: 'Domain',
	STREAM_FIELD_SUBDOMAIN: 'Sotto Dominio',
	STREAM_FIELD_SLUG : 'Virtual Entity Slug',
	STREAM_FIELD_LICENCE : 'Licence',
	STREAM_FIELD_DISCLAIMER : 'Disclaimer',
	STREAM_FIELD_COPYRIGHT : 'Copyright',
	STREAM_FIELD_VISIBILITY : 'Visibility',
	STREAM_FIELD_TAGS : 'Tags',
	STREAM_FIELD_FPS : 'FPS',
	STREAM_FIELD_CREATION_DATE: 'Created',
	STREAM_FIELD_LASTUPDATE : 'Lastupdate',
	STREAM_FIELD_EVENTS : 'Events',
	STREAM_FIELD_VERSION : 'Version',
	STREAM_FIELD_IN_STORE: 'In the store',
	STREAM_FIELD_ICON: 'Icon for the store',
	STREAM_FIELD_TENANTSSHARING: 'Share with ',
	STREAM_FIELD_TENANTSSHARED_WITH: 'Shared with',
	STREAM_FIELD_OPENDATA: 'Opendata',
	STREAM_FIELD_METADATA_OPENDATA_AUTHOR: 'Author',
	STREAM_FIELD_METADATA_OPENDATA_AUTHOR_PLACEHOLDER: 'e.g. Regione Piemonte',
	STREAM_FIELD_METADATA_OPENDATA_LANG: 'Language of metadata card',
	STREAM_FIELD_METADATA_OPENDATA_LANG_PLACEHOLDER: 'Language of metadata...',
	STREAM_FIELD_METADATA_OPENDATA_DATA_UPDATE_DATE: 'Last update of data',
	STREAM_FIELD_METADATA_OPENDATA_DATA_UPDATE_DATE_PLACEHOLDER: '12/09/2015',	
	STREAM_FIELD_METADATA_EXTERNAL_REFERENCE: 'External Reference',
	STREAM_FIELD_ISOPENDATA: 'Is Opendata',
	STREAM_FIELD_ISOPENDATA_TRUE: 'Yes',
	STREAM_FIELD_ISOPENDATA_FALSE: 'No',
	STREAM_FIELD_METADATA_LICENCE_OTHER: 'Other',
	STREAM_FIELD_METADATA_LICENSE: 'License',
	STREAM_FIELD_METADATA_LICENCE_CCBY: 'CC BY 4.0',
	STREAM_FIELD_METADATA_LICENCE_CC0: 'CC 0 1.0',
		
	STREAM_FIELD_TWT_QUERY: 'Search Query',
	STREAM_FIELD_TWT_GEO: 'Geographic search',
	STREAM_FIELD_TWT_GEO_LON: 'Longitude',
	STREAM_FIELD_TWT_GEO_LAT: 'Latitude',
	STREAM_FIELD_TWT_GEO_RADIUS: 'Radius',
	STREAM_FIELD_TWT_GEO_UNIT: 'Unit of measure',
	STREAM_FIELD_TWT_LANG: 'Language',
	STREAM_FIELD_TWT_RATE: 'Percentage Search',

	STREAM_FIELD_METADATA_DCAT_NOMEORG: 'Organizzation Name',
	STREAM_FIELD_METADATA_DCAT_NOMEORG_PLACEHOLDER: 'e.g. CSI PIEMONTE',
	STREAM_FIELD_METADATA_DCAT_EMAILORG: 'Organizzation email',
	STREAM_FIELD_METADATA_DCAT_EMAILORG_PLACEHOLDER: 'e.g. info@csi.it',
	STREAM_FIELD_METADATA_DCAT_TELORG: 'Organizzation tel',
	STREAM_FIELD_METADATA_DCAT_TELORG_PLACEHOLDER: 'e.g. 01994120339',
	STREAM_FIELD_METADATA_DCAT_URLORG: 'Organizzation url',
	STREAM_FIELD_METADATA_DCAT_URLORG_PLACEHOLDER: 'e.g. www.csi.it',
	STREAM_FIELD_METADATA_DCAT_CREATORNAME: 'Creator Name',
	STREAM_FIELD_METADATA_DCAT_CREATORNAME_PLACEHOLDER: 'es. Regione Piemonte',
	STREAM_FIELD_METADATA_DCAT_CREATORTYPE: 'Creator Type',
	STREAM_FIELD_METADATA_DCAT_CREATORTYPE_PLACEHOLDER: 'es. http://purl.org/adms/publishertype/Company',
	STREAM_FIELD_METADATA_DCAT_CREATORID: 'Creator Identifier',
	STREAM_FIELD_METADATA_DCAT_CREATORID_PLACEHOLDER: 'es. 80087670016',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERNAME: 'RightHolder Name',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERNAME_PLACEHOLDER: 'es. Tizio Sempronio',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERTYPE: 'RightHolder Type',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERTYPE_PLACEHOLDER: 'es. http://purl.org/adms/publishertype/Company',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERID: 'RightHolder Identifier',
	STREAM_FIELD_METADATA_DCAT_RIGHTHOLDERID_PLACEHOLDER: 'eg. 80087670016',

	STREAM_INPUT_FIELDS: 'Stream in Input Definition',
	STREAM_NEW_DEFINITION: 'Smart Object ',
	STREAM_AGGREGATE_DEFINITION: 'Internal Streams ',
	STREAM_TYPE_DEFINITION: 'Creation from ',
	STREAM_FIELDSET: 'Internal Stream Definition',
	STREAM_FIELD_COMPONENTS_OUTPUT: 'Components of the stream in output',
	STREAM_INTERNAL_SELECTED_STREAM: 'Selected Stream',
	
	STREAM_SIDDHI_QUERY_SUCCESS: "The query siddhi is valid.",
	STREAM_SIDDHI_QUERY: "SIDDHI query ",
	STREAM_SIDDHI_QUERY_DEFAULT:"Default added in the end:",
	STREAM_SIDDHI_VALIDATE_BUTTON:'Validate',
	STREAM_SIDDHI_PLEASE_VALIDATE:'Please validate Query before saving stream!',
	STREAM_SIDDHI_PLEASE_OUTPUTSTREAM:'Please insert "outputStream" case sensitive in the query.',
	STREAM_SIDDHI_INSERT_COMPONENT:"Before validation it is necessary to add the components to the stream",

	/* Stream placeholder */
	STREAM_FIELD_CODE_PLACEHOLDER : 'e.g. temperature',
	STREAM_FIELD_NAME_PLACEHOLDER : 'e.g. dinner room temperature',
	STREAM_FIELD_SLUG_PLACEHOLDER : 'Enter the name and then click here, the sistem will create a valid code, editable.',
	STREAM_FIELD_COMPONENTS_ID_PLACEHOLDER: 'e.g. 1.4',
	STREAM_FIELD_COMPONENTS_NAME_PLACEHOLDER: 'e.g. wind',
	STREAM_FIELD_COMPONENTS_TOLERANCE_PLACEHOLDER: 'e.g. 12',
	
	STREAM_FIELD_TWT_QUERY_PLACEHOLDER: 'eg. water', 
	
	/* Stream List */
	STREAM_LIST_TENANT_FILTER : 'Filter by tenant',
	STREAM_LIST_NAME_FILTER : 'Filter by name',
	STREAM_LIST_CODE_FILTER : 'Filter by code',
	STREAM_LIST_STATUS_FILTER : 'Filter by status',
	STREAM_LIST_LASTUPDATE_FILTER : 'Filter by lastupdate',
	STREAM_LIST_DOMAIN_FILTER: 'Filter by domain',
	
	/* Creator of Stream */
	USER_APPLICANT:'Applicant',
	USER_FIELD_NAME:'Username',
	USER_FIELD_SURNAME:'Surname',
	USER_FIELD_EMAIL : 'Email',
	USER_FIELD_ACCEPT:'Terms',
	USER_FIELD_PRIVACY: 'Privacy',
	USER_FIELD_RESPONSABILITY: 'Responsability',
	USER_FIELD_ACCEPT_YES:'I Accept ',
	USER_FIELD_ACCEPT_NO:"I Don't Accept ",
	
	//USER_FIELD_ACCEPT_PRIVACY:'Dopo aver preso visione dell\'informativa sulla Privacy ai sensi dell\'art. 13 del D.Lgs 196/2013, autorizzo il CSI Piemonte al trattamento dei dati personali qui inseriti con le modalit&agrave; e per le finalit&agrave; in essa contenute',
	USER_FIELD_ACCEPT_PRIVACY:'<p><strong>INFORMATIVA PRIVACY AI SENSI DELL\'ART. 13 DEL D.LGS. 196/2003</strong></p> '+
	'<p>Il trattamento dei dati personali forniti dall\'Utente con la compilazione del form e con l\'utilizzo della piattaforma Smart Data Platform e dei servizi dalla medesima ospitati (log di sistema)  &egrave; disciplinato dal D. Lgs. n. 196/2003 (Codice in materia di protezione dei dati personali) e s.m.i.</p> '+
	'<p>Ai sensi dell\'art. 13 del D.Lgs. 196/2003, la Regione Piemonte informa pertanto, di quanto segue:</p> '+
	'<ol type=\'a\'> '+
	'<li>i dati saranno trattati, in base a principi di correttezza, liceit&agrave; e trasparenza, al solo fine di poter espletare tutte le attivit&agrave; amministrative e tecniche necessarie alla registrazione e conseguente suo accesso, come utente,  alla Piattaforma SDP e ai servizi ivi ospitati a cui la sua persona verr&agrave; abilitata (secondo quanto stabilito dalle Condizioni d\'uso);</li> '+
	'<li>il conferimento dei dati ed il consenso al trattamento sono liberi e facoltativi. Tuttavia l\'eventuale rifiuto comporter&agrave; l\'impossibilit&agrave; per CSI Piemonte, ente strumentale per l\'informatica di Regione, nonch&eacute; Responsabile  del trattamento ai sensi dell\'art. 29 del D. Lgs. 196/03 e s.m.i su nomina di Regione stessa, di raggiungere la finalit&agrave; suindicata;</li> '+
	'<li>i dati saranno trattati sia con sistemi automatizzati sia manualmente, e, in ogni caso, a tutela e garanzia della riservatezza dei dati forniti in modo da ridurre al minimo la soglia di rischio di accessi abusivi, furti o manomissioni dei dati stessi, in conformit&agrave; a quanto previsto dagli artt. 31 ss del D.Lgs. n. 196/2003 e s.m.i. e dall\'Allegato B allo stesso decreto;</li> '+
	'<li>i dati saranno trattati da personale &quot; Incaricato&quot;  ai sensi dell\'art. 4, comma 1, lett. h) del Codice Privacy previa adeguate istruzioni operative, per il tempo strettamente necessario al raggiungimento delle finalit&agrave; suindicate;</li> '+
	'<li>i dati non saranno oggetto di comunicazione a terzi e diffusione, fatti salvi gli obblighi di legge nazionale e comunitaria e/o richieste da parte dell\'autorit&agrave; giudiziaria;</li> '+
	'<li>il Titolare del trattamento &egrave; Regione Piemonte, con sede in Torino, Piazza Castello n. 165 Torino;</li> '+
	'<li>il Responsabile del trattamento dei dati personali &egrave; il CSI-Piemonte.</li> '+
	'</ol>'+
	'<p>In relazione al trattamento dei dati che lo riguardano l\'interessato ha diritto ad ottenere le informazioni previste dall\'articolo 7 del decreto in oggetto. Potr&agrave; avvalersi dei diritti di cui all\'art. 7 del D.Lgs. n. 196/2003 e s.m.i. (tra cui quelli di ottenere dal Titolare, anche per il tramite dei Responsabili o degli Incaricati, la conferma dell\'esistenza o meno dei suoi dati personali e la loro messa a disposizione in forma intelligibile; di avere conoscenza della logica e delle finalit&agrave; su cui si basa il trattamento; di ottenere la cancellazione, la trasformazione in forma anonima o il blocco dei dati trattati in violazione di legge, nonch&eacute; l\'aggiornamento, la rettificazione o, se vi &egrave; interesse, l\'integrazione dei dati; di opporsi per motivi legittimi al trattamento stesso) rivolgendosi al CSI- Piemonte Corso Unione Sovietica 216 Torino; e-mail: privacy@csi.it, tel. 011-3168111.</p> ',	
	USER_FIELD_ACCEPT_STREAM_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera titolarit&agrave; e/o  disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle &quot;Linee guida per l\'integrazione in Smart Data Net&quot; , dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione, a titolo gratuito e senza nulla pretendere, degli altri fruitori della piattaforma e, nei termini stabiliti dall\'art. 12 delle Condizioni d\'uso,  di Regione Piemonte lo stream conferito- nonch&eacute; sue eventuali elaborazioni - senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',
	USER_FIELD_ACCEPT_DATASET_RESPONSABILITY:'Dichiaro, consapevole di essere l\'unico soggetto che risponder&agrave; di eventuali contestazioni o richieste di risarcimento danni da parte di terzi per violazione di un qualche diritto o autorizzazione, che i dati e le informazioni da me trattati e conferiti alla piattaforma sono tutti nella mia piena e libera titolarit&agrave; e/o  disponibilit&agrave;. Avvalendomi della facolt&agrave; sancita dalle &quot;Linee guida per l\'integrazione in Smart Data Net&quot; , dichiaro altres&igrave; la disponibilit&agrave; a mettere a disposizione, a titolo gratuito e senza nulla pretendere, degli altri fruitori della piattaforma e, nei termini stabiliti dall\'art. 12 delle Condizioni d\'uso,  di Regione Piemonte lo stream conferito- nonch&eacute; sue eventuali elaborazioni - senza che ci&ograve; violi diritti di terze parti e con licenze conformi a quanto consigliato dalle linee guida stesse.',

	/* Creator of Stream PlaceHolder */
	USER_FIELD_NAME_PLACEHOLDER:'Your name',
	USER_FIELD_SURNAME_PLACEHOLDER:'Your surname',
	USER_FIELD_EMAIL_PLACEHOLDER : 'Your@Email',

	/* Virtual Entity */
	VIRTUALENTITY_FIELD_ID: 'ID Smart Object',
	VIRTUALENTITY_FIELD_CODE: 'Code',
	VIRTUALENTITY_SLUG: 'Slug',
	VIRTUALENTITY_FIELD_ID_TENANT : 'Id tenant',
	VIRTUALENTITY_FIELD_TENANT_CODE:"Tenant Code",
	VIRTUALENTITY_FIELD_TYPE : 'Type',
	VIRTUALENTITY_FIELD_CATEGORY: 'Category',
	VIRTUALENTITY_FIELD_NAME: 'Name',
	VIRTUALENTITY_FIELD_DESCRIPTION: 'Description',
	VIRTUALENTITY_FIELD_CATEGORY_ID: 'ID category',
	VIRTUALENTITY_FIELD_TYPE_ID: 'ID Type',
	VIRTUALENTITY_FIELD_STREAMS_COUNT: 'Number of Streams',
	VIRTUALENTITY_FIELD_STATUS: 'Status',
	/* new */
	VIRTUALENTITY_FIELD_POSITION_TYPE: 'Position',
	VIRTUALENTITY_FIELD_POSITION_TYPE_STATIC: 'Static',
	VIRTUALENTITY_FIELD_POSITION_TYPE_MOBILE: 'Mobile',
	VIRTUALENTITY_FIELD_POSITION: 'Position',
	VIRTUALENTITY_FIELD_LATITUDE: 'Latitude',
	VIRTUALENTITY_FIELD_LONGITUDE: 'Longitude',
	VIRTUALENTITY_FIELD_ELEVATION: 'Elevation', 
	VIRTUALENTITY_FIELD_ESPOSITION: 'Esposition',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR_ADDITIONAL: 'Indoor',
	VIRTUALENTITY_FIELD_ESPOSITION_INDOOR: 'Indoor',
	VIRTUALENTITY_FIELD_ESPOSITION_OUTDOOR: 'Outdoor',
	VIRTUALENTITY_FIELD_INDOOR_BUILDING: 'Building',
	VIRTUALENTITY_FIELD_INDOOR_ROOM: 'Room',
	VIRTUALENTITY_FIELD_INDOOR_FLOOR: 'Floor', 
	VIRTUALENTITY_FIELD_CREATION_DATE: 'Creation Date',
	VIRTUALENTITY_FIELD_MODEL: 'Model',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE: 'Supply',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_AUTO: 'Auto',
	VIRTUALENTITY_FIELD_SUPPLY_TYPE_NETWORK: 'Network',
	VIRTUALENTITY_FIELD_ADMIN_URI: 'Administration URI',
	VIRTUALENTITY_FIELD_SOFTWARE_VERSION: 'Software version',
	VIRTUALENTITY_FIELD_TWITTER_USER_NAME: 'Twitter User',
	VIRTUALENTITY_FIELD_TWITTER_MAX_STREAM: 'Max number of streams', 
	
	/* Dataset */
	DATASET_FIELD_ID: 'ID',
	DATASET_FIELD_VERSION: 'Version',
	DATASET_FIELD_CONFIGDATA_ID: 'Id Dataset',
	DATASET_FIELD_CONFIGDATA_CODE: 'Code',
	DATASET_FIELD_CONFIGDATA_TENANT: 'Tenant',
	DATASET_FIELD_CONFIGDATA_COLLECTION: 'Collection',
	DATASET_FIELD_CONFIGDATA_TYPE: 'Type',
	DATASET_FIELD_CONFIGDATA_SUBTYPE: 'Subtype',
	DATASET_FIELD_CONFIGDATA_DATAVERSION: 'Version',
	DATASET_FIELD_CONFIGDATA_DELETED: 'Uninstalled',
	DATASET_FIELD_METADATA_NAME: 'Name',
	DATASET_FIELD_METADATA_DESCRIPTION: 'Description',
	DATASET_FIELD_METADATA_DISCLAIMER: 'Disclaimer',
	DATASET_FIELD_METADATA_LICENSE: 'License',
	DATASET_FIELD_METADATA_LICENCE_CCBY: 'CC BY 4.0',
	DATASET_FIELD_METADATA_LICENCE_CC0: 'CC 0 1.0',
	DATASET_FIELD_METADATA_LICENCE_OTHER: 'Other',
	DATASET_FIELD_METADATA_COPYRIGHT: 'Copyright',
	DATASET_FIELD_METADATA_VISIBILITY: 'Visibility',
	DATASET_FIELD_METADATA_REGISTRATIONDATE: 'Registration date',
	DATASET_FIELD_METADATA_DATADOMAIN: 'Domain',
	DATASET_FIELD_METADATA_COD_SUB_DATADOMAIN: 'Sub Domain',
	DATASET_FIELD_METADATA_FPS: 'FPS',
	DATASET_FIELD_TENANTSSHARING: 'Share with ',
	DATASET_FIELD_TENANTSSHARED_WITH: 'Shared with ',
	DATASET_FIELD_METADATA_EXTERNAL_REFERENCE: 'External Reference',
		
	DATASET_FIELD_METADATA_STARTINGESTIONDATE: 'Begin upload',
	DATASET_FIELD_METADATA_ENDINGESTIONDATE: 'End upload',
	DATASET_FIELD_METADATA_IMPORTFILETYPE: 'File Type',
	DATASET_FIELD_METADATA_DATASETSTATUS: 'Status',
	DATASET_FIELD_METADATA_TAGS: 'Tag',
	DATASET_FIELD_METADATA_FIELDS: 'Fields',
	DATASET_FIELD_METADATA_FIELD_NAME: 'Name',
	DATASET_FIELD_METADATA_FIELD_ALIAS: 'Alias',
	DATASET_FIELD_METADATA_FIELD_DATATYPE: 'Data type',
	DATASET_FIELD_METADATA_FIELD_DATATYPE_FORMAT: 'Date format', 
	DATASET_FIELD_METADATA_FIELD_SOURCE_COLUMN: 'Source',
	DATASET_FIELD_METADATA_FIELD_SOURCE_COLUMN_HINT: 'Write the column index in the source file',
	DATASET_FIELD_METADATA_FIELD_IS_KEY: 'Key',
	DATASET_FIELD_METADATA_FIELD_UNIT: 'Measurement unit',
	DATASET_FIELD_TENANTSSHARED_WITH: 'Shared with',
	
	DATASET_FIELD_UNPUBLISHED_TRUE: 'Not published',
	DATASET_FIELD_UNPUBLISHED_FALSE: 'Published',
	DATASET_FIELD_UNPUBLISHED_TRUE_HINT: 'Not published on the store',
	DATASET_FIELD_UNPUBLISHED_FALSE_HINT: 'Published on the store',
	
	DATASET_FIELD_METADATA_OPENDATA: 'Opendata',
	DATASET_FIELD_METADATA_OPENDATA_AUTHOR: 'Author',
	DATASET_FIELD_METADATA_OPENDATA_AUTHOR_PLACEHOLDER: 'e.g. Regione Piemonte',
	DATASET_FIELD_METADATA_OPENDATA_LANG_PLACEHOLDER: 'Language of metadata...',
	DATASET_FIELD_METADATA_OPENDATA_DATA_UPDATE_DATE: 'Last update of data',
	DATASET_FIELD_METADATA_OPENDATA_DATA_UPDATE_DATE_PLACEHOLDER: '12/09/2015',
	STREAM_FIELD_METADATA_OPENDATA_DATA_UPDATE_FREQUENCY: 'Update Frequency',
	STREAM_FIELD_METADATA_OPENDATA_UPDATE_FREQUENCY_PLACEHOLDER: 'Indicates the refresh rate...',

	DATASET_FIELD_METADATA_DCAT_NOMEORG: 'Organizzation Name',
	DATASET_FIELD_METADATA_DCAT_NOMEORG_PLACEHOLDER: 'e.g. Regione Piemonte',
	DATASET_FIELD_METADATA_DCAT_EMAILORG: 'Organizzation email',
	DATASET_FIELD_METADATA_DCAT_EMAILORG_PLACEHOLDER: 'e.g. urp@regione.piemonte.it',
	DATASET_FIELD_METADATA_DCAT_TELORG: 'Organizzation tel',
	DATASET_FIELD_METADATA_DCAT_TELORG_PLACEHOLDER: 'e.g. 011.1234567',
	DATASET_FIELD_METADATA_DCAT_URLORG: 'Organizzation url',
	DATASET_FIELD_METADATA_DCAT_URLORG_PLACEHOLDER: 'e.g. www.regione.piemonte.it',
	DATASET_FIELD_METADATA_OPENDATA_LANG: 'Language of metadata card',
	DATASET_FIELD_METADATA_DCAT_CREATORNAME: 'Dataset Creator',
	DATASET_FIELD_METADATA_DCAT_CREATORNAME_PLACEHOLDER: 'es. Tizio Sempronio',
	DATASET_FIELD_METADATA_DCAT_CREATORTYPE: 'Creator Type',
	DATASET_FIELD_METADATA_DCAT_CREATORTYPE_PLACEHOLDER: 'es. http://purl.org/adms/publishertype/Company',
	DATASET_FIELD_METADATA_DCAT_CREATORID: 'Creator Identifier',
	DATASET_FIELD_METADATA_DCAT_CREATORID_PLACEHOLDER: 'es. 80087670016',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERNAME: 'Dataset RightHolder',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERNAME_PLACEHOLDER: 'es. Regione Piemonte',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERTYPE: 'RightHolder Type',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERTYPE_PLACEHOLDER: 'es. http://purl.org/adms/publishertype/Company',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERID: 'RightHolder Identifier',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERID_PLACEHOLDER: 'es. 80087670016',
	
	
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDER: 'Rightholder',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERNAME_SHORT: 'Name',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERID_SHORT: 'Identification',
	DATASET_FIELD_METADATA_DCAT_RIGHTHOLDERTYPE_SHORT: 'Type',

	DATASET_FIELD_METADATA_DCAT_CREATOR: 'Creator',
	DATASET_FIELD_METADATA_DCAT_CREATORNAME_SHORT: 'Name',
	DATASET_FIELD_METADATA_DCAT_CREATORTYPE_SHORT: 'Type',
	DATASET_FIELD_METADATA_DCAT_CREATORID_SHORT: 'Identification',

	DATASET_FIELD_METADATA_DCAT_ORG: 'organization',
	DATASET_FIELD_METADATA_DCAT_NOMEORG_SHORT: 'Name',
	DATASET_FIELD_METADATA_DCAT_EMAILORG_SHORT: 'E-Mail ',
	
	
	DATASET_BINARY_DETAIL_ID: 'Id',
	DATASET_BINARY_DETAIL_FILENAME: 'File',
	DATASET_BINARY_DETAIL_ALIASNAME: 'Alias',
	DATASET_BINARY_DETAIL_SIZE: 'Siz',
	DATASET_BINARY_DETAIL_CONTENTTYPE: 'Content type',
	DATASET_BINARY_DETAIL_PREVIEW: 'Preview',
	DATASET_BINARY_DETAIL_URLDOWNLOAD: 'Download',
	DATASET_BINARY_DETAIL_METADATA: 'Metadata',
	DATASET_BINARY_DETAIL_METADATA_VIEW_BTN: 'View',
	DATASET_BINARY_DETAIL_NOT_FOUND :'No file found',
	
	/* Cookie */
	COOKIE_MESSAGE: 'This site uses cookies to improve the browsing experience. Continuing navigation you accept the use of cookies',
	COOKIE_ACCEPT: 'Accept',
	COOKIE_DECLINE: 'Decline',

	/* Dataset placeholder */
	DATASET_FIELD_NAME_PLACEHOLDER : 'e.g. museum 2014',
	DATASET_FIELD_METADATA_FIELD_IS_KEY_PLACEHOLDER: 'key',
	
	
	/* Stream domains */
	/*AGRICULTURE: 'Agriculture',
	ENERGY: 'Energy',
	ENVIRONMENT: 'Environment',
	HEALTH: 'Health',
	SCHOOL: 'School',
	SECURITY: 'Security',
	TRANSPORT: 'Transport',
	SMART_COMMUNITY: 'Smart Community',
	CULTURE: 'Culture',*/

	/* Stream tags */
	/*AIR: 'Air',
	CARBON: 'Carbon',
	CONSUMPTION: 'Consumption',
	DIOXIDE: 'Dioxide',
	FIRE: 'Fire',
	FOREST: 'Forest',
	GLACIER: 'Glacier',
	INDOOR: 'Indoor',
	LAKE: 'Lake',
	LANDSLIDE: 'Landslide',
	MONOXIDE: 'Monoxide',
	NITROGEN: 'Nitrogen',
	OZONE: 'Ozone',
	POLLUTION: 'Pollution',
	RAIN: 'Rain',
	RIVER: 'River',
	SNOW: 'Snow',
	WATER: 'Water',
	POWDERS: 'Powders',
	QUALITY: 'Quality',
	NOISE: 'Noise',
	OUTDOOR: 'Outdoor',
	PRODUCTION: 'Production',
	STORM: 'Storm',
	GROUND: 'Ground',
	TRAFFIC: 'Traffic',
	WIND: 'Wind',
	SULPHUR: 'Sulphur',
	VINEYARD: 'Vineyard',
	COMFORT: 'Comfort',
	LIGHTNING: 'Lightning',
	PEOPLE: 'People', 
	MONEY: 'Money',
	SEGNALAZIONI: 'Citizen Reports',*/
	
	TELEMEDICINE: 'Telemedicine',
	TELE_REHABILITATION: 'Tele-rehabilitation',
	HOME_CARE: 'Home care',
	REEDUCATION: 'Reeducation',
	PATIENT: 'Patient',
	PHYSIOTHERAPY: 'Physiotherapy',
	
	
	/* Validations */
	VALIDATION_PATTERN_INTEGER_TOOLTIP: 'Only integer number',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Only decimal number',
	VALIDATION_PATTERN_UUID_TOOLTIP: 'The code entered doesn\'t match with the pattern: 8-4-4-4-12 hexadecimal digits',
	VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP: 'The code entered cannot contain white space or * . / # ',
	VALIDATION_PATTERN_MAXLENGTH_TOOLTIP: 'The value is too long',
	VALIDATION_PATTERN_NO_SPACE_TOOLTIP: 'The value cannot contains white spaces',
	VALIDATION_PATTERN_CODE_STREAM_TOOLTIP: 'The code entered cannot contain white space or * . / # - ',
	VALIDATION_PATTERN_FLOAT_TOOLTIP: 'Insert a decimal number using dot as separator',
	VALIDATION_MAX_STREAM_TWITTER_TOOLTIP: 'With this Smart Object is not possible create other streams', 
	
	/* stream status */
	draft:'draft',
    req_inst:'installation in progress',
    inst:'installed',
    req_uninst:'uninstall in progress',
    uninst:'uninstalled and historicized',
	
	/* Virtual Entity List */
	VIRTUALENTITY_LIST_CODE_FILTER: 'Filter by code',
	VIRTUALENTITY_LIST_STATUS_FILTER: 'Filter by status',

	/* Dataset List */
	DATASET_LIST_NAME_FILTER: 'Filter by name',
	DATASET_LIST_DOMAIN_FILTER: 'Filter by domain',
	DATASET_LIST_STATUS_FILTER: 'Filter by status',
	DATASET_LIST_TYPE_FILTER: 'Filter by type/subtype', 
	DATASET_LIST_CODE_FILTER: 'Filter by code', 

	/* header */
	HEADER_DEVELOPER_CENTER_LINK: 'developer center',
	HEADER_MARKET_PLACE_LINK: 'market place',

	/* Home page */
	/*HOME_TOP_HEADER_INTRO: 'A cloud platform to achieve self service application solutions based on Internet of Things and Big Data. Interconnects applications, social networks, systems and objects located throughout. Collects data and information and allows processing and advanced analysis to enable the creation of end-to-end',
	HOME_TITLE: 'Yucca Platform',
	HOME_SUBTITLE: 'Record smart objects and define transmitted streams',
	HOME_INTRO_HTML: 'Information from the world around us and open solutions: these are the distinctive points of the platform made available by Regione Piemonte for Ecosystem Smart Data Net',
	HOME_START_BUTTON_DESC: 'Sign in with your credential', */
	HOME_START_BUTTON: 'Sign in',
	HOME_FORCE_LOGOUT_BUTTON: 'Force Logout',
	HOME_TENANT_TRIAL_BUTTON: 'Request Trial Tenant',
	HOME_TENANT_PERSONAL_BUTTON: 'Request Personal Tenant',
	HOME_START_DEMO_BUTTON_DESC: 'Try the platform using the tenant sandbox',
	HOME_START_DEMO_BUTTON: 'Anonymous access to public data', 
	HOME_LOGGED_IN_WELCOME: 'Welcome, ',
	HOME_LOGGED_NOT_STRONG_AUTHENTICATION: 'Your credentials are not a level SUFFICIENT to access , contact Alla Casella smartdatanet@csi.it',
	HOME_LOGGED_NOT_TENANT_AUTHENTICATION: 'Your credentials are not a level SUFFICIENT to access, contact Alla Casella smartdatanet@csi.it',
	HOME_LOGGED_TECHNICAL_AUTHENTICATION: 'Are you using technical credentials, contact the box smartdatanet@csi.it',
	
	HOME_LOGIN_ENTER_TITLE : 'Do you want to <strong>access</strong> to your workspace or test area?',
	HOME_LOGIN_ENTER_TEXT : 'Use credentials recognized by SistemaPiemonte or ' +
	/*'<i class="fa fa-facebook" aria-hidden="true" title="Facebook"></i> <i class="fa fa-google" aria-hidden="true" title="Google"></i>  <i class="fa fa-yahoo" aria-hidden="true" title="Yahoo!"></i>' +*/
	'<img src="img/icons/fb-art.png" width="25px">  <img src="img/icons/1342004.png" width="25px">   <img src="img/icons/yahoo-icon.png" width="25px"> ' +
	', if you have already requested  personal area',
	HOME_LOGIN_ENTER_BUTTON : 'Sign In',
	HOME_LOGIN_REQUEST_WORKAREA_TITLE : 'Do you want a workspace?',
	HOME_LOGIN_REQUEST_WORKAREA_TEXT : 'You can activate a personal <strong>workspace</strong> using credentials recognized by SistemaPiemonte',
	HOME_LOGIN_REQUEST_WORKAREA_BUTTON : 'Active',
	HOME_LOGIN_REQUEST_TESTAREA_TITLE : 'Do you want a test area?',
	HOME_LOGIN_REQUEST_TESTAREA_TEXT : 'You can activate a <strong>trial period</strong> of 30 days using an account ' +
										/*'<i class="fa fa-facebook" aria-hidden="true" title="Facebook"></i> <i class="fa fa-google" aria-hidden="true" title="Google"></i>  <i class="fa fa-yahoo" aria-hidden="true" title="Yahoo!"></i>' +*/
										'<img src="img/icons/fb-art.png" width="25px">  <img src="img/icons/1342004.png" width="25px">   <img src="img/icons/yahoo-icon.png" width="25px"> ' +
	' or credentials <i>recognized</i> by SistemaPiemonte',
	HOME_LOGIN_REQUEST_TESTAREA_BUTTON : 'Active',
	HOME_LOGIN_REGISTER_TITLE : 'Do you want to request the SistemaPiemonte credentials??',
	HOME_LOGIN_REGISTER_TEXT : 'Register for free',
	HOME_LOGIN_REGISTER_BUTTON : 'Register',
	
	HOME_TITLE_TEXT: '<a href="http://www.smartdatanet.it/yucca.html">USING YUCCA YOU CAN:</a>',
	HOME_REGISTRATION_TEXT: 'If you wish to request the SistemaPiemonte <br> credentials you have to do is follow the link to the registration page <a class=\'\' href="http://www.sistemapiemonte.it/registrazione/index.shtml"> clicking here. </a>',
						
	HOME_SEARCH_TITLE: 'Cerca nei dati presenti in Yucca',
	HOME_SEARCH_TEXT: 'You can search in the <store>store</store> datasets and public stream and try the platform using the sandbox area.',
	HOME_SEARCH_BUTTON: 'Access to public data',
	
	HOME_BOX1_TEXT: 'interconnect applications, social networks, distributed systems, and objects on the territory',
	HOME_BOX2_TEXT: 'collect data and information and allow processing and advanced analysis',
	HOME_BOX3_TEXT: 'provide an integrated map of the Smart Community',
	HOME_BOX4_TEXT: 'enable the creation of end-to-end final solutions',
	
	HOME_START_LOGGED_IN_BUTTON: 'Go to your streams',
	HOME_MAP_INTRO: 'Smart object currently active on the territory',
	HOME_STATISTIC_PANEL_TITLE: 'What can you find in the platform',
	HOME_STATISTIC_TOTAL_MEASURES: 'Available measures',
	HOME_STATISTIC_TOTAL_MEASURES_TIP: 'Total measures available: ',
	HOME_STATISTIC_TOTAL_DATA: 'Available data',
	HOME_STATISTIC_TOTAL_DATA_TIP: 'Total data available: ',
	HOME_STATISTIC_CURRENT_MONTH_DATA: 'Measures this month',
	HOME_STATISTIC_CURRENT_MONTH_DATA_TIP: 'Total  measures recorded this month: ',
	HOME_STATISTIC_TODAY_DATA: 'Measures yesterday',
	HOME_STATISTIC_TODAY_DATA_TIP: 'Total measures recorded yesterday: ',
	HOME_STATISTIC_VIRTUALOBJECT_DATA: 'data from smart objects',
	HOME_STATISTIC_VIRTUALOBJECT_DATA_TIP: 'Total data from Smart Object: ',
	HOME_STATISTIC_TENANT: 'Organizations',	
	HOME_STATISTIC_VIRTUALENTITY: 'Active Smart Objects',	
	HOME_STATISTIC_STREAM: 'Online stream',	
	HOME_OPERATION_PANEL_TITLE:'What can you do with the platform',
	HOME_STATISTIC_LASTUPDATE_INFO: 'Statistics updated on ',
	HOME_ROLE_DEVELOPER: 'developer',
	HOME_ROLE_DEVELOPER_INTRO: 'You can create stream  merging other existing stream',
	HOME_ROLE_PUBLISHER: 'publisher',
	HOME_ROLE_PUBLISHER_INTRO: 'You can create and manage Streams, Smart Object and Dataset',
	HOME_ROLE_SUBSCRIBER: 'subscriber',
	HOME_ROLE_SUBSCRIBER_INTRO: 'You can use the data available in the platform',
	HOME_LOGGED_NOT_STRONG_AUTHENTICATION: 'Your credentials are not of a valid for a standard access, contact the mail smartdatanet@csi.it',

	HOME_ACTION_DEVELOPER_SEP_1: 'or create a new stream',
	HOME_ACTION_PUBLISHER_SEP_1: 'or add directly the objects ',
	HOME_ACTION_SUBSCRIBER_SEP_1: 'Or search stream and dataset in the store',
	
	HOME_ACTION_DASHBOARD: 'Stream Dashboard',
	HOME_ACTION_MANAGEMENT: 'Management',

	HOME_ACTION_NEW_STREAM_INTERNAL: 'Create Streams',
	HOME_ACTION_NEW_VIRTUAL_ENTITY: 'Create Smart Objects',
	HOME_ACTION_NEW_STREAM: 'Create Stream',
	HOME_ACTION_NEW_DATASET: 'Create Dataset',
	HOME_ACTION_SEARCH: 'Search in the Store',
	HOME_ACTION_STORE: 'Go to the store',
	HOME_ACTION_NO_STREAM_UPGRADE: 'To manage <strong>stream</strong> and <strong>smart object</strong> ask for an upgrade of your tenant',
	 
	HOME_TTFORUM_USERFIRSTNAME_PLACEHOLDER: 'Insert your Name',
	HOME_TTFORUM_USERSURNAME_PLACEHOLDER: 'Insert your Surname',
	HOME_TTFORUM_USEREMAIL_PLACEHOLDER: 'Insert yuor email',
	HOME_TTFORUM_USERTYPEAUTH_PLACEHOLDER: 'Insert your authentication type',
	HOME_TTFORUM_TENANTNAME_PLACEHOLDER: 'Insert your Tenant name',
	HOME_TTFORUM_TENANTDESC_PLACEHOLDER: 'Insert the Description of your Tenant', 
	HOME_TTFORUM_TENANTPWD_PLACEHOLDER: 'Insert the Password', 
	HOME_TTFORUM_TENANTECOSYS_PLACEHOLDER: 'Choose the Eco System of your Tenant', 
	HOME_TTFORUM_TENANTORG_PLACEHOLDER: 'Organization', 
	
	HOME_TTFORUM_USERNAME: 'UserName',
	HOME_TTFORUM_USERFIRSTNAME: 'Name',
	HOME_TTFORUM_USERSURNAME: 'Surname',
	HOME_TTFORUM_USEREMAIL: 'E-Mail',
	HOME_TTFORUM_USERTYPEAUTH: 'Authentication type',
	HOME_TTFORUM_TENANTNAME: 'Tenant Name',
	HOME_TTFORUM_TENANTDESC: 'Tenant Description', 
	HOME_TTFORUM_TENANTPWD: 'Password', 
	HOME_TTFORUM_TENANTECOSYS: 'Eco System', 
	HOME_TTFORUM_TENANTORG: 'Organization', 
	
	HOME_TTFORUM_SUBMIT: 'Send',
	HOME_TTFORUM_CANCEL: 'Cancel and close',
	HOME_TTFORUM_CLOSE: 'Close',
	
	HOME_SEARCH_TITLE: 'Discovery data',
	HOME_STORE_TITLE: 'Go to store',
	
	
	HOME_HOWTO_TITLE: 'What can I do with the platform',
	HOME_HOWTO_TEXT_HTML:   '<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/virtualentities/{{tenant}}">Configure</a> your smart object and sends data using your tenant or the demo tenant <strong>Sandbox</strong></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/streams">Consumes</a> all available streams via <strong>WebSocket</strong> or <strong>MQTT</strong></li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/dashboard/main/example">Monitor</a> your streams in the dashboard </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/datasets/sandbox">Import</a> your <strong>bulk dataset </strong> via upload</li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/discovery">Discover and  consume</a> all archived data and dataset via <strong>OData API</strong> </li>' +
							'<li><span class="glyphicon glyphicon-check"></span> &nbsp;<a href="#/management/streams/sandbox">Create derived streams</a> from one or more streams with <strong>custom logic using SiddhiQL</strong></li>' +
							'<li class="mute"><span class="glyphicon glyphicon-unchecked"></span> &nbsp;Create derived streams simply with wizard (coming soon...)</li>',
							

							
	/* Term and conditions */						
							
	TERM_CONDITION_TITLE: 'Terms and conditions',
	TERM_CONDITION_INTRO: 'In order to continue using the Yucca platform you must read and agree to the <strong>Terms and conditions</strong> ',
	TERM_CONDITION_ACCEPT_BUTTON: 'I have read and accept terms and conditions',						
	TERM_CONDITION_CANCEL_BUTTON: 'Cancel',	
							
	/* Dashboard */
	DASHBOARD_TITLE : 'Dashboard streams monitoring',
	
	DASHBOARD_SECTION_OVERVIEW: 'Overview',
	DASHBOARD_SECTION_EXAMPLE: 'Example',
	DASHBOARD_SECTION_TRAFFIC: 'Traffic',
	
	DASHBOARD_SECTION_TENANT_NO_DASHBOARD_ERROR: 'Tenant not configured', 

	DASHBOARD_STREAM_LIST_STREAM_NAME : 'Stream',
	DASHBOARD_STREAM_LIST_VIRTUALENTITY_CODE: 'Smart Object',
	DASHBOARD_STREAM_LIST_TENANT : 'Tenant',
	DASHBOARD_STREAM_LIST_EVENTS : 'Events in the last 30 min.',
	DASHBOARD_STREAM_LIST_REGISTRATION_DATE : 'Registration date',
	DASHBOARD_STREAM_LIST_LASTUPDATE : 'Lastupdate',
	DASHBOARD_STREAM_LIST_STATUS : 'Status',
	
	/* Dashboard home */
	DASHBOARD_DASHBOARD_BUTTON: 'Dashboard',
	DASHBOARD_STREAMS_BUTTON: 'Streams list',
	DASHBOARD_ERROR_LOG_BUTTON: 'Error log', 

	//DASHBOARD_STREAM_TITLE: 'Stream <strong>{{stream_name}}</strong>',
	DASHBOARD_STREAM_TITLE: 'Stream ',
	DASHBOARD_STREAM_DETAIL_TITLE : 'Details',
	DASHBOARD_STREAM_DETAIL_TABLE_KEY : 'Field',
	DASHBOARD_STREAM_DETAIL_TABLE_VALUE : 'Value',
	DASHBOARD_STREAM_DETAIL_OTHER_CONFIUGURATION: 'Other configuration',

	DASHBOARD_STREAM_DATA_CHART_TITLE: 'Last 30 data', 
	
	DASHBOARD_STREAM_DATA_LAST_TWEET_TITLE: 'Last tweet',
	DASHBOARD_STREAM_DATA_TWEET_DETAIL_TITLE: 'Tweet Detail',

	DASHBOARD_STREAM_REALTIME_FPS: 'FPS', 
	DASHBOARD_STREAM_REALTIME_SEC_BTW_EVENTS: 'Sec. between events', 
	DASHBOARD_STREAM_REALTIME_FPM: 'FPM', 
	DASHBOARD_STREAM_REALTIME_MIN_BTW_EVENTS: 'Min. between events', 
	
	
	DASHBOARD_STREAM_DATA_MAX_RESULT_INTERVAL: 'Max number of data to be displayed', 
	DASHBOARD_STREAM_DATA_FILTER_CHART_LABEL: 'Choose the serie to be displayed', 
	DASHBOARD_STREAM_DATA_MAIN_INFO_TITLE: 'Main Information', 
	DASHBOARD_STREAM_DATA_DETAIL_INFO_TITLE: 'Detailed information', 
	DASHBOARD_STREAM_DATA_SHARE_INFO_TITLE: 'Sharing information', 
	DASHBOARD_STREAM_TWITTER_INFO_TITLE: 'Twitter Configuration', 
	DASHBOARD_STREAM_VIEW_ON_TWITTER_BUTTON: 'Look on Twitter', 

	DASHBOARD_STREAM_REALTIME_STATISTIC_TITLE: 'Statistics', 
	
	DASHBOARD_STREAM_WS_URL_TITLE : 'Web Socket Url',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TITLE : 'Number of Events',
	DASHBOARD_STREAM_WS_STATISTICS_CHART_TIME_INTERVAL : 'Time range',
	DASHBOARD_STREAM_WS_STATISTICS_SAMPLING_FREQUENCY: 'Sampling period',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_TIME : 'Time',
	DASHBOARD_STREAM_WS_STATISTICS_TABLE_HEAD_COUNT : 'Events',
	DASHBOARD_STREAM_WS_LASTMESSAGE_PANEL_TITLE : 'Last message received',
	DASHBOARD_STREAM_WS_LASTMESSAGE_NOT_RECEIVED: 'No yet new messages, it is displayed the last recorded (if any)', 
	DASHBOARD_STREAM_WS_LASTERROR_PANEL_TITLE : 'Last errors received',
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
	
	DASHBOARD_ERROR_LIST_CODE : 'Error Code',
	DASHBOARD_ERROR_LIST_NAME : 'Error Name',
	DASHBOARD_ERROR_LIST_TENANT : 'Tenant',
	DASHBOARD_ERROR_LIST_DATE : 'Date',
	

	/* Management */
	MANAGEMENT_TITLE: 'Management',
    MANAGEMENT_MENU_DASHBOARD: 'Dashboard',
    MANAGEMENT_MENU_STREAMS: 'Streams',
    MANAGEMENT_MENU_VIRTUAL_ENTITIES: 'Smart Objects',
    MANAGEMENT_MENU_DATASET: 'Dataset',
	MANAGEMENT_MENU_STREAM_UPGRADE: 'For <strong>stream</strong> and <strong>smart object</strong> ask for an upgrade of your tenant',

    
    MANAGEMENT_SANDBOX_WARNING: 'You are using the demo tenant Sandbox. The data uploaded to this tenant are periodically removed',
    
    MANAGEMENT_DATASET_START_NAME_HINT: 'The <strong>dataset name</strong> will be <strong>used  in the store</strong>',
    MANAGEMENT_DATASET_METADATA_DESCRIPTION_HINT: 'The <strong>dataset description</strong> will be <strong>used  in the store</strong>',
    MANAGEMENT_DATASET_METADATA_MANDATORY_HINT:'Required fields ',
    MANAGEMENT_DATASET_MATADATA_TAG_HINT: 'At least one tag',
    MANAGEMENT_DATASET_MATADATA_DCAT_HINT: 'Metadata DCat AP',
    
    /* Management Stream  */
	MANAGEMENT_DASHBOARD_SUBTITLE: 'Dashboard',
	MANAGEMENT_DASHBOARD_TENANT_PANEL_TITLE: 'Info about tenant',
    /* Management Stream  */
	MANAGEMENT_STREAM_SUBTITLE: 'Streams',

	/* Management Stream List */
	MANAGEMENT_STREAM_LIST_NEW_STREAM: 'New',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM : 'Edit',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM : 'Delete',
	MANAGEMENT_STREAM_LIST_EDIT_STREAM_BUTTON_HINT: 'To enable editing select a single stream',
	MANAGEMENT_STREAM_LIST_DELETE_STREAM_BUTTON_HINT: 'To enable deleting select at least one stream',
	MANAGEMENT_STREAM_LIST_SHOW_UNINSTALLED: 'Uninstalled',
	MANAGEMENT_STREAM_LIST_SHOW_UNINSTALLED_HINT : 'Show Uninstalled',
	
	/* view stream */
	MANAGEMENT_VIEW_STREAM: 'Stream',
	MANAGEMENT_VIEW_STREAM_INSTALL_BUTTON: 'Request Installation',
	MANAGEMENT_VIEW_STREAM_UNINSTALL_BUTTON: 'Request Unistallation',
	MANAGEMENT_VIEW_STREAM_NEWVERSION_BUTTON: 'Create New Version',
	MANAGEMENT_VIEW_STREAM_HISTORICAL_BUTTON: 'Historical',
	MANAGEMENT_VIEW_STREAM_DELETE_BUTTON: 'Delete',
	MANAGEMENT_VIEW_STREAM_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_STREAM_CLONE_BUTTON: 'Clone',
	MANAGEMENT_VIEW_STREAM_LIFECYCLE_OK_INFO: 'Success',
	MANAGEMENT_VIEW_STREAM_DASHBOARD_BUTTON: 'Dashboard',

	/* Management new Stream from Virtual Entity */
	MANAGEMENT_NEW_STREAM_CREATE_BUTTON : 'Create',
	MANAGEMENT_NEW_STREAM_VIRTUALENTITY_PLACEHOLDER : 'Choose one Smart Object',
	MANAGEMENT_NEW_STREAM_SUBTITLE: 'New Stream',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER: 'Register',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR: 'Requestor',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL: 'Detail',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS: 'Components',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_TWEETDATA: 'Twitter',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE: 'Share',
	
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REGISTER_TITLE: 'Register the Stream',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_REQUESTOR_TITLE: 'Insert the requestor information',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_DETAIL_TITLE: 'Insert some details',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_COMPONENTS_TITLE: 'Describe the components',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_TWEETDATA_TITLE: 'Twitter Search Parameters',
	MANAGEMENT_NEW_STREAM_WIZARD_STEP_SHARE_TITLE: 'Define how to share',
	MANAGEMENT_NEW_STREAM_WIZARD_NEXT:'Next',
	
	MANAGEMENT_NEW_STREAM_GEO_COORDINATES: 'Geographic search',
	MANAGEMENT_NEW_STREAM_TWT_RATE_HINT: 'Percentuale del rate di chiamate dello smartobject riservato a questa ricerca',
		
	
	MANAGEMENT_EDIT_STREAM_FROM_VIRTUAL_ENTITY_SUBTITLE: 'Edit ', 
	MANAGEMENT_EDIT_STREAM_TAG_PLACEHOLDER: 'Choose one or more tag...',
	MANAGEMENT_EDIT_STREAM_TAG_TOOLTIP_TITLE: 'Available tags',
	MANAGEMENT_EDIT_STREAM_DOMAIN_PLACEHOLDER: 'Choose one domain...',
	MANAGEMENT_EDIT_STREAM_SUBDOMAIN_PLACEHOLDER: 'Choose one subdomain...',
	MANAGEMENT_EDIT_STREAM_COMPONENT_EXAMPLE_TITLE: 'Example',
	MANAGEMENT_EDIT_STREAM_UNIT_OF_MEASUREMENT_PLACEHOLDER: 'Choose one...',
	MANAGEMENT_EDIT_STREAM_PHENOMENOM_PLACEHOLDER: 'Choose one...',
	MANAGEMENT_EDIT_STREAM_READ_COMPONENT_FROM_STREAM_BUTTON: 'Read from Stream',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA_LABEL: 'Save data',
	MANAGEMENT_EDIT_STREAM_SAVE_DATA: 'Save',
	MANAGEMENT_EDIT_STREAM_DONT_SAVE_DATA: 'Don\'t save',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PUBLIC: 'Public',
	MANAGEMENT_EDIT_STREAM_VISIBILITY_PRIVATE: 'Private',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE_LABEL: 'Publication in the Store',
	MANAGEMENT_EDIT_STREAM_PUBLISH_ON_STORE: 'Published',
	MANAGEMENT_EDIT_STREAM_NOT_PUBLISH_ON_STORE: 'Not Published',
	MANAGEMENT_EDIT_STREAM_SAVE_AS_DRAFT_BUTTON: 'Save as draft',
	MANAGEMENT_EDIT_STREAM_FINISH_BUTTON: 'Finish editing', 
	MANAGEMENT_EDIT_STREAM_ADD_TAG : 'Add tag', 
	MANAGEMENT_EDIT_STREAM_DATA_SAVED_INFO : 'Stream saved',
	MANAGEMENT_EDIT_STREAM_ADD_TENANT_SHARING : 'Add tenant', 
	MANAGEMENT_EDIT_STREAM_TENANT_SHARING_PLACEHOLDER: 'Choose one tenant...',
	MANAGEMENT_EDIT_STREAM_TWITTER_DATA: 'Twitter Data',
	MANAGEMENT_EDIT_STREAM_TWT_QUERY_CHECK: 'Verify query',		
	MANAGEMENT_EDIT_STREAM_TWT_QUERY_CHECK_RESPONSE: 'Verify query',		
	MANAGEMENT_EDIT_STREAM_TWT_QUERY_CHECK_OK_NO_MESSAGE: 'The query is valid, but have not been returned no results',
	MANAGEMENT_EDIT_STREAM_TWT_POLLING_HELP: 'The polling interval depends on the number of streams configurated in the creation of smart objects and the limits imposed by the Twitter API',

	MANAGEMENT_EDIT_STREAM_TENANT_TOOLTIP_TITLE: 'Organizations available',

	MANAGEMENT_EDIT_STREAM_GENERAL_INFO: 'Genearl Info',
	MANAGEMENT_EDIT_STREAM_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_STREAM_LEGAL_INFO: 'Legal Info',
	MANAGEMENT_EDIT_STREAM_SETTINGS: 'Settings',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_DROPAREA: 'Drop here the icon',
	MANAGEMENT_EDIT_STREAM_UPLOAD_ICON_BUTTON_LOAD_FILE: 'Or click here to choose',
	MANAGEMENT_EDIT_STREAM_OPENDATA: 'OPENDATA',
	MANAGEMENT_EDIT_STREAM_OPENDATA_AUTHOR: 'Author',
	MANAGEMENT_EDIT_STREAM_OPENDATA_LANGUAGE: 'Language of metadata',
	MANAGEMENT_EDIT_STREAM_OPENDATA_UPDATE_DATE: 'Last update of data',
	
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TITLE: 'Warning',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_REQUIRED: 'The field \'name\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_UNIQUE: 'The field \'name\' must be unique in a stream',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_INVALID: 'The field \'name\' contains invalid  characters ',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_RESERVED_WORD_TIME:  '\'time\' is a reserved word. Choose a different name ',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TYPE_REQUIRED: 'The field \'data type\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED: 'The field \'tollerance\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_PHENOMENON_REQUIRED: 'The field \'Phenomenon\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED: 'The field \'Tollerance\' is required',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER: 'The field \'tollerance\' must be numeric',
	MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS: 'Isert at least one component',
	MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_NAME_NOSPACE: 'The field \'Name\' cannot contain white space',
	
	MANAGEMENT_EDIT_STREAM_WS_LBL: 'Use the stream in real time with websocket',
	MANAGEMENT_EDIT_STREAM_MQTT_LBL: 'Use the stream in real time with MQTT',
    
	MANAGEMENT_EDIT_STREAM_INTERNAL_STREAM_DRAFT_WARNING: 'The components  of the streams in draft may not match with the installed version',

	/* Management Virtual Entity  */
	MANAGEMENT_VIRTUALENTITY_SUBTITLE: 'Smart Objects',

	/* Management Stream List */
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY : 'Create Smart Object',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_APP : 'App',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_DEVICE : 'Device',
	MANAGEMENT_VIRTUALENTITY_LIST_NEW_VIRTUALENTITY_FEED : 'Feed',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY : 'Edit',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY : 'Delete',
	MANAGEMENT_VIRTUALENTITY_LIST_EDIT_VIRTUALENTITY_BUTTON_HINT: 'To enable editing select a single Smart Object',
	MANAGEMENT_VIRTUALENTITY_LIST_DELETE_VIRTUALENTITY_BUTTON_HINT: 'To enable deleting select at least one Smart Object',
  
	/* Management new Virtual Entity  */
	MANAGEMENT_NEW_VIRTUALENTITY_SUBTITLE: 'Create Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_CREATE_BUTTON: 'Create Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_GENERATE_UUID_BUTTON: 'Generate',	
	MANAGEMENT_NEW_VIRTUALENTITY_TYPE_PLACEHOLDER: 'Choose one...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_PLACEHOLDER: 'Choose one...', 
	MANAGEMENT_NEW_VIRTUALENTITY_CODE_HINT: 'Only for device', 
	MANAGEMENT_NEW_VIRTUALENTITY_CATEGORY_HINT: 'Only for device', 
	MANAGEMENT_NEW_VIRTUALENTITY_AUTH_TWITTER_LOGIN: 'Login Twitter',
	MANAGEMENT_NEW_VIRTUALENTITY_AUTH_TWITTER_LOGOUT: 'Logout',
	MANAGEMENT_NEW_VIRTUALENTITY_AUTH_TWITTER_CHANGE: 'Change Twitter User', 
	MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_NOTLOGGED_ERROR: 'To create a Feed Tweet smart object type you have login to Twitter to specify the Twitter user used',
	
	/* Management edit Virtual Entity  */
	MANAGEMENT_EDIT_VIRTUAL_ENTITY_SUBTITLE: 'Edit ',
	MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO: 'Smart Object Saved',
		
	MANAGEMENT_EDIT_VIRTUALENTITY_GENERAL: 'General Info',
	MANAGEMENT_EDIT_VIRTUALENTITY_COLLOCATION: 'Collocation',
	MANAGEMENT_EDIT_VIRTUALENTITY_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_VIRTUALENTITY_FINISH_BUTTON: 'Finish Editing',
	MANAGEMENT_EDIT_VIRTUALENTITY_SAVE_BUTTON: 'Save',
	
	MANAGEMENT_EDIT_VIRTUALENTITY_REINSTALL_STREAMS: 'Installed Stream',
	MANAGEMENT_EDIT_VIRTUALENTITY_REINSTALL_STREAMS_HELP: 'To activate the change of the user Twitter is necessary to reinstall stream',
	MANAGEMENT_EDIT_VIRTUALENTITY_REINSTALL_STREAMS_NO_STREAMS: 'There are no streams installed related to this Smart Object',

	MANAGEMENT_VIEW_VIRTUALENTITY_HISTORICAL_BUTTON: 'Historical',
	MANAGEMENT_VIEW_VIRTUALENTITY_DELETE_BUTTON: 'Delete',
	MANAGEMENT_VIEW_VIRTUALENTITY_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_VIRTUALENTITY_INSTALL_BUTTON: 'Install',
	
	/* Management dataset */
	MANAGEMENT_DATASET_SUBTITLE: 'Dataset',
	MANAGEMENT_DATASET_LIST_NEW_DATASET: 'Load new Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET_BUTTON_HINT: 'To enable editing select a single Dataset',
	MANAGEMENT_DATASET_LIST_EDIT_DATASET: 'Edit',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET_BUTTON_HINT: 'To enable deleting select at least one Dataset',
	MANAGEMENT_DATASET_LIST_IMPORT_DB: 'Import Metadata',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET_BUTTON_HINT: 'To enable the delete, choose at least one dataset',
	MANAGEMENT_DATASET_LIST_DELETE_DATASET: 'Delete',
	MANAGEMENT_DATASET_LIST_DELETE_DATA_DATASET: 'Data delete',
	MANAGEMENT_DATASET_LIST_SHOW_UNINSTALLED : 'Show Unistalled',
	MANAGEMENT_DATASET_CONFIRM_DELETE: 'You are about to uninstall the selected Dataset(s)! Are you sure?',
	MANAGEMENT_DATASET_MODAL_DELETE_TITLE : 'Erasing the data of the selected DATASET',
	MANAGEMENT_DATASET_MODAL_DELETE_SUBTITLE : 'ARE YOU SURE YOU WANT TO ERASE ALL DATA OF DATASET ?',
	MANAGEMENT_DATASET_MODAL_DELETE_OKMSG : 'Dataset data deleted properly',
	MANAGEMENT_DATASET_MODAL_DELETE_KOMSG : 'It was not possible to delete the dataset data! Try again later',
	
	MANAGEMENT_VIEW_DATASET_EDIT_BUTTON: 'Edit',
	MANAGEMENT_VIEW_DATASET_DOWNLOAD_BUTTON: 'Download',
	MANAGEMENT_VIEW_DATASET_DOWNLOAD_BUTTON: 'Download',
	MANAGEMENT_VIEW_DATASET_ADD_DATA_BUTTON: 'Add more data',
	MANAGEMENT_VIEW_DATASET_DATA_URLS: 'API Data access',
	MANAGEMENT_VIEW_DATASET_DATA_EXPLORER_BUTTON: 'Data explorer',
	MANAGEMENT_VIEW_DATASET_GO_TO_DATASET_CARD: 'Go to Dataset card',
	
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER: 'Register',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION: 'Positions',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL: 'Other info',

	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_REGISTER_TITLE: 'Register the Smart Object',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_POSITION_TITLE: 'Describe the positions',
	MANAGEMENT_NEW_VIRTUALENTITY_WIZARD_STEP_DETAIL_TITLE: 'Fill the additional fields',
	
	MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE: "Error while creation of the Smart Object", 
	MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_ERROR_DETAIL: "Verify that you have not already used this Twitter account. Is possible create a single Smart Object for each Twitter account", 

	MANAGEMENT_NEW_VIRTUALENTITY_SLUG_WARNING: 'The name of the slug is cleared of spaces and special characters automatically before saving',
	MANAGEMENT_NEW_VIRTUALENTITY_SLUG_VALID: 'Slug name ok',

	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_CREATE_BUTTON : 'Create',
	MANAGEMENT_NEW_DATASET_TITLE: 'New Dataset',
	MANAGEMENT_NEW_DATASET_START_SUBTITLE: 'ID',
	MANAGEMENT_NEW_DATASET_CHOOSE_DATASET_TYPE_SUBTITLE: 'Dataset type',
	MANAGEMENT_NEW_DATASET_REQUESTOR_SUBTITLE: 'Requestor',
	MANAGEMENT_NEW_DATASET_METADATA_SUBTITLE: 'Metadata',
	MANAGEMENT_NEW_DATASET_UPLOAD_SUBTITLE: 'File Upload',
	MANAGEMENT_NEW_DATASET_COLUMNS_SUBTITLE: 'Fields',
	MANAGEMENT_NEW_DATASET_DCAT : 'Metadata from standard DCAT-AP_IT - <a href="http://www.dati.gov.it">www.dati.gov.it</a>',
	
	/* Management new Dataset */
	MANAGEMENT_NEW_DATASET_WIZARD_PREV: 'Back', 
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT: 'Next', 
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT_CREATE_COLUMNS: 'Define columns without uploading the file',
	MANAGEMENT_NEW_DATASET_WIZARD_NEXT_IMPORT_COLUMNS: 'Define columns from the file',
	MANAGEMENT_NEW_DATASET_WIZARD_END: 'Create dataset',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_WITH_ATTACH_TITLE: 'With attachment',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_NO_ATTACH_TITLE: 'Without attachment',
	
	MANAGEMENT_NEW_DATASET_CHOOSE_DATASET_TYPE_QUESTION: 'How do you want to create the data set?',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_BINARY: 'Biinary file',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_BINARY_DESC: 'Choose this one if you have movies, pictures or binary files',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_DEFINE_COLUMN: 'Define columns',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_DEFINE_COLUMN_DESC: 'Choose this one to define the structure of the columns in the dataset',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_UPLOAD_FILE: 'Upload csv',
	MANAGEMENT_NEW_DATASET_CHOOSE_FILE_UPLOAD_FILE_DESC: 'Choose this one to define the structure of the columns of the dataset through the upload of a csv file',
	
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_DROPAREA: 'Drop the file to upload ',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_OR: 'Or',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_BUTTON_LOAD_FILE: 'Click here to choose',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_FORMAT: 'Format',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_ENCODING: 'Encoding',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SEPARATOR: 'Separator',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_MAX_SIZE: 'Max file size supported: ',
	MANAGEMENT_NEW_DATASET_FILE_ALREADY_UPLOADED: 'Previously uploaded files',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_TITLE: 'Warning',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_FILE_TOO_BIG: 'The size of the selected file exceeds the quota limit',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_NUM_COLUMN: 'The number of column in the file choosen is different from the number expected. Choose a different file',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SKIP_UPLOAD_INFO: 'If you do not have the file to upload, you can directly define the columns',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_SKIP_UPLOAD_LINK: 'Define columns',
	MANAGEMENT_NEW_DATASET_UPLOAD_FILE_ERROR_FROM_SERVER: 'Could not load data, unexpected error on a server, try clicking on the Add Data',
	
	MANAGEMENT_NEW_DATASET_SKIP_COLUMN_HINT: 'Skip column', 
	MANAGEMENT_NEW_DATASET_MOVE_COLUMN_HINT: 'Change column order',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW: 'Skip first row',
	MANAGEMENT_NEW_DATASET_SKIP_FIRST_ROW_HELP: 'If the first row contain the name of the columns', 
	MANAGEMENT_NEW_DATASET_COLUMNS_TITLE: 'Columns to import',
	MANAGEMENT_NEW_DATASET_COLUMNS_INTRO: 'Choose the columns that you want to import. Is possible to change the order of import', 
	
	MANAGEMENT_NEW_DATASET_ADD_COLUMN_DEFINITION: 'Add column',
	MANAGEMENT_NEW_DATASET_REMOVE_COLUMN_DEFINITION: 'Remove column',

	MANAGEMENT_NEW_DATASET_CREATE_COLUMNS_TITLE: 'Configure colums',
	MANAGEMENT_NEW_DATASET_CREATE_COLUMNS_INTRO: 'Add the columns that will be in the dataset file', 
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME: 'Column name is required',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_NAME_UNIQUE: 'The column name must be unique',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN: 'The column index of the source file is required, and must be numeric',
	MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE: 'The column index of the source file  must be unique',	
	MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN: 'Define at least one column',
	MANAGEMENT_NEW_DATASET_ADD_COLUMN_INPUT_NAME_HINT: 'The name will be cleaned up by spaces and special characters automatically when saving',
	MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE: 'The columns name must be unique',
	MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME: 'The columns name are required, there is some column without name',
	
	
	MANAGEMENT_NEW_DATASET_BINARY_TITLE :'Binary file',
	MANAGEMENT_NEW_DATASET_BINARY_INTRO: 'Define at least one binary file',
	MANAGEMENT_NEW_DATASET_ADD_BINARY_DEFINITION: 'Add file definition',
	MANAGEMENT_NEW_DATASET_REMOVE_BINARY_DEFINITION: 'Remove file definition',
	MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME: 'File name is required',
	MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME_UNIQUE: 'Fine name must be unique',
	MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY: 'Define at least one binary file',
	MANAGEMENT_NEW_DATASET_ADD_BINARY_INPUT_NAME_HINT: 'The name will be cleaned up by spaces and special characters automatically when saving',
	
	/* import database*/
	MANAGEMENT_IMPORT_DATABASE_TITLE: 'Import metadata', 
	MANAGEMENT_IMPORT_DATABASE_STEP_DB_TYPE: 'Database',
	MANAGEMENT_IMPORT_DATABASE_STEP_TABLES: 'Tables',
	MANAGEMENT_IMPORT_DATABASE_STEP_REQUESTOR: 'Requestor',
	MANAGEMENT_IMPORT_DATABASE_STEP_METADATA: 'Metadata',
	MANAGEMENT_IMPORT_DATABASE_STEP_CUSTOMIZE: 'Customize',
	MANAGEMENT_IMPORT_DATABASE_STEP_FINISH: 'Finish',

	MANAGEMENT_IMPORT_DATABASE_STEP_START_INTRO: 'This section allows automatic definition of datasets from a jdbc connection or by  a database creation script',

	MANAGEMENT_IMPORT_DATABASE_STEP_DB_JDBC_INTRO: 'The platform must reach the server on which the database is hosted. <br>Contact  <a href="mailto:smartdatanet@csi.it" target="_blank">smartdatanet@csi.it</a> '+
		' for more information. <strong>No password will be saved on your system.</strong>',

	MANAGEMENT_IMPORT_DATABASE_STEP_DB_SCRIPT_INTRO: 'Be sure that the script is generated by exporting from the database itself and that it is encoded in UTF-8',
	MANAGEMENT_IMPORT_DATABASE_STEP_TABLES_INTRO: 'Choose the tables or views you want to import, for each table will create or update a dataset.<br>The name of the dataset can be customized. '+
	'<br>For previously imported datasets, a new version will be created with updates',

	MANAGEMENT_IMPORT_DATABASE_STEP_METADATA_INTRO: 'Define common metadata for all new datasets. For previously imported datasets are mantained the original metadata (which you can change in the next step in the wizard)',
		
	MANAGEMENT_IMPORT_DATABASE_STEP_CUSTOMIZE_INTRO: 'Customize the metadata of individual datasets, and choose what columns of the tables should be included.<br> '+
			'For existing datasets is possible to include columns that were eventually discarded in previous imports.',


	
	MANAGEMENT_IMPORT_DATABASE_START_SUBTITLE: 'Satabase structure source',
	MANAGEMENT_IMPORT_DATABASE_SOURCE_TYPE_QUESTION: 'From where do we import tables?',
	MANAGEMENT_IMPORT_DATABASE_SOURCE_TYPE_DB_TITLE: 'Database Connection', 
	MANAGEMENT_IMPORT_DATABASE_SOURCE_TYPE_SCRIPT_TITLE: 'Script SQL', 
	MANAGEMENT_IMPORT_DATABASE_SOURCE_DATABASE: 'Connect to Database',
	MANAGEMENT_IMPORT_DATABASE_SOURCE_DATABASE_DESC: 'Choose this if you want to connect directly to the database. You will be asked for the connection parameters',
	MANAGEMENT_IMPORT_DATABASE_SOURCE_SCRIPT: 'Load Script',
	MANAGEMENT_IMPORT_DATABASE_SOURCE_SCRIPT_DESC: 'Choose this if you have a database creation SQL script.',
	
	MANAGEMENT_IMPORT_DATABASE_TABLES_COLUMS: 'Table columns', 
	MANAGEMENT_IMPORT_DATABASE_TABLE_STATUS_new: 'New',
	MANAGEMENT_IMPORT_DATABASE_TABLE_STATUS_existing: 'Existing',
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_ALL: 'Tutte', 
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_NONE: 'Nessuna', 
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_INVERT: 'Invert',
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_NEW: 'New', 
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_EXISTING: 'Existing', 
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_TABLE: 'Tables',
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_VIEW: 'Views',
	MANAGEMENT_IMPORT_DATABASE_TABLES_SELECT_SYNONYM: 'Sysnoyms',
	MANAGEMENT_IMPORT_DATABASE_TABLES_WARNINGS: 'Table errors', 
	MANAGEMENT_IMPORT_DATABASE_TABLE_WARNINGS_TITLE: 'The following errors occurred during loading',

	MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS: 'New',
	MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS_HINT: 'Columns not included in previous imports',
	
	
	
	MANAGEMENT_IMPORT_DATABASE_TABLE_CUSTOMIZED: 'Customized',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_COLUMNS_COLUMN: 'Column',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_COLUMNS_COLUMN_HINT: 'Columns on database',
	
	MANAGEMENT_IMPORT_DATABASE_DATABASE_SUBTITLE: 'Import Configuration',
	MANAGEMENT_IMPORT_DATABASE_FINISH_SUBTITLE: 'Metadata Creation',
	
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_TITLE:'Imports completed',
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_INFO_OK: '{{datasetCreated}} metadata successfully imported ',
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_INFO_CREATED_OK: 'Metadata created: {{datasetCreated}} ',
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_INFO_UPDATED_OK: 'Metadata updated: {{datasetUpdated}} ',
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_INFO_KO: 'Metadata not imported: {{datasetNotCreated}}',
	MANAGEMENT_IMPORT_DATABASE_FINISH_END_IMPORT_INFO_KO_LIST: 'Metadata with errors', 
	MANAGEMENT_IMPORT_DATABASE_FINISH_CREATE_METADATA: 'Creation of Metadata',
	MANAGEMENT_IMPORT_DATABASE_FINISH_BACK_TO_START: 'Create other metadata',
	MANAGEMENT_IMPORT_DATABASE_FINISH_GO_TO_MANAGEMENT: 'Go to your dataset list',
	
	MANAGEMENT_IMPORT_DATABASE_FINISH_START_QUESTION: 'Proceed with loading of {{totalMetadata}} metadata',
	MANAGEMENT_IMPORT_DATABASE_FINISH_START_BTN: 'Load Metadata',
	MANAGEMENT_IMPORT_DATABASE_FINISH_ERROR_SINGLE_TITLE: 'Error while importing metadata of the dataset ' ,
	MANAGEMENT_IMPORT_DATABASE_FINISH_ERROR_SINGLE_CONTINUE: 'Continue loading the remaining metadata',
	MANAGEMENT_IMPORT_DATABASE_FINISH_ERROR_SINGLE_BREAK: 'Stop uploading metadata',
	
	JDBC_PARAM_INTRO: 'Database connections parameters',
	JDBC_PARAM_HOSTNAME: 'Host',
	JDBC_PARAM_HOSTNAME_PLACEHOLDER: 'db.server.it:5123',
	JDBC_PARAM_DBNAME: 'Db Name',
	JDBC_PARAM_DBNAME_PLACEHOLDER: 'db_anagrafiche',
	JDBC_PARAM_USERNAME: 'User',
	JDBC_PARAM_USERNAME_PLACEHOLDER: 'admin',
	JDBC_PARAM_PASSWORD: 'Password',
	JDBC_PARAM_PASSWORD_PLACEHOLDER: 'secret',
	JDBC_PARAM_PASSWORD_HINT: 'Username and password are not saved on Yucca',
	
	MANAGEMENT_IMPORT_DATABASE_ERROR_CONNECTION: "Error connecting to database, check connection parameters, or database type", 

	
	MANAGEMENT_IMPORT_DATABASE_DATABASE_TYPE: 'Database type',
	MANAGEMENT_IMPORT_DATABASE_JDBC_PARAMS_WARNING: 'Enter all connection parameters: url (hostname: port), database instance name, user and password',
	MANAGEMENT_IMPORT_DATABASE_DBTYPE_NULL_WARNING: 'Specify the database type',
	MANAGEMENT_IMPORT_DATABASE_UPLOAD_SOURCEFILE_DROPAREA: 'Drop here the file to upload',
	MANAGEMENT_IMPORT_DATABASE_UPLOAD_SOURCEFILE_OR: 'or',
	MANAGEMENT_IMPORT_DATABASE_UPLOAD_SOURCEFILE_BUTTON: 'Browse',
	MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_TOOBIG_WARNING: 'File too big (max 1Mb)',
	MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_NULL_WARNING: 'Select the database creation script file',

	MANAGEMENT_IMPORT_DATABASE_TABLES_SUBTITLE: 'Choose tables',
	MANAGEMENT_IMPORT_DATABASE_TABLE_PROPERTIES: 'Table proprieties',
	MANAGEMENT_IMPORT_DATABASE_TABLE_PROPERTIES_HINT: 'Metadata new or imported previously, table or view ...',
	MANAGEMENT_IMPORT_DATABASE_TABLE_NAME: 'Table name',
	MANAGEMENT_IMPORT_DATABASE_DATASET_NAME: 'Dataset Name',
	MANAGEMENT_IMPORT_DATABASE_DATASET_DESCRIPTION: 'Dataset Description',
	MANAGEMENT_IMPORT_DATABASE_DATASET_INFO: 'Name, description, external reference',
	MANAGEMENT_IMPORT_DATABASE_DATASET_STORE_PUBLICATION: 'Publishing on the  store',
	MANAGEMENT_IMPORT_DATABASE_DATASET_DOMAIN: 'Domain, subdomain and tag',
	MANAGEMENT_IMPORT_DATABASE_TABLE_COLUMNS: 'Columns', 
	MANAGEMENT_IMPORT_DATABASE_TABLES_ZERO_SELECTED_WARNING: 'Choose at least one table to import',
	
	MANAGEMENT_IMPORT_DATABASE_HIVE_STAGE_AREA_INFO: 'For Yucca Data Lake you do not need to write the connection parameters, all the tables in the stage area of the organization and tenant you are using will be loaded',

	MANAGEMENT_IMPORT_DATABASE_REQUESTOR_SUBTITLE: 'Requestor',
	MANAGEMENT_IMPORT_DATABASE_METADATA_SUBTITLE: 'Metadata',
	
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_SUBTITLE: 'Cusomize datasets',

	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_NAME_DESCRIPTION: 'Name and description',
	//MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_DOMAIN_DESCRIPTION: 'Domain, subdomain and tag',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_PUBLISH_STORE_DESCRIPTION: 'Info for publishing on the store',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_VISIBILITY: 'Visibility',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_VISIBILITY_DESCRIPTION: 'Visibility',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_DCAT: 'DCat',
	MANAGEMENT_IMPORT_DATABASE_CUSTOMIZE_COLUMNS: 'Columns',
	
	MANAGEMENT_IMPORT_DATABASE_TENANT_SHARED: 'Shared with ',
	MANAGEMENT_IMPORT_DATABASE_DCAT_UNEXPECTED: 'DCat AP data is not expected for unpublished datasets',
	MANAGEMENT_IMPORT_DATABASE_DCAT_UNCOMPLETED: 'Some DCat AP values are missing',
	
	
	MANAGEMENT_PANEL_START_HINT_TITLE: 'Choose with care',
	MANAGEMENT_PANEL_METADATA_HINT_TITLE: 'Tips',
	
	/* Management upload dataset*/
	MANAGEMENT_UPLOAD_DATASET_SUBTITLE: 'Load data',
	MANAGEMENT_EDIT_DATASET_SUBTITLE: 'Edit ', 
	MANAGEMENT_EDIT_DATASET_TAG_PLACEHOLDER: 'Choose one or more tag...',
	MANAGEMENT_EDIT_DATASET_UPLOAD_ICON_DROPAREA: 'Drop here the icon',
	MANAGEMENT_EDIT_DATASET_DOMAIN_PLACEHOLDER: 'Choose one domain...',
	MANAGEMENT_EDIT_DATASET_COD_SUB_DOMAIN_PLACEHOLDER: 'Choose one sub-domain...',
	MANAGEMENT_EDIT_DATASET_COD_SUB_DOMAIN_MULTI_VALIDATION: 'The subdomain can not contain spaces',
	MANAGEMENT_EDIT_STREAM_DATATYPE_PLACEHOLDER: 'Choose...',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA_LABEL: 'Save data',
	MANAGEMENT_EDIT_DATASET_SAVE_DATA: 'Save',
	MANAGEMENT_EDIT_DATASET_DONT_SAVE_DATA: 'Don\'t save',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PUBLIC: 'Public',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_PRIVATE: 'Private',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE_LABEL: 'Publication in the Store',
	MANAGEMENT_EDIT_DATASET_PUBLISH_ON_STORE: 'Published',
	MANAGEMENT_EDIT_DATASET_NOT_PUBLISH_ON_STORE: 'Not Published',
	MANAGEMENT_EDIT_DATASET_SAVE_BUTTON: 'Save',
	MANAGEMENT_EDIT_DATASET_FINISH_BUTTON: 'Finish editing', 
	MANAGEMENT_EDIT_DATASET_ADD_TAG : 'Add tag', 
	MANAGEMENT_EDIT_DATASET_DATA_SAVED_INFO : 'Dataset saved',
	MANAGEMENT_EDIT_DATASET_LEGAL_INFO: 'Legal informations', 
	MANAGEMENT_EDIT_DATASET_ADD_TENANT_SHARING : 'Add tenant', 
	MANAGEMENT_EDIT_DATASET_TENANT_SHARING_PLACEHOLDER: 'Choose one tenant...',	
	MANAGEMENT_EDIT_DATASET_DOMAIN_SUBDOMAIN_HINT: 'Domain and subdomain <strong>will no longer be editable</strong>',
	MANAGEMENT_EDIT_DATASET_UNPUBLISHED: 'Publish sullo store',
	MANAGEMENT_EDIT_DATASET_UNPUBLISHED_FLAG: 'Don\'t publish',
	MANAGEMENT_EDIT_DATASET_UNPUBLISHED_FLAG_HINT: '<strong>Unpublished datasets</strong> are not visible in searches',
	MANAGEMENT_EDIT_DATASET_USE_MULTIDOMAIN_FLAG: 'Use special domain <strong>MULTI</strong>',
	MANAGEMENT_EDIT_DATASET_USE_MULTIDOMAIN_FLAG_HINT: 'In the special domain <strong>MULTI</strong> are stored the helper dataset shared between the various domains',
	MANAGEMENT_EDIT_DATASET_USE_MULTIDOMAIN_WARNING: 'Warning, choosing the special domain <strong>MULTI</strong> , you will not be able to publish the dataset in the future',
	MANAGEMENT_EDIT_DATASET_API_URL: 'API Url', 
	MANAGEMENT_EDIT_DATASET_DELETE_RESULT_KO: 'Problems during the unistallation',
	MANAGEMENT_EDIT_DATASET_DELETE_RESULT_OK: 'Unistallation correctly executed',
	
	MANAGEMENT_EDIT_DATASET_GENERAL_INFO: 'Genearl Info',
	MANAGEMENT_EDIT_DATASET_VISIBILITY_AND_SHARING: 'Visibility and sharing', 
	//MANAGEMENT_METADATA_OPENDATA_SOURCEID_HINT: 'Specifying the data source you will be indexed on the portal <a href="http://www.dati.piemonte.it" target="_blank">Dati Piemonte</a>',
	MANAGEMENT_EDIT_DATASET_COLUMNS: 'Define data structure',
	MANAGEMENT_EDIT_DATASET_COLUMNS_HELP: 'In the data structure you can change only the column\'s alias',
	MANAGEMENT_EDIT_DATASET_NEW_COLUMN: 'Add column',

	MANAGEMENT_EDIT_DATASET_OTHER_INFO: 'Additional Info',
	MANAGEMENT_EDIT_DATASET_SETTINGS: 'Settings (coming soon)',
	
	MANAGEMENT_EDIT_DATASET_ERROR_COMPONENT_TITLE: 'Warning',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_REQUIRED: 'The field \'code\' is required',
	MANAGEMENT_EDIT_DATASET_ERROR_COLUMN_CODE_UNIQUE: 'The field \'code\' must be unique in a dataset',
	
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN: 'There are some errors',
	MANAGEMENT_EDIT_DATASET_ERROR_IMPORT_COLUMN_NUM_ERR: 'Number of error\'s',
	
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SUBTITLE: 'Add data',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_FINISH_BUTTON: 'Finish add data',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_UPLOAD_BUTTON: 'Upload',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_UPLOAD_MORE_BUTTON: 'Upload more data',
	MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO: 'Upload data: ', 
	
	MANAGEMENT_EDIT_DATASET_DATA_URLS: 'OData URL format (ref. http://www.odata.org/): ', 
		
	/* Choose tenant temp */
	MANAGEMENT_CHOOSE_TENANT_SUBTITLE: 'Choose tenant',
	MANAGEMENT_CHOOSE_TENANT_WARNING: 'Temporary page awaiting authentication system',
	MANAGEMENT_CHOOSE_TENANT_TITLE: 'Choose one tenant',
	
	/* Discovery */
	DISCOVERY_TITLE: 'Discovery',
	DISCOVERY_FILTER_INTRO: 'Search through  the data stored in Yucca and available in mode Open: real-time data from smart objects on the territory of the Piedmont Region and Open Data',
	DISCOVERY_FILTER_SIMPLESEARCH_LABEL: 'Search',
	DISCOVERY_SIMPLESEARCH_MENU: 'Simple search',
	DISCOVERY_ADVANCEDSEARCH_MENU: 'Advanced search',
	DISCOVERY_FILTER_SIMPLESEARCH_PLACEHOLDER: ' ',
	DISCOVERY_FILTER_SIMPLESEARCH_HELP: 'Search operator enabled <strong>tags</strong>, <strong>licence</strong>, <strong>idDataset</strong>, <strong>tenantCode</strong>, <strong>dataDomain</strong>, <strong>fps</strong> ,<br>'+
	' <strong>datasetName</strong>, <strong>visibility</strong>, <strong>measureUnit</strong> , <strong>smartOCode</strong>, <strong>streamCode</strong>, <strong>streamName</strong>, <strong>streamDescription</strong> to use it <i>operator<strong>:</strong><i>value</i> ',
	DISCOVERY_FILTER_ADVANCED_FILTER_LABEL: 'Filter', 
	
	DISCOVERY_FILTER_ADVANCED_FIELD_PLACEHOLDER: 'Choose one field',
	
	DISCOVERY_RESULTS_SIZE_LABEL: 'Numero di risultati: ',
	DISCOVERY_RESULTS_NO_DATA_FOUND: 'No result found',
	
	DISCOVERY_BACK_FILTER_LABEL: 'Back to search filter',
	DISCOVERY_BACK_RESULT_LABEL: 'Back to result list',
	
	DISCOVERY_RESULTS_TITLE: 'Result',
	DISCOVERY_RESULTS_DETAIL_BUTTON: 'Detail',
	
	DISCOVERY_DETAIL_DATASET_GENERAL_INFO: 'Main info',
	DISCOVERY_DETAIL_DATASET_LEGAL_INFO: 'Legal informations',
	DISCOVERY_DETAIL_DATASET_STREAM_INFO: 'Stream',
	DISCOVERY_DETAIL_DATASET_SMART_OBJECT_INFO: 'Smart Object',
	DISCOVERY_DETAIL_DATASET_COLUMNS: 'Define data structure',
	DISCOVERY_DETAIL_ACCESS_DATA_TITLE: 'Data access', 
	DISCOVERY_DETAIL_ACCESS_DATA_API: 'Url API OData',
	DISCOVERY_DETAIL_ACCESS_DATA_STREAM: 'Url Stream API',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET: 'Real time stream with web socket',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_SERVER_URL_LABEL: 'Server URL',
	DISCOVERY_DETAIL_ACCESS_DATA_WEBSOCKET_TOPIC_LABEL: 'Topic', 
	DISCOVERY_DETAIL_OPEN_DASHBOARD_STREAM: 'Open Dashboard stream', 
	DISCOVERY_DETAIL_DOWNLOAD_CSV: 'Download data csv url', 
		

	/* Discovery fields */
	DISCOVERY_FIELD_TITLE: 'Name',
	DISCOVERY_FIELD_TAG: 'Tag',
	DISCOVERY_FIELD_LICENSE: 'License',
	DISCOVERY_FIELD_TENANT: 'Tenant',
	DISCOVERY_FIELD_FPS: 'FPS',
	DISCOVERY_FIELD_UNIT_OF_MEASUREMENT: 'Unit of Measurement',
	DISCOVERY_FIELD_STCODE:'StreamCode',
	DISCOVERY_FIELD_VE_NAME:'Smart Object Name',
	DISCOVERY_FIELD_VE_CODE:'Smart Object Code',
	
	DISCOVERY_FIELD_STNAME:'StreamName',
	DISCOVERY_FIELD_STDESC:'StreamDescription',
	
	/* data explorer */
	DATA_EXPLORER_DATA_RESULT_EMPTY: 'No data found',
	DATA_EXPLORER_DATA_RESULT_NO_MORE_DATA: 'No more data found',
	DATA_EXPLORER_MORE_DATA_BUTTON: 'More', 
	DATA_EXPLORER_FILTER_PANEL_TITLE: 'Filter',
	DATA_EXPLORER_DETAIL_PANEL_TITLE: 'Detail',
	DATA_EXPLORER_DETAIL_BACK_TO_DATASET_CARD: 'Back to Dataset card',
	DATA_EXPLORER_USED_FILTER: 'Filter', 
	DATA_EXPLORER_TOTAL_FOUND: 'Total', 
	DATA_EXPLORER_FILTER_MENU_BUTTON: 'Filter',
	DATA_EXPLORER_FILTER_PREVIEW_FILTER: 'Selected filter', 
	DATA_EXPLORER_FILTER_PREVIEW_FILTER_NO_FILTER: 'No filter selected', 
	DATA_EXPLORER_FILTER_ADD_FILTER: 'Add Filter',
	DATA_EXPLORER_DETAIL_MENU_BUTTON: 'Detail',
	DATA_EXPLORER_FILTER_APPLY: 'Add',
	DATA_EXPLORER_FILTER_ADD_FILTER_ERROR_MISSING_FIELDS: 'Fill all fields',
	DATA_EXPLORER_QUERY_INPUT: 'Query',
	DATA_EXPLORER_FILTER_QUERY_ODATA_LABEL: 'Used Query OData', 
	DATA_EXPLORER_FILTER_QUERY_ODATA_DOWNLOAD: 'Download the result of this page',
	DATA_EXPLORER_FILTER_DOWNLOAD_CSV_LABEL: 'Download Url for data in csv format',
	//DATA_EXPLORER_FILTER_DOWNLOAD_CSV_HINT: 'Any data loaded in the last 24 hours may not be present',
	DATA_EXPLORER_FILTER_DOWNLOAD_CSV_HINT: 'Download limited to data at the end of the previous day',
	DATA_EXPLORER_BINARY_SHOW_DETAIL: 'Details',
	DATA_EXPLORER_BINARY_HIDE_DETAIL: 'Hide',
	
	DATA_EXPLORER_OPEN_IN_MANAGEMENT_BUTTON: 'Open in management',

	DATA_EXPLORER_SUBSCRIBE_API_BUTTON_HINT: 'Subscribe API',
	DATA_EXPLORER_SUBSCRIBE_API_ODATA_BUTTON: 'Subscribe OData API',
	DATA_EXPLORER_SUBSCRIBE_API_STREAM_BUTTON: 'Subscribe Stream API',
	DATA_EXPLORER_SUBSCRIBE_API_BUTTON: 'Subscribe API',

	DATABROWSER_TITLE: 'Browse data and stream',
	DATABROWSER_CHOOSE_DOMAIN_TITLE: 'Choose one domain',
	DATABROWSER_CHOOSE_TAG_TITLE: 'Choose one or more tags',
	DATABROWSER_RESULTS_DETAIL_HINT: 'Show details',
	DATABROWSER_RESULTS_TITLE: 'Stream and Dataset found',
	DATABROWSER_RESULTS_BACK_BTN: 'New search',
	DATABROWSER_SHOW_GRID: 'Grid', 
	DATABROWSER_SHOW_LIST: 'List', 
	
	DATA_BROWSER_TOTAL_FOUND: 'Total',
	DATA_BROWSER_USED_FILTER: 'Active filter:',
	DATA_BROWSER_FACET_PANEL_TITLE: 'Filter the results',
	DATA_BROWSER_SEARCH_BUTTON: 'Search',
	DATA_BROWSER_SANDBOX_EXCLUDE: 'include the SANDBOX tenant',
	DATA_BROWSER_SEARCH_EXACT: 'Exact search',
	DATABROWSER_EXPAND_FACET_MENU: 'Morehellip;',
	DATABROWSER_COMPACT_FACET_MENU: 'Compact',
	stream: 'Stream',
	dataset: 'Dataset',
	stream_dataset: 'Stream/Dataset',
	
	DATASEARCH_TITLE: 'Find data you need',
	DATASEARCH_DOMAINS_TITLE: 'Data categories',
	DATASEARCH_DOMAINS_SUBTITLE: 'You can search  data starting from the categories in which they are organized',
	DATASEARCH_DOMAINS_TOOLTIP_PREFIX: 'Search ',
	
	DATASEARCHRESULT_NEW_SEARCH: 'New research',
	DATASEARCHRESULT_TOTAL: 'Results',
	DATASEARCHRESULT_QUERY: 'for',
	DATASEARCHRESULT_DASHBOARD_BUTTON: 'Dashboard',
	DATASEARCHRESULT_DATA_EXPLORER_BUTTON: 'Data explorer',
	DATASEARCHRESULT_COMPACT_DESCRIPTION: 'Hide',
	DATASEARCHRESULT_SHOWALL_DESCRIPTION: 'Read all',
	
	DATA_EXPLORER_DETAIL_STREAM_CODE: 'Stream Code',
	DATA_EXPLORER_DETAIL_DATASET_CODE: 'Dataset Code',
	DATA_EXPLORER_DETAIL_GENERAL_INFO: 'Main Info',
	DATA_EXPLORER_DETAIL_COMPONENTS: 'Data Structure Definition',
	
	domainCode: 'Domain',
	subdomainCode: 'Subdomain',
	organizationCode: 'Organizzation',	

	
	FACET_tenantCode: 'Workarea',
	FACET_domainCode: 'Domain',
	FACET_subdomainCode: 'Subdomain',
	FACET_tagCode: 'Tag',
	FACET_visibility: 'Visibility',
	FACET_entityType: 'Type',
	FACET_organizationCode: 'Organizzation',
	'public': 'Pubblic',
	'private': 'Private',
	
	FILTER_tenantCode: 'Workarea',
	FILTER_domainCode: "Domain",
	FILTER_subdomainCode: 'Subdomain',
	FILTER_tagCode: 'Tag',
	FILTER_visibility: 'Visibility;',
	FILTER_entityType: 'Type',
	FILTER_organizationCode: 'Organizzation',	

	FILTER_isSearchExact: 'Exact search',
	FILTER_includeSandbox: 'Include Sandbox',
	
	DATABROWSER_ENTITY: 'Object name',

	DATABROWSER_GO_TO_DOMAIN_BTN: 'Filter by domain per dominio',
	DATABROWSER_GO_TO_TAG_BTN: 'Filter by tag',
	DATABROWSER_GO_TO_RESULTS_BTN: 'Show data',
	
	DATA_EXPLORER_SUBSCRIBE_MODAL_TITLE: 'Subscribe API',
	DATA_EXPLORER_SUBSCRIBE_MODAL_SUBTITLE: 'Choose an application and subscribe API',
	
	APPLICATIONS_NAME: 'Nome',
	APPLICATIONS_DESCRIPTION: 'Descrizione',
	
	DATA_EXPLORER_APPLICATIONS_LIST_TITLE: 'Applications',
	
	DATA_EXPLORER_SUBSCRIBE_NEW_APPLICATION_TITLE: 'Create new  applicazione',
	DATA_EXPLORER_SUBSCRIBE_ADD_SUBSCRIPTION: 'Subscribe',
	DATA_EXPLORER_SUBSCRIBE_REMOVE_SUBSCRIPTION: 'Unsubscribe',
	
	DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_APP: 'Loading application failed',
	DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_SUBSCRIPTIONS: 'Loading subscriptions failed',
	DATA_EXPLORER_SUBSCRIBE_OK_SUBSCRIBE: 'Subscribe successfull',
	DATA_EXPLORER_SUBSCRIBE_ERROR_SUBSCRIBE: 'Subscribe failed',
	DATA_EXPLORER_SUBSCRIBE_OK_UNSUBSCRIBE: 'Unsubscribe successfull',
	DATA_EXPLORER_SUBSCRIBE_ERROR_UNSUBSCRIBE: 'Unsubscribe failed',
	DATA_EXPLORER_SUBSCRIBE_OK_UPDATE_APP: 'Application updated',
	DATA_EXPLORER_SUBSCRIBE_ERROR_UPDATE_APP: 'Application update failed',
	DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP: 'Application created',
	DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP: 'Creating application failed',
	
	DATA_EXPLORER_SUBSCRIBE_CREATE_APP_BTN: 'Create application',
	
	DATA_EXPLORER_SUBSCRIBE_GO_TO_SUBSCRIPTIONS: 'Go to your subscriptions',
	
	/* Subscriptions */
	SUBSCRIPTIONS_TITLE: 'Subscriptions',
	SUBSCRIPTIONS_ACCESS_TOKEN: 'Access token',
	SUBSCRIPTIONS_TOKEN_VALIDITY: 'Validity Token',
	SUBSCRIPTIONS_CONSUMER_KEY: 'Consumer Key',
	SUBSCRIPTIONS_CONSUMER_SECRET: 'Consumer Secret',
	SUBSCRIPTIONS_TOKEN_OPERATION: 'Operation',
	SUBSCRIPTIONS_GENERATE_TOKEN_BTN: 'Generate Token',
	SUBSCRIPTIONS_RE_GENERATE_TOKEN_BTN: 'Re-generate Token',
	SUBSCRIPTIONS_TOKEN_VALID_PLACEHOLDER: 'insert timestamp',
	SUBSCRIPTIONS_ALERT_NO_SUBSCRIPTION: 'NO API SUBSCRIBED TO THIS APPLICATION',
	SUBSCRIPTIONS_API_SUBSCRIBED: 'API subscribed',

	/* Market */
	MARKET_TITLE: 'Market',

	/* Store */
	STORE_TITLE: 'Store',
	
	/* Info */
	INFO_TITLE: 'About userportal', 
	INFO_INTRO: '<p>The <strong>Yucca Platform</strong>is entirely created using <strong>Open Source</strong> technologies</p><p>Source code is available on github <a href="https://github.com/csipiemonte" target="_blank">github.com/csipiemonte</a>',
	INFO_MAIN_FRAMEWORK_TITLE: 'Created with',
	INFO_LIBRARIES_TITLE: 'Presentation and libraries',
	INFO_SOURCE_TOOL_TITLE: 'Source code and build tools',

};
