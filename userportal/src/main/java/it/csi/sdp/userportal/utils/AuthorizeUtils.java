package it.csi.sdp.userportal.utils;

import it.csi.sdp.userportal.info.ApiEntityEnum;

import javax.servlet.http.HttpServletRequest;

public class AuthorizeUtils {

	public static boolean verifyAPIRequest(HttpServletRequest request) {
		
		for (ApiEntityEnum api : ApiEntityEnum.values()) {
			if (api.isApiCalled(request) && api.isAuthorizeAccess(request))
				return true;
		}
		return false;
		
	}




	public static boolean isAPIRequest(HttpServletRequest request) {
		String servlet = request.getServletPath();
		
		return (servlet.equals("/api/proxy"));
			
	}
	
	
}
