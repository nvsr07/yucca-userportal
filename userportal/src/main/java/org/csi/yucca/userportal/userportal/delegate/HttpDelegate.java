package org.csi.yucca.userportal.userportal.delegate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.http.HttpHeaders;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
//import org.apache.commons.httpclient.HttpClient;
//import org.apache.commons.httpclient.HttpMethod;
//import org.apache.commons.httpclient.UsernamePasswordCredentials;
//import org.apache.commons.httpclient.auth.AuthScope;
//import org.apache.commons.httpclient.methods.GetMethod;
//import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.log4j.Logger;
import org.opensaml.xml.util.Base64;


public class HttpDelegate {

	static Logger log = Logger.getLogger(HttpDelegate.class);

	private static HttpDelegate instance;

	private HttpDelegate() {
	};

	public static HttpDelegate getInstance() {
		if (instance == null)
			instance = new HttpDelegate();
		return instance;
	}

	public String doGet(String targetUrl, String basicUser, String basicPassword, 
						String contentType, String characterEncoding, Map<String, String> parameters) throws Exception {
		return makeCall("GET", targetUrl,   basicUser,  basicPassword, contentType, characterEncoding, parameters,null);
	}

	public String doPost(String targetUrl, String basicUser, String basicPassword,
						String contentType, String characterEncoding, Map<String, String> parameters,
						 Map<String, String> postData) throws Exception {
		return makeCall("POST", targetUrl,   basicUser,  basicPassword, contentType, characterEncoding, parameters, postData);
	}

	private String makeCall(String method, String targetUrl,  String basicUser, String basicPassword,
							String contentType, String characterEncoding, Map<String, String> parameters,
			 				Map<String, String> postData) throws Exception {
		log.debug("[AbstractService::doPost] START");
		String result = "";
		CloseableHttpClient client = null;
		try {

			HttpRequestBase httpRequestBase = prepareCall(method, targetUrl, contentType, characterEncoding, parameters,postData);

			HttpClientBuilder httpClientB =HttpClientBuilder.create();
			// auth
			if (basicUser!=null && basicPassword!=null)
			{
				httpRequestBase.setHeader(HttpHeaders.AUTHORIZATION,"BASIC " + Base64.encodeBytes(new String(basicUser+":"+basicPassword).getBytes()));
			}
			client = httpClientB.build();

			CloseableHttpResponse response = client.execute(httpRequestBase);

			StringBuffer buffer = new StringBuffer();
			BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
			String dataLine = null;
			while ((dataLine = reader.readLine()) != null) {
				buffer.append(dataLine);
			}
			result = buffer.toString();


		} catch (IOException e) {
			log.error("[AbstractService::doPost] ERROR IOException: " + e.getMessage());
			throw new Exception(e);
		} finally {
			if (client!=null)
				client.close();
			log.debug("[AbstractService::doPost] END");
		}
		return result;
	}

	private HttpRequestBase prepareCall(String method, String targetUrl, String contentType, 
										String characterEncoding, Map<String, String> parameters,
										Map<String, String> postData) {

		if (contentType == null)
			contentType = "application/json";
		if (characterEncoding == null)
			characterEncoding = "UTF-8";

		log.debug("[AbstractService::doPost] - targetUrl: " + targetUrl);

		if (parameters != null) {
			for (String key : parameters.keySet()) {
				// targetUrl += key + "=" + parameters.get(key) + "&";
				// post.addParameter(key, parameters.get(key));
				targetUrl += key
						+ "="
						+ parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E")
								.replaceAll("<", "%3C") + "&";

			}
		}

		HttpRequestBase httpRequestBase = new HttpGet(targetUrl);

		// HttpMethod httpMethod = new GetMethod(targetUrl);
		if (method.equals("POST"))
		{
			HttpPost httppost = new HttpPost(targetUrl);
			if (postData!=null) {

				List<BasicNameValuePair> postParameters = new LinkedList<BasicNameValuePair>();
				Set<Entry<String, String>> entryPost = postData.entrySet();
				
				for (Entry<String, String> entry : entryPost) {
					postParameters.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
					log.debug("[HttpDelegate::executePost] adding data: " + entry.getKey()+":"+entry.getValue());
				}
				try {
					httppost.setEntity(new UrlEncodedFormEntity(postParameters, characterEncoding));
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

			httpRequestBase = httppost;
			

		}

		httpRequestBase.setHeader("Content-Type", contentType);

		return httpRequestBase;
	}
}