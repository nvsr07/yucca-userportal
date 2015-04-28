package org.csi.yucca.userportal.backoffice.service;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.backoffice.info.Info;
import org.csi.yucca.userportal.backoffice.info.User;
import org.csi.yucca.userportal.backoffice.utils.AuthorizeUtils;

@WebFilter(filterName = "AuthorizationFilter", description = "Check if the session is valid", value = "/api/*", dispatcherTypes = { javax.servlet.DispatcherType.REQUEST })
public class AuthorizeFilter implements Filter {

	static Logger log = Logger.getLogger(AuthorizeFilter.class);

	public void init(FilterConfig arg0) throws ServletException {

	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		log.debug("[AuthorizeFilter::doFilter] - START ");
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;


		if (request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO) == null) {
			Info info = new Info();
			//info.setTenantCode(AuthorizeUtils.DEFAULT_TENANT);
			User defaultUser = AuthorizeUtils.DEFAULT_USER();

			defaultUser.setToken(SAML2ConsumerServlet.getTokenForTenant(defaultUser));
			
			info.setUser(defaultUser);
			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
		}

		try {

			if (AuthorizeUtils.isAPIRequest(request)) {
				if (!AuthorizeUtils.verifyAPIRequest(request)) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().append("{\"error_message\":\"Unauthorized access\"}");
					response.getWriter().flush();
					return;
				}

			}
			chain.doFilter(request, response);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("[AuthorizeFilter::doFilter] - ERROR " + e.getMessage());
		} finally {
			log.debug("[AuthorizeFilter::doFilter] - END ");

		}
	}
	
	public void destroy() {
		// TODO Auto-generated method stub

	}

}
