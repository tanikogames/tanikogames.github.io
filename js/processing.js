
/* #region  Work */
// the work button
function workDown() {
	if (actionPoints + currentWorkRate > actionPointsMax) {
		actionPoints = actionPointsMax;
		document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
		checkUpgradeButtons();
	}
	else {
		actionPoints += currentWorkRate * workRateModifier;
		document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
		workClicked += 1;
		checkUpgradeButtons();

		workTimer = setInterval(function () {
			workHeldDownInSeconds += workDownRateInMs / 1000;
			if (actionPoints + currentWorkHoldRate > actionPointsMax) {
				actionPoints = actionPointsMax;
				document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
			}
			else {
				actionPoints = actionPoints + currentWorkHoldRate;
				workHeldDown += currentWorkHoldRate;
				document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
			}
		}, workDownRateInMs);
	}
}

function addActionPoints(input) {

	if (actionPoints + input > actionPointsMax) {
		actionPoints = actionPointsMax;
		document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
	}
	else {
		actionPoints = actionPoints + input;
		document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
	}
}


/* #endregion */

/* #region  Intervals and Timerouts */
//stops the auto press
function workUp() {
	if (typeof workTimer != "undefined") {
		clearInterval(workTimer);
	}
}
//checkbuttons
checkUpgradesTimer = setInterval(function () {
	checkUpgradeButtons();
}, 500);
//check ap per second
checkApRateTimer = setInterval(function () {
	apRate = niceNumber(actionPoints - lastActionPoints);
	$("#workPerSecond").html(apRate);
	lastActionPoints = actionPoints;
}, 1000);
//check ap per second
helperActionTimer = setInterval(function () {
	apRate = niceNumber(actionPoints - lastActionPoints);
	$("#ptWorkerRate").html(niceNumber(ptHelpRate * ptHelp));
	$("#ftWorkerRate").html(niceNumber(ftHelpRate * ftHelp));
	addActionPoints((ftHelpRate * ftHelp) + (ptHelpRate * ptHelp));
}, 1000);

/* #endregion */

/* #region  Upgrades Processing */

//runs all of the upgrade buttons
function upgrade(id, buttonId) {
	//Custom Upgrades
	if (upgrades[id].typeOfUpgrade1 == '99') {
		window[upgrades[id].upgradeMethod](id, buttonId);
	}
	// 1 - plus ap / click
	if (upgrades[id].typeOfUpgrade1 == '1') {
		if (upgrades[id].costType == '1') {
			actionPoints -= parseFloat(upgrades[id].cost);
			document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
		}
		currentWorkRate += parseFloat(upgrades[id].upgradeAmount1);
		document.getElementById("totalWorkRate").innerHTML = niceNumber(currentWorkRate * workRateModifier);
		currentWorkHoldRate = (currentWorkRate * workRateModifier) / (10 / holdRate);
		document.getElementById("totalWorkHoldRate").innerHTML = niceNumber(currentWorkHoldRate * (1000 / workDownRateInMs));
		addLogEntry("Upgrade " + upgrades[id].title + ": added " + upgrades[id].upgradeAmount1 + " action points to each click.");
		nextUpgradeButton(id, buttonId);

	}
	checkUpgradeButtons();
}
function checkUpgradeButtons() {
	for (i = 1; i <= 11; i++) {
		if ($("button[name='upgrade" + i + "']").prop('disabled') == true) {
			enableUpgrade(i);
		}
		else {
			if ($("button[name='upgrade" + i + "']").prop('disabled') == false) {
				disableUpgrade(i);
			}
		}
	}
}
function enableUpgrade(buttonId) {
	thisUpgradeId = parseInt($("button[name='upgrade" + buttonId + "']").attr('id'));
	//for ap cost
	if ((upgrades[thisUpgradeId].costType == '1') && (actionPoints >= parseFloat(upgrades[thisUpgradeId].cost))) {
		$("button[name='upgrade" + buttonId + "']").removeAttr("disabled");
	}
}
function disableUpgrade(buttonId) {
	thisUpgradeId = parseInt($("button[name='upgrade" + buttonId + "']").attr('id'));
	//for ap cost
	if ((upgrades[thisUpgradeId].costType == '1') && (actionPoints < parseFloat(upgrades[thisUpgradeId].cost))) {
		$("button[name='upgrade" + buttonId + "']").attr("disabled", true);
	}
}
function nextUpgradeButton(id, _buttonId) {
	nextUpgradeId = upgrades[id].nextUpgradeID;
	buttonString = upgrades[nextUpgradeId].title + " <div class=\"secondRowOfButton\">" + upgrades[nextUpgradeId].costLabel + "</div>";
	$("button[name='upgrade" + _buttonId + "']").attr("id", nextUpgradeId);
	$("button[name='upgrade" + _buttonId + "']").parent().attr("title", upgrades[nextUpgradeId].description);
	$("button[name='upgrade" + _buttonId + "']").html(buttonString);
	checkUpgradeButtons();
}
function updateUpgradeButton(id, _buttonId) {
	buttonString = upgrades[id].title + " <div class=\"secondRowOfButton\">" + upgrades[id].costLabel + "</div>";
	$("button[name='upgrade" + _buttonId + "']").attr("id", id);
	$("button[name='upgrade" + _buttonId + "']").parent().attr("title", upgrades[id].description);
	$("button[name='upgrade" + _buttonId + "']").html(buttonString);
	checkUpgradeButtons();
}
/* #endregion */

