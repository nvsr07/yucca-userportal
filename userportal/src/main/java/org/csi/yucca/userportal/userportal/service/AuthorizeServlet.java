package org.csi.yucca.userportal.userportal.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(description = "Authorization Servlet", urlPatterns = { "/api/authorizeOld" }, asyncSupported = false)
 @Deprecated
public class AuthorizeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//		String username = (String) request.getParameter("username");
//		String password = (String) request.getParameter("password");
//		String tenantCode = (String) request.getParameter(AuthorizeUtils.SESSION_KEY_TENANT_CODE);
//
//		Properties authorizationConfig = Config.loadAuthorizationConfiguration();
//		String secret = authorizationConfig.getProperty("authorization.secret");
//
//		if (tenantCode != null && "admin".equals(username) && secret.equals(password)) {
//			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE, tenantCode);
//			response.sendRedirect(request.getContextPath() + "/#/management/streams/" + tenantCode);
//		} else {
//			response.getWriter().append("Attirbuto TENANT_CODE nullo!");
//		}

	}
}
