package org.csi.yucca.userportal.userportal.test;

import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class TryToHackDetailIT extends SeleniumBase {

	@BeforeClass
	public void setUpSecretObject() throws IOException {
		super.setUpSecretObject("/testSecret.json");
	}
	
	
	
	@DataProvider(name = "UserportalTryToHackDetail")
	public Iterator<Object[]> getFromHackJson() {

		return super.getFromJson("/UserportalTryToHackDetail.json");

	}	
	
	
	
	@Test(dataProvider="UserportalTryToHackDetail", singleThreaded= true)
	public void tryToHackDataset(JSONObject dato) {
		String detailUrl = dato.getString("up.detailUrl");
		
		driver.navigate().to(dato.getString("up.url"));
		Assert.assertEquals(driver.getTitle(), "Smart Data Platform");
		
		
		if (dato.getBoolean("up.logged"))
		{
			
			driver.navigate().to(dato.getString("up.url")+"/userportal/api/authorize?returnUrl=%23%2Fhome%3FscrollTo%3Dhome-operation-section-anchor");
			driver.findElement(By.name("username")).sendKeys(dato.getString("up.username"));
			driver.findElement(By.name("password")).sendKeys(dato.getString("up.password"));
			driver.findElement(By.id("loginForm")).submit();
		}
		
		WebDriverWait wait = new WebDriverWait(driver, 1);
		driver.navigate().to(dato.getString("up.url")+"/userportal/api/proxy/services/"+detailUrl+(dato.optString("up.visibleFrom")==null?"":"?visibleFrom="+dato.optString("up.visibleFrom")));

		if (!dato.getBoolean("up.authorized"))
		{
			Assert.assertEquals(driver.getPageSource(),"{\"error_message\":\"Unauthorized access\"}");
		}
		else {
			Assert.assertNotEquals(driver.getPageSource(),"{\"error_message\":\"Unauthorized access\"}");
		}
		
		if (dato.getBoolean("up.logged"))
		{
			driver.navigate().to(dato.getString("up.url")+"/userportal/api/authorize?logout="+dato.getString("up.username")+"&returnUrl=%23%2Fhome");
		}
	}
	
}
