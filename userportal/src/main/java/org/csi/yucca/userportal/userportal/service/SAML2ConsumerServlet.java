package org.csi.yucca.userportal.userportal.service;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.User;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.Util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;




import org.opensaml.xml.ConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@WebServlet(name = "AuthorizeServlet", description = "Authorization Servlet", urlPatterns = { "/api/authorize" }, asyncSupported = false)
public class SAML2ConsumerServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private SamlConsumerManager consumer;

	static Logger log = Logger.getLogger(SAML2ConsumerServlet.class);

	public void init(ServletConfig config) throws ServletException {
		try {
			consumer = new SamlConsumerManager(config);
		} catch (ConfigurationException e) {
			throw new ServletException("Errow while configuring SAMLConsumerManager", e);
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[SAML2ConsumerServlet::doPost] - START");
		try {
			String responseMessage = request.getParameter("SAMLResponse");
			log.debug("[SAML2ConsumerServlet::doPost] - responseMessage: " + responseMessage);
			Info info = (Info) request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			if (responseMessage != null) {

				Map<String, String> result = consumer.processResponseMessage(responseMessage);

				User newUser = info.getUser();
				if (result == null) {
					//newUser = AuthorizeUtils.DEFAULT_USER;
					log.debug("[SAML2ConsumerServlet::doPost] - result null");

				} else if (result.size() == 1) {
					log.debug("[SAML2ConsumerServlet::doPost] - result size 1");

					newUser = new User();
					newUser.setLoggedIn(true);
					newUser.setUsername(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_USERNAME)));
					newUser.setTenants(AuthorizeUtils.DEFAULT_TENANT);
					try {
						newUser.setPermissions(loadPermissions(newUser));
					} catch (Exception e) {
						log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
						e.printStackTrace();
					}

					newUser.setToken(getTokenForTenant(newUser));

					log.debug("[SAML2ConsumerServlet::doPost] - result size 1 - username: " + newUser.getUsername() + " | tenant: " + newUser.getTenants());

				} else if (result.size() > 1) {
					log.debug("[SAML2ConsumerServlet::doPost] - result size > 1");
					newUser = new User();
					newUser.setLoggedIn(true);
					newUser.setUsername(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_USERNAME)));
					String organizations  = result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TENANT));

					List<String> tenants  = AuthorizeUtils.DEFAULT_TENANT;
					if(organizations!=null){
						tenants  = Arrays.asList(organizations.split(","));
					}
					newUser.setTenants(tenants);
					newUser.setFirstname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)));
					newUser.setLastname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)));
					newUser.setEmail(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_EMAIL_ADDRESS)));

					log.debug("[SAML2ConsumerServlet::doPost] - result size > 1 - username: " + newUser.getUsername() + " | tenant: " + newUser.getTenants());
					try {
						newUser.setPermissions(loadPermissions(newUser));
					} catch (Exception e) {
						log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
						e.printStackTrace();
					}

					newUser.setToken(getTokenForTenant(newUser));

					for (Object key : result.keySet().toArray()) {
						String value = (String) result.get(key);
						log.debug("[SAML2ConsumerServlet::doPost] - result size > 1 - value: " + value);
					}
				} else {
					// something wrong, re-login
				}

				info.setUser(newUser);
				//info.setTenantCode(newUser.getTenant());

				request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
				String returnPath = request.getContextPath() + "/"
						+ URLDecoder.decode(Util.nvlt(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION)), "UTF-8");
				log.debug("[SAML2ConsumerServlet::doPost] - sendRedirect to " + returnPath);

				response.sendRedirect(returnPath);
			} else {
				try {
					String returnPath = request.getParameter("returnUrl");
					request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION, returnPath);
					//info.setTenantCode(AuthorizeUtils.DEFAULT_TENANT);
					//User defaultUser = AuthorizeUtils.DEFAULT_USER;
					//defaultUser.setPermissions(AuthorizeUtils.DEFAULT_PERMISSIONS);
					//info.setUser(defaultUser);
					//request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
					request.getSession().removeAttribute(AuthorizeUtils.SESSION_KEY_INFO);
					String requestMessage = consumer.buildRequestMessage(request);
					response.sendRedirect(requestMessage + "&issuer=userportal&customCssPath="
							+ URLEncoder.encode(consumer.getIdpLoginPageStylePath(), "UTF-8"));
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		} finally {
			log.debug("[SAML2ConsumerServlet::doPost] - END");
		}
	}
	private String getTokenForTenant(User newUser){

		String apiBaseUrl ="";

		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_SERVICES_URL_KEY);

			if(newUser != null && newUser.getTenants()!=null && newUser.getTenants().size()>0)
				apiBaseUrl+= Config.SECDATA_NEWTOKEN+newUser.getTenants().get(0);
			else
				apiBaseUrl+= Config.SECDATA_NEWTOKEN+"sandbox";


			HttpClient  client = HttpClientBuilder.create().build();
			HttpGet  httpget = new HttpGet(apiBaseUrl);

			HttpResponse r = client.execute(httpget);
			String status = r.getStatusLine().toString();
			System.out.println("status " + status);

			StringBuilder out = new StringBuilder();
			BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
			String line = "";

			while ((line = rd.readLine()) != null) {
				out.append(line);
			}
			
			String	inputJson = out.toString();

			JsonParser parser = new JsonParser();
			JsonObject rootObj = parser.parse(inputJson).getAsJsonObject();

			
			String access_token = rootObj.get("access_token").getAsString();


			System.out.println("TOKEN :: " + access_token);
			
			return access_token;

		} catch (IOException e) {
			log.error("[ApiServiceProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
		return "";
	}

	private List<String> loadPermissions(User newUser) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException,
	SAXException {

		log.debug("[SAML2ConsumerServlet::loadPermissions] - START");
		List<String> permissions = new LinkedList<String>();
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <ser:getAllowedUIResourcesForUser>";
			xmlInput += "         <ser:userName>"+newUser.getUsername()+"</ser:userName>";
			xmlInput += "         <ser:permissionRootPath>permission/Applications/userportal</ser:permissionRootPath>";
			xmlInput += "      </ser:getAllowedUIResourcesForUser>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "getAllowedUIResourcesForUser";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.RBAC_WEBSERVICE_URL_KEY);
			String user = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
			String password = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadPermissions] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			NodeList permissionsNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (permissionsNodeList != null) {
				for (int i = 0; i < permissionsNodeList.getLength(); i++) {

					Node permissionNode = permissionsNodeList.item(i);
					String permission = permissionNode.getTextContent();
					log.debug("[SAML2ConsumerServlet::loadPermissions] - permission: " + permission);
					permissions.add(permission);
				}
			}

		} finally {
			log.debug("[SAML2ConsumerServlet::loadPermissions] - END");
		}
		return permissions;
	}
}
