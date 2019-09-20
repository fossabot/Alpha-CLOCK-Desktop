const { app, BrowserWindow } = require("electron");
app.on("ready", function() {
	var win = new BrowserWindow({
		width: 1557,
		height: 932,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});
	win.loadFile("index.html");	
});
