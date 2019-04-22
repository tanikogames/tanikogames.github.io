
/* #region  Global Variables */
//Functional Variables
var actionPoints = 0;
var lastActionPoints = 0
var actionPointsMax = 100;
var currentWorkRate = .1;
var workRateModifier = 1;
var holdRate = 3;
var currentWorkHoldRate = currentWorkRate / (10/holdRate);
var workDownRateInMs = 100;
var currentCustomerCapacity = 1;
var activeUpgrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var upgrades = new Array();
var inv = new Array();
var factions = new Array();
var levels = new Array();
var currentLevelExperience = 0;
var currentLevelExperienceMax = 100;
var shopLevel;
var shopTitle;
var shopDescription;
var coins = 0;
var ptHelp = 0;
var ftHelp = 0;
var ptHelpRate = 0.05;
var ftHelpRate = 0.2;
var humanRep = 0;
var dwarfRep = 0;
var elfRep = 0;
var wizardRep = 0;
var boostCountDown = 5;
var boostRecharge = 20;
var activeCraftItem = 1;
var donationExperienceFactor = 0.5;

//Statistical Variables
var workClicked = 0;
var workHeldDownInSeconds = 0;
var workHeldDown = 0;

//Game save and related variables
var loadFile;
var saveData;
var sessionTimeSeconds = 0;
var logEntry = "empty";
var logEntryTop = "emptyTop";
var logText;
var logBlob = "empty";
var hrp;
var activeInvRow = 0;

/* #endregion */

