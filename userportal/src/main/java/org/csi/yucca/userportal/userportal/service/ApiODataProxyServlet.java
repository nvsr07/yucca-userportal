package org.csi.yucca.userportal.userportal.service;

import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/odata/*" }, asyncSupported = false)
public class ApiODataProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_ODATA_URL_KEY);
		} catch (IOException e) {
			log.error("[ApiServiceProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	protected void setOauthTokenInHeader(HttpServletRequest request, GetMethod getMethod) {
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		if (info != null && info.getUser() != null && info.getUser().getToken() != null) {
			getMethod.setRequestHeader("Authorization", "Bearer " + info.getUser().getToken());
		}

	}

	@Override
	protected void beforeExecute(HttpServletRequest request, GetMethod method) {
	}

	@Override
	protected void beforeExecute(HttpServletRequest request, PostMethod method) throws ServletException {
	}

}
