package org.csi.yucca.userportal.userportal.utils;

import java.text.ParseException;

import net.minidev.json.JSONObject;

import org.apache.log4j.Logger;
import org.csi.yucca.userportal.userportal.delegate.HttpDelegate;

import com.nimbusds.jose.JWSObject;
import com.nimbusds.jwt.JWTParser;

public class JWTUtil {

	static Logger log = Logger.getLogger(HttpDelegate.class);
	static public JSONObject  getJsonFromJwt(String jwt) throws ParseException
	{
		JWSObject jwsObject;
		try {
		    jwsObject = JWSObject.parse(jwt);
		    return jwsObject.getPayload().toJSONObject();
		} catch (java.text.ParseException e) {
		    log.error("[JWTUtil::getFieldValueFromJwt] Error during parsing ["+jwt+"]",e);
		    throw e;
		}
	}
	
	
	
	public static void main(String[] args) throws ParseException {
		String jwt="eyJ0eXAiOiJKV1QiLCJhbGciOiJTSEEyNTZ3aXRoUlNBIiwieDV0IjoiTVRkbE5HSTRNbVUwWVRNMVpXVXdOMkppTm1SaE1qWm1ZakZoTlRVeVltTmxNRFZoTTJFNU1BIn0.eyJpc3MiOiJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheSIsImV4cCI6MTUwNzk3OTc1MTI2MiwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvc3Vic2NyaWJlciI6ImFkbWluIiwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvYXBwbGljYXRpb25uYW1lIjoidXNlcnBvcnRhbDIiLCJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheS9lbmR1c2VyIjoidXNlcnRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9naXZlbm5hbWUiOiJVc2VyIiwgImh0dHA6Ly93c28yLm9yZy9jbGFpbXMvaWRlbnRpdHkvdGVybUNvbmRpdGlvblRlbmFudHMiOiJ8dHN0X2NzcHx0c3RfYXJwYV9ydW1vcmV8dHN0X3JlZ3BpZXxwcm92YV96ZXJvMDAxfHByb3ZhX3plcm8wMDIiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9sYXN0bmFtZSI6IlRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9yb2xlIjoidXNlcnBvcnRhbC1zdXBlcnVzZXIsdHN0X2NzcF9zdWJzY3JpYmVyLHRzdF9hcnBhX3J1bW9yZV9zdWJzY3JpYmVyLHRzdF9yZWdwaWVfc3Vic2NyaWJlcixwcm92YV96ZXJvMDAxX3N1YnNjcmliZXIsSW50ZXJuYWwvdXNlcnBvcnRhbCxJbnRlcm5hbC9zdWJzY3JpYmVyLEludGVybmFsL2V2ZXJ5b25lIn0.h05V-5rwNK-LfEFO2bAPRo4W5krolqabdOk8XreCD4HuUktvWelwwIz-AnhQuOa-Cw-wCBlwfj_JWeUa8M4Wkl2UoajMdhI7z6W5tMDfakrlnob3BtOaTwCgPROl5r1h4moXX9u9wiOZXRrZ_uyeWOXJPOVgpIOfq_MnB2z0iniKVN0pkEQkVubcKZIqxbfxYn589fTknPGj30URrIQndiIidRObu01u3Vg_GjNO0rj6mLLu_K__ZH9XiNxo88-NpLvsuf2SeanzWzlFdG5lqeEZQ1ALUYSicbvvrhZfNhpjV7wG-b2My_vpxQ_tvcD8rhk-FVAHxPrJheAg1yMVZA";
		
		JSONObject jsonObj = JWTUtil.getJsonFromJwt(jwt);
		
		log.info(jsonObj.toJSONString());
	}
	
}
