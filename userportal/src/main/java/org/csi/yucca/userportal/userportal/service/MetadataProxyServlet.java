package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.methods.GetMethod;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

@WebServlet(description = "Api proxy Servlet  for service", urlPatterns = { "/api/proxy/metadata/*" }, asyncSupported = false)
public class MetadataProxyServlet extends ApiProxyServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void setApiBaseUrl() {
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_METADATA_URL_KEY);
		} catch (IOException e) {
			log.error("[MetadataProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	protected void setOauthTokenInHeader(HttpServletRequest request, GetMethod getMethod) {
		// disalbed 01/06/2017 token added client side
//		Info info  = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
//		if(info!=null && info.getUser()!=null && info.getUser().getToken()!=null){
//			getMethod.setRequestHeader("Authorization", "Bearer "+info.getUser().getToken());
//		}
		
	}
	
}
