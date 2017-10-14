package org.csi.yucca.userportal.userportal.info;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;

public class UserJsonExclusionStrategy implements ExclusionStrategy {

	public boolean shouldSkipField(FieldAttributes f) {
		return (f.getName().startsWith("secret"));
	}

	public boolean shouldSkipClass(Class<?> clazz) {
		return false;
	}

}