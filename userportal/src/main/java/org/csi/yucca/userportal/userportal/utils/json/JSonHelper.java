package org.csi.yucca.userportal.userportal.utils.json;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSonHelper {
	private static Gson gson;

	public static Gson getInstance() {
		if (gson == null)
			gson = new GsonBuilder().setExclusionStrategies(new GSONExclusionStrategy()).disableHtmlEscaping().setPrettyPrinting().create();
		return gson;
	}

}
