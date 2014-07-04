package it.csi.sdp.userportal.service;

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

@WebFilter(filterName = "AuthorizationFilter", description = "Check if the session is valid", value = "/api", dispatcherTypes = { javax.servlet.DispatcherType.REQUEST })
public class AuthorizeFilter implements Filter {

	public static String API_URL = "http://www.ale.it/";

	static Logger log = Logger.getLogger(AuthorizeFilter.class);

	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		log.debug("[AuthorizeFilter::doFilter] - START ");
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;
		try {

			if (!request.isRequestedSessionIdValid()) {
				response.sendRedirect("/auth/login.jsp");
			} else {
				response.sendRedirect(API_URL + request.getRequestURI());
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("[AuthorizeFilter::doFilter] - ERROR " + e.getMessage());
//			req.setAttribute("ERROR", "Request failed: " + e.getMessage());
//			res.setStatus(HttpServletResponse.SC_ERROR);
//			ServletContext context = getServletContext();
//			RequestDispatcher dispatcher = context.getRequestDispatcher("/error.jsp");
//			dispatcher.forward(req, resp);
//			response.sendError(HttpServletResponse.SC_XPECTATION_FAILED);
		} finally {
			log.debug("[AuthorizeFilter::doFilter] - END ");

		}
	}

	public void destroy() {
		// TODO Auto-generated method stub

	}

}
