package org.csi.yucca.userportal.userportal.test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.TimeUnit;

import org.json.JSONArray;
import org.json.JSONObject;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

public class SeleniumBase {
	protected WebDriver driver;
	protected static JSONObject secretObject = new JSONObject();
		
	
	protected void recreateDriver() {
		if (driver!=null) {
			driver.quit();
		}
		String xvfbPropsFile = System.getProperty("display.props");

//		FirefoxBinary ffox = new FirefoxBinary();
//		ffox.setEnvironmentProperty("DISPLAY", /*read value from xvfbPropsFile*/);
		
		
		FirefoxProfile profile = new FirefoxProfile();
		profile.setPreference("browser.cache.disk.enable", false);
		profile.setPreference("browser.cache.memory.enable", false);
		profile.setPreference("browser.cache.offline.enable", false);
		profile.setPreference("network.http.use-cache", false);
		driver = new FirefoxDriver(profile);
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	}
	
	public void setUpSecretObject(String file) throws IOException {
		String str = readFile(file);
		secretObject = new JSONObject(str);

	}

	protected static Iterator<Object[]> getFromJson(String file) {
		ArrayList<Object[]> data = new ArrayList();

		String str = readFile(file);
		JSONObject json = new JSONObject(str);
		JSONArray jsArray = json.getJSONArray("data");

		for (int i = 0; i < jsArray.length(); i++) {
			JSONObject arr = jsArray.getJSONObject(i);

			// merge with secret

			Iterator iterSecret = secretObject.keys();
			String tmp_key;
			while (iterSecret.hasNext()) {
				tmp_key = (String) iterSecret.next();
				if (!arr.has(tmp_key)) {
					arr.put(tmp_key, secretObject.get(tmp_key));
				}
			}

			data.add(new Object[] { arr });
		}

		return data.iterator();

	}

	protected static String readFile(String file) {
		String jsonData = "";
		BufferedReader br = null;
		try {
			String line;
			InputStream inputStream = SeleniumBase.class.getResourceAsStream(file);
			if (inputStream!=null)
			{
				InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
				br = new BufferedReader(inputStreamReader);
				while ((line = br.readLine()) != null) {
					jsonData += line + "\n";
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null)
					br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return jsonData;
	}
	
	@BeforeMethod
	public void setupSelenium() {
		// Start the browser (firefox for now)
		//driver = new FirefoxDriver();
		recreateDriver();
	}
	
	@AfterTest
    public void closeSelenium(){
		if (driver!=null)
			driver.quit();
    }
}
