package org.csi.yucca.userportal.backoffice.service;

import java.io.IOException;
import java.util.List;

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
import org.csi.yucca.userportal.backoffice.utils.AuthorizeUtils;

@WebFilter(filterName = "AuthorizationFilter", description = "Check if the session is valid", value = "/*", dispatcherTypes = { javax.servlet.DispatcherType.REQUEST })
public class AuthorizeFilter implements Filter {

	static Logger log = Logger.getLogger(AuthorizeFilter.class);

	public void init(FilterConfig arg0) throws ServletException {

	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		log.debug("[AuthorizeFilter::doFilter] - START ");
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		String uri = request.getRequestURI();

		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		boolean isLoggedIn = (info != null && info.getUser() != null && info.getUser().getLoggedIn());

		if (!isLoggedIn && !isAuthorizedPath(uri)) {
			response.sendRedirect("/backoffice/api/authorize?returnUrl=");
			return;
		} else if (isLoggedIn && !checkPermission(info.getUser().getPermissions()) && !isAuthorizedPath(uri)) {
			response.sendRedirect("/backoffice/403.html");
			return;
		} else
			chain.doFilter(request, response);
	}

	private boolean checkPermission(List<String> permissions) {
		boolean hasPermission = false;
		if (permissions != null)
			for (String permission : permissions) {
				permission.equals("/permission/applications/backoffice/admin-backoffice");
				hasPermission = true;
				break;
			}

		return hasPermission;
	}

	private boolean isAuthorizedPath(String uri) {

		return uri.startsWith("/backoffice/api/authorize") || uri.startsWith("/backoffice/403.html") || uri.startsWith("/backoffice/css")
				|| uri.startsWith("/backoffice/js") || uri.startsWith("/backoffice/lib");

	}

	public void destroy() {
		// TODO Auto-generated method stub

	}

}
