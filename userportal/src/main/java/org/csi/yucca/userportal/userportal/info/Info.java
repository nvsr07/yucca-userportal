package org.csi.yucca.userportal.userportal.info;

import com.google.gson.Gson;

public class Info {

	//private String tenantCode;
	private User user;
	private String version;

	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public Info() {
		version = "0.8.1";
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getVersion() {
		return version; // FIXME manage version
	}

	public void setVersion(String version) {
		this.version = version;
	}

//	public String getTenantCode() {
//		return tenantCode;
//	}
//
//	public void setTenantCode(String tenantCode) {
//		this.tenantCode = tenantCode;
//	}

}