/* #region  Custom Upgrades */
//Custom Upgrades
//focus upgrades
function boostApUnlock(id, buttonId) {
	nextUpgradeButton(parseInt(id), parseInt(buttonId));
	addLogEntry(upgrades[id].title + " activated.");
}
function boostAp(id, buttonId) {
	buttonString = "Work<div class=\"secondRowOfButton\">100% Boost! done in " + boostCountDown + "...</div>";
	$("button[name='upgrade" + id + "']").removeAttr("disabled");
	$("#workClickButton").html(buttonString);
	thisBoostCountDown = boostCountDown;
	workRateModifier = 2;
	document.getElementById("totalWorkRate").innerHTML = niceNumber(currentWorkRate * workRateModifier);
	currentWorkHoldRate = (currentWorkRate * workRateModifier) / (10 / holdRate);
	document.getElementById("totalWorkHoldRate").innerHTML = niceNumber(currentWorkHoldRate * (1000 / workDownRateInMs));
	$("button[name='upgrade" + buttonId + "']").attr("disabled", true);
	$("button[name='upgrade" + buttonId + "']").html(upgrades[id].title + " <div class=\"secondRowOfButton\">Active</div>");
	actionPoints -= parseFloat(upgrades[id].cost);
	document.getElementById("apCounter").innerHTML = niceNumber(actionPoints);
	boostApTimer = setInterval(function () {
		if (thisBoostCountDown > 1) {
			thisBoostCountDown--;
			buttonString = "Work<div class=\"secondRowOfButton\">100% Boost! done in " + thisBoostCountDown + "...</div>";
			$("#workClickButton").html(buttonString);
		}
		else {
			workRateModifier = 1;
			document.getElementById("totalWorkRate").innerHTML = niceNumber(currentWorkRate * workRateModifier);
			currentWorkHoldRate = (currentWorkRate * workRateModifier) / (10 / holdRate);
			document.getElementById("totalWorkHoldRate").innerHTML = niceNumber(currentWorkHoldRate * (1000 / workDownRateInMs));
			$("#workClickButton").html("Work");
			thisBoostRecharge = boostRecharge;
			$("button[name='upgrade" + buttonId + "']").html(upgrades[id].title + " <div class=\"secondRowOfButton\">Ready in " + thisBoostRecharge + "...</div>");
			boostApChargeTimer = setInterval(function () {
				if (thisBoostRecharge > 1) {
					thisBoostRecharge--;
					buttonString = upgrades[id].title + " <div class=\"secondRowOfButton\">Ready in " + thisBoostRecharge + "...</div>";
					$("button[name='upgrade" + buttonId + "']").html(buttonString);
				}
				else {
					buttonString = upgrades[id].title + " <div class=\"secondRowOfButton\">" + upgrades[id].costLabel + "</div>";
					$("button[name='upgrade" + buttonId + "']").html(buttonString);
					$("button[name='upgrade" + buttonId + "']").removeAttr("disabled");
					clearInterval(boostApChargeTimer);
				}
			}, 1000);
			clearInterval(boostApTimer);
		}
	}, 1000);
}
/* #endregion */

/* #region  Crafting functions */
//Crafting functions
function craftItemSelected(itemId){
	//fix the item id to match the inv array
	itemId = itemId.match(/\d+/)[0];
	if(activeCraftItem == itemId)
	{
		//craft item is already highlighted
	}
	else{
		$( "#craftItem" + activeCraftItem).parent().css({"-webkit-box-shadow": "","-moz-box-shadow": "","box-shadow": ""});
		activeCraftItem = itemId;
		$( "#craftItem" + activeCraftItem).parent().css({"-webkit-box-shadow": "inset 0px 0px 0px 2px #fff","-moz-box-shadow": "inset 0px 0px 0px 2px #fff","box-shadow": "inset 0px 0px 0px 2px #fff"});
		$('#craftItemDetail').fadeOut(80, function() {
			updateCraftItemDetail(itemId);
			$('#craftItemDetail').fadeIn(80);
		});
	}
}
/* #endregion */