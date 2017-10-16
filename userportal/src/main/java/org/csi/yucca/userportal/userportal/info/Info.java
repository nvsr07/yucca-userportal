package org.csi.yucca.userportal.userportal.info;

import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Info {

	//private String tenantCode;
	private User user;
	private String version;
	private Tenant personalTenantToActivated;
	private Tenant trialTenantToActivated;

	public String toJson() {
		Gson gson = JSonHelper.getInstance();
		return gson.toJson(this);
	}

	public Info() {
		version = "1.11.0";
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

	public Tenant getPersonalTenantToActivated() {
		return personalTenantToActivated;
	}

	public void setPersonalTenantToActivated(Tenant personalTenantToActivated) {
		this.personalTenantToActivated = personalTenantToActivated;
	}

	public Tenant getTrialTenantToActivated() {
		return trialTenantToActivated;
	}

	public void setTrialTenantToActivated(Tenant trialTenantToActivated) {
		this.trialTenantToActivated = trialTenantToActivated;
	}

//	public String getTenantCode() {
//		return tenantCode;
//	}
//
//	public void setTenantCode(String tenantCode) {
//		this.tenantCode = tenantCode;
//	}

}
