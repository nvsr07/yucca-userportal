package org.csi.yucca.userportal.userportal.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;

//@WebServlet(description = "Api proxy Servlet", urlPatterns = { "/api/proxy/*" }, asyncSupported = false)
public abstract class ApiProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	static Logger log = Logger.getLogger(ApiProxyServlet.class);

	private static final File FILE_UPLOAD_TEMP_DIRECTORY = new File(System.getProperty("java.io.tmpdir"));
	private static final String STRING_CONTENT_TYPE_HEADER_NAME = "Content-Type";
	private int intMaxFileUploadSize = 5 * 1024 * 1024;

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

		GetMethod getMethod = new GetMethod(createTargetUrlWithParameters(request));
		

		String authorizationHeader = request.getHeader("Authorization");
		if(authorizationHeader!=null)
			getMethod.setRequestHeader("Authorization", authorizationHeader);

		HttpClient httpclient = new HttpClient();
		int result = httpclient.executeMethod(getMethod);
		response.setStatus(result);
		response.setCharacterEncoding(getMethod.getResponseCharSet());
		if(getMethod.getResponseHeader("Content-Type")!=null)
			response.setContentType(getMethod.getResponseHeader("Content-Type").getValue());
		//		for (Header header : getMethod.getResponseHeaders()) {
		//			System.out.println(header.getName() + "-"+header.getValue());
		//		}
		Header contentDisposition = getMethod.getResponseHeader("Content-Disposition");
		if(contentDisposition!=null)
			response.setHeader("Content-Disposition", getMethod.getResponseHeader("Content-Disposition").getValue());

		

		String jsonOut = getMethod.getResponseBodyAsString();
		if (isJSONPRequest(request))
			jsonOut = getCallbackMethod(request) + "(" + jsonOut + ")";
		out.println(jsonOut);
		out.close();
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[ApiProxyServlet::doPost] START");
		try {

			RequestEntity requestBody = null;
			String contentType = request.getContentType();
			String targetUrl = createTargetUrlWithParameters(request);
			PostMethod post = new PostMethod(targetUrl);

			log.debug("[ApiProxyServlet::doPost] - targetUrl: " + targetUrl);

			if (contentType.startsWith("multipart/form-data")) {
				requestBody = handleMultipartPost(request, post.getParams());
			} else {
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
				requestBody = new StringRequestEntity(inBodyRequest.toString(), request.getContentType(), request.getCharacterEncoding());
			}


			post.setRequestEntity(requestBody);
			post.setRequestHeader(STRING_CONTENT_TYPE_HEADER_NAME, requestBody.getContentType());

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

	protected String cleanParameters(Map<String, String[]> parameterMap) throws UnsupportedEncodingException {
		String parametersOut = "?";
		if (parameterMap != null && parameterMap.size() > 0) {
			int i = 0;
			for (String key : parameterMap.keySet()) {
				i++;
				if (!key.trim().equalsIgnoreCase("callback")) {
					parametersOut += key + "=" +  URLEncoder.encode(parameterMap.get(key)[0],"UTF-8").replace("+","%20") ;
					if(i<parameterMap.size()){
						parametersOut +="&";
					}
				}
			}
		}
		if (parametersOut.equals("?"))
			parametersOut = "";

		return parametersOut;
	}

	protected String createTargetUrlWithParameters(HttpServletRequest request) throws IOException {

		//FIXME workaround to force security in the datadiscovery 
		String tenantCode = AuthorizeUtils.getTenantsInSession(request).get(0);
		
		Map<String, String[]> parameterMap =  new HashMap<String, String[]>(request.getParameterMap());
		

		String parameters = cleanParameters(parameterMap);
		String path = request.getRequestURI() + parameters;

		path = path.replaceAll(request.getContextPath() + request.getServletPath(), "");

		return apiBaseUrl + path;

	}

	@SuppressWarnings("unused")
	private void allowClientOrigin(HttpServletResponse response, String clientOrigin, String methods) {
		response.setHeader("Access-Control-Allow-Origin", clientOrigin);
		response.setHeader("Access-Control-Allow-Methods", methods);
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Max-Age", "86400");

	}

	private MultipartRequestEntity handleMultipartPost(HttpServletRequest httpServletRequest, HttpMethodParams params) throws ServletException {
		MultipartRequestEntity multipartRequestEntity = null;
		DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();
		diskFileItemFactory.setSizeThreshold(this.getMaxFileUploadSize());
		diskFileItemFactory.setRepository(FILE_UPLOAD_TEMP_DIRECTORY);
		ServletFileUpload servletFileUpload = new ServletFileUpload(diskFileItemFactory);
		try {
			List<FileItem> listFileItems = servletFileUpload.parseRequest(httpServletRequest);
			List<Part> listParts = new ArrayList<Part>();
			for (FileItem fileItemCurrent : listFileItems) {
				if (fileItemCurrent.isFormField()) {
					String value = "";
					try {
						value = new String (fileItemCurrent.getString().getBytes ("iso-8859-1"), "UTF-8");
					} catch (UnsupportedEncodingException e) {
						value = fileItemCurrent.getString();
						e.printStackTrace();
					}
					StringPart stringPart = new StringPart(fileItemCurrent.getFieldName(), value,"UTF-8");
					listParts.add(stringPart);
				} else {
					FilePart filePart = new FilePart(fileItemCurrent.getFieldName(), new ByteArrayPartSource(fileItemCurrent.getName(), fileItemCurrent.get()));
					listParts.add(filePart);
				}
			}

			multipartRequestEntity = new MultipartRequestEntity(listParts.toArray(new Part[] {}), params);
		} catch (FileUploadException fileUploadException) {
			throw new ServletException(fileUploadException);
		}
		return multipartRequestEntity;
	}

	private int getMaxFileUploadSize() {
		return this.intMaxFileUploadSize;
	}
}
