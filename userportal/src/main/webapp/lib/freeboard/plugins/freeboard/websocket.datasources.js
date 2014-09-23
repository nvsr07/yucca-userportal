(function()
{
	freeboard.loadDatasourcePlugin({
		"type_name"   : "websocket_stomp_plugin",
		"display_name": "Datasource Plugin For Websocket STOMP",
		"description" : "<strong>Datasource Plugin For Websocket STOMP</strong>",
		"settings"    : [
			{
				"name"         : "ws_url",
				"display_name" : "Websocket URL",
				"type"         : "text",
				"default_value": "ws://stream.smartdatanet.it/ws",
				"description"  : "Url of wesocket stomp server"
			},
			{
				"name"         : "ws_user",
				"display_name" : "Username",
				"type"         : "text",
				"default_value": "guest",
				"description"  : "Username"
			},
			{
				"name"         : "ws_pwd",
				"display_name" : "Password",
				"type"         : "text",
				"default_value": "Aekieh6F",
				"description"  : "Password"
			},
			{
				"name"         : "ws_topic",
				"display_name" : "Topic to subscribe",
				"type"         : "text",
				"default_value": "/topic/output.csp.89f84a22-1e2e-5882-bbf0-9c6efffb8ce7_FrmHyd",
				"description"  : "Topic to subscribe"
			}
		],
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new websocketStompPlugin(settings, updateCallback));
		}
	});
		var websocketStompPlugin = function(settings, updateCallback) 
		{
			var self = this;
			var currentSettings = settings;
			Stomp.WebSocketClass = ReconnectingWebSocket;
			var client = Stomp.client(settings.ws_url);
			var cont = 0;
			
			function createConnection(intSettings, intUpdateCallback,intClient)
			{
				client = intClient;
				intClient.connect(intSettings.ws_user,intSettings.ws_pwd,function(frame) 
					{
					subscribe(intSettings.ws_topic,intClient);
					},
					function(frame) 
					{
//						cont = cont +1;
//						if (cont<5) {
//							intClient = Stomp.client(settings.ws_url);
//							createConnection(intSettings, intUpdateCallback,intClient);
//						} else 
						//ert('Impossibile connettersi');
					});
			}
			
			function subscribe(wstopic,intClient)
			{
						intClient.subscribe(wstopic,
									function(message) {
										jsonMessage = JSON.parse(message.body);
										updateCallback(jsonMessage);
									}
						);
			}
			
			self.onSettingsChanged = function(newSettings)
			{
				currentSettings = newSettings;
			}
			self.updateNow = function()
			{
				createConnection(currentSettings,updateCallback,client);
			}
			self.onDispose = function()
			{
				client.disconnect();
			}
			createConnection(currentSettings,updateCallback,client);
			
		}
}());