package org.csi.yucca.userportal.userportal.info;

import java.util.List;

import com.google.gson.Gson;

public class Info {

	//private String tenantCode;
	private User user;
	private String version;
	private Tenant personalTenant;
	private Tenant trialTenant;

	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public Info() {
		version = "1.4.7";
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

	public Tenant getPersonalTenant() {
		return personalTenant;
	}

	public void setPersonalTenant(Tenant personalTenant) {
		this.personalTenant = personalTenant;
	}

	public Tenant getTrialTenant() {
		return trialTenant;
	}

	public void setTrialTenant(Tenant trialTenant) {
		this.trialTenant = trialTenant;
	}

//	public String getTenantCode() {
//		return tenantCode;
//	}
//
//	public void setTenantCode(String tenantCode) {
//		this.tenantCode = tenantCode;
//	}

}
