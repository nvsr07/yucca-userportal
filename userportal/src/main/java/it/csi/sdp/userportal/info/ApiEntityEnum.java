package it.csi.sdp.userportal.info;

import it.csi.sdp.userportal.utils.AuthorizeUtils;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

public enum ApiEntityEnum {
	
	STREAM_COMPONENT("DASHBOARD_API_STREAM_COMPONENT_URL","/userportal/api/proxy/streams/components/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.getElementInPositionByRequest(request, 3).equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
		}
	},
	STREAM("DASHBOARD_API_STREAM_URL","/userportal/api/proxy/streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) || 
					AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
		}
	},
	STREAM_LIST("DASHBOARD_API_STREAM_LIST_URL","/userportal/api/proxy/streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) || 
					AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
		}
	},
	VIRTUALENTITY("DASHBOARD_API_VIRTUALENTITY_URL","/userportal/api/proxy/virtualentities/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) || 
					AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
		}
	},
	VIRTUALENTITY_LIST("DASHBOARD_API_VIRTUALENTITY_LIST_URL","/userportal/api/proxy/virtualentities/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) || 
					AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
		}
	},	
	VIRTUALENTITY_CATEGORIES("DASHBOARD_API_VIRTUALENTITY_CATEGORIES_URL","/userportal/api/proxy/misc/category/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	VIRTUALENTITY_TYPES("DASHBOARD_API_VIRTUALENTITY_TYPES_URL","/userportal/api/proxy/misc/types/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	STREAM_TAGS("DASHBOARD_API_STREAM_TAGS_URL","/userportal/api/proxy/misc/streamtags/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	STREAM_DOMAINS("DASHBOARD_API_STREAM_DOMAINS_URL","/userportal/api/proxy/misc/streamdomains/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},

	DASHBOARD_API_STREAM_UNIT_OF_MESAUREMENT_URL("DASHBOARD_API_STREAM_UNIT_OF_MESAUREMENT_URL","/userportal/api/proxy/misc/measureunits/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	
	DASHBOARD_API_STREAM_PHENOMENOM_URL("DASHBOARD_API_STREAM_DOMAINS_URL","/userportal/api/proxy/misc/phenomenon/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	
	DASHBOARD_API_STREAM_DATATYPE_URL("DASHBOARD_API_STREAM_DOMAINS_URL","/userportal/api/proxy/misc/datatype/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	},
	
	TENANT_LIST("DASHBOARD_API_TENANT_LIST_URL","/userportal/api/proxy/tenants/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request) ;
		}
	};
	
	private String nameEntity;
	private String baseUrl;
	
	private ApiEntityEnum(String nameEntity, String baseUrl) {
		this.nameEntity = nameEntity;
		this.baseUrl = baseUrl;
	}
	
	public abstract boolean isAuthorizeAccess(HttpServletRequest request);
	
	public void addPropertyForJs(Properties prop)
	{
		prop.put(nameEntity, baseUrl);
	}
	
	public boolean isApiCalled(HttpServletRequest request)
	{
		return (request.getRequestURI()).startsWith(baseUrl);
	}
}
