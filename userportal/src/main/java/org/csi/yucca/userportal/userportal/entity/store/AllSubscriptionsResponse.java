package org.csi.yucca.userportal.userportal.entity.store;

import java.util.List;

import com.google.gson.annotations.SerializedName;

public class AllSubscriptionsResponse {
	private boolean error;

	@SerializedName("subscriptions")
	private List<ApplicationSubscription> subscriptions;

	public AllSubscriptionsResponse() {
		super();
	}

	public boolean getError() {
		return error;
	}

	public void setError(boolean error) {
		this.error = error;
	}

	public List<ApplicationSubscription> getSubscriptions() {
		return subscriptions;
	}

	public void setSubscriptions(List<ApplicationSubscription> subscriptions) {
		this.subscriptions = subscriptions;
	}

}
