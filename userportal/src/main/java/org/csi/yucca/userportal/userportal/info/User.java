package org.csi.yucca.userportal.userportal.info;

import java.util.LinkedList;
import java.util.List;

import com.google.gson.Gson;

public class User {
	private String username;
	private List<String> tenants;
	private String firstname;
	private String lastname;
	private String email;
	private boolean loggedIn;
	private List<String> permissions;

	public User() {
	}

	public User(String username, List<String> tenants, String firstname, String lastname, String email, List<String> permissions) {
		super();
		this.username = username;
		this.tenants = tenants;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.loggedIn = false;
		this.permissions = permissions;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getTenants() {
		return tenants;
	}

	public void setTenants(List<String> tenants) {
		this.tenants = tenants;
	}

	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public boolean getLoggedIn() {
		return loggedIn;
	}

	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}

	public void addRole(String permission) {
		if (getPermissions() == null)
			setPermissions(new LinkedList<String>());
		getPermissions().add(permission);
	}

	public void removeRole(String permission) {
		if (getPermissions() != null) {
			getPermissions().remove(permission);
			if (getPermissions().size() == 0)
				setPermissions(null);
		}
	}

	public List<String> getPermissions() {
		return permissions;
	}

	public void setPermissions(List<String> permissions) {
		this.permissions = permissions;
	}
}
