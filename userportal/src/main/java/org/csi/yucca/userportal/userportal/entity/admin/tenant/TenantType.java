package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class TenantType {
	private Long idTenantType;
	private String tenanttypecode;
	private String description;

	public TenantType() {
		super();
	}

	public Long getIdTenantType() {
		return idTenantType;
	}

	public void setIdTenantType(Long idTenantType) {
		this.idTenantType = idTenantType;
	}

	public String getTenanttypecode() {
		return tenanttypecode;
	}

	public void setTenanttypecode(String tenanttypecode) {
		this.tenanttypecode = tenanttypecode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
