package org.csi.yucca.userportal.userportal.delegate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.apache.log4j.Logger;

public class HttpDelegate {

	static Logger log = Logger.getLogger(HttpDelegate.class);
	
	public static String executeGet(String targetUrl, String contentType, String characterEncoding, Map<String, String> parameters) throws IOException {
		log.debug("[HttpDelegate::executeGet] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executeGet] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			log.debug("[HttpDelegate::executeGet] - targetUrl: " + targetUrl);
			GetMethod get = new GetMethod(targetUrl);
			

			contentType = "application/x-www-form-urlencoded";
			get.setRequestHeader("Content-Type", contentType);

			HttpClient httpclient = new HttpClient();
			try {
				resultCode = httpclient.executeMethod(get);
				log.debug("[HttpDelegate::executeGet] - get result: " + resultCode);
				result = get.getResponseBodyAsString();
			} finally {
				get.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executeGet] END");
		}
		return result;
	}
	
	
	public static String executePost(String targetUrl, String basicUser, String basicPassword, String contentType, String characterEncoding, Map<String, String> parameters, String data) throws Exception {
		log.debug("[HttpDelegate::executePost] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			
			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);
			PostMethod post = new PostMethod(targetUrl);

			RequestEntity requestEntity = new StringRequestEntity(data, contentType, characterEncoding);
			post.setRequestEntity(requestEntity);
			

			post.setRequestHeader("Content-Type", contentType);
			HttpClient httpclient = new HttpClient();

			if(basicUser!=null && basicPassword!=null){
				post.setDoAuthentication( true );
				String userPassowrd  = basicUser + ":" + basicPassword;
				byte[] encoding = Base64.encodeBase64(userPassowrd.getBytes());
				post.setRequestHeader("Authorization", "Basic " + new String(encoding));
				
			}
			
			try {
				resultCode = httpclient.executeMethod(post);
				result = post.getResponseBodyAsString();
				if (resultCode >= 400) {
					log.error("[HttpDelegate::executePost] - post result: " + resultCode);
					log.error(post.getResponseHeaders().toString());
					throw new Exception(result);
				}
				log.debug("[HttpDelegate::executePost] - post result: " + resultCode);
			} finally {
				post.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executePost] END");
		}
		return result;
	}

	
	
	public static String executePost(String targetUrl, String basicUser, String basicPassword, String contentType, String characterEncoding, Map<String, String> parameters,  Map<String, String> postData) throws Exception {
		log.debug("[HttpDelegate::executePost] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executePost] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			
			PostMethod post = new PostMethod(targetUrl);
			log.info("[HttpDelegate::executePost] Posting data: " + postData.size());
			if (postData!=null && !postData.isEmpty())
			{
				List<Part> parts = new ArrayList<Part>();

				Set<Entry<String, String>> entryPost = postData.entrySet();
				
				for (Entry<String, String> entry : entryPost) {
					parts.add(new StringPart(entry.getKey(), entry.getValue()));
					log.info("[HttpDelegate::executePost] adding data: " + entry.getKey()+":"+entry.getValue());
				}
	
					      
				RequestEntity requestEntity = new MultipartRequestEntity(parts.toArray(new Part[]{}),post.getParams());
				post.setRequestEntity(requestEntity);
			
			}
			post.setRequestHeader("Content-Type", contentType);
			HttpClient httpclient = new HttpClient();

			if(basicUser!=null && basicPassword!=null){
				post.setDoAuthentication( true );
				String userPassowrd  = basicUser + ":" + basicPassword;
				byte[] encoding = Base64.encodeBase64(userPassowrd.getBytes());
				post.setRequestHeader("Authorization", "Basic " + new String(encoding));
				
			}
			
			try {
				resultCode = httpclient.executeMethod(post);
				result = post.getResponseBodyAsString();
				if (resultCode >= 400) {
					log.error("[HttpDelegate::executePost] - post result: " + resultCode);
					log.error(post.getResponseHeaders().toString());
					throw new Exception(result);
				}
				log.debug("[HttpDelegate::executePost] - post result: " + resultCode);
			} finally {
				post.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executePost] END");
		}
		return result;
	}
	
	public static String executeDelete(String targetUrl, String contentType, String characterEncoding, Map<String, String> parameters) throws IOException {
		log.debug("[HttpDelegate::executeDelete] START");
		String result = "";
		int resultCode = -1;
		try {

			if (contentType == null)
				contentType = "application/json";
			if (characterEncoding == null)
				characterEncoding = "UTF-8";

			log.debug("[HttpDelegate::executeDelete] - targetUrl: " + targetUrl);

			if (parameters != null) {
				for (String key : parameters.keySet()) {
					targetUrl += key + "=" + parameters.get(key).replaceAll("  ", " ").replaceAll(" ", "%20").
							replaceAll("\\[", "%5B").replaceAll("\\]", "%5D").replaceAll(">", "%3E").replaceAll("<", "%3C") + "&";
				}

			}

			log.debug("[HttpDelegate::executeDelete] - targetUrl: " + targetUrl);
			DeleteMethod delete = new DeleteMethod(targetUrl);
			

			//contentType = "application/x-www-form-urlencoded";
			delete.setRequestHeader("Content-Type", contentType);

			HttpClient httpclient = new HttpClient();
			try {
				resultCode = httpclient.executeMethod(delete);
				log.debug("[HttpDelegate::executeDelete] - delete result: " + resultCode);
				result = delete.getResponseBodyAsString();
			} finally {
				delete.releaseConnection();
			}

		} finally {
			log.debug("[HttpDelegate::executeDelete] END");
		}
		return result;
	}
	

}