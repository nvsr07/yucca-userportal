package com.example.tests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class SearchDataSet {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

  @Before
  public void setUp() throws Exception {
    driver = new FirefoxDriver();
    baseUrl = "https://int-userportal.smartdatanet.it/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void testSearchDataSet() throws Exception {
    driver.get("http://www.google.it");
    driver.get(baseUrl + "/userportal/#/home");
    for (int second = 0;; second++) {
    	if (second >= 60) fail("timeout");
    	try { if (isElementPresent(By.cssSelector("a.btn.main-action-button > span.ng-scope"))) break; } catch (Exception e) {}
    	Thread.sleep(1000);
    }

    try {
      assertTrue(isElementPresent(By.linkText("Login")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.cssSelector("small > a.btn.main-action-button > span.ng-scope")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//button[@type='submit']")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.cssSelector("a.main-menu-item.main-menu-item-management > span.ng-scope")).click();
    try {
      assertTrue(isElementPresent(By.linkText("Dataset")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.linkText("Dataset")).click();
    try {
      assertTrue(isElementPresent(By.xpath("//td[2]")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.xpath("//input[@type='text']")).clear();
    driver.findElement(By.xpath("//input[@type='text']")).sendKeys("test");
    try {
      assertTrue(isElementPresent(By.cssSelector("td.text-left")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }
    driver.findElement(By.linkText("ds_Teststreamse_213")).click();
    try {
      assertTrue(isElementPresent(By.cssSelector("div.url")));
    } catch (Error e) {
      verificationErrors.append(e.toString());
    }

  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
