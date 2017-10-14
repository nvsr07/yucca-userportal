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
		String jwt="eyJ0eXAiOiJKV1QiLCJhbGciOiJTSEEyNTZ3aXRoUlNBIiwieDV0IjoiTVRkbE5HSTRNbVUwWVRNMVpXVXdOMkppTm1SaE1qWm1ZakZoTlRVeVltTmxNRFZoTTJFNU1BIn0.eyJpc3MiOiJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheSIsImV4cCI6MTUwNzk3NDQ0MjM0MSwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvc3Vic2NyaWJlciI6ImFkbWluIiwiaHR0cDovL3dzbzIub3JnL2dhdGV3YXkvYXBwbGljYXRpb25uYW1lIjoidXNlcnBvcnRhbDIiLCJodHRwOi8vd3NvMi5vcmcvZ2F0ZXdheS9lbmR1c2VyIjoidXNlcnRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9naXZlbm5hbWUiOiJVc2VyIiwgImh0dHA6Ly93c28yLm9yZy9jbGFpbXMvaWRlbnRpdHkvdGVybUNvbmRpdGlvblRlbmFudHMiOiJ8dHN0X2NzcHx0c3RfYXJwYV9ydW1vcmV8dHN0X3JlZ3BpZXxwcm92YV96ZXJvMDAxfHByb3ZhX3plcm8wMDIiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9sYXN0bmFtZSI6IlRlc3QiLCAiaHR0cDovL3dzbzIub3JnL2NsYWltcy9yb2xlIjoidXNlcnBvcnRhbC1zdXBlcnVzZXIsdHN0X2NzcF9zdWJzY3JpYmVyLHRzdF9hcnBhX3J1bW9yZV9zdWJzY3JpYmVyLHRzdF9yZWdwaWVfc3Vic2NyaWJlcixwcm92YV96ZXJvMDAxX3N1YnNjcmliZXIsSW50ZXJuYWwvdXNlcnBvcnRhbCxJbnRlcm5hbC9zdWJzY3JpYmVyLEludGVybmFsL2V2ZXJ5b25lIn0.SaNKUtKx697QaODfyfSOmg-tqf0iGY7TU9SXaz3timRyHmrX2KphHU6SR7Du9HbwWGpS9WmC9yzYxoH0tcMKZ_xA7GAgH8rrb1_JT7so9R7jqtzkTkMFT01phVGNLab46LjL9vYCjbjhMaDTcCDZh8BEsInE8yjAihi5FoTPIGK_DP1AQUFIRI9M5xShPEc3uSmaCOPD8l6XcNdmDdREZaDg5ahMa3Bo-pmMSqnJDVCSvq-KWWsyE0WE234sSON8XpH8qfxkKUusebYjmfby2d6HEXjISMcw2LARuJAl5xovvcUHOYhvpnQmBVC60v9awQ3RuPHwvEPXhnuPynm6BA";
		
		JSONObject jsonObj = JWTUtil.getJsonFromJwt(jwt);
		
		log.info(jsonObj.toJSONString());
	}
	
}