/* #region  Loading Functions */
//Functions on window load
function loadEvent(func) {
	// assign any pre-defined functions on 'window.onload' to a variable
	var oldOnLoad = window.onload;
	// if there is not any function hooked to it
	if (typeof window.onload != 'function') {
		// you can hook your function with it
		window.onload = func
	} else { // someone already hooked a function
		window.onload = function () {
			// call the function hooked already
			oldOnLoad();
			// call your awesome function
			func();
		}
	}
	loadUpgrades();
	loadInventory();
	loadFactions();
	loadShopLevels();
}
function loadUpgrades() {
	//Working with CSV imports	 
	$.ajax({
		url: "data/upgrades.csv",
		success: function (csvd) {
			data = $.csv2Array(csvd);
			createArrayForUpgrades(csvd);
		},
		dataType: "text",
		complete: function () {
			// call a function on complete			
		}
	});
}
function createArrayForUpgrades(input) {

	data = $.csv2Array(input);
	var len = data.length;
	var upgradeData = new Array();
	for (var i = 0; i < len; i++) {
		upgradeData.push({
			name: data[i][0],
			title: data[i][1],
			description: data[i][2],
			cost: data[i][3],
			costType: data[i][4],
			costLabel: data[i][5],
			typeOfUpgrade1: data[i][6],
			upgradeAmount1: data[i][7],
			typeOfUpgrade2: data[i][8],
			upgradeAmount2: data[i][9],
			upgradeMethod: data[i][10],
			nextUpgradeID: data[i][11]
		});
	}
	upgrades = upgradeData;
	updateUpgradeButton(parseInt(activeUpgrades[0]), 1);
	updateUpgradeButton(parseInt(activeUpgrades[1]), 2);
	updateUpgradeButton(parseInt(activeUpgrades[2]), 3);
	updateUpgradeButton(parseInt(activeUpgrades[3]), 4);
	updateUpgradeButton(parseInt(activeUpgrades[4]), 5);
	updateUpgradeButton(parseInt(activeUpgrades[5]), 6);
	updateUpgradeButton(parseInt(activeUpgrades[6]), 7);
	updateUpgradeButton(parseInt(activeUpgrades[7]), 8);
	updateUpgradeButton(parseInt(activeUpgrades[8]), 9);
	updateUpgradeButton(parseInt(activeUpgrades[9]), 10);
	updateUpgradeButton(parseInt(activeUpgrades[10]), 11);
}
function loadInventory() {
	//Working with CSV imports	 
	$.ajax({
		url: "data/inv.csv",
		success: function (csvd) {
			data = $.csv2Array(csvd);
			createArrayForInventory(csvd);
		},
		dataType: "text",
		complete: function () {
			// call a function on complete			
		}
	});
}
function createArrayForInventory(input) {
	//split string.split(',');
	data = $.csv2Array(input);
	var len = data.length;
	var invData = new Array();
	for (var i = 0; i < len; i++) {
		invData.push({
			arrayId: data[i][0],
			makeCostApCrCoFa: data[i][1].split(','),
			title: data[i][2],
			currentName: data[i][3],
			currentLevel: data[i][4],
			levelNames: data[i][5].split(','),
			currentPrice: data[i][6],
			normalPricesByLevel: data[i][7].split(','),
			lowPriceFactor: data[i][8],
			highPriceFactor: data[i][9],
			sellXPByLevel: data[i][10].split(','),
			UpgradeSellFactor: data[i][11],
			donateFactionByLevel: data[i][12].split(','),
			donateFactionType: data[i][13],
			typeOfRace: data[i][14],
			currentCount: data[i][15],
			maxCount: data[i][16],
			description: data[i][17],
			craftPointsByLevel: data[i][18],
			currentCraftPoints: data[i][19],
			totalSoldByLevel: data[i][20],
			totalDonatedByLevel: data[i][21],
			discontinuedText: data[i][22],
			imagePath: data[i][23],
			currentMats: data[i][24],
			currentResearch: data[i][25]
		});
	}
	inv = invData;
	for(var i = 1; i < len; i++){
		inv[i].currentName = inv[i].levelNames[0];
		$("#craftItemButton" + i).attr("title",inv[i].description);
	}
	updateCraftItemDetail(1);
}
function loadFactions() {
	//Working with CSV imports	 
	$.ajax({
		url: "data/factionlevels.csv",
		success: function (csvd) {
			data = $.csv2Array(csvd);
			createArrayForFactions(csvd);
		},
		dataType: "text",
		complete: function () {
			// call a function on complete			
		}
	});
}
function createArrayForFactions(input) {

	data = $.csv2Array(input);
	var len = data.length;
	var factionData = new Array();
	for (var i = 0; i < len; i++) {
		factionData.push({
			city: data[i][0],
			factionReq: data[i][1].split(','),
			reputationFactor: data[i][2].split(','),
			runnersAvailable: data[i][3].split(','),
			inventoryLimit: data[i][4].split(','),
			warLevel: data[i][5].split(',')
		});
	}
	factions = factionData;
}
function loadShopLevels() {
	//Working with CSV imports	 
	$.ajax({
		url: "data/shoplevels.csv",
		success: function (csvd) {
			data = $.csv2Array(csvd);
			createArrayForShops(csvd);
		},
		dataType: "text",
		complete: function () {
			// call a function on complete			
		}
	});
}
function createArrayForShops(input) {

	data = $.csv2Array(input);
	var len = data.length;
	var shopData = new Array();
	for (var i = 0; i < len; i++) {
		shopData.push({
			shopLevel: data[i][0],
			title: data[i][1],
			description: data[i][2],
			nextLevelExp: data[i][3],
			maxInventory: data[i][4],
			maxHelpers: data[i][5],
			maxAp: data[i][6],
			maxCustomers: data[i][7],
			secondsPerCustomer: data[i][8]
		});
	}
	levels = shopData;
	$("#levelContainter").prop('title', levels[1].description);
	$("#currentLevel").html(levels[1].shopLevel);
	$("#currentLevelDescription").html(levels[1].title);
	updateProgressBar(0, 'characterLevelProgressBar');
	$("#progressRightStats").html(currentLevelExperience + "/" + levels[1].nextLevelExp);
	document.getElementById("customerCapacityCount").innerHTML = levels[1].maxCustomers;
	document.getElementById("customerFrequencyCount").innerHTML = levels[1].secondsPerCustomer + ' sec';
	actionPointsMax = levels[1].maxAp;
	
	

}
// pass the function you want to call at 'window.onload'
loadEvent(function () {

	
	//Preloads images
	function preload(arrayOfImages) {
		$(arrayOfImages).each(function () {
			$('<img/>')[0].src = this;
		});
	}
	
	//Preload the city backgrounds
	preload([
		'Resources/Images/Backgrounds/0.jpg',
		'Resources/Images/Backgrounds/1.jpg',
		'Resources/Images/Backgrounds/2.jpg',
		'Resources/Images/Backgrounds/3.jpg',
		'Resources/Images/Backgrounds/4.jpg'
	]);


});

