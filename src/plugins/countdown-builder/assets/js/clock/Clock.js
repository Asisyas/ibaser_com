function YcdClock() {

}

YcdClock.prototype.init = function() {
	this.clock1();
	this.clock2();
	this.clock3();
};

YcdClock.prototype.clock1 = function() {
	this.clockId = 1;
	this.callback = 'ycdClockConti';
	this.renderClock();
};

YcdClock.prototype.clock2 = function() {
	this.clockId = 2;
	this.callback = 'ycdClockBars';
	this.renderClock();
};

YcdClock.prototype.clock3 = function() {
	this.clockId = 3;
	this.callback = 'ycdDigitalClock';
	this.renderClock();
};

YcdClock.prototype.renderClock = function() {
	var that = this;
	var id = that.clockId;
	var clock = that.callback;
	jQuery('.ycdClock'+id).each(function(index, element) {
		var args = jQuery(element).data('args');
		var options = jQuery(element).data('options');

		if (typeof options == 'undefined' || typeof args == 'undefined') {
			return '';
		}
		var context = element.getContext('2d');
		var width = parseInt(jQuery(this).width());
		var settings = {};

		settings.timeZone = options['timeZone'];
		var clock = eval(that.callback);
		clock(width, context, args, settings);
	});
};

jQuery(document).ready(function() {
	var obj = new YcdClock();
	obj.init();
});