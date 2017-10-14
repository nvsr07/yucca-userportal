package org.csi.yucca.userportal.userportal.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
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

import org.apache.commons.httpclient.HttpException;
import org.apache.commons.ssl.Base64;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.HttpDelegate;
import org.csi.yucca.userportal.userportal.delegate.HttpDelegate2;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.entity.store.AllSubscriptionsResponse;
import org.csi.yucca.userportal.userportal.entity.store.ApplicationSubscription;
import org.csi.yucca.userportal.userportal.entity.store.GenerateTokenResponse;
import org.csi.yucca.userportal.userportal.entity.store.LoadTokenFromApiResponse;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.Tenant;
import org.csi.yucca.userportal.userportal.info.TenantsContainer;
import org.csi.yucca.userportal.userportal.info.User;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.csi.yucca.userportal.userportal.utils.Util;
import org.opensaml.xml.ConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@WebServlet(name = "AuthorizeServlet", description = "Authorization Servlet", urlPatterns = { "/api/authorize" }, asyncSupported = false)
public class SAML2ConsumerServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private SamlConsumerManager consumer;

	static Logger log = Logger.getLogger(SAML2ConsumerServlet.class);

	// static List<Tenant> allTenants = null;

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
			String newUsername = null;

			List<Tenant> tenants = null;

			List<Tenant> allTenant = getAllTenants(); // call without JWT, needed for sandbox

			if (responseMessage != null) {

				Map<String, String> result = consumer.processResponseMessage(responseMessage);

				User newUser = info.getUser();
				Boolean strongUser = true;
				Boolean tenantUser = true;
				Boolean socialUser = false;
				Boolean tecnicalUser = false;

				// HttpSession sessParam = request.getSession();

				if (result == null) {
					// newUser = AuthorizeUtils.DEFAULT_USER;
					log.info("[SAML2ConsumerServlet::doPost] - result null");
				} else if (result.size() > 0 && checkStrongAuthentication(result)) {
					log.debug("[SAML2ConsumerServlet::doPost] - result size > 1");
					// OBTAIN TOKEN and JWT FROM WSO2 IS (REPLACEBLE WITH CUSTOM LOCAL JWT GENERATION)
					log.info("[SAML2ConsumerServlet::doPost] BEGIN - TOKEN FROM SAML ");
					
					String b64SAMLAssertion = result.get(AuthorizeUtils.ASSERTION_KEY);
					LoadTokenFromApiResponse token =loadTokenFromSaml2(b64SAMLAssertion);
					
					
					
					if (token !=null)
					{
						try {
							String jwt = getJWT(token.getAccess_token());
							log.info("[SAML2ConsumerServlet::doPost] JWT "+jwt);
						} catch (KeyManagementException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (NoSuchAlgorithmException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (ParserConfigurationException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (SAXException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						
					}
					else {
						log.error("[SAML2ConsumerServlet::doPost] END - TOKEN FROM SAML NESSUN TOKEN!!! ");
					}
					
					log.info("[SAML2ConsumerServlet::doPost] END - TOKEN FROM SAML "+token);
					newUser = new User();
					newUser.setLoggedIn(true);
					//
					newUser.setSecretTokenFromSaml(token);
					
					newUsername = result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_USERNAME));
					newUser.setUsername(newUsername);
					List<String> tenantsCode = null;
					try {
						tenantsCode = loadRoles(newUser, "*_subscriber");
					} catch (Exception e) {
						log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
						e.printStackTrace();
					}
					// filtro sui tenant, data di disattivazione
					tenants = filterDisabledTenants(tenantsCode, allTenant);

					// verifichiamo che non sia un utente tecnico
					if (tenants.isEmpty()) {
						tenantUser = false;
						List<String> tenantsCodeForTechincal = null;

						try {
							// the user for each tenant has a role
							// tenantName_subscriber
							tenantsCodeForTechincal = loadRoles(newUser, "mb-topic-*");
						} catch (Exception e) {

							log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
							e.printStackTrace();
						}

						if (!tenantsCodeForTechincal.isEmpty()) {
							tecnicalUser = true;
						}
					}

					if (tenantsCode.isEmpty()) {
						tenantsCode = Arrays.asList(AuthorizeUtils.DEFAULT_TENANT.getTenantCode());
					}

					if (!tecnicalUser) {
						newUser.setTenants(tenants);
						// String regexCFPattern =
						// "^[a-z]{6}[0-9]{2}[a-z][0-9]{2}[a-z][0-9]{3}[a-z]$";
						if (newUsername.contains("_AT_")) {
							socialUser = true;
							// Entro con credenziali social ovvero: Facebook,
							// Google o Yahoo
							String[] emailParts = newUsername.split("_AT_");
							String firstEmailParts = emailParts[0];
							String lastEmailParts = emailParts[1];
							newUser.setEmail(firstEmailParts + "@" + lastEmailParts);
							newUser.setUsername(newUsername);
							// newUser.setUsername(firstEmailParts + "@" +
							// lastEmailParts);
							if (result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)).contains(" ")) {
								// sembrerebbe il caso di Google o Yahoo
								String[] givenNameParts = AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME).split(" ");
								String firstName = givenNameParts[0];
								String lastName = givenNameParts[1];

								newUser.setFirstname(firstName);
								newUser.setLastname(lastName);
							} else {
								// sembrerebbe il caso di Facebook
								newUser.setFirstname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)));
								newUser.setLastname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)));
							}
						} else if (newUsername.contains("tw:")) {
							// Entro con credenziali social ovvero: Twitter
							if (result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)).contains(" ")) {
								String[] givenNameParts = AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME).split(" ");
								String firstName = givenNameParts[0];
								String lastName = givenNameParts[1];

								newUser.setFirstname(firstName);
								newUser.setLastname(lastName);
							} else {
								newUser.setLastname(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME));
							}
						} else {
							// Entro con credenziali non social
							newUser.setFirstname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)));
							newUser.setLastname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)));
							newUser.setEmail(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_EMAIL_ADDRESS)));
						}

						newUser.setAcceptTermConditionTenantsFromString(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS)));

						if (tenants.isEmpty())
							tenants = filterDisabledTenants(Arrays.asList(AuthorizeUtils.DEFAULT_TENANT.getTenantCode()), allTenant);

						newUser.setActiveTenant(tenants.get(0).getTenantCode());

						log.debug("[SAML2ConsumerServlet::doPost] - result size > 1 - username: " + newUser.getUsername() + " | tenant: " + newUser.getTenants());

						try {
							newUser.setPermissions(loadPermissions(newUser));
						} catch (Exception e) {
							log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
							e.printStackTrace();
						}
						// newUser.setActiveTenant(newUser.getTenants().get(0));
						// newUser.setToken(getTokenForTenant(newUser));
						Map<String, String> tokens = new HashMap<String, String>();

						if (newUser != null && newUser.getTenants() != null && newUser.getTenants().size() > 0) {
							newUser.setToken(getTokenForTenant(newUser.getActiveTenant()));
							tokens.put(newUser.getActiveTenant(), newUser.getToken());
						} else {
							newUser.setToken(getTokenForTenant("sandbox"));
							tokens.put("sandbox", newUser.getToken());
						}

						for (Tenant tnt : newUser.getTenants()) {
							if (!tnt.equals(newUser.getActiveTenant())) {
								tokens.put(tnt.getTenantCode(), getTokenForTenant(tnt.getTenantCode()));
							}
						}
						newUser.setTenantsTokens(tokens);

						for (Object key : result.keySet().toArray()) {
							String value = (String) result.get(key);
							log.debug("[SAML2ConsumerServlet::doPost] - result size > 1 - value: " + value);
						}
					}
				} else {
					// something wrong, re-login
					// Add modalview
					// Utente senza strong authentication

					strongUser = false;
					tenantUser = false;
				}

				if ((socialUser) && (newUser.getTenants().isEmpty())) {
					newUser.setTenants(Arrays.asList(AuthorizeUtils.DEFAULT_TENANT));
				}

				if ((newUser.getAcceptTermConditionTenants() == null) || (newUser.getAcceptTermConditionTenants().size() <= 0)) {
					String termAndConditionClaim = null;
					try {
						termAndConditionClaim = loadTermConditionTenantClaim(newUser);
					} catch (Exception e) {
						log.error("[SAML2ConsumerServlet::doPost] - loadTermConditionTenantClaim Error " + e.getMessage());
						e.printStackTrace();
					}

					if (termAndConditionClaim != null)
						newUser.setAcceptTermConditionTenantsFromString(termAndConditionClaim);
				}

				try {
					String storeToken = loadStoreToken(newUser.getUsername());
					newUser.setStoreToken(storeToken);
				} catch (Exception e) {
					log.error("[SAML2ConsumerServlet::doPost] - loadStoreToken Error " + e.getMessage());
					e.printStackTrace();
				}

				info.setUser(newUser);
				// info.setTenantCode(newUser.getTenant());
				info.setPersonalTenantToActivated(filterPersonalTenant(allTenant, newUser.getUsername()));
				info.setTrialTenantToActivated(filterTrialTenant(allTenant, newUser.getUsername()));

				request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
				String returnPath = request.getContextPath() + "/"
						+ URLDecoder.decode(Util.nvlt(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION)), "UTF-8");
				log.debug("[SAML2ConsumerServlet::doPost] - sendRedirect to " + returnPath);

				if (!strongUser) { // Ovvero l'utente non ha credenziali forti
					int found = returnPath.indexOf("?");
					if (found == -1) {
						returnPath += "?strong=false";
					} else {
						returnPath += "&strong=false";
					}
				}

				if (!tenantUser) { // Ovvero l'utente non ha tenant associati!
					int found = returnPath.indexOf("?");
					if (found == -1) {
						returnPath += "?tenant=false";
					} else {
						returnPath += "&tenant=false";
					}
				}

				if (socialUser) { // Ovvero l'utente ha usato credenziali
									// social, strong=false&social=true non può
									// capitare
					int found = returnPath.indexOf("?");
					if (found == -1)
						returnPath += "?social=true";
					else
						returnPath += "&social=true";
				} else {
					int found = returnPath.indexOf("?");
					if (found == -1)
						returnPath += "?social=false";
					else
						returnPath += "&social=false";
				}

				if (tecnicalUser) { // Accesso con credenziali tecniche,
									// mb-topic-*
					request.getSession().invalidate();
					int found = returnPath.indexOf("?");
					if (found != -1)
						returnPath += "&tecnical=true";
				}

				if (strongUser && tenantUser) { // Se hai credenziali strong e
												// hai tenant, non compare la
												// modale!!
					int found = returnPath.indexOf("?");
					if (found == -1) {
						returnPath += "?login=ok";
					} else {
						returnPath += "&login=ok";
					}
				}
				log.debug("[SAML2ConsumerServlet::doPost] - sendRedirect to " + returnPath);
				response.sendRedirect(returnPath);
			} else {
				try {
					String returnPath = request.getParameter("returnUrl");
					String typeAuth = request.getParameter("typeAuth");
					request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION, returnPath);
					// info.setTenantCode(AuthorizeUtils.DEFAULT_TENANT);
					// User defaultUser = AuthorizeUtils.DEFAULT_USER;
					// defaultUser.setPermissions(AuthorizeUtils.DEFAULT_PERMISSIONS);
					// info.setUser(defaultUser);
					// request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO,
					// info);
					request.getSession().removeAttribute(AuthorizeUtils.SESSION_KEY_INFO);
					String requestMessage = consumer.buildRequestMessage(request);
					// response.sendRedirect(requestMessage +
					// "&issuer=userportal&customCssPath=" +
					// URLEncoder.encode(consumer.getIdpLoginPageStylePath(),
					// "UTF-8"));

					String cssPath = consumer.getIdpLoginPageStylePath();
					if (typeAuth != null) {
						cssPath = cssPath.substring(0, cssPath.length() - 4);
						if (typeAuth.equals("personal"))
							cssPath = cssPath + "Personal.css";
						if (typeAuth.equals("trial"))
							cssPath = cssPath + "Trial.css";
						if (typeAuth.equals("work"))
							cssPath = cssPath + "Work.css";
					}
					response.sendRedirect(requestMessage + "&issuer="+consumer.getIssuer()+"&customCssPath=" + URLEncoder.encode(cssPath, "UTF-8"));
				} catch (IOException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} finally {
			log.debug("[SAML2ConsumerServlet::doPost] - END");
		}
	}



	private boolean checkStrongAuthentication(Map<String, String> result) {
		String riscontro = result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_SHIB_RISCONTRO));
		String livello = result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_SHIB_LIVAUTH));

		// Non utilizzo shibboleth, ma credenziali interne o social
		if (livello == null)
			return true;
		try {
			// user password e PIN
			if (Integer.parseInt(livello) == 2 || Integer.parseInt(livello) == 4)
				return (riscontro != null && riscontro.equalsIgnoreCase("S"));
			if (Integer.parseInt(livello) == 8 || Integer.parseInt(livello) == 16)
				return true;
		} catch (NumberFormatException e) {
		}
		return false;
	}
	
	
	private static LoadTokenFromApiResponse loadTokenFromSaml2(String b64samlAssertion) {
		LoadTokenFromApiResponse loadTokenFromSaml = null;
		try {
			Properties config = Config.loadServerConfiguration();
			String apiBaseUrl = config.getProperty(Config.TOKEN_FROM_SAML_URL_KEY) ;
			String user = config.getProperty(Config.TOKEN_FROM_SAML_USER_KEY);
			config = Config.loadAuthorizationConfiguration();
			String password = config.getProperty(Config.TOKEN_FROM_SAML_PASSWORD_KEY);

			Map<String, String> postData = new HashMap<String, String>();
			
			postData.put("grant_type", "urn:ietf:params:oauth:grant-type:saml2-bearer");
			postData.put("assertion", b64samlAssertion);
			
			
			String result = HttpDelegate2.executePost(apiBaseUrl, user, password, "application/x-www-form-urlencoded", "utf-8", null, postData);
			
			log.info("[loadTokenFromSaml2]-->"+result.toString());
			
			Gson gson = new GsonBuilder().create();
			loadTokenFromSaml = gson.fromJson(result.toString(), LoadTokenFromApiResponse.class);

					
		} catch (Exception e) {
			log.error("[SAML2ConsumerServlet::loadTokenFromSaml2] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
		return loadTokenFromSaml;
	}

	private static List<Tenant> getAllTenants() {
		List<Tenant> allTenants = new ArrayList<Tenant>();
		String apiBaseUrl = "";
		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_SERVICES_URL_KEY) + "/tenants";
			HttpClient client = HttpClientBuilder.create().build();
			HttpGet httpget = new HttpGet(apiBaseUrl);

			HttpResponse r = client.execute(httpget);
			log.debug("[SAML2ConsumerServlet::getAllTenants] call to " + apiBaseUrl + " - status " + r.getStatusLine().toString());

			StringBuilder out = new StringBuilder();
			BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
			String line = "";

			while ((line = rd.readLine()) != null) {
				out.append(line);
			}

			String inputJson = out.toString();

			TenantsContainer allTenantsContainer = TenantsContainer.fromJson(inputJson);
			allTenants = allTenantsContainer.getTenants().getTenant();
		} catch (IOException e) {
			log.error("[SAML2ConsumerServlet::getAllTenants] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
		return allTenants;
	}

	private static Tenant filterPersonalTenant(List<Tenant> allTenants, String username) {
		return filterTenant(allTenants, username, "personal");
	}

	private static Tenant filterTrialTenant(List<Tenant> allTenants, String username) {
		return filterTenant(allTenants, username, "trial");
	}

	private static Tenant filterTenant(List<Tenant> allTenants, String username, String label) {
		Tenant foundTenant = null;
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd+hh:mm");
		Date actualDate = new Date();
		Date singleTenantDate = new Date();
		for (Tenant singleTenant : allTenants) {
			singleTenantDate = actualDate;
			if (singleTenant.getDataDisattivazione() != null) {
				try {
					singleTenantDate = formatter.parse(singleTenant.getDataDisattivazione());
				} catch (ParseException e) {
					log.warn("[SAML2ConsumerServlet::filterTenant] invalid tenant disable date: " + singleTenant.getDataDisattivazione());
					e.printStackTrace();
				}
			}
			if ((singleTenant.getTenantType().equals(label)) && (singleTenant.getUserName().equals(username))
					&& (actualDate.before(singleTenantDate) || actualDate.equals(singleTenantDate)) && (singleTenant.getCodDeploymentStatus().equals("req_inst"))) {

				foundTenant = singleTenant;
			}
		}
		return foundTenant;
	}

	private static List<Tenant> filterDisabledTenants(List<String> tenantsCode, List<Tenant> allTenants) {
		Date actualDate = new Date();
		List<Tenant> tenants = new LinkedList<Tenant>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd+hh:mm");

		for (Tenant singleTenant : allTenants) {

			Date singleTenantDate = actualDate;

			if (singleTenant.getDataDisattivazione() != null) {
				try {
					singleTenantDate = formatter.parse(singleTenant.getDataDisattivazione());
				} catch (ParseException e) {
					log.warn("[SAML2ConsumerServlet::filterDisabledTenants] invalid tenant disable date: " + singleTenant.getDataDisattivazione());
					e.printStackTrace();
				}
			}

			if (singleTenantDate.getTime() >= actualDate.getTime()) {
				for (String tenantCode : tenantsCode) {
					if (singleTenant.getTenantCode().equals(tenantCode))
						tenants.add(singleTenant);
				}

			}
		}
		return tenants;
	}

	public static String getCurrentTimeStamp() {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd+HH:mm:ss");
		Date now = new Date();
		String strDate = sdfDate.format(now);
		return strDate;
	}

	public static String getTokenForTenant(String tenant) {

		String apiBaseUrl = "";

		try {
			Properties config = Config.loadServerConfiguration();
			apiBaseUrl = config.getProperty(Config.API_SERVICES_URL_KEY);
			apiBaseUrl += Config.SECDATA_NEWTOKEN + tenant;

			HttpClient client = HttpClientBuilder.create().build();
			HttpGet httpget = new HttpGet(apiBaseUrl);

			HttpResponse r = client.execute(httpget);
			String status = r.getStatusLine().toString();
			System.out.println("status " + status);

			StringBuilder out = new StringBuilder();
			BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
			String line = "";

			while ((line = rd.readLine()) != null) {
				out.append(line);
			}

			String inputJson = out.toString();

			JsonParser parser = new JsonParser();
			JsonObject rootObj = parser.parse(inputJson).getAsJsonObject();

			String access_token = rootObj.get("access_token").getAsString();


			return access_token;

		} catch (IOException e) {
			log.error("[ApiServiceProxyServlet::setApiBaseUrl] - ERROR " + e.getMessage());
			e.printStackTrace();
		}
		return "";
	}

	private List<String> loadPermissions(User newUser) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException, SAXException {

		log.debug("[SAML2ConsumerServlet::loadPermissions] - START");
		List<String> permissions = new LinkedList<String>();
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <ser:getAllowedUIResourcesForUser>";
			xmlInput += "         <ser:userName>" + newUser.getUsername() + "</ser:userName>";
			xmlInput += "         <ser:permissionRootPath>permission/Applications/userportal</ser:permissionRootPath>";
			xmlInput += "      </ser:getAllowedUIResourcesForUser>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "getAllowedUIResourcesForUser";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.RBAC_PERMISSIONS_WEBSERVICE_URL_KEY);
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

	private String getJWT(String token) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException, SAXException {

		log.debug("[SAML2ConsumerServlet::getJWT] - START");
		String jwt = null;
		Boolean valid= false;
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" xmlns:xsd1=\"http://dto.oauth2.identity.carbon.wso2.org/xsd\">";
				xmlInput += "   <soapenv:Header/>";
				xmlInput += "   <soapenv:Body>";
				xmlInput += "      <xsd:validate>";
				xmlInput += "         <xsd:validationReqDTO>";
				xmlInput += "            <xsd1:accessToken>";
				xmlInput += "               <xsd1:identifier>"+token+"</xsd1:identifier>";
				xmlInput += "               <xsd1:tokenType>bearer</xsd1:tokenType>";
				xmlInput += "            </xsd1:accessToken>";
				xmlInput += "            <xsd1:context>";
				xmlInput += "               <xsd1:key></xsd1:key>";
				xmlInput += "               <xsd1:value></xsd1:value>";
				xmlInput += "            </xsd1:context>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_ROLE)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_NICKNAME)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            <xsd1:requiredClaimURIs>"+AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_SHIB_LIVAUTH)+"</xsd1:requiredClaimURIs>";
				xmlInput += "            </xsd:validationReqDTO>";
				xmlInput += "      </xsd:validate>";
				xmlInput += "   </soapenv:Body>";
				xmlInput += "</soapenv:Envelope>";
				
			String SOAPAction = "validate";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_URL_KEY);
			String user = config.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_USER_KEY);
			String password = authConfig.getProperty(Config.JWT_FROM_VALIDATION_TOKEN_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadRoles] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			NodeList fieldsNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (fieldsNodeList != null) {
				
				for (int i = 0; i < fieldsNodeList.getLength(); i++) {

					Node fieldNode = fieldsNodeList.item(i);
					
					
					if (fieldNode.getNodeName().endsWith("valid")){
						log.debug("Valid|"+fieldNode.getTextContent()+"|");
						valid = Boolean.parseBoolean(fieldNode.getTextContent());
					}
					if (fieldNode.getNodeName().endsWith("authorizationContextToken"))
					{
						NodeList authContNodeList = fieldNode.getChildNodes();
						if (authContNodeList!=null)
						{
							for (int j = 0; j < authContNodeList.getLength(); j++) {
								Node authNode = authContNodeList.item(i);
								log.info("authNode.getNodeName |"+authNode.getNodeName());
								if (authNode.getNodeName().endsWith("tokenString")) {
									log.debug("tokenString |"+authNode.getTextContent());
									jwt = authNode.getTextContent();
								}
							}
						}
					}
				}
			}

		} finally {
			log.debug("[SAML2ConsumerServlet::getJWT] - END");
		}
		if (valid)
			return jwt;
		else
			return null;
	}

	
	
	private List<String> loadRoles(User newUser, String filter) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException, SAXException {

		log.debug("[SAML2ConsumerServlet::loadRoles] - START");
		List<String> roles = new LinkedList<String>();
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <xsd:getRolesOfUser>";
			xmlInput += "         <xsd:userName>" + newUser.getUsername() + "</xsd:userName>";
			xmlInput += "         <xsd:filter>" + filter + "</xsd:filter>";
			xmlInput += "         <xsd:limit>-1</xsd:limit>";

			xmlInput += "      </xsd:getRolesOfUser>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "getRolesOfUser";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.RBAC_ROLES_WEBSERVICE_URL_KEY);
			String user = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
			String password = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadRoles] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			NodeList rolessNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (rolessNodeList != null) {
				for (int i = 0; i < rolessNodeList.getLength(); i++) {

					Node roleNode = rolessNodeList.item(i);

					String selected = "";
					String role = "";
					for (int j = 0; j < roleNode.getChildNodes().getLength(); j++) {
						Node node = roleNode.getChildNodes().item(j);
						if ("ax2644:selected".equals(node.getNodeName())) {
							selected = node.getTextContent();
						} else if ("ax2644:itemName".equals(node.getNodeName())) {
							role = node.getTextContent();
						}
					}

					if (selected.equals("true") && !role.equals(""))
						roles.add(role.replace("_subscriber", ""));

				}
			}

		} finally {
			log.debug("[SAML2ConsumerServlet::loadRoles] - END");
		}
		return roles;
	}

	private String loadTermConditionTenantClaim(User newUser) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException, SAXException {
		return loadUserClaimValue(newUser, AuthorizeUtils.claimsKeys.get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS));
	}

	private String loadUserClaimValue(User newUser, String claimKey) throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException,
			SAXException {

		log.debug("[SAML2ConsumerServlet::loadUserClaimValue] - START");
		String claimValue = null;
		try {

			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <ser:getUserClaimValue>";
			xmlInput += "         <ser:userName>" + newUser.getUsername() + "</ser:userName>";
			xmlInput += "         <ser:claim>" + claimKey + "</ser:claim>";
			xmlInput += "      </ser:getUserClaimValue>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "urn:getUserClaimValue";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = config.getProperty(Config.RBAC_USER_STORE_WEBSERVICE_URL_KEY);
			String user = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
			String password = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, user, password, xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadUserClaimValue] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);

			NodeList nodeList = doc.getFirstChild().getFirstChild().getChildNodes();
			if (nodeList != null) {
				for (int i = 0; i < nodeList.getLength(); i++) {
					Node node = nodeList.item(i);
					claimValue = node.getTextContent();
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		} finally {
			log.debug("[SAML2ConsumerServlet::loadUserClaimValue] - END");
		}
		return claimValue;
	}

	private String loadStoreToken(String username) throws IOException {

		String storeToken = null;

		Properties config = Config.loadServerConfiguration();
		String storeBaseUrl = config.getProperty(Config.API_STORE_URL_KEY);
		// String username = info.getUser().getUsername();

		AllSubscriptionsResponse allSubscriptions = loadSubscriptions(storeBaseUrl, username);
		ApplicationSubscription defaultApplication = null;

		String productConsumerKey = null;
		String productConsumerSecret = null;
		String oldStoreToken = null;

		if (allSubscriptions != null && !allSubscriptions.getError()) {
			for (ApplicationSubscription application : allSubscriptions.getSubscriptions()) {
				if (application.getName().equals("DefaultApplication")) {
					defaultApplication = application;
					if (application.getProdConsumerKey() != null) {
						productConsumerKey = application.getProdConsumerKey();
						productConsumerSecret = application.getProdConsumerSecret();
						oldStoreToken = application.getProdKey();
					} else {
						GenerateTokenResponse generateStoreToken = generateApplicationKey(storeBaseUrl, username);
						if (generateStoreToken != null && !generateStoreToken.getError() && generateStoreToken.getData() != null && generateStoreToken.getData().getKey() != null) {
							productConsumerKey = generateStoreToken.getData().getKey().getConsumerKey();
							productConsumerSecret = generateStoreToken.getData().getKey().getConsumerSecret();
							oldStoreToken = generateStoreToken.getData().getKey().getAccessToken();
						} else
							log.error("[AuthorizeFilter::doFilter] error generateApplicationKey");

					}
					break;
				}
			}
		}

		if (defaultApplication == null) {
			//GenerateTokenResponse generateStoreToken = createAndSubscribeDefaultApplication(storeBaseUrl, username);
			GenerateTokenResponse generateStoreToken = addDefaultApplication(storeBaseUrl, username);
			
			if (generateStoreToken != null && !generateStoreToken.getError() && generateStoreToken.getData() != null && generateStoreToken.getData().getKey() != null) {

				productConsumerKey = generateStoreToken.getData().getKey().getConsumerKey();
				productConsumerSecret = generateStoreToken.getData().getKey().getConsumerSecret();
				oldStoreToken = generateStoreToken.getData().getKey().getAccessToken();
			} else
				log.error("[AuthorizeFilter::doFilter] error createAndSubscribeDefaultApplication");
		}

		String apiBaseUrl = config.getProperty(Config.API_ODATA_URL_KEY);
		storeToken = loadStoreTokenFromApi(apiBaseUrl, username, productConsumerKey, productConsumerSecret, storeBaseUrl);
		// storeToken = refreshStoreToken(storeBaseUrl, username,
		// productConsumerKey, productConsumerSecret, oldStoreToken);
		log.debug("[AuthorizeFilter::doFilter] oldStoreToken " + oldStoreToken);

		return storeToken;

	}

	private AllSubscriptionsResponse loadSubscriptions(String storeBaseUrl, String username) throws HttpException, IOException {

		String url = storeBaseUrl + "/site/blocks/secure/subscription.jag?action=getAllSubscriptions&application=s&username=" + username;
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet httpget = new HttpGet(url);

		HttpResponse r = client.execute(httpget);
		log.debug("[SAML2ConsumerServlet::loadSubscriptions] call to " + url + " - status " + r.getStatusLine().toString());

		StringBuilder out = new StringBuilder();
		BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
		String line = "";

		while ((line = rd.readLine()) != null) {
			out.append(line);
		}

		Gson gson = new GsonBuilder().create();

		AllSubscriptionsResponse allSubscriptions = gson.fromJson(out.toString(), AllSubscriptionsResponse.class);

		return allSubscriptions;

	}

	private GenerateTokenResponse generateApplicationKey(String storeBaseUrl, String username) throws HttpException, IOException {

		long validityTime = 86400;

		HttpPost httpPost = new HttpPost(storeBaseUrl + "/site/blocks/secure/subscription.jag?");
		httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPost.addHeader("charset", "UTF-8");

		List<BasicNameValuePair> postParameters = new LinkedList<BasicNameValuePair>();
		postParameters.add(new BasicNameValuePair("username", username));
		postParameters.add(new BasicNameValuePair("action", "generateApplicationKey"));
		postParameters.add(new BasicNameValuePair("application", "DefaultApplication"));
		postParameters.add(new BasicNameValuePair("keytype", "PRODUCTION"));
		postParameters.add(new BasicNameValuePair("authorizedDomains", "ALL"));
		postParameters.add(new BasicNameValuePair("validityTime", "" + validityTime));

		httpPost.setEntity(new UrlEncodedFormEntity(postParameters, "UTF-8"));

		HttpClient client = HttpClientBuilder.create().build();
		HttpResponse r = client.execute(httpPost);
		log.debug("[SAML2ConsumerServlet::generateApplicationKey] call to " + storeBaseUrl + "/site/blocks/secure/subscription.jag?" + " - status " + r.getStatusLine().toString());

		StringBuilder out = new StringBuilder();
		BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
		String line = "";

		while ((line = rd.readLine()) != null) {
			out.append(line);
		}

		Gson gson = new GsonBuilder().create();
		GenerateTokenResponse generateTokenResponse = gson.fromJson(out.toString(), GenerateTokenResponse.class);
		return generateTokenResponse;

	}

	private String loadStoreTokenFromApi(String apiBaseUrl, String username, String productConsumerKey, String productConsumerSecret, String storeBaseUrl) throws HttpException,
			IOException {

		HttpPost httpPost = new HttpPost(apiBaseUrl + "/token?grant_type=client_credentials");
		httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPost.addHeader("charset", "UTF-8");
		byte[] encoding = new Base64().encode((productConsumerKey + ":" + productConsumerSecret).getBytes());
		String authorizationHeader = "Basic " + new String(encoding);
		httpPost.addHeader("Authorization", authorizationHeader);

		HttpClient client = HttpClientBuilder.create().build();
		HttpResponse r = client.execute(httpPost);
		log.debug("[SAML2ConsumerServlet::refreshStoreToken] call to " + apiBaseUrl + "/token?grant_type=client_credentials" + " - status " + r.getStatusLine().toString());

		StringBuilder out = new StringBuilder();
		BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
		String line = "";

		while ((line = rd.readLine()) != null) {
			out.append(line);
		}

		Gson gson = new GsonBuilder().create();
		LoadTokenFromApiResponse loadTokenFromApiResponse = gson.fromJson(out.toString(), LoadTokenFromApiResponse.class);

		String storeToken = loadTokenFromApiResponse.getAccess_token();
		if (loadTokenFromApiResponse.getExpires_in() <= 0) {
			storeToken = refreshStoreToken(storeBaseUrl, username, productConsumerKey, productConsumerSecret, loadTokenFromApiResponse.getAccess_token());
			log.error("[AuthorizeFilter::refreshStoreToken] error refreshStoreToken ");
		}

		return storeToken;

	}

	private String refreshStoreToken(String storeBaseUrl, String username, String productConsumerKey, String productConsumerSecret, String oldStoreToken) throws HttpException,
			IOException {

		HttpPost httpPost = new HttpPost(storeBaseUrl + "/site/blocks/secure/subscription.jag?");
		httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPost.addHeader("charset", "UTF-8");

		long validityTime = 86400;

		List<BasicNameValuePair> postParameters = new LinkedList<BasicNameValuePair>();
		postParameters.add(new BasicNameValuePair("username", username));
		postParameters.add(new BasicNameValuePair("action", "refreshToken"));
		postParameters.add(new BasicNameValuePair("application", "DefaultApplication"));
		postParameters.add(new BasicNameValuePair("clientId", productConsumerKey));
		postParameters.add(new BasicNameValuePair("clientSecret", productConsumerSecret));
		postParameters.add(new BasicNameValuePair("keytype", "PRODUCTION"));
		postParameters.add(new BasicNameValuePair("oldAccessToken", oldStoreToken));
		postParameters.add(new BasicNameValuePair("authorizedDomains", "ALL"));
		postParameters.add(new BasicNameValuePair("validityTime", "" + validityTime));

		httpPost.setEntity(new UrlEncodedFormEntity(postParameters, "UTF-8"));

		HttpClient client = HttpClientBuilder.create().build();
		HttpResponse r = client.execute(httpPost);
		log.debug("[SAML2ConsumerServlet::refreshStoreToken] call to " + storeBaseUrl + "/site/blocks/secure/subscription.jag?" + " - status " + r.getStatusLine().toString());

		StringBuilder out = new StringBuilder();
		BufferedReader rd = new BufferedReader(new InputStreamReader(r.getEntity().getContent()));
		String line = "";

		while ((line = rd.readLine()) != null) {
			out.append(line);
		}

		Gson gson = new GsonBuilder().create();
		GenerateTokenResponse refreshTokenResponse = gson.fromJson(out.toString(), GenerateTokenResponse.class);
		String storeToken = null;

		if (refreshTokenResponse != null && !refreshTokenResponse.getError() && refreshTokenResponse.getData() != null && refreshTokenResponse.getData().getKey() != null)
			storeToken = refreshTokenResponse.getData().getKey().getAccessToken();
		else
			log.error("[AuthorizeFilter::refreshStoreToken] error refreshStoreToken ");

		return storeToken;

	}
	
	private GenerateTokenResponse addDefaultApplication(String storeBaseUrl, String username) throws HttpException, IOException {


		HttpClient client = HttpClientBuilder.create().build();

		// create Default Application
		HttpPost httpPostCreate = new HttpPost(storeBaseUrl + "/site/blocks/secure/application.jag?");
		httpPostCreate.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPostCreate.addHeader("charset", "UTF-8");

		List<BasicNameValuePair> postParametersCreate = new LinkedList<BasicNameValuePair>();
		postParametersCreate.add(new BasicNameValuePair("username", username));
		postParametersCreate.add(new BasicNameValuePair("action", "addDefaultApplication"));

		httpPostCreate.setEntity(new UrlEncodedFormEntity(postParametersCreate, "UTF-8"));

		HttpResponse rCreate = client.execute(httpPostCreate);
		log.debug("[SAML2ConsumerServlet::addDefaultApplication] call to " + storeBaseUrl + storeBaseUrl + "/site/blocks/secure/application.jag?" + " - status "
				+ rCreate.getStatusLine().toString());

		StringBuilder outCreate = new StringBuilder();
		BufferedReader rdCreate = new BufferedReader(new InputStreamReader(rCreate.getEntity().getContent()));
		String lineCreate = "";

		while ((lineCreate = rdCreate.readLine()) != null) {
			outCreate.append(lineCreate);
		}

		log.info("[AuthorizeFilter::addDefaultApplication] - add default application create response " + outCreate);


		return generateApplicationKey(storeBaseUrl, username);

	
	}

	/* no more usefull, now using addDefaultApplication 
	private GenerateTokenResponse createAndSubscribeDefaultApplication(String storeBaseUrl, String username) throws HttpException, IOException {

		HttpClient client = HttpClientBuilder.create().build();

		// create Default Application
		HttpPost httpPostCreate = new HttpPost(storeBaseUrl + "/site/blocks/secure/application.jag?");
		httpPostCreate.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPostCreate.addHeader("charset", "UTF-8");

		List<BasicNameValuePair> postParametersCreate = new LinkedList<BasicNameValuePair>();
		postParametersCreate.add(new BasicNameValuePair("username", username));
		//postParametersCreate.add(new BasicNameValuePair("description", "Default Application"));
		postParametersCreate.add(new BasicNameValuePair("action", "addApplication"));
		postParametersCreate.add(new BasicNameValuePair("callbackUrl", ""));
		postParametersCreate.add(new BasicNameValuePair("tier", "Unlimited"));
		postParametersCreate.add(new BasicNameValuePair("application", "DefaultApplication"));

		httpPostCreate.setEntity(new UrlEncodedFormEntity(postParametersCreate, "UTF-8"));

		HttpResponse rCreate = client.execute(httpPostCreate);
		log.debug("[SAML2ConsumerServlet::createAndSubscribeDefaultApplication] call to " + storeBaseUrl + storeBaseUrl + "/site/blocks/secure/application.jag?" + " - status "
				+ rCreate.getStatusLine().toString());

		StringBuilder outCreate = new StringBuilder();
		BufferedReader rdCreate = new BufferedReader(new InputStreamReader(rCreate.getEntity().getContent()));
		String lineCreate = "";

		while ((lineCreate = rdCreate.readLine()) != null) {
			outCreate.append(lineCreate);
		}

		log.info("[AuthorizeFilter::createAndSubscribeDefaultApplication] - add default application create response " + outCreate);

		// Subscribe Default Application
		HttpPost httpPostSubscribe = new HttpPost(storeBaseUrl + "/site/blocks/secure/subscription.jag?");
		httpPostSubscribe.addHeader("Content-Type", "application/x-www-form-urlencoded");
		httpPostSubscribe.addHeader("charset", "UTF-8");

		List<BasicNameValuePair> postParametersSubscribe = new LinkedList<BasicNameValuePair>();
		postParametersSubscribe.add(new BasicNameValuePair("username", username));
		postParametersSubscribe.add(new BasicNameValuePair("action", "addAPISubscription"));
		postParametersSubscribe.add(new BasicNameValuePair("name", "metadata_api"));
		postParametersSubscribe.add(new BasicNameValuePair("version", "1.0"));
		postParametersSubscribe.add(new BasicNameValuePair("provider", "admin"));
		postParametersSubscribe.add(new BasicNameValuePair("tier", "Unlimited"));
		postParametersSubscribe.add(new BasicNameValuePair("applicationName", "DefaultApplication"));

		httpPostSubscribe.setEntity(new UrlEncodedFormEntity(postParametersSubscribe, "UTF-8"));

		HttpResponse rSubscribe = client.execute(httpPostSubscribe);
		log.debug("[SAML2ConsumerServlet::createAndSubscribeDefaultApplication] call to " + storeBaseUrl + storeBaseUrl + "/site/blocks/secure/subscription.jag?" + " - status "
				+ rSubscribe.getStatusLine().toString());

		StringBuilder outSubscribe = new StringBuilder();
		BufferedReader rdSubscribe = new BufferedReader(new InputStreamReader(rSubscribe.getEntity().getContent()));
		String lineSubscribe = "";

		while ((lineSubscribe = rdSubscribe.readLine()) != null) {
			outSubscribe.append(lineSubscribe);
		}

		log.info("[AuthorizeFilter::createAndSubscribeDefaultApplication] - add default application subscription response " + outSubscribe);

		return generateApplicationKey(storeBaseUrl, username);

	} */

	public static void main(String[] args) {
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"><soapenv:Body><ns:getRolesOfUserResponse xmlns:ns=\"http://org.apache.axis2/xsd\" xmlns:ax2644=\"http://common.mgt.user.carbon.wso2.org/xsd\"><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>all4all_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>false</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>circe_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>false</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>csp_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>true</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>ondeuwc_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>true</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>sandbox_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>false</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>smartlab_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>true</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>true</ax2644:editable><ax2644:itemDisplayName xsi:nil=\"true\"></ax2644:itemDisplayName><ax2644:itemName>tecnetdati_subscriber</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>false</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return><ns:return xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:type=\"ax2644:FlaggedName\"><ax2644:dn xsi:nil=\"true\"></ax2644:dn><ax2644:domainName xsi:nil=\"true\"></ax2644:domainName><ax2644:editable>false</ax2644:editable><ax2644:itemDisplayName></ax2644:itemDisplayName><ax2644:itemName>false</ax2644:itemName><ax2644:readOnly>false</ax2644:readOnly><ax2644:roleType xsi:nil=\"true\"></ax2644:roleType><ax2644:selected>false</ax2644:selected><ax2644:shared>false</ax2644:shared></ns:return></ns:getRolesOfUserResponse></soapenv:Body></soapenv:Envelope>";
		List<String> roles = new LinkedList<String>();
		try {

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			dbf.setNamespaceAware(true);

			DocumentBuilder db = dbf.newDocumentBuilder();
			Document doc = db.parse(new ByteArrayInputStream(xml.getBytes()));

			NodeList rolessNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (rolessNodeList != null) {
				for (int i = 0; i < rolessNodeList.getLength(); i++) {

					Node roleNode = rolessNodeList.item(i);

					String selected = "";
					String role = "";
					for (int j = 0; j < roleNode.getChildNodes().getLength(); j++) {
						Node node = roleNode.getChildNodes().item(j);
						if ("ax2644:selected".equals(node.getNodeName())) {
							selected = node.getTextContent();
						} else if ("ax2644:itemName".equals(node.getNodeName())) {
							role = node.getTextContent();
						}
					}

					if (selected.equals("true") && !role.equals(""))
						roles.add(role.replace("_subscriber", ""));

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		for (String role : roles) {
			System.out.println(role);
		}
	}

}
