package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.WebServiceDelegate;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.User;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;
import org.csi.yucca.userportal.userportal.utils.Config;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class OldUserConfTenant {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(InfoServlet.class);

	public static void main(String[] args) {

		try {
			List<String> listOfUsers = loadUsers();
			for (int i=0; i < listOfUsers.size(); i++){
				User newUser = new User();

				newUser.setLoggedIn(true);
				newUser.setUsername(listOfUsers.get(i));
				List<String> tenantsCode = null;

				try {
					tenantsCode = loadRoles(newUser, "*_subscriber");
				} catch (Exception e) {
 
					log.error("[SAML2ConsumerServlet::doPost] - ERROR: " + e.getMessage());
					e.printStackTrace();
				}
				
				String listTennant = "";

				for (String tennant : tenantsCode){
					listTennant += "|" + tennant;
				}
				
				if (listTennant != ""){
					listTennant += "|old";
					addClaim(newUser, listTennant);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private static List<String> loadUsers() throws KeyManagementException, NoSuchAlgorithmException, IOException, ParserConfigurationException,
			SAXException {

		log.debug("[SAML2ConsumerServlet::loadPermissions] - START");
		List<String> users = new LinkedList<String>();
		try {
			
			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\">";
				  xmlInput += "		<soapenv:Header/>";
				  xmlInput += "		<soapenv:Body>";
				  xmlInput += "			<xsd:listAllUsers>";
				  xmlInput += "				<!--Optional:-->";
				  xmlInput += "				<xsd:filter></xsd:filter>"; 
				  xmlInput += "				<!--Optional:-->";
				  xmlInput += "				<xsd:limit>200</xsd:limit>";
				  xmlInput += "			</xsd:listAllUsers>";
				  xmlInput += "		</soapenv:Body>";
				  xmlInput += "</soapenv:Envelope>";

			String SOAPAction = "listAllUsers";

			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();

			String webserviceUrl = "https://int-sso.smartdatanet.it/services/UserAdmin";
 			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, "admin", "***REMOVED***", xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadPermissions] - webServiceResponse: " + webServiceResponse);

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			InputSource is = new InputSource(new StringReader(webServiceResponse));
			Document doc = db.parse(is);
			
			//User newUser

			NodeList oldUsersNodeList = doc.getFirstChild().getFirstChild().getFirstChild().getChildNodes();
			if (oldUsersNodeList != null) {
				for (int i = 0; i < oldUsersNodeList.getLength(); i++) {

					Node userNode = oldUsersNodeList.item(i);

					String itemDisplayName = "";
					String itemName = "";
					for (int j = 0; j < userNode.getChildNodes().getLength(); j++) {
						Node node = userNode.getChildNodes().item(j);
						if ("ax2644:itemDisplayName".equals(node.getNodeName())) {
							itemDisplayName = node.getTextContent();
							users.add(itemDisplayName);
							break;
						} else if ("ax2644:itemName".equals(node.getNodeName())) {
							itemName = node.getTextContent();
							users.add(itemName);
							break;
						}
					}
				}
			}

		} catch (Exception e) {
			log.error("[InfoServlet::doGet] - ERROR " + e.getMessage());
		} finally {
			log.debug("[SAML2ConsumerServlet::loadPermissions] - END");
		}
		return users;
	}
	
	private static void addClaim(User user, String termCoditionsTenants) throws KeyManagementException, NoSuchAlgorithmException, IOException,
	ParserConfigurationException, SAXException {

		log.debug("[SAML2ConsumerServlet::loadPermissions] - START");
		try {
		
			String xmlInput = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">";
			xmlInput += "   <soapenv:Header/>";
			xmlInput += "   <soapenv:Body>";
			xmlInput += "      <ser:setUserClaimValue>";
			xmlInput += "         <ser:userName>" + user.getUsername() + "</ser:userName>";
			xmlInput += "         <ser:claimURI>" + AuthorizeUtils.getClaimsMap("WSO2").get(AuthorizeUtils.CLAIM_KEY_TERM_CODITION_TENANTS) + "</ser:claimURI>";
			xmlInput += "         <ser:claimValue>" + termCoditionsTenants + "</ser:claimValue>";
			xmlInput += "      </ser:setUserClaimValue>";
			xmlInput += "   </soapenv:Body>";
			xmlInput += "</soapenv:Envelope>";
		
			String SOAPAction = "setUserClaimValue";
		
			Properties config = Config.loadServerConfiguration();
			Properties authConfig = Config.loadAuthorizationConfiguration();
		
			String webserviceUrl = config.getProperty(Config.RBAC_USER_STORE_WEBSERVICE_URL_KEY);
			//String user = config.getProperty(Config.RBAC_WEBSERVICE_USER_KEY);
			//String password = authConfig.getProperty(Config.RBAC_WEBSERVICE_PASSWORD_KEY);
			String webServiceResponse = WebServiceDelegate.callWebService(webserviceUrl, "admin", "***REMOVED***", xmlInput, SOAPAction, "text/xml");
			log.debug("[SAML2ConsumerServlet::loadPermissions] - webServiceResponse: " + webServiceResponse);
		} catch (Exception e) {
			log.error("[InfoServlet::doGet] - ERROR " + e.getMessage());
		} finally {
			log.debug("[SAML2ConsumerServlet::loadPermissions] - END");
		}
	}

	private static List<String> loadRoles(User newUser, String filter) throws KeyManagementException, NoSuchAlgorithmException, IOException,
			ParserConfigurationException, SAXException {

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

	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

}
