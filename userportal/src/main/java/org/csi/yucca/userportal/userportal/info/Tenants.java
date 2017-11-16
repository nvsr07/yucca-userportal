package org.csi.yucca.userportal.userportal.info;

import java.util.List;

import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

public class Tenants {

	private List<Tenant> tenant;

	public Tenants() {
		// TODO Auto-generated constructor stub
	}	
	
	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public static Tenants fromJson(String json) {
		Gson gson = JSonHelper.getInstance();
		return gson.fromJson(json, Tenants.class);
	}

	public List<Tenant> getTenant() {
		return tenant;
	}

	public void setTenant(List<Tenant> tenant) {
		this.tenant = tenant;
	}

}
