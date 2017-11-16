package org.csi.yucca.userportal.userportal.info;

import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

public class TenantsContainer {

	private Tenants tenants;

	public TenantsContainer() {
		// TODO Auto-generated constructor stub
	}

	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public static TenantsContainer fromJson(String json) {
		Gson gson = JSonHelper.getInstance();
		return gson.fromJson(json, TenantsContainer.class);
	}

	public Tenants getTenants() {
		return tenants;
	}

	public void setTenants(Tenants tenants) {
		this.tenants = tenants;
	}

}
