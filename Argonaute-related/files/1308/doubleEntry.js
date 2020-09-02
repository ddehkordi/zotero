function blocker() {
	button = document.getElementById("buy-now-button");
	button.disabled = 'disabled';
	button.src = '/images/processing_order_button.gif';
	button.alt = 'processing purchase please wait';
}
function doubleEntry (formName) {
	if (!document.getElementById) {
		return false;
	}
	var purchaseForm = document.getElementById(formName);
	if (purchaseForm) {
		purchaseForm.onsubmit = blocker;
	}
}
addLoadEvent(function() {
	doubleEntry('buy-now');
});

