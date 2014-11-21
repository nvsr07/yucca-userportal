package org.csi.yucca.userportal.userportal.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class Config {
	static Logger log = Logger.getLogger(Config.class);

	public static final String API_SERVICES_URL_KEY = "API_SERVICES_URL";
	public static final String API_MANAGEMENT_URL_KEY = "API_MANAGEMENT_URL";
	public static final String API_DISCOVERY_URL_KEY = "API_DISCOVERY_URL";
	
	public static final String API_PROXY_SERVICES_BASE_URL = "/userportal/api/proxy/services/";
	public static final String API_PROXY_MANAGEMENT_BASE_URL = "/userportal/api/proxy/management/";
	public static final String API_PROXY_DISCOVERY_BASE_URL = "/userportal/api/proxy/discovery/";

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
		log.debug("[ClientConfigServlet::loadConfiguration] - START, configPath " + configPath);
		try {
			Properties config = new Properties();
			config.load(Config.class.getClassLoader().getResourceAsStream(configPath));
			return config;
		} finally {
			log.debug("[ClientConfigServlet::loadConfiguration] - END, configPath " + configPath);
		}
	}

}
