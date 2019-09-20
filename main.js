const { app, BrowserWindow, Menu, Tray } = require("electron");
app.on("ready", function() {
	var win = new BrowserWindow({
		width: 1557,
		height: 932,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});
	var tray = null;
	tray = new Tray("images/icon.png");
	tray.setToolTip("α CLOCK Desktop");
	tray.setIgnoreDoubleClickEvents(true);
	tray.on("click", function (_e) {
		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		};
	});
	win.loadFile("index.html");
});