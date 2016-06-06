package org.csi.yucca.userportal.userportal.service.auth;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;

@WebServlet(description = "Configuration Parameter for clients", urlPatterns = { "/api/termcondition" }, asyncSupported = true)
public class TermConditionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger log = Logger.getLogger(TermConditionServlet.class);

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("[TermConditionServlet::doGet] - START");
		try {
			String tenantCode = request.getParameter("tenantcode");
			Info info  = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			info.getUser().addAcceptTermConditionTenants(tenantCode);

			request.getSession().setAttribute(AuthorizeUtils.SESSION_KEY_INFO, info);
			
			String infoJson = info.toJson();
			if (isJSONPRequest(request))
				infoJson = getCallbackMethod(request) + "(" +infoJson + ")";


			response.setContentType("application/json; charset=utf-8");
			response.setCharacterEncoding("UTF-8");

			PrintWriter out = response.getWriter();

			out.println(infoJson);
			out.close();
		} catch (IOException e) {
			log.error("[TermConditionServlet::doGet] - ERROR " + e.getMessage());
			throw e;
		} finally {
			log.debug("[TermConditionServlet::doGet] - END");
		}
	}


	private String getCallbackMethod(HttpServletRequest httpRequest) {
		return httpRequest.getParameter("callback");
	}

	private boolean isJSONPRequest(HttpServletRequest httpRequest) {
		String callbackMethod = getCallbackMethod(httpRequest);
		return (callbackMethod != null && callbackMethod.length() > 0);
	}

}
