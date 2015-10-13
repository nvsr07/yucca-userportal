package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;

import org.csi.yucca.userportal.userportal.utils.Config;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/store/*" }, asyncSupported = false)
public class StoreProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_STORE_URL_KEY);
		} catch (IOException e) {
			log.error("[StoreProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}
	
}
