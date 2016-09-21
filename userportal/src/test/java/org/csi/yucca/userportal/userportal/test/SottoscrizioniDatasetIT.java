package org.csi.yucca.userportal.userportal.test;

import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.json.JSONArray;
import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class SottoscrizioniDatasetIT extends SeleniumBase {

	@BeforeClass
	public void setUpSecretObject() throws IOException {
		super.setUpSecretObject("/testSecret.json");
	}   

	@DataProvider(name = "UserportalDatasetDettaglioSubscription")
	public Iterator<Object[]> getFromJson() {

		return super.getFromJson("/UserportalDatasetDettaglioSubscription.json");
	}

	@Test(dataProvider = "UserportalDatasetDettaglioSubscription", singleThreaded = true)
	public void viewDataset(JSONObject dato) {
		String tenant = dato.getString("up.tenantCode");
		String dataset = dato.getString("up.datasetCode");

		driver.navigate().to(dato.getString("up.url"));
		Assert.assertEquals(driver.getTitle(), "Smart Data Platform");

		if (dato.getBoolean("up.logged")) {

			driver.navigate().to(dato.getString("up.url") + "/userportal/api/authorize?returnUrl=%23%2Fhome%3FscrollTo%3Dhome-operation-section-anchor");
			driver.findElement(By.name("username")).sendKeys(dato.getString("up.username"));
			driver.findElement(By.name("password")).sendKeys(dato.getString("up.password"));
			driver.findElement(By.id("loginForm")).submit();
			driver.navigate().to(dato.getString("up.url"));
			Assert.assertEquals(driver.getTitle(), "Smart Data Platform");
		}

		WebDriverWait wait = new WebDriverWait(driver, 2);
		driver.navigate().to(dato.getString("up.url") + "/userportal/#/management/viewDataset/" + tenant + "/" + dataset);
		if (dato.getBoolean("up.toBeFound")) {
			wait.until(ExpectedConditions.textToBe(By.cssSelector(".url > strong:nth-child(1)"), dataset));

			driver.navigate().to(dato.getString("up.url") + "/userportal/#/management/editDataset/" + tenant + "/" + dataset);
			try {
				if (dato.getBoolean("up.isPublic"))
					driver.findElement(By.id("RadioGroupVisibility_0")).click(); // public
				else {
					driver.findElement(By.id("RadioGroupVisibility_1")).click(); // private

					JSONArray isShare = dato.getJSONArray("up.isShare");
					//Select select = new Select(driver.findElement(By.cssSelector("select.input-sm.form-control.ng-pristine.ng-valid")));
					Select select = new Select(driver.findElement(By.xpath("//*[@ng-model='newTenantSharing']")));
					
					//select.deselectAll();  driver.findElement(By.cssSelector("span.label.label-custom.label-tenant-sharing > a")).click(); 
					for (int i = 0; i < isShare.length(); i++) {
						select.selectByVisibleText(isShare.get(i).toString());
						driver.findElement(By.cssSelector("span.input-group-btn > a.btn.btn-sm")).click(); 
					}
				}
				driver.findElement(By.cssSelector("a.btn.btn-default.ng-scope")).click();
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".alert-danger")));
			} catch (TimeoutException e1) {
				Assert.assertTrue(true);
				return;
			}
		} else {
			/*
			try {
				wait.until(ExpectedConditions.textToBe(By.cssSelector("small.ng-binding"), dataset + " -"));
			} catch (TimeoutException e) {
				driver.navigate().to(dato.getString("up.url") + "/userportal/#/dataexplorer/" + tenant + "/" + dataset);
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".alert-danger")));
				Assert.assertTrue(true);
				return;
			}
			Assert.assertTrue(false);
			*/
		}

		if (dato.getBoolean("up.logged")) {
			driver.navigate().to(dato.getString("up.url") + "/userportal/api/authorize?logout=" + dato.getString("up.username") + "&returnUrl=%23%2Fhome");
		}
	}
}