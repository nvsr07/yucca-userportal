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
	
	
	public static String getElementInPositionByRequest(HttpServletRequest request, int position)
	{
		String[] paths = request.getPathInfo().split("/");
		if (paths!=null && paths.length>=position+1)
			return paths[position];
		else 
			return "";
	}

	public static boolean isReadMethod(HttpServletRequest request)
	{
		return request.getMethod().equalsIgnoreCase("GET");
	}

	public static final String TENANT_CODE = "TENANT_CODE";
	public static final String SANDBOX = "sandbox";
	
}
