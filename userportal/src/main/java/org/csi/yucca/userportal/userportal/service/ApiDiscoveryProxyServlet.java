package org.csi.yucca.userportal.userportal.service;

import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

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
	
	@Override
	protected String createTargetUrlWithParameters(HttpServletRequest request) throws IOException {

		//TODO workaround to force security in the datadiscovery 
		
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		List<String> tenantCodes = info.getUser().getTenants();
		
		Map<String, String[]> parameterMap =  new HashMap<String, String[]>(request.getParameterMap());
		
			if (parameterMap != null && parameterMap.size() > 0 ) {
				String parametersOut="";
					if (parameterMap.get("$filter")!=null && parameterMap.get("$filter").length!=0) {
						parametersOut =parameterMap.get("$filter")[0];
						parametersOut +=  " and (";
						for(String tenantCode : tenantCodes){
						parametersOut +=  " substringof('"+tenantCode+"',tenantCode) eq true or ";
						}
						parametersOut += "substringof('public',visibility ) eq true)";
					}else{
						parametersOut =  "&$filter=";
						for(String tenantCode : tenantCodes){
							parametersOut +=  " substringof('"+tenantCode+"',tenantCode) eq true or ";
							}
							parametersOut += "substringof('public',visibility ) eq true";
						
//					 parametersOut = "&$filter="+ "substringof('"+tenantCode+"',tenantCode) eq true or substringof('public',visibility ) eq true";
				}
				parameterMap.put("$filter",new String[]{parametersOut});
			}

		String parameters = cleanParameters(parameterMap);
		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");

		return apiBaseUrl + path;

	}

}
