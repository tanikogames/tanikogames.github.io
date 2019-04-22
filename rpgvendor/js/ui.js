
/* #region  Event Handling */
//adding the event handlers for stuff
function addMyElementEventHandlers() {
	addEventHandler(document.getElementById("sell"), "click", sellClick);
	addEventHandler(document.getElementById("discount"), "click", discountClick);
	addEventHandler(document.getElementById("barter"), "click", barterClick);
	addEventHandler(document.getElementById("repair"), "click", repairClick);
	addEventHandler(document.getElementById("workClickButton"), "mousedown", workDown);
	addEventHandler(document.getElementById("workClickButton"), "mouseup", workUp);
	addEventHandler(document.getElementById("workClickButton"), "mouseleave", workUp);
}
//helps with the event handlers
function addEventHandler(to_element, event, handler) {
	if (typeof (handler) == "string") handler = Function(handler);
	var f = event.substr(0, 2);
	var e = (f == "on" || f == "On" || f == "ON" || f == "oN") ? event.substr(2) : event;
	to_element.addEventListener ? to_element.addEventListener(event, handler, false) : to_element.attachEvent("on" + event, handler);
}
addEventHandler(window, "load", addMyElementEventHandlers);

/* #endregion */

/* #region  Readability */
//Makes numbers readable for the ui
function niceNumber(input) {
	var output = 0;
	if (input < 100 && input > -100) {
		if(input == 0){output = 0;}else{
			output = parseFloat(Math.round(input * 100).toFixed(2) / 100).toFixed(2);
		}		
	}
	else {
		output = Math.floor(input);
	}
	return output;
}
function numberToCoinsText(input){
	amount = Math.round(input);
	output = "0c";
	if (amount < 1000) {
		output = niceNumber(amount) + 'c';
	}
	if (amount > 999 && amount < 1000000) {
		output = niceNumber(amount / 1000) + 's';
	}
	if (amount > 999999 && amount < 1000000000) {
		output = niceNumber(amount.toString().substr(0, (amount.toString().length - 3))/1000) + 'g';
	}
	if (amount > 999999999 && amount < 1000000000000) {		
		output = niceNumber(amount.toString().substr(0, (amount.toString().length - 6))/1000) + 'p';
	}
	return output;
}

/* #endregion */

/* #region  Updating the UI */
//update coins
function updateCoins(amount) {
	amount = Math.round(amount);
	if (amount < 1000) {
		$("#copperCountTag").show();
		$("#silverCountTag").hide();
		$("#goldCountTag").hide();
		$("#platCountTag").hide();
		$("#copperCount").html(amount);
	}
	if (amount > 999 && amount < 1000000) {
		$("#copperCountTag").show();
		$("#silverCountTag").show();
		$("#goldCountTag").hide();
		$("#platCountTag").hide();
		$("#copperCount").html(parseInt(amount.toString().substr((amount.toString().length - 3), 3)));
		$("#silverCount").html(amount.toString().substr(0, (amount.toString().length - 3)));
	}
	if (amount > 999999 && amount < 1000000000) {
		$("#copperCountTag").show();
		$("#silverCountTag").show();
		$("#goldCountTag").show();
		$("#platCountTag").hide();
		$("#copperCount").html(parseInt(amount.toString().substr((amount.toString().length - 3), 3)));
		$("#silverCount").html(parseInt(amount.toString().substr((amount.toString().length - 6), 3)));
		$("#goldCount").html(amount.toString().substr(0, (amount.toString().length - 6)));
	}
	if (amount > 999999999 && amount < 1000000000000) {
		$("#copperCountTag").hide();
		$("#silverCountTag").show();
		$("#goldCountTag").show();
		$("#platCountTag").show();
		$("#copperCount").html(parseInt(amount.toString().substr((amount.toString().length - 3), 3)));
		$("#silverCount").html(parseInt(amount.toString().substr((amount.toString().length - 6), 3)));
		$("#goldCount").html(parseInt(amount.toString().substr((amount.toString().length - 9), 3)));
		$("#platCount").html(amount.toString().substr(0, (amount.toString().length - 9)));
	}
}
/* #endregion */