function initGame() {
	/*
	loadFile = JSON.parse(localStorage.getItem("save"));
	if('null' != loadFile){	
		work = loadFile["work"];
		mHpPotions = loadFile["mHpPotions"];
		mHpPotionsCost = loadFile["mHpPotionsCost"];	
	}
	*/
	initiateLog();
	updateLogWindow();
	updateAllLabels();
	
	$('#modalInfo').dialog({
		autoOpen: false,
		position: {
			my: "center",
			at: "center",
			of: "#middleTabsContainer"
		  },
		modal: true,
		width: "500",
		closeText: "",
		draggable: false,
		dialogClass: "no-close",
		buttons: [
			{
			  text: "Ok",
			  icon: "ui-icon-check",
			  click: function() {
				$( this ).dialog( "close" );
				addLogEntry($("#modalInfo").html());
			  }}],
		closeOnEscape: true,
	});
	//Call this modal
	//$('#modalInfo').dialog("open");
	//
	$('#modalDialogWithButtons').dialog({
		autoOpen: false,
		position: {
			my: "center",
			at: "center",
			of: "#middleTabsContainer"
		  },
		modal: true,
		closeText: "",
		draggable: false,
		buttons: [
			{
			  text: "Ok",
			  icon: "ui-icon-heart",
			  click: function() {
				$( this ).dialog( "close" );
			  }}],
		closeOnEscape: false,
		dialogClass: "no-close",
		buttons: [
			{
			text: "OK",
			click: function() {
				$( this ).dialog( "close" );
			}
			}
		]
	});
}
function updateAllLabels(){	
	$("#apMax").html(niceNumber(actionPointsMax));
	$("#apCounter").html(niceNumber(actionPoints));
	$("#totalWorkRate").html(niceNumber(currentWorkRate));
	$("#totalWorkHoldRate").html(niceNumber(currentWorkHoldRate * 1000 / workDownRateInMs));
	$("#progressRightStats").html(niceNumber(currentLevelExperience) + '/' + niceNumber(currentLevelExperienceMax));	
	$("#characterLevelProgressBar").html((Math.round((currentLevelExperience/currentLevelExperienceMax) * 100).toFixed(2) / 100) + '%');
	$("#totalPartTimeHelp").html(niceNumber(ptHelp));
	$("#totalFullTimeHelp").html(niceNumber(ptHelp));
	$("#humanRepCounter").html(niceNumber(humanRep));
	$("#dwarfRepCounter").html(niceNumber(dwarfRep));
	$("#elfRepCounter").html(niceNumber(elfRep));
	$("#wizardRepCounter").html(niceNumber(wizardRep));
	updateCoins(coins);
}

/* #endregion */

/* #region  Loggin Functions */
//logging functions
function initiateLog() {

	logEntryTop = "";
	logEntry = ""
	logText = [logEntryTop, logEntry];

}

function addLogEntry(newText) {

	if (logText.length == 10) {
		logText.splice(9, 1);
	}

	for (i = logText.length; i >= 0; i--) {

		if (i == 0) {
			logText[0] = newText;
			logEntryTop = newText;
		}
		else {
			logText[i] = logText[i - 1];
		}
	}
	updateLogWindow();
}

function updateLogWindow() {

	logBlob = "<div class=\"logentrytop\">" + logEntryTop + "</div>";

	for (i = 1; i < logText.length; i++) {
		logBlob = logBlob + "\n<div class=\"logentry\">" + logText[i] + "</div>";
	}

	$("#logHistoryBox").fadeOut(75, function () {

		document.getElementById("logHistoryBox").innerHTML = logBlob;

	}).fadeIn(75);
}
/* #endregion */

/* #region Game File Functions */
//game file functions
function saveGame() {
	/*
		saveData = {
			work: work,
			mHpPotions: mHpPotions,
			mHpPotionsCost: mHpPotionsCost
			};
		
		localStorage.setItem("save",JSON.stringify(saveData));
		
		addLogEntry("Game Saved with " + work + " work complete.");
		updateLogWindow();
		alert(data[0][0]); */
}

function reset() {

	localStorage.removeItem("save");
	location.reload();

}

/* #endregion */

