$(function () {
	const request = require("request");
	request("https://www.sony.net/united/clock/assets/js/heritage_data.js", function (_error, _response, body) {
		eval(body);
		for (i = 0; i < a_clock_heritage_data.length; i++) {
			$("#content").append("<div class='heritage'><div class='overlay'><div class='title'>" + a_clock_heritage_data[i].name.en + (a_clock_heritage_data[i].is_new ? "<span class='bx--tag'>NEW</span>" : "") + "</div><div class='description'>" + a_clock_heritage_data[i].country.en +"</div><div class='bx--btn-set'><button class='bx--btn bx--btn--primary' data='" + a_clock_heritage_data[i].id + "'>Select Scene</button><button class='bx--btn bx--btn--secondary' data='" + a_clock_heritage_data[i].id + "'>Open in Browser</button></div></div><img class='preview' src='https://www.sony.net/united/clock/share/img/photo/" + a_clock_heritage_data[i].id + "/fp/" + a_clock_heritage_data[i].thumbnail_default + ".jpg'></div>");
		};
		$(".bx--loading").detach();
	});
	const { remote } = require("electron");
	$(".bx--header__action img").click(function (_e) {
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
$(document).on("click", ".bx--btn--primary", function () {
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
$(document).on("click", ".bx--btn--secondary", function () {
	const { shell } = require("electron");
	shell.openExternal("https://www.sony.net/united/clock/heritage/" + $(this).attr("data") + "/");
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
