(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global YoastSEO */
/* global wpseoLocalL10n */

if (typeof YoastSEO !== 'undefined' && typeof YoastSEO.analysisWorker !== 'undefined') {
	new YoastLocalSEOLocationsPlugin();
} else {
	jQuery(window).on('YoastSEO:ready', function () {
		return new YoastLocalSEOLocationsPlugin();
	});
}

var YoastLocalSEOLocationsPlugin = function () {
	function YoastLocalSEOLocationsPlugin() {
		_classCallCheck(this, YoastLocalSEOLocationsPlugin);

		this.bindEventListener();
		this.loadWorkerScripts();
	}

	_createClass(YoastLocalSEOLocationsPlugin, [{
		key: 'bindEventListener',
		value: function bindEventListener() {
			var elem = document.getElementById('wpseo_business_city');
			if (elem !== null) {
				elem.addEventListener('change', YoastSEO.app.refresh);
			}
		}
	}, {
		key: 'loadWorkerScripts',
		value: function loadWorkerScripts() {
			if (typeof YoastSEO === 'undefined' || typeof YoastSEO.analysis === "undefined" || typeof YoastSEO.analysis.worker === "undefined") {
				return;
			}

			YoastSEO.analysis.worker.loadScript(wpseoLocalL10n.locations_script_url).then(function () {
				return YoastSEO.analysis.worker.sendMessage('initializeLocations', wpseoLocalL10n, 'YoastLocalSEO');
			});
		}
	}]);

	return YoastLocalSEOLocationsPlugin;
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWxvY2FsLWFuYWx5c2lzLWxvY2F0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBO0FBQ0E7O0FBRUEsSUFBSyxPQUFPLFFBQVAsS0FBb0IsV0FBcEIsSUFBbUMsT0FBTyxTQUFTLGNBQWhCLEtBQW1DLFdBQTNFLEVBQXlGO0FBQ3hGLEtBQUksNEJBQUo7QUFDQSxDQUZELE1BR0s7QUFDSixRQUFRLE1BQVIsRUFBaUIsRUFBakIsQ0FBcUIsZ0JBQXJCLEVBQXVDO0FBQUEsU0FBTSxJQUFJLDRCQUFKLEVBQU47QUFBQSxFQUF2QztBQUNBOztJQUVLLDRCO0FBQ0wseUNBQWM7QUFBQTs7QUFDYixPQUFLLGlCQUFMO0FBQ0EsT0FBSyxpQkFBTDtBQUNBOzs7O3NDQUVtQjtBQUNuQixPQUFNLE9BQU8sU0FBUyxjQUFULENBQXlCLHFCQUF6QixDQUFiO0FBQ0EsT0FBSSxTQUFTLElBQWIsRUFBa0I7QUFDakIsU0FBSyxnQkFBTCxDQUF1QixRQUF2QixFQUFpQyxTQUFTLEdBQVQsQ0FBYSxPQUE5QztBQUNBO0FBQ0Q7OztzQ0FFbUI7QUFDbkIsT0FBSyxPQUFPLFFBQVAsS0FBb0IsV0FBcEIsSUFBbUMsT0FBTyxTQUFTLFFBQWhCLEtBQTZCLFdBQWhFLElBQStFLE9BQU8sU0FBUyxRQUFULENBQWtCLE1BQXpCLEtBQW9DLFdBQXhILEVBQXNJO0FBQ3JJO0FBQ0E7O0FBRUQsWUFBUyxRQUFULENBQWtCLE1BQWxCLENBQXlCLFVBQXpCLENBQXFDLGVBQWUsb0JBQXBELEVBQ0UsSUFERixDQUNRO0FBQUEsV0FBTSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsQ0FBeUIsV0FBekIsQ0FBc0MscUJBQXRDLEVBQTZELGNBQTdELEVBQTZFLGVBQTdFLENBQU47QUFBQSxJQURSO0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIFlvYXN0U0VPICovXG4vKiBnbG9iYWwgd3BzZW9Mb2NhbEwxMG4gKi9cblxuaWYgKCB0eXBlb2YgWW9hc3RTRU8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBZb2FzdFNFTy5hbmFseXNpc1dvcmtlciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdG5ldyBZb2FzdExvY2FsU0VPTG9jYXRpb25zUGx1Z2luKCk7XG59XG5lbHNlIHtcblx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggJ1lvYXN0U0VPOnJlYWR5JywgKCkgPT4gbmV3IFlvYXN0TG9jYWxTRU9Mb2NhdGlvbnNQbHVnaW4oKSApO1xufVxuXG5jbGFzcyBZb2FzdExvY2FsU0VPTG9jYXRpb25zUGx1Z2luIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5iaW5kRXZlbnRMaXN0ZW5lcigpO1xuXHRcdHRoaXMubG9hZFdvcmtlclNjcmlwdHMoKTtcblx0fVxuXG5cdGJpbmRFdmVudExpc3RlbmVyKCkge1xuXHRcdGNvbnN0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwc2VvX2J1c2luZXNzX2NpdHknICk7XG5cdFx0aWYoIGVsZW0gIT09IG51bGwpe1xuXHRcdFx0ZWxlbS5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgWW9hc3RTRU8uYXBwLnJlZnJlc2ggKTtcblx0XHR9XG5cdH1cblxuXHRsb2FkV29ya2VyU2NyaXB0cygpIHtcblx0XHRpZiAoIHR5cGVvZiBZb2FzdFNFTyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIFlvYXN0U0VPLmFuYWx5c2lzID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBZb2FzdFNFTy5hbmFseXNpcy53b3JrZXIgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0WW9hc3RTRU8uYW5hbHlzaXMud29ya2VyLmxvYWRTY3JpcHQoIHdwc2VvTG9jYWxMMTBuLmxvY2F0aW9uc19zY3JpcHRfdXJsIClcblx0XHRcdC50aGVuKCAoKSA9PiBZb2FzdFNFTy5hbmFseXNpcy53b3JrZXIuc2VuZE1lc3NhZ2UoICdpbml0aWFsaXplTG9jYXRpb25zJywgd3BzZW9Mb2NhbEwxMG4sICdZb2FzdExvY2FsU0VPJyApICk7XG5cdH1cbn1cbiJdfQ==
