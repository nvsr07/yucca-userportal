package org.csi.yucca.userportal.backoffice.info;

import java.util.Properties;

import javax.servlet.http.HttpServletRequest;

import org.csi.yucca.userportal.backoffice.utils.AuthorizeUtils;
import org.csi.yucca.userportal.backoffice.utils.Config;

public enum ApiEntityEnum {

	API_INFO("API_INFO_URL", "/backoffice/api/info") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	// SERVICES
	API_SERVICES_STREAM_COMPONENT("API_SERVICES_STREAM_COMPONENT_URL", Config.API_PROXY_SERVICES_BASE_URL + "streams/components/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
		}
	},
	API_SERVICES_STREAM("API_SERVICES_STREAM_URL", Config.API_PROXY_SERVICES_BASE_URL + "streams/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			String activeTenant = request.getParameter("visibleFrom");
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			if((activeTenant!=null && !"".equals(activeTenant)) ){				
				if(activeTenant.equals(info.getUser().getActiveTenant()) && AuthorizeUtils.isReadMethod(request)){
					return true;
				}else{
					return false;
				}				
			}
			if(AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(info.getUser().getActiveTenant())){
				return true;
			}
			return false;
		}
	},
	API_SERVICES_TENANT("API_SERVICES_TENANT_URL", Config.API_PROXY_SERVICES_BASE_URL + "tenants/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			String activeTenant = request.getParameter("visibleFrom");
			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
//			if((activeTenant!=null && !"".equals(activeTenant)) ){				
//				if(activeTenant.equals(info.getUser().getActiveTenant()) && AuthorizeUtils.isReadMethod(request)){
//					return true;
//				}else{
//					return false;
//				}				
//			}
			if("admin".equals(info.getUser().getUsername())){
				return true;
			}
			return false;
		}
	},
	API_SERVICES_VIRTUALENTITY("API_SERVICES_VIRTUALENTITY_URL", Config.API_PROXY_SERVICES_BASE_URL + "virtualentities/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {

			Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
			if(AuthorizeUtils.getElementInPositionByRequest(request, 2).equals(info.getUser().getActiveTenant())){
				return true;
			}
			return false;
		}
	},
	API_SERVICES_VIRTUALENTITY_CATEGORIES("API_SERVICES_VIRTUALENTITY_CATEGORIES_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/category/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_VIRTUALENTITY_TYPES("API_SERVICES_VIRTUALENTITY_TYPES_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/types/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_TAGS("API_SERVICES_STREAM_TAGS_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/streamtags/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_DOMAINS("API_SERVICES_STREAM_DOMAINS_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/streamdomains/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_SUB_DOMAINS("API_SERVICES_STREAM_SUB_DOMAINS_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/streamsubdomains/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_UNIT_OF_MESAUREMENT_URL("API_SERVICES_STREAM_UNIT_OF_MESAUREMENT_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/measureunits/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_PHENOMENOM_URL("API_SERVICES_STREAM_PHENOMENOM_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/phenomenon/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_STREAM_DATATYPE_URL("API_SERVICES_STREAM_DATATYPE_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/datatype/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_TENANT_LIST("API_SERVICES_TENANT_LIST_URL", Config.API_PROXY_SERVICES_BASE_URL + "tenants/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_ECOSYSTEM_LIST("API_SERVICES_ECOSYSTEM_LIST_URL", Config.API_PROXY_SERVICES_BASE_URL + "ecosystems/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_ORGANIZATION_LIST("API_SERVICES_ORGANIZATION_LIST_URL", Config.API_PROXY_SERVICES_BASE_URL + "misc/organizationlist/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.isReadMethod(request);
		}
	},
	API_SERVICES_LIFECYCLE_STREAM_REQ_INST("API_SERVICES_LIFECYCLE_STREAM_REQ_INST", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/reqinst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// String tenant = request.getParameter("codTenant") == null?
			// "":request.getParameter("codTenant") ;
			// return AuthorizeUtils.isReadMethod(request)
			// ||
			// tenant.equals(request.getSession().getAttribute(AuthorizeUtils.TENANT_CODE));
			return true;
		}
	},

	API_SERVICES_LIFECYCLE_STREAM_NEW_VERSION("API_SERVICES_LIFECYCLE_STREAM_NEW_VERSION", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/newversion/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_SERVICES_LIFECYCLE_STREAM_REQ_UNINST("API_SERVICES_LIFECYCLE_STREAM_REQ_UNINST", Config.API_PROXY_SERVICES_BASE_URL + "lifecycle/streams/requninst/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	API_SERVICES_VIRTUALENTITY_GEO("API_SERVICES_VIRTUALENTITY_GEO_URL", Config.API_PROXY_SERVICES_BASE_URL + "virtualentitiesgeo") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},

	// MANAGEMENT
	API_MANAGEMENT_DATASET_DOWNLOAD_URL("API_MANAGEMENT_DATASET_DOWNLOAD_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/download/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			// return AuthorizeUtils.getElementInPositionByRequest(request,
			// 3).equals(AuthorizeUtils.getTenantInSession(request));
			return true;
		}
	},

	API_MANAGEMENT_DATASET_LIST("API_MANAGEMENT_DATASET_LIST_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 2));

		}
	},

	API_MANAGEMENT_DATA_STATISTICS("API_PROXY_DATA_STATISTICS_URL", Config.API_PROXY_DATA_STATISTICS_URL) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;

		}
	},

	API_MANAGEMENT_DATASET("API_MANAGEMENT_DATASET_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 2));
		}
	},
	API_MANAGEMENT_DATASET_ADD_DATA_URL("API_MANAGEMENT_DATASET_ADD_DATA_URL", Config.API_PROXY_MANAGEMENT_BASE_URL + "dataset/add/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return AuthorizeUtils.checkTenantInSession(request, AuthorizeUtils.getElementInPositionByRequest(request, 3));
		}
	},
	API_VALIDATE_SIDDHI("API_VALIDATE_SIDDHI", Config.API_PROXY_SERVICES_BASE_URL + "internalstreams/validate/") {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_FABRIC_PROXY_URL("API_FABRIC_PROXY_URL", Config.API_PROXY_FABRIC_BASE_URL ) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	},
	API_DEPLOY_PROXY_URL("API_DEPLOY_PROXY_URL", Config.API_PROXY_DEPLOY_BASE_URL ) {
		@Override
		public boolean isAuthorizeAccess(HttpServletRequest request) {
			return true;
		}
	}
	;

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
		String requestURI = request.getRequestURI();
		return (requestURI).startsWith(baseUrl);
	}
}
