package org.csi.yucca.userportal.userportal.info;

import com.google.gson.Gson;



public class User {
	private String username;
	private String tenant;
	private String firstname;
	private String lastname;
	private String email;
	private boolean loggedIn;
	
	public User(){
	}
	
	

	public User(String username, String tenant, String firstname, String lastname, String email) {
		super();
		this.username = username;
		this.tenant = tenant;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.loggedIn = false;
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

	public String getTenant() {
		return tenant;
	}

	public void setTenant(String tenant) {
		this.tenant = tenant;
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

}