/* #region  customers window */
//Nice little hover hand while you choose what to do with customers
$('#sell').hover(function () {
	$('#sellPointer').visibilityToggle();

});
$('#discount').hover(function () {
	$('#discountPointer').visibilityToggle();
});
$('#barter').hover(function () {
	$('#barterPointer').visibilityToggle();
});
$('#repair').hover(function () {
	$('#repairPointer').visibilityToggle();
});
//called after a transaction is completed to either close or renew the customer window
function refreshCustomerContainer() {
	$('.customer-container').fadeOut(60).delay(60).fadeIn(60);
}
//Interaction with customers
function sellClick() {
	refreshCustomerContainer();
}
function discountClick() {
	refreshCustomerContainer();
}
function barterClick() {
	refreshCustomerContainer();
}
function repairClick() {
	refreshCustomerContainer();
}
/* #endregion */

/* #region  Crafting stuff */
//updating crafting
function updateCraftItemDetail(itemId) {
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftDetailItemCount").html(inv[itemId].currentCount);
	$("#craftCurrentItemName").html(inv[itemId].currentName.replace('"','').replace('"',''));
	$("#craftLowPrice").html( numberToCoinsText(inv[itemId].normalPricesByLevel[inv[itemId].currentLevel -1] * inv[itemId].lowPriceFactor) + ' ');	
	$("#craftMiddlePrice").html( numberToCoinsText(inv[itemId].normalPricesByLevel[inv[itemId].currentLevel -1]) + ' ');	
	$("#craftHighPrice").html( numberToCoinsText(inv[itemId].normalPricesByLevel[inv[itemId].currentLevel -1] * inv[itemId].highPriceFactor));
	if(inv[itemId].sellXPByLevel[inv[itemId].currentLevel-1] < 3){
		if(inv[itemId].donateFactionByLevel[inv[itemId].currentLevel-1] == 0){
			donationString = '1xp';
		}
		else{
			donationString = inv[itemId].donateFactionByLevel[inv[itemId].currentLevel-1] + "rep, 1xp";
		}
	}
	else{
		if(inv[itemId].donateFactionByLevel[inv[itemId].currentLevel-1] == 0){
			donationString = niceNumber(inv[itemId].sellXPByLevel[inv[itemId].currentLevel-1] * donationExperienceFactor) + 'xp';
		}
		else{
			donationString = inv[itemId].donateFactionByLevel[inv[itemId].currentLevel-1] + "rep," + niceNumber(inv[itemId].sellXPByLevel[inv[itemId].currentLevel-1] * donationExperienceFactor) + 'xp';
		}
	}
	$("#craftDonationReputation").html(donationString);
	if(parseInt(inv[itemId].currentLevel) < 4){
		$("#researchingTitle").html("Researching: " + inv[itemId].levelNames[parseInt(inv[itemId].currentLevel) + 1].replace('"','').replace('"',''));
		$("#progressRightStats").html(inv[itemId].currentResearch + "/" + inv[itemId].currentLevel * 10);		
		$("#nextCraftedItemProgressBar").html(inv[itemId].currentResearch + '/' + (parseInt(inv[itemId].currentLevel) * 10));
		$("#nextCraftedItemProgressBar").css('width', niceNumber(parseInt(inv[itemId].currentResearch)*10/(parseInt(inv[itemId].currentLevel))) + '%');
		//todo if full, enable research button
	}
	else{
		$("#researchingTitle").html("No further research is availble.");
	}
	
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
	$("#craftItemPicture").attr("src",inv[itemId].imagePath);
}

/* #endregion */

/* #region  Progress Bars */
//progress bar stuff
function updateProgressBar(value, progressBarId) {
	progressBarId = '#' + progressBarId;
	value = value + '%';
	$(progressBarId).css('width', value);
	$(progressBarId).html(value);
}
/* #endregion */

