const { app, BrowserWindow, Tray, shell } = require("electron");
const path = require("path");
var tray = null;
app.on("ready", function() {
	var win = new BrowserWindow({
		width: 1557,
		height: 932,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});
	tray = new Tray(path.join(__dirname, "images/icon.png"));
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
	win.webContents.on("new-window", function (e, url) {
		e.preventDefault();
		shell.openExternal(url);
	});
});