//Document Ready
$(document).ready(function () {

	initGame();

	/* #region Tab Switching */
	$('ul.middleTabs').each(function () {
		// For each set of tabs, we want to keep track of
		// which tab is active and it's associated content
		var $active, $content, $links = $(this).find('a');

		// If the location.hash matches one of the links, use that as the active tab.
		// If no match is found, use the first link as the initial active tab.
		$active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
		$active.addClass('active');

		$content = $($active[0].hash);

		// Hide the remaining content
		$links.not($active).each(function () {
			$(this.hash).hide();
		});

		// Bind the click event handler
		$(this).on('click', 'a', function (e) {
			// Make the old tab inactive.
			$active.removeClass('active');
			$content.hide();

			// Update the variables with the new link and content
			$active = $(this);
			$content = $(this.hash);

			setupTab(this.hash);

			// Make the tab active.
			$active.addClass('active');
			$content.show();

			// Prevent the anchor's default click action
			e.preventDefault();
		});
	});

	jQuery.fn.visibilityToggle = function () {
		return this.css('visibility', function (i, visibility) {
			return (visibility == 'visible') ? 'hidden' : 'visible';
		});
	};


	/* #endregion */

	/* #region Combat screen stuff */
	//draws a glow around selected buttons in the combat screen
	$(".specialButton").click(function () {

		if ($(this).is(":enabled")) {

			$(this).css({

				'-moz-box-shadow': '0px 0px 13px 0px #619',
				'-webkit-box-shadow': '0px 0px 13px 0px #619',
				'box-shadow': '0px 0px 13px 0px #619'

			});
		}
	});

	//Event that kicks off combat
	//Set the combat list back to default once combat is finished
	$(".combatStartList").change(function () {
		var value = $(this).val();

		if (value != "Aid in Combat") { startCombat(value); }

	});

	//functions called after combat is finished by click outside the combat screen
	$("#combatWindowBack").click(function () {

		endCombat();
		$(".combatStartList").val("Aid in Combat");

	});

	/* #endregion */

	/* #region Inventory row management (collapsing and stuff) */
	//prevent the row from collapsing when you click a button in the inventory
	$("[id^=invRow] .pricingButton").click(function (e) { e.stopPropagation(); });
	$("[id^=humanRow] .pricingButton").click(function (e) { e.stopPropagation(); });
	$("[id^=dwarfRow] .pricingButton").click(function (e) { e.stopPropagation(); });
	$("[id^=elfRow] .pricingButton").click(function (e) { e.stopPropagation(); });
	$("[id^=wizardRow] .pricingButton").click(function (e) { e.stopPropagation(); });


	//collapsing and expanding inventory rows
	$('#invRow1').click(function () {
		if (activeInvRow == 1 || activeInvRow == 0) {
			$('.invExpansion1').slideToggle(100);
			activeInvRow = 1;
		}
		else {
			$('.invExpansion' + activeInvRow).slideUp(120, function () {
				$('.invExpansion1').slideDown(100);
				activeInvRow = 1;
			});
		}
	});

	$('#invRow2').click(function () {
		if (activeInvRow == 2 || activeInvRow == 0) {
			$('.invExpansion2').slideToggle(100);
			activeInvRow = 2;
		}
		else {
			$('.invExpansion' + activeInvRow).slideUp(120, function () {
				$('.invExpansion2').slideDown(100);
				activeInvRow = 2;
			});
		}
	});

	$('#invRow3').click(function () {
		if (activeInvRow == 3 || activeInvRow == 0) {
			$('.invExpansion3').slideToggle(100);
			activeInvRow = 3;
		}
		else {
			$('.invExpansion' + activeInvRow).slideUp(120, function () {
				$('.invExpansion3').slideDown(100);
				activeInvRow = 3;
			});
		}
	});

	$('#invRow4').click(function () {
		if (activeInvRow == 4 || activeInvRow == 0) {
			$('.invExpansion4').slideToggle(100);
			activeInvRow = 4;
		}
		else {
			$('.invExpansion' + activeInvRow).slideUp(120, function () {
				$('.invExpansion4').slideDown(100);
				activeInvRow = 4;
			});
		}
	});

	$('#invRow5').click(function () {
		if (activeInvRow == 5 || activeInvRow == 0) {
			$('.invExpansion5').slideToggle(100);
			activeInvRow = 5;
		}
		else {
			$('.invExpansion' + activeInvRow).slideUp(120, function () {
				$('.invExpansion5').slideDown(100);
				activeInvRow = 5;
			});
		}
	});

	$('#humanRow1').click(function () {
		if (activeHumanRow == 1 || activeHumanRow == 0) {
			$('.humanExpansion1').slideToggle(100);
			activeHumanRow = 1;
		}
		else {
			$('.humanExpansion' + activeHumanRow).slideUp(120, function () {
				$('.humanExpansion1').slideDown(100);
				activeHumanRow = 1;
			});
		}
	});

	$('#humanRow2').click(function () {
		if (activeHumanRow == 2 || activeHumanRow == 0) {
			$('.humanExpansion2').slideToggle(100);
			activeHumanRow = 2;
		}
		else {
			$('.humanExpansion' + activeHumanRow).slideUp(120, function () {
				$('.humanExpansion2').slideDown(100);
				activeHumanRow = 2;
			});
		}
	});

	$('#humanRow3').click(function () {
		if (activeHumanRow == 3 || activeHumanRow == 0) {
			$('.humanExpansion3').slideToggle(100);
			activeHumanRow = 3;
		}
		else {
			$('.humanExpansion' + activeHumanRow).slideUp(120, function () {
				$('.humanExpansion3').slideDown(100);
				activeHumanRow = 3;
			});
		}
	});

	$('#humanRow4').click(function () {
		if (activeHumanRow == 4 || activeHumanRow == 0) {
			$('.humanExpansion4').slideToggle(100);
			activeHumanRow = 4;
		}
		else {
			$('.humanExpansion' + activeHumanRow).slideUp(120, function () {
				$('.humanExpansion4').slideDown(100);
				activeHumanRow = 4;
			});
		}
	});

	$('#humanRow5').click(function () {
		if (activeHumanRow == 5 || activeHumanRow == 0) {
			$('.humanExpansion5').slideToggle(100);
			activeHumanRow = 5;
		}
		else {
			$('.humanExpansion' + activeHumanRow).slideUp(120, function () {
				$('.humanExpansion5').slideDown(100);
				activeHumanRow = 5;
			});
		}
	});

	$('#dwarfRow1').click(function () {
		if (activeDwarfRow == 1 || activeDwarfRow == 0) {
			$('.dwarfExpansion1').slideToggle(100);
			activeDwarfRow = 1;
		}
		else {
			$('.dwarfExpansion' + activeDwarfRow).slideUp(120, function () {
				$('.dwarfExpansion1').slideDown(100);
				activeDwarfRow = 1;
			});
		}
	});

	$('#dwarfRow2').click(function () {
		if (activeDwarfRow == 2 || activeDwarfRow == 0) {
			$('.dwarfExpansion2').slideToggle(100);
			activeDwarfRow = 2;
		}
		else {
			$('.dwarfExpansion' + activeDwarfRow).slideUp(120, function () {
				$('.dwarfExpansion2').slideDown(100);
				activeDwarfRow = 2;
			});
		}
	});

	$('#dwarfRow3').click(function () {
		if (activeDwarfRow == 3 || activeDwarfRow == 0) {
			$('.dwarfExpansion3').slideToggle(100);
			activeDwarfRow = 3;
		}
		else {
			$('.dwarfExpansion' + activeDwarfRow).slideUp(120, function () {
				$('.dwarfExpansion3').slideDown(100);
				activeDwarfRow = 3;
			});
		}
	});

	$('#dwarfRow4').click(function () {
		if (activeDwarfRow == 4 || activeDwarfRow == 0) {
			$('.dwarfExpansion4').slideToggle(100);
			activeDwarfRow = 4;
		}
		else {
			$('.dwarfExpansion' + activeDwarfRow).slideUp(120, function () {
				$('.dwarfExpansion4').slideDown(100);
				activeDwarfRow = 4;
			});
		}
	});

	$('#dwarfRow5').click(function () {
		if (activeDwarfRow == 5 || activeDwarfRow == 0) {
			$('.dwarfExpansion5').slideToggle(100);
			activeDwarfRow = 5;
		}
		else {
			$('.dwarfExpansion' + activeDwarfRow).slideUp(120, function () {
				$('.dwarfExpansion5').slideDown(100);
				activeDwarfRow = 5;
			});
		}
	});

	$('#elfRow1').click(function () {
		if (activeElfRow == 1 || activeElfRow == 0) {
			$('.elfExpansion1').slideToggle(100);
			activeElfRow = 1;
		}
		else {
			$('.elfExpansion' + activeElfRow).slideUp(120, function () {
				$('.elfExpansion1').slideDown(100);
				activeElfRow = 1;
			});
		}
	});

	$('#elfRow2').click(function () {
		if (activeElfRow == 2 || activeElfRow == 0) {
			$('.elfExpansion2').slideToggle(100);
			activeElfRow = 2;
		}
		else {
			$('.elfExpansion' + activeElfRow).slideUp(120, function () {
				$('.elfExpansion2').slideDown(100);
				activeElfRow = 2;
			});
		}
	});

	$('#elfRow3').click(function () {
		if (activeElfRow == 3 || activeElfRow == 0) {
			$('.elfExpansion3').slideToggle(100);
			activeElfRow = 3;
		}
		else {
			$('.elfExpansion' + activeElfRow).slideUp(120, function () {
				$('.elfExpansion3').slideDown(100);
				activeElfRow = 3;
			});
		}
	});

	$('#elfRow4').click(function () {
		if (activeElfRow == 4 || activeElfRow == 0) {
			$('.elfExpansion4').slideToggle(100);
			activeElfRow = 4;
		}
		else {
			$('.elfExpansion' + activeElfRow).slideUp(120, function () {
				$('.elfExpansion4').slideDown(100);
				activeElfRow = 4;
			});
		}
	});

	$('#elfRow5').click(function () {
		if (activeElfRow == 5 || activeElfRow == 0) {
			$('.elfExpansion5').slideToggle(100);
			activeElfRow = 5;
		}
		else {
			$('.elfExpansion' + activeElfRow).slideUp(120, function () {
				$('.elfExpansion5').slideDown(100);
				activeElfRow = 5;
			});
		}
	});

	$('#wizardRow1').click(function () {
		if (activeWizardRow == 1 || activeWizardRow == 0) {
			$('.wizardExpansion1').slideToggle(100);
			activeWizardRow = 1;
		}
		else {
			$('.wizardExpansion' + activeWizardRow).slideUp(120, function () {
				$('.wizardExpansion1').slideDown(100);
				activeWizardRow = 1;
			});
		}
	});

	$('#wizardRow2').click(function () {
		if (activeWizardRow == 2 || activeWizardRow == 0) {
			$('.wizardExpansion2').slideToggle(100);
			activeWizardRow = 2;
		}
		else {
			$('.wizardExpansion' + activeWizardRow).slideUp(120, function () {
				$('.wizardExpansion2').slideDown(100);
				activeWizardRow = 2;
			});
		}
	});

	$('#wizardRow3').click(function () {
		if (activeWizardRow == 3 || activeWizardRow == 0) {
			$('.wizardExpansion3').slideToggle(100);
			activeWizardRow = 3;
		}
		else {
			$('.wizardExpansion' + activeWizardRow).slideUp(120, function () {
				$('.wizardExpansion3').slideDown(100);
				activeWizardRow = 3;
			});
		}
	});

	$('#wizardRow4').click(function () {
		if (activeWizardRow == 4 || activeWizardRow == 0) {
			$('.wizardExpansion4').slideToggle(100);
			activeWizardRow = 4;
		}
		else {
			$('.wizardExpansion' + activeWizardRow).slideUp(120, function () {
				$('.wizardExpansion4').slideDown(100);
				activeWizardRow = 4;
			});
		}
	});

	$('#wizardRow5').click(function () {
		if (activeWizardRow == 5 || activeWizardRow == 0) {
			$('.wizardExpansion5').slideToggle(100);
			activeWizardRow = 5;
		}
		else {
			$('.wizardExpansion' + activeWizardRow).slideUp(120, function () {
				$('.wizardExpansion5').slideDown(100);
				activeWizardRow = 5;
			});
		}
	});
	/* #endregion */

	/* #region Loading tools */

	$(function () {
		$(document).tooltip();
	});

	/* #endregion */
});
