package it.csi.sdp.userportal.service;

import it.csi.sdp.userportal.info.Info;
import it.csi.sdp.userportal.utils.AuthorizeUtils;

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

@WebFilter(filterName = "AuthorizationFilter", description = "Check if the session is valid", value = "/api/*", dispatcherTypes = { javax.servlet.DispatcherType.REQUEST })
public class AuthorizeFilter implements Filter {

	static Logger log = Logger.getLogger(AuthorizeFilter.class);

	public void init(FilterConfig arg0) throws ServletException {

	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		log.debug("[AuthorizeFilter::doFilter] - START ");
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		if (request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE) == null) {
			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE, AuthorizeUtils.DEFAULT_TENANT);
		}

		if (request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO) == null) {
			Info info = new Info();
			info.setTenantCode(AuthorizeUtils.DEFAULT_TENANT);
			info.setUser(AuthorizeUtils.DEFAULT_USER);
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