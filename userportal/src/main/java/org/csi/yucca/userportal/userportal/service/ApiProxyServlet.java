package org.csi.yucca.userportal.userportal.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.log4j.Logger;

//@WebServlet(description = "Api proxy Servlet", urlPatterns = { "/api/proxy/*" }, asyncSupported = false)
public abstract class ApiProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	static Logger log = Logger.getLogger(ApiProxyServlet.class);

	protected String apiBaseUrl;
	
	@Override
	public void init() throws ServletException {
		super.init();
		setApiBaseUrl();
	}

	protected abstract void setApiBaseUrl();

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();

		URL targetUrl = new URL(createTargetUrlWithParameters(request));

		response.setContentType("application/json; charset=utf-8");
		response.setCharacterEncoding("UTF-8");

		BufferedReader in = new BufferedReader(new InputStreamReader(targetUrl.openStream()));
		StringBuffer jsonBuffer = new StringBuffer("");
		String inputLine;
		while ((inputLine = in.readLine()) != null)
			jsonBuffer.append(inputLine);
		in.close();

		String jsonOut = jsonBuffer.toString();
		if (isJSONPRequest(request))
			jsonOut = getCallbackMethod(request) + "(" + jsonOut + ")";
		out.println(jsonOut);
		out.close();
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[ApiProxyServlet::doPost] START");
		try {
			//allowClientOrigin(response, request.getHeader("origin"), "POST");
			
			StringBuffer inBodyRequest = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = request.getReader();
				while ((line = reader.readLine()) != null) {
					inBodyRequest.append(line);
					log.debug("[ApiProxyServlet::doPost] - request body: " + line);
				}
				reader.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

			String targetUrl = createTargetUrlWithParameters(request);
			PostMethod post = new PostMethod(targetUrl);
			RequestEntity requestBody = new StringRequestEntity(inBodyRequest.toString(), " application/json", request.getCharacterEncoding());
			log.debug("[ApiProxyServlet::doPost] - targetUrl: " + targetUrl);

			post.setRequestEntity(requestBody);
			PrintWriter out = response.getWriter();
			HttpClient httpclient = new HttpClient();
			try {
				int result = httpclient.executeMethod(post);
				log.debug("[ApiProxyServlet::doPost] - post result: " + result);
				response.setStatus(result);
				out.println(post.getResponseBodyAsString());
			} finally {
				post.releaseConnection();
			}

		} catch (IOException e) {
			log.error("[ApiProxyServlet::doPost] ERROR IOException: " + e.getMessage());
			throw e;
		} finally {
			log.debug("[ApiProxyServlet::doPost] END");
		}
	}

	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[ApiProxyServlet::doPut] START");
		try {
			StringBuffer inBodyRequest = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = request.getReader();
				while ((line = reader.readLine()) != null) {
					inBodyRequest.append(line);
					log.debug("[ApiProxyServlet::doPut] - request body: " + line);
				}
				reader.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

			String targetUrl = createTargetUrlWithParameters(request);
			PutMethod put = new PutMethod(targetUrl);
			RequestEntity requestBody = new StringRequestEntity(inBodyRequest.toString(), " application/json", request.getCharacterEncoding());
			log.debug("[ApiProxyServlet::doPut] - targetUrl: " + targetUrl);

			put.setRequestEntity(requestBody);
			PrintWriter out = response.getWriter();
			HttpClient httpclient = new HttpClient();
			try {
				int result = httpclient.executeMethod(put);
				log.debug("[ApiProxyServlet::doPut] - post result: " + result);
				response.setStatus(result);
				out.println(put.getResponseBodyAsString());
			} finally {
				put.releaseConnection();
			}

		} catch (IOException e) {
			log.error("[ApiProxyServlet::doPut] ERROR IOException: " + e.getMessage());
			throw e;
		} finally {
			log.debug("[ApiProxyServlet::doPut] END");
		}
	}

	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		super.doDelete(req, resp);
	}


	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

	private String cleanParameters(Map<String, String[]> parameterMap) {
		String parametersOut = "?";
		if (parameterMap != null && parameterMap.size() > 0) {
			for (String key : parameterMap.keySet()) {
				if (!key.trim().equalsIgnoreCase("callback")) {
					parametersOut += key + "=" + parameterMap.get(key) + "&";
				}
			}
		}
		if (parametersOut.equals("?"))
			parametersOut = "";

		return parametersOut;
	}

	private String createTargetUrlWithParameters(HttpServletRequest request) throws IOException {
		String parameters = cleanParameters(request.getParameterMap());
		//Properties config = Config.loadServerConfiguration();
		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");
		//String apiBaseUrl = config.getProperty(Config.API_SERVICES_URL);

		return apiBaseUrl + path;

	}
	
	@SuppressWarnings("unused")
	private void allowClientOrigin(HttpServletResponse response, String clientOrigin, String methods){
		 response.setHeader("Access-Control-Allow-Origin", clientOrigin);
		 response.setHeader("Access-Control-Allow-Methods", methods);
		 response.setHeader("Access-Control-Allow-Headers",
		 "Content-Type");
		 response.setHeader("Access-Control-Max-Age", "86400");

	}

}