/* #region  Tab Switching */
//Changes the background when you switch city tabs
var currentBackground = 0;
function changeBg(imgUrl) {
	//switch to this section if you want a smooth transition, but it doesn't work consistantly
	/* $('#fullPage').animate({backgroundColor: 'rgb(0,0,0)'}, 150, function ()
		{
			$('body').css('background-image', 'url("' + imgUrl + '")');
			$('#fullPage').animate({backgroundColor: 'transparent'}, 150);
	}); */
	//this section will just change out the images, no transition
	$('body').css('background-image', 'url("' + imgUrl + '")');
}
//Tab Switching Functions
var activeHumanRow = 0;
var activeDwarfRow = 0;
var activeElfRow = 0;
var activeWizardRow = 0;
function setupTab(newTabHash) {
	if (newTabHash == "#humanTab") {
		$("#middleTabsContainer").css({
			'background': 'rgba(110,110,70,0.7)',
			'background': '-moz-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(110,110,70,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customer-container").css({
			'background': 'rgba(110,110,70,0.7)',
			'background': '-moz-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(110,110,70,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(110,110,70,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customerLine").css({
			'background': 'rgba(110,110,70,1)'
		});
		if (currentBackground != 1) {
			changeBg("Resources/Images/Backgrounds/swordtile.jpg");
			currentBackground = 1;
		}
		$("#humanTabA").css({
			'background': 'rgba(110,110,70,0.7)'
		});
		$("#dwarfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#elfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#wizardTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
	}
	else if (newTabHash == "#dwarfTab") {
		$("#middleTabsContainer").css({
			'background': 'rgba(15,45,15,0.7)',
			'background': '-moz-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(15,45,15,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customer-container").css({
			'background': 'rgba(15,45,15,0.7)',
			'background': '-moz-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(15,45,15,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(15,45,15,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customerLine").css({
			'background': 'rgba(15,45,15,1)'
		});
		if (currentBackground != 2) {
			changeBg("Resources/Images/Backgrounds/axetile.jpg");
			currentBackground = 2;
		}
		$("#humanTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#dwarfTabA").css({
			'background': 'rgba(15,45,15,0.7)'
		});
		$("#elfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#wizardTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
	}
	else if (newTabHash == "#elfTab") {
		$("#middleTabsContainer").css({
			'background': 'rgba(120,120,120,0.7)',
			'background': '-moz-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(120,120,120,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customer-container").css({
			'background': 'rgba(120,120,120,0.7)',
			'background': '-moz-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(120,120,120,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(120,120,120,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customerLine").css({
			'background': 'rgba(100,100,100,1)'
		});
		if (currentBackground != 3) {
			changeBg("Resources/Images/Backgrounds/bowtile.jpg");
			currentBackground = 3;
		}
		$("#humanTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#dwarfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#elfTabA").css({
			'background': 'rgba(120,120,120,0.7)'
		});
		$("#wizardTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
	}
	else if (newTabHash == "#wizardTab") {
		$("#middleTabsContainer").css({
			'background': 'rgba(40,40,80,0.7)',
			'background': '-moz-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(40,40,80,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customer-container").css({
			'background': 'rgba(40,40,80,0.7)',
			'background': '-moz-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(40,40,80,0.7)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(40,40,80,0.7) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1313ff', endColorstr='#141436', GradientType=0 )"
		});
		$(".customerLine").css({
			'background': 'rgba(40,40,80,1)'
		});
		if (currentBackground != 4) {
			changeBg("Resources/Images/Backgrounds/stafftile.jpg");
			currentBackground = 4;
		}
		$("#humanTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#dwarfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#elfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#wizardTabA").css({
			'background': 'rgba(40,40,80,0.7)'
		});
	}
	else {
		$("#middleTabsContainer").css({
			'background': 'rgba(70,70,80,0.9)',
			'background': '-moz-linear-gradient(top, rgba(70,70,80,0.9) 0%, rgba(30,30,40,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(40,40,250,0.7)), color-stop(100%, rgba(30,30,40,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(70,70,80,0.9) 0%, rgba(30,30,40,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(70,70,80,0.9) 0%, rgba(30,30,40,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(70,70,80,0.9) 0%, rgba(30,30,40,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(70,70,80,0.9) 0%, rgba(30,30,40,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#13138f', endColorstr='#141436', GradientType=0 )"
		});
		$(".customer-container").css({
			'background': 'rgba(40,40,50,0.9)',
			'background': '-moz-linear-gradient(top, rgba(40,40,50,0.9) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(40,40,250,0.9)), color-stop(100%, rgba(10,10,20,0.7)))',
			'background': '-webkit-linear-gradient(top, rgba(40,40,50,0.9) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-o-linear-gradient(top, rgba(40,40,50,0.9) 0%, rgba(10,10,20,0.7) 100%)',
			'background': '-ms-linear-gradient(top, rgba(40,40,50,0.9) 0%, rgba(10,10,20,0.7) 100%)',
			'background': 'linear-gradient(to bottom, rgba(40,40,50,0.9) 0%, rgba(10,10,20,0.7) 100%)',
			"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#13138f', endColorstr='#141436', GradientType=0 )"
		});
		$(".customerLine").css({
			'background': 'rgba(40,40,50,1)'
		});
		if (currentBackground != 0) {
			changeBg("Resources/Images/Backgrounds/multitile.jpg");
			currentBackground = 0;
		}
		$("#humanTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#dwarfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#elfTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
		$("#wizardTabA").css({
			'background': 'rgba(20,20,30,0.7)'
		});
	}
}
/* #endregion */





