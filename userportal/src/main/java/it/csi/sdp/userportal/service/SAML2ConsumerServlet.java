package it.csi.sdp.userportal.service;

import it.csi.sdp.userportal.info.Info;
import it.csi.sdp.userportal.info.User;
import it.csi.sdp.userportal.utils.AuthorizeUtils;
import it.csi.sdp.userportal.utils.Util;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.opensaml.xml.ConfigurationException;

@WebServlet(name = "AuthorizeServlet", description = "Authorization Servlet", urlPatterns = { "/api/authorize" }, asyncSupported = false)
public class SAML2ConsumerServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private SamlConsumerManager consumer;

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

		String responseMessage = request.getParameter("SAMLResponse");
		Info info = (Info) request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		if (responseMessage != null) {

			Map<String, String> result = consumer.processResponseMessage(responseMessage);

			User newUser = info.getUser();
			if (result == null) {
				;
			} else if (result.size() == 1) {
				newUser = new User();
				newUser.setLoggedIn(true);
				newUser.setUsername(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_USERNAME)));
				newUser.setTenant(AuthorizeUtils.DEFAULT_TENANT);
			} else if (result.size() > 1) {
				newUser = new User();
				newUser.setLoggedIn(true);
				newUser.setUsername(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_USERNAME)));
				newUser.setTenant(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_TENANT)));
				newUser.setFirstname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_GIVEN_NAME)));
				newUser.setLastname(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_LASTNAME)));
				newUser.setEmail(result.get(AuthorizeUtils.getClaimsMap().get(AuthorizeUtils.CLAIM_KEY_EMAIL_ADDRESS)));

				for (Object key : result.keySet().toArray()) {
					String value = (String) result.get(key);
					System.out.println(value);

				}
			} else {
				// something wrong, re-login
			}
			info.setUser(newUser);
			info.setTenantCode(newUser.getTenant());
			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
			String returnPath = request.getContextPath() + "/"
					+ URLDecoder.decode(Util.nvlt(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION)), "UTF-8");
			response.sendRedirect(returnPath);
		} else {
			try {
				String returnPath = request.getParameter("returnUrl");
				request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION, returnPath);
				info.setTenantCode(AuthorizeUtils.DEFAULT_TENANT);
				info.setUser(AuthorizeUtils.DEFAULT_USER);
				request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
				String requestMessage = consumer.buildRequestMessage(request);
				response.sendRedirect(requestMessage + "&issuer=userportal&customCssPath=" + URLEncoder.encode(consumer.getIdpLoginPageStylePath(), "UTF-8"));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
