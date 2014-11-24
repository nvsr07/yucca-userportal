package org.csi.yucca.userportal.userportal.service;

import org.csi.yucca.userportal.userportal.utils.Config;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/discovery/*" }, asyncSupported = false)
public class ApiDiscoveryProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_DISCOVERY_URL_KEY);
		} catch (IOException e) {
			log.error("[ApiServiceProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

}
