package org.csi.yucca.userportal.userportal.entity.admin.tenant;

public class Ecosystem {
	private Long idEcosystem;
	private String ecosystemcode;
	private String description;

	public Ecosystem() {
		super();
	}

	public Long getIdEcosystem() {
		return idEcosystem;
	}

	public void setIdEcosystem(Long idEcosystem) {
		this.idEcosystem = idEcosystem;
	}

	public String getEcosystemcode() {
		return ecosystemcode;
	}

	public void setEcosystemcode(String ecosystemcode) {
		this.ecosystemcode = ecosystemcode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}