package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.csi.yucca.userportal.userportal.utils.Config;

@WebServlet(description = "Api proxy Servlet  for resources", urlPatterns = { "/api/proxy/resources/*" }, asyncSupported = false)
public class ApiResourcesProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		Properties config = Config.loadServerConfiguration();
		String apiBaseUrl = config.getProperty(Config.API_MANAGEMENT_URL_KEY);
		Map<String, String[]> parameterMap = new HashMap<String, String[]>(request.getParameterMap());

		String parameters = "";
		if (parameterMap != null && parameterMap.size() > 0) {
			for (String key : parameterMap.keySet()) {
				if (!key.trim().equalsIgnoreCase("callback")) {
					parameters += key + "=" + URLEncoder.encode(parameterMap.get(key)[0], "UTF-8").replace("[+]", "%2B").replace("+", "%20");
				}
			}
		}

		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");

		String completeUrl = apiBaseUrl + path;

		GetMethod getMethod = new GetMethod(completeUrl);

		String authorizationHeader = request.getHeader("Authorization");
		if (authorizationHeader != null)
			getMethod.setRequestHeader("Authorization", authorizationHeader);

		HttpClient httpclient = new HttpClient();
		int result = httpclient.executeMethod(getMethod);
		response.setStatus(result);
		if (getMethod.getResponseHeader("Content-Type") != null)
			response.setContentType(getMethod.getResponseHeader("Content-Type").getValue());

		Header contentDisposition = getMethod.getResponseHeader("Content-Disposition");
		if (contentDisposition != null)
			response.setHeader("Content-Disposition", getMethod.getResponseHeader("Content-Disposition").getValue());

		ServletOutputStream out = response.getOutputStream();
		InputStream in = getMethod.getResponseBodyAsStream();

		byte[] bytes = new byte[4096];
		int bytesRead;

		while ((bytesRead = in.read(bytes)) != -1) {
			out.write(bytes, 0, bytesRead);
		}

		in.close();
		out.close();

	}

}
