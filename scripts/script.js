$(function () {
	const request = require("request");
	request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
		eval(body);
		for (i = 0; i < a_clock_heritage_data.length; i++) {
			$("#content").append("<div class='heritage'><div class='overlay'><div class='title'>" + a_clock_heritage_data[i].name.en + (a_clock_heritage_data[i].is_new ? "<span class='bx--tag'>NEW</span>" : "") + "</div><div class='description'>" + a_clock_heritage_data[i].country.en + "</div><div class='bx--btn-set'><button class='acd-btn-select bx--btn bx--btn--primary' data='" + a_clock_heritage_data[i].id + "'>Select Scene</button><button class='acd-btn-open bx--btn bx--btn--secondary bx--btn--icon-only' data='" + a_clock_heritage_data[i].id + "'><img src='images/browser.svg'></button><button class='acd-btn-download bx--btn bx--btn--secondary bx--btn--icon-only' data='" + a_clock_heritage_data[i].id + "'><img src='images/download.svg'></button></div></div><img class='preview' src='https://www.sony.net/united/clock/share/img/photo/" + a_clock_heritage_data[i].id + "/fp/" + a_clock_heritage_data[i].thumbnail_default + ".jpg'></div>");
		};
		$(".bx--loading").detach();
	});
	const { remote } = require("electron");
	$("#minimize").click(function (_e) {
		remote.BrowserWindow.getFocusedWindow().hide();
	});
	$("#close").click(function (_e) {
		remote.BrowserWindow.getFocusedWindow().close();
	});
	const fs = require("fs");
	if (fs.existsSync("current.txt")) {
		name();
	};
	fs.watchFile("current.txt", function (_curr, _prev) {
		main();
		name();
	});
});
$(document).on("change", "#toggle", function () {
	if (this.checked) {
		main();
	} else {
		const schedule = require("node-schedule");
		Object.values(schedule.scheduledJobs).map(job => {
			schedule.cancelJob(job.name);
		});
	};
});
$(document).on("click", ".acd-btn-select", function () {
	const fs = require("fs");
	var data = $(this).attr("data");
	fs.writeFileSync("current.txt", data);
	const request = require("request");
	request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
		eval(body);
		var temp = a_clock_heritage_data.filter(x => x.id == data);
		$(".bx--header__name--prefix").text(temp[0].name.en);
	});
});
$(document).on("click", ".acd-btn-open", function () {
	const { shell } = require("electron");
	shell.openExternal("https://www.sony.net/united/clock/heritage/" + $(this).attr("data") + "/");
});
$(document).on("click", ".acd-btn-download", function () {
	var data = $(this).attr("data");
	const request = require("request");
	request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
		eval(body);
		var temp = a_clock_heritage_data.filter(x => x.id == data)[0];
		$("#content").hide();
		$("body").append("<div class='download'><div class='block'><div class='title'>" + temp.name.en + "</div><section class='bx--structured-list'><div class='bx--structured-list-thead'><div class='bx--structured-list-row bx--structured-list-row--header-row'><div class='bx--structured-list-th'>Method</div><div class='bx--structured-list-th'>Description</div><div class='bx--structured-list-th'>Link</div></div></div><div class='bx--structured-list-tbody'><div class='bx--structured-list-row'><div class='bx--structured-list-td'>Default</div><div class='bx--structured-list-td'>Downloads resources only, including snapshots, music tracks and soundscapes, but without a way to automatically set it as wallpaper.</div><div class='bx--structured-list-td'><a class='dl-link' data-heritage='" + temp.id + "' data-method='def' href='#'>Download</a></div></div><div class='bx--structured-list-row'><div class='bx--structured-list-td'>WinDynamicDesktop</div><div class='bx--structured-list-td'>Downloads the photos and converts them into a theme to use with WinDynamicDesktop on Windows.</div><div class='bx--structured-list-td'><a class='dl-link' data-heritage='" + temp.id + "' data-method='wdd' href='#'>Download</a></div></div><div class='bx--structured-list-row'><div class='bx--structured-list-td'>macOS</div><div class='bx--structured-list-td'>Downloads the photos and converts them into a dynamic wallpaper to use on macOS Mojave or later.</div><div class='bx--structured-list-td'><a class='dl-link' data-heritage='" + temp.id + "' data-method='mac' href='#'>Download</a></div></div><div class='bx--structured-list-row'><div class='bx--structured-list-td'>GNOME</div><div class='bx--structured-list-td'>Downloads the photos and converts them into a time-shifting wallpaper to use with GNOME-based environments.</div><div class='bx--structured-list-td'><a class='dl-link' data-heritage='" + temp.id + "' data-method='gtw' href='#'>Download</a></div></div></div></section></div></div>");
		$(".bx--header__name").hide();
		$(".bx--header").prepend("<button class='acd-btn-return bx--header__action' type='button' id='return'><img src='images/return.svg'></button>");
	});
});
$(document).on("click", ".dl-link", function () {
	var dataHeritage = $(this).attr("data-heritage");
	var dataMethod = $(this).attr("data-method");
	const { dialog } = require("electron").remote;
	var dataDirectory = dialog.showOpenDialogSync({
		properties: ["openDirectory"]
	});
	if (dataDirectory == undefined) {
		return;
	};
	dataDirectory = dataDirectory[0];
	const request = require("request");
	request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
		eval(body);
		var dataResponse = a_clock_heritage_data.filter(x => x.id == dataHeritage)[0];
		const fs = require("fs");
		const path = require("path");
		const sanitize = require("sanitize-filename");
		dataDirectory = path.join(dataDirectory, sanitize(dataResponse.name.en, {
			replacement: "_"
		}));
		if (fs.existsSync(dataDirectory)) {
			alert("Directory already exists!");
			return;
		};
		fs.mkdirSync(dataDirectory, {
			recursive: true
		});
		process.chdir(dataDirectory);
		switch (dataMethod) {
			case "def":
				$(".acd-btn-return").addClass("acd-btn-return-disabled");
				$(".dl-link").addClass("dl-link-disabled");
				var dataLinks = [];
				var dataResolutions = ["3840_2160", "1920_1200", "1920_1080", "1280_1024"];
				for (i = 0; i < 12; i++) {
					for (j = 0; j < dataResolutions.length; j++) {
						dataLinks.push("https://di.update.sony.net/ACLK/wallpaper/" + dataResponse.id + "/" + dataResolutions[j] + "/fp/" + dataResponse.id + "_" + dataResolutions[j] + "_fp_" + (i + 1).toString().padStart(2, "0") + ".zip");
					};
				};
				for (i = 0; i < 10; i++) {
					for (j = 0; j < dataResolutions.length; j++) {
						dataLinks.push("https://di.update.sony.net/ACLK/wallpaper/" + dataResponse.id + "/" + dataResolutions[j] + "/ss/" + dataResponse.id + "_" + dataResolutions[j] + "_ss_" + (i + 1).toString().padStart(2, "0") + ".zip");
					};
				};
				if (dataResponse.music) {
					dataLinks.push("https://www.sony.net/united/clock/assets/sound/theme_song_of_world_heritage_" + dataResponse.music + ".mp3");
				};
				if (dataResponse.soundscape) {
					dataLinks.push("https://www.sony.net" + dataResponse.soundscape.media.mp3);
				};
				const async = require("async");
				var dataThreads = 1;
				var dataFilesSuccess = 0;
				var dataFilesErorr = 0;
				$(".block .description").remove();
				$(".block").append("<div class='description'></div>");
				async.eachOfLimit(dataLinks, dataThreads, function (asyncData, key, callback) {
					$(".block .description").html("Downloading <a href='" + asyncData + "'>" + asyncData + "</a> (" + (key + 1) + " of " + dataLinks.length + ")...");
					request({
						url: asyncData,
						encoding: null
					}, function (error, _response, body) {
						if (error) {
							dataFilesErorr++;
							callback();
						} else {
							dataFilesSuccess++;
							fs.writeFileSync(path.basename(asyncData), body);
							callback();
						};
					});
				}, function () {
					$(".block .description").html("Finished downloading " + dataResponse.name.en + " (with " + dataFilesSuccess + " successful and " + dataFilesErorr + " failed request" + (dataFilesErorr != 1 ? "s" : "") + ").");
					$(".acd-btn-return").removeClass("acd-btn-return-disabled");
					$(".dl-link").removeClass("dl-link-disabled");
					process.chdir(__dirname);
				});
				break;
			case "wdd":
				alert("Coming soon...");
				process.chdir(__dirname);
				break;
			case "mac":
				alert("Coming soon...");
				process.chdir(__dirname);
				break;
			case "gtw":
				alert("Coming soon...");
				process.chdir(__dirname);
				break;
			default:
				alert("Error: Unexpected method " + dataMethod + "!");
				break;
		};
	});
});
$(document).on("click", ".acd-btn-return", function () {
	$("#content").show();
	$(".download").remove();
	$(".bx--header__name").show();
	$(".acd-btn-return").remove();
});
function main() {
	if ($("#toggle").prop("checked") == false) {
		return;
	};
	const fs = require("fs");
	const request = require("request");
	if (fs.existsSync("current.txt") == false) {
		alert("No scene selected!");
		$("#toggle").prop("checked", false);
	} else {
		var data = fs.readFileSync("current.txt", "utf8");
		if (data) {
			request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
				eval(body);
				var temp = a_clock_heritage_data.filter(x => x.id == data);
				if (temp.length == 0) {
					alert("Scene not found!");
					$("#toggle").prop("checked", false);
				} else {
					var value = Object.values(temp[0].fp).filter(x => x < (new Date().getHours().toString() + new Date().getMinutes().toString()).padStart(4, "0")).sort().slice(-1)[0];
					if (value == undefined) {
						value = Object.values(temp[0].fp).sort().slice(-1)[0];
					};
					request({
						url: "https://di.update.sony.net/ACLK/wallpaper/" + temp[0].id + "/3840_2160/fp/" + temp[0].id + "_3840_2160_fp_" + Object.keys(temp[0].fp).find(x => temp[0].fp[x] == value) + ".zip",
						encoding: null
					}, function (_error, _response, body) {
						const AdmZip = require("adm-zip");
						var zip = new AdmZip(body);
						zip.extractEntryTo(zip.getEntries()[0].entryName, ".", false, true);
						const wallpaper = require("wallpaper");
						wallpaper.set(zip.getEntries()[0].entryName).then(function () {
							fs.unlinkSync(zip.getEntries()[0].entryName);
						});
					});
					const schedule = require("node-schedule");
					Object.values(schedule.scheduledJobs).map(job => {
						schedule.cancelJob(job.name);
					});
					for (i in temp[0].fp) {
						if (isNaN(i)) {
							continue;
						};
						j = "https://di.update.sony.net/ACLK/wallpaper/" + temp[0].id + "/3840_2160/fp/" + temp[0].id + "_3840_2160_fp_" + i + ".zip";
						schedule.scheduleJob(temp[0].fp[i].slice(2) + " " + temp[0].fp[i].slice(0, 2) + " * * *", function (j) {
							request({
								url: j,
								encoding: null
							}, function (_error, _response, body) {
								const AdmZip = require("adm-zip");
								var zip = new AdmZip(body);
								zip.extractEntryTo(zip.getEntries()[0].entryName, ".", false, true);
								const wallpaper = require("wallpaper");
								wallpaper.set(zip.getEntries()[0].entryName).then(function () {
									fs.unlinkSync(zip.getEntries()[0].entryName);
								});
							});
						}.bind(false, j));
					};
				};
			});
		} else {
			alert("No scene selected!");
			$("#toggle").prop("checked", false);
		};
	};
};
function name() {
	const fs = require("fs");
	if (fs.existsSync("current.txt")) {
		var data = fs.readFileSync("current.txt", "utf8");
		if (data) {
			const request = require("request");
			request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
				eval(body);
				var temp = a_clock_heritage_data.filter(x => x.id == data);
				if (temp.length == 0) {
					$(".bx--header__name--prefix").text("");
				} else {
					$(".bx--header__name--prefix").text(temp[0].name.en);
				};
			});
		} else {
			$(".bx--header__name--prefix").text("");
		};
	} else {
		$(".bx--header__name--prefix").text("");
	};
};
