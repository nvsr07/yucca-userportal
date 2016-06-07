package org.csi.yucca.userportal.userportal.info;

import org.csi.yucca.userportal.userportal.utils.json.JSonHelper;

import com.google.gson.Gson;

public class Tenant {

	private Long idTenant;
	private String tenantName;
	private String tenantDescription;
	private String tenantCode;
	private Integer maxDatasetNum;
	private Integer maxStreamsNum;
	private String tenantType;
	private String codDeploymentStatus;
	private String dataAttivazione;
	private String dataDisattivazione;
	private Integer numGiorniAttivo;
	private Long idEcosystem;
	private String organizationCode;


	public Tenant() {
	}

	public String toJson() {
		Gson gson = new Gson();
		return gson.toJson(this);
	}

	public static Tenant fromJson(String json) {
		Gson gson = JSonHelper.getInstance();
		return gson.fromJson(json, Tenant.class);
	}

	public Long getIdTenant() {
		return idTenant;
	}

	public void setIdTenant(Long idTenant) {
		this.idTenant = idTenant;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public String getTenantDescription() {
		return tenantDescription;
	}

	public void setTenantDescription(String tenantDescription) {
		this.tenantDescription = tenantDescription;
	}

	public String getTenantCode() {
		return tenantCode;
	}

	public void setTenantCode(String tenantCode) {
		this.tenantCode = tenantCode;
	}

	public Integer getMaxDatasetNum() {
		return maxDatasetNum;
	}

	public void setMaxDatasetNum(Integer maxDatasetNum) {
		this.maxDatasetNum = maxDatasetNum;
	}

	public Integer getMaxStreamsNum() {
		return maxStreamsNum;
	}

	public void setMaxStreamsNum(Integer maxStreamsNum) {
		this.maxStreamsNum = maxStreamsNum;
	}

	public String getTenantType() {
		return tenantType;
	}

	public void setTenantType(String tenantType) {
		this.tenantType = tenantType;
	}

	public String getCodDeploymentStatus() {
		return codDeploymentStatus;
	}

	public void setCodDeploymentStatus(String codDeploymentStatus) {
		this.codDeploymentStatus = codDeploymentStatus;
	}

	public String getDataAttivazione() {
		return dataAttivazione;
	}

	public void setDataAttivazione(String dataAttivazione) {
		this.dataAttivazione = dataAttivazione;
	}

	public String getDataDisattivazione() {
		return dataDisattivazione;
	}

	public void setDataDisattivazione(String dataDisattivazione) {
		this.dataDisattivazione = dataDisattivazione;
	}

	public Integer getNumGiorniAttivo() {
		return numGiorniAttivo;
	}

	public void setNumGiorniAttivo(Integer numGiorniAttivo) {
		this.numGiorniAttivo = numGiorniAttivo;
	}

	public Long getIdEcosystem() {
		return idEcosystem;
	}

	public void setIdEcosystem(Long idEcosystem) {
		this.idEcosystem = idEcosystem;
	}

	public String getOrganizationCode() {
		return organizationCode;
	}

	public void setOrganizationCode(String organizationCode) {
		this.organizationCode = organizationCode;
	}

	public static final Tenant SANDBOX() {
		Tenant sandbox = new Tenant();
		sandbox.setIdTenant(1L);
		sandbox.setTenantName("sandbox");
		sandbox.setTenantCode("sandbox");
		sandbox.setMaxDatasetNum(-1);
		sandbox.setMaxStreamsNum(-1);
		sandbox.setTenantType("readonly");
		sandbox.setCodDeploymentStatus("inst");
		sandbox.setNumGiorniAttivo(-1);
		sandbox.setIdEcosystem(1L);
		sandbox.setOrganizationCode("SANDBOX");
		return sandbox;
	}
}
