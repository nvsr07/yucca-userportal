package org.csi.yucca.userportal.userportal.service.i18n;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Locale;
import java.util.Properties;

import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

import org.csi.yucca.userportal.userportal.utils.Config;

import twitter4j.JSONArray;
import twitter4j.JSONException;
import twitter4j.JSONObject;

@WebServlet(description = "Configuration language TAGS for clients", urlPatterns = { "/api/domains" }, initParams = { @WebInitParam(name = "language", value = "it"), }, asyncSupported = true)
public class DomainServiceServlet extends I18nServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected JSONObject loadMessages(Locale currentLocale) throws MalformedURLException {
		InputStream is = null;
		JSONObject json = null;
		try {
			Properties config = Config.loadServerConfiguration();
			String tagsDomainsURL = config.getProperty(Config.TAG_DOMAINS_URL_KEY);
			is = new URL(tagsDomainsURL + "/userportal/api/proxy/services/misc/streamdomains/").openStream();

			BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
			String jsonText = null;
			jsonText = readAll(rd);
			json = new JSONObject(jsonText);

			is.close();
		} catch (JSONException ex) {
			ex.printStackTrace();
		} catch (IOException ex) {
			ex.printStackTrace();
		}

		return json;
	}

	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}

	protected String formatMessages(JSONObject messages, Locale locale) {
		log.debug("[I18nServlet::formatMessages] - START");
		StringBuffer sb = new StringBuffer("");
		String loc = locale.getLanguage().substring(0, 1).toUpperCase() + locale.getLanguage().substring(1);
		try {
			JSONObject streamTags = messages.getJSONObject("streamDomains");
			JSONArray elements = streamTags.getJSONArray("element");
			for(int i = 0 ; i < elements.length() ; i++){
				String tagCode = elements.getJSONObject(i).getString("codDomain");
				String langEl = elements.getJSONObject(i).getString("lang"+loc);
			    sb.append("translations_" + locale.getLanguage() + "[\"" + tagCode + "\"] = \"" + langEl + "\";\n\n");
			}

		} catch (JSONException ex) {
			// TODO Auto-generated catch block
			ex.printStackTrace();
		} finally {
			log.debug("[I18nServlet::formatMessages] - END");
		}
		return sb.toString();
	}

}
