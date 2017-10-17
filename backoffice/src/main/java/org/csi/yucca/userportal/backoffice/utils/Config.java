package org.csi.yucca.userportal.backoffice.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class Config {
	static Logger log = Logger.getLogger(Config.class);

	public static final String API_SERVICES_URL_KEY = "API_SERVICES_URL";
	public static final String API_MANAGEMENT_URL_KEY = "API_MANAGEMENT_URL";
	//public static final String API_DISCOVERY_URL_KEY = "API_DISCOVERY_URL";
	//apublic static final String API_ODATA_URL_KEY = "API_ODATA_URL";
	public static final String API_FABRIC_URL_KEY = "API_FABRIC_URL";
	public static final String API_DEPLOY_ACTION_URL_KEY = "API_DEPLOY_ACTION_URL";


	public static final String RBAC_PERMISSIONS_WEBSERVICE_URL_KEY = "RBAC_PERMISSIONS_WEBSERVICE_URL";
	public static final String RBAC_ROLES_WEBSERVICE_URL_KEY = "RBAC_ROLES_WEBSERVICE_URL";
	public static final String RBAC_WEBSERVICE_USER_KEY = "RBAC_WEBSERVICE_USER";
	public static final String RBAC_WEBSERVICE_PASSWORD_KEY = "rbac.webservice.secret";

	
	public static final String API_PROXY_SERVICES_BASE_URL = "/backoffice/api/proxy/services/";
	public static final String API_PROXY_MANAGEMENT_BASE_URL = "/backoffice/api/proxy/management/";
	public static final String API_PROXY_DATA_STATISTICS_URL = "/backoffice/api/proxy/management/statistics/";
	public static final String API_PROXY_FABRIC_BASE_URL = "/backoffice/api/proxy/fabric/";
	public static final String API_PROXY_DEPLOY_BASE_URL = "/backoffice/api/proxy/deploy/";
	public static final String  SECDATA_NEWTOKEN = "/secdata/newtoken/";

	public static Properties loadClientConfiguration() throws IOException {
		return loadConfiguration("client.properties");
	}

	public static Properties loadServerConfiguration() throws IOException {
		return loadConfiguration("server.properties");
	}
	
	public static Properties loadAuthorizationConfiguration() throws IOException {
		return loadConfiguration("authorization.properties");
	}
	
	private static Properties loadConfiguration(String configPath) throws IOException {
		log.debug("[Config::loadConfiguration] - START, configPath " + configPath);
		try {
			Properties config = new Properties();
			config.load(Config.class.getClassLoader().getResourceAsStream(configPath));
			return config;
		} finally {
			log.debug("[Config::loadConfiguration] - END, configPath " + configPath);
		}
	}

}
