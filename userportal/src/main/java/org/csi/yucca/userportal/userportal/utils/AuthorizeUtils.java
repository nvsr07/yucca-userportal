package org.csi.yucca.userportal.userportal.utils;

import org.csi.yucca.userportal.userportal.info.ApiEntityEnum;
import org.csi.yucca.userportal.userportal.info.Info;
import org.csi.yucca.userportal.userportal.info.User;
import org.csi.yucca.userportal.userportal.utils.AuthorizeUtils;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class AuthorizeUtils {

	public static final String SESSION_KEY_INFO = "SESSION_KEY_INFO";
	public static final String SESSION_KEY_USER = "SESSION_KEY_USER";
	// public static final String SESSION_KEY_TENANT_CODE =
	// "SESSION_KEY_TENANT_CODE";
	public static final String SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION = "SESSION_KEY_RETURN_PATH_AFTER_AUTHENTICATION";

	public static final String DEFAULT_TENANT = "sandbox";
	public static final User DEFAULT_USER = new User("Guest", DEFAULT_TENANT, "Guest", "Guest", null);

	public static final String CLAIM_KEY_USERNAME = "USERNAME";
	public static final String CLAIM_KEY_OTHERPHONE = "OTHERPHONE";
	public static final String CLAIM_KEY_DOB = "DOB";
	public static final String CLAIM_KEY_PRIMARY_CHALLENGE_QUESTION = "PRIMARY_CHALLENGE_QUESTION";
	public static final String CLAIM_KEY_ROLE = "ROLE";
	public static final String CLAIM_KEY_CHALLENGE_QUESTION_1 = "CHALLENGE_QUESTION_1";
	public static final String CLAIM_KEY_TELEPHONE = "TELEPHONE";
	public static final String CLAIM_KEY_MOBILE = "MOBILE";
	public static final String CLAIM_KEY_COUNTRY = "COUNTRY";
	public static final String CLAIM_KEY_CHALLENGE_QUESTION_URIS = "CHALLENGE_QUESTION_URIS";
	public static final String CLAIM_KEY_POSTALCODE = "POSTALCODE";
	public static final String CLAIM_KEY_CHALLENGE_QUESTION_2 = "CHALLENGE_QUESTION_2";
	public static final String CLAIM_KEY_IDENTITY_ACCOUNTLOCKED = "IDENTITY_ACCOUNTLOCKED";
	public static final String CLAIM_KEY_NICKNAME = "NICKNAME";
	public static final String CLAIM_KEY_STREET_ADDRESS = "STREET_ADDRESS";
	public static final String CLAIM_KEY_URL = "URL";
	public static final String CLAIM_KEY_GIVEN_NAME = "GIVEN_NAME";
	public static final String CLAIM_KEY_EMAIL_ADDRESS = "EMAIL_ADDRESS";
	public static final String CLAIM_KEY_ONE_TIME_PASSWORD = "ONE_TIME_PASSWORD";
	public static final String CLAIM_KEY_REGION = "REGION";
	public static final String CLAIM_KEY_GENDER = "GENDER";
	public static final String CLAIM_KEY_FULLNAME = "FULLNAME";
	public static final String CLAIM_KEY_PASSWORD_TIMESTAMP = "PASSWORD_TIMESTAMP";
	public static final String CLAIM_KEY_TITLE = "TITLE";
	public static final String CLAIM_KEY_LOCALITY = "LOCALITY";
	public static final String CLAIM_KEY_STATE_OR_PROVINCE = "STATE_OR_PROVINCE";
	public static final String CLAIM_KEY_IM = "IM";
	public static final String CLAIM_KEY_TENANT = "TENANT";
	public static final String CLAIM_KEY_LASTNAME = "LASTNAME";

	public static Map<String, String> claimsKeys;

	public static final String CLAIM_DIALECT_WSO2 = "WSO2";

	public static boolean verifyAPIRequest(HttpServletRequest request) {

		for (ApiEntityEnum api : ApiEntityEnum.values()) {
			if (api.isApiCalled(request) && api.isAuthorizeAccess(request))
				return true;
		}
		return false;

	}

	public static boolean isAPIRequest(HttpServletRequest request) {
		String servlet = request.getServletPath();
		return (servlet.startsWith("/api/proxy"));
	}

	public static String getElementInPositionByRequest(HttpServletRequest request, int position) {
		String[] paths = request.getPathInfo().split("/");
		if (paths != null && paths.length >= position + 1)
			return paths[position];
		else
			return "";
	}

	public static boolean isReadMethod(HttpServletRequest request) {
		return request.getMethod().equalsIgnoreCase("GET");
	}

	public static Map<String, String> getClaimsMap() {
		return getClaimsMap(CLAIM_DIALECT_WSO2);
	}

	public static Map<String, String> getClaimsMap(String dialect) {
		if (claimsKeys == null) {
			claimsKeys = new HashMap<String, String>();
			if (CLAIM_DIALECT_WSO2.equals(dialect)) {
				claimsKeys.put(CLAIM_KEY_USERNAME, "Subject");
				claimsKeys.put(CLAIM_KEY_TENANT, "http://wso2.org/claims/organization");
				claimsKeys.put(CLAIM_KEY_EMAIL_ADDRESS, "http://wso2.org/claims/emailaddress");
				claimsKeys.put(CLAIM_KEY_OTHERPHONE, "http://wso2.org/claims/otherphone");
				claimsKeys.put(CLAIM_KEY_DOB, "http://wso2.org/claims/dob");
				claimsKeys.put(CLAIM_KEY_PRIMARY_CHALLENGE_QUESTION, "http://wso2.org/claims/primaryChallengeQuestion");
				claimsKeys.put(CLAIM_KEY_ROLE, "http://wso2.org/claims/role");
				claimsKeys.put(CLAIM_KEY_CHALLENGE_QUESTION_1, "http://wso2.org/claims/challengeQuestion1");
				claimsKeys.put(CLAIM_KEY_TELEPHONE, "http://wso2.org/claims/telephone");
				claimsKeys.put(CLAIM_KEY_MOBILE, "http://wso2.org/claims/mobile");
				claimsKeys.put(CLAIM_KEY_COUNTRY, "http://wso2.org/claims/country");
				claimsKeys.put(CLAIM_KEY_CHALLENGE_QUESTION_URIS, "http://wso2.org/claims/challengeQuestionUris");
				claimsKeys.put(CLAIM_KEY_POSTALCODE, "http://wso2.org/claims/postalcode");
				claimsKeys.put(CLAIM_KEY_CHALLENGE_QUESTION_2, "http://wso2.org/claims/challengeQuestion2");
				claimsKeys.put(CLAIM_KEY_IDENTITY_ACCOUNTLOCKED, "http://wso2.org/claims/identity/accountLocked");
				claimsKeys.put(CLAIM_KEY_NICKNAME, "http://wso2.org/claims/nickname");
				claimsKeys.put(CLAIM_KEY_STREET_ADDRESS, "http://wso2.org/claims/streetaddress");
				claimsKeys.put(CLAIM_KEY_URL, "http://wso2.org/claims/url");
				claimsKeys.put(CLAIM_KEY_GIVEN_NAME, "http://wso2.org/claims/givenname");
				claimsKeys.put(CLAIM_KEY_ONE_TIME_PASSWORD, "http://wso2.org/claims/oneTimePassword");
				claimsKeys.put(CLAIM_KEY_REGION, "http://wso2.org/claims/region");
				claimsKeys.put(CLAIM_KEY_GENDER, "http://wso2.org/claims/gender");
				claimsKeys.put(CLAIM_KEY_FULLNAME, "http://wso2.org/claims/fullname");
				claimsKeys.put(CLAIM_KEY_PASSWORD_TIMESTAMP, "http://wso2.org/claims/passwordTimestamp");
				claimsKeys.put(CLAIM_KEY_TITLE, "http://wso2.org/claims/title");
				claimsKeys.put(CLAIM_KEY_LOCALITY, "http://wso2.org/claims/locality");
				claimsKeys.put(CLAIM_KEY_STATE_OR_PROVINCE, "http://wso2.org/claims/stateorprovince");
				claimsKeys.put(CLAIM_KEY_IM, "http://wso2.org/claims/im");
				claimsKeys.put(CLAIM_KEY_LASTNAME, "http://wso2.org/claims/lastname");
			}
		}
		return claimsKeys;

	}

	public static String getTenantInSession(HttpServletRequest request) {
		String tenant = DEFAULT_TENANT;
		Info info = (Info) request.getSession(true).getAttribute(AuthorizeUtils.SESSION_KEY_INFO);
		if (info != null && !Util.nvlt(info.getTenantCode()).equals("")) {
			tenant = info.getTenantCode();
		}
		return tenant;

	}

}
