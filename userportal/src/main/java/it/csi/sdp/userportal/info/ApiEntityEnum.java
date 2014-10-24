package it.csi.sdp.userportal.info;

import it.csi.sdp.userportal.utils.AuthorizeUtils;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

public enum ApiEntityEnum {

	STREAM_COMPONENT("API_STREAM_COMPONENT_URL", "/userportal/api/proxy/streams/components/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.getElementInPositionByRequest(request, 3).equals(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE));
		}
	},
	STREAM("API_STREAM_URL", "/userportal/api/proxy/streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request)
					|| AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE));
		}
	},
	STREAM_LIST("API_STREAM_LIST_URL", "/userportal/api/proxy/streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request)
					|| AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE));
		}
	},
	VIRTUALENTITY("API_VIRTUALENTITY_URL", "/userportal/api/proxy/virtualentities/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request)
					|| AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE));
		}
	},
	VIRTUALENTITY_LIST("API_VIRTUALENTITY_LIST_URL", "/userportal/api/proxy/virtualentities/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request)
					|| AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(request.getSession().getAttribute(AuthorizeUtils.SESSION_KEY_TENANT_CODE));
		}
	},
	VIRTUALENTITY_CATEGORIES("API_VIRTUALENTITY_CATEGORIES_URL", "/userportal/api/proxy/misc/category/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	VIRTUALENTITY_TYPES("API_VIRTUALENTITY_TYPES_URL", "/userportal/api/proxy/misc/types/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	STREAM_TAGS("API_STREAM_TAGS_URL", "/userportal/api/proxy/misc/streamtags/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	STREAM_DOMAINS("API_STREAM_DOMAINS_URL", "/userportal/api/proxy/misc/streamdomains/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	API_STREAM_UNIT_OF_MESAUREMENT_URL("API_STREAM_UNIT_OF_MESAUREMENT_URL", "/userportal/api/proxy/misc/measureunits/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	API_STREAM_PHENOMENOM_URL("API_STREAM_PHENOMENOM_URL", "/userportal/api/proxy/misc/phenomenon/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	API_STREAM_DATATYPE_URL("API_STREAM_DATATYPE_URL", "/userportal/api/proxy/misc/datatype/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	TENANT_LIST("API_TENANT_LIST_URL", "/userportal/api/proxy/tenants/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},

	LIFECYCLE_STREAM_REQ_INST("API_LIFECYCLE_STREAM_REQ_INST", "/userportal/api/proxy/lifecycle/streams/reqinst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
//			String tenant = request.getParameter("codTenant") == null? "":request.getParameter("codTenant") ;
//			return AuthorizeUtils.isReadMethod(request)
//					|| tenant.equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
			return true;
		}
	},

	LIFECYCLE_STREAM_NEW_VERSION("API_LIFECYCLE_STREAM_NEW_VERSION", "/userportal/api/proxy/lifecycle/streams/newversion/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	LIFECYCLE_STREAM_REQ_UNINST("API_LIFECYCLE_STREAM_REQ_UNINST", "/userportal/api/proxy/lifecycle/streams/requninst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_INFO("API_INFO_URL", "/userportal/api/info") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	VIRTUALENTITY_GEO("VIRTUALENTITY_GEO_URL", "/userportal/api/proxy/virtualentitiesgeo") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	};

	private String nameEntity;
	private String baseUrl;

	private ApiEntityEnum(String nameEntity, String baseUrl) {
		this.nameEntity = nameEntity;
		this.baseUrl = baseUrl;
	}

	public abstract boolean isAuthorizeAccess(HttpServletRequest request);

	public void addPropertyForJs(Properties prop) {
		prop.put(nameEntity, baseUrl);
	}

	public boolean isApiCalled(HttpServletRequest request) {
		return (request.getRequestURI()).startsWith(baseUrl);
	}
}
