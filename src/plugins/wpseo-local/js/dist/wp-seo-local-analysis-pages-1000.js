(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global YoastSEO */
/* global wpseoLocalL10n */

/* global YoastSEO: true, wpseoLocalL10n */

if (typeof YoastSEO !== 'undefined' && typeof YoastSEO.analysisWorker !== 'undefined') {
	new YoastLocalSEOPagesPlugin();
} else {
	jQuery(window).on('YoastSEO:ready', function () {
		return new YoastLocalSEOPagesPlugin();
	});
}

var YoastLocalSEOPagesPlugin = function () {
	function YoastLocalSEOPagesPlugin() {
		_classCallCheck(this, YoastLocalSEOPagesPlugin);

		this.bindEventListener();
		this.loadWorkerScripts();
	}

	_createClass(YoastLocalSEOPagesPlugin, [{
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

			YoastSEO.analysis.worker.loadScript(wpseoLocalL10n.pages_script_url).then(function () {
				return YoastSEO.analysis.worker.sendMessage('initializePages', wpseoLocalL10n, 'YoastLocalSEO');
			});
		}
	}]);

	return YoastLocalSEOPagesPlugin;
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWxvY2FsLWFuYWx5c2lzLXBhZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFDQTs7QUFFQTs7QUFHQSxJQUFLLE9BQU8sUUFBUCxLQUFvQixXQUFwQixJQUFtQyxPQUFPLFNBQVMsY0FBaEIsS0FBbUMsV0FBM0UsRUFBeUY7QUFDeEYsS0FBSSx3QkFBSjtBQUNBLENBRkQsTUFHSztBQUNKLFFBQVEsTUFBUixFQUFpQixFQUFqQixDQUFxQixnQkFBckIsRUFBdUM7QUFBQSxTQUFNLElBQUksd0JBQUosRUFBTjtBQUFBLEVBQXZDO0FBQ0E7O0lBRUssd0I7QUFDTCxxQ0FBYztBQUFBOztBQUNiLE9BQUssaUJBQUw7QUFDQSxPQUFLLGlCQUFMO0FBQ0E7Ozs7c0NBRW1CO0FBQ25CLE9BQU0sT0FBTyxTQUFTLGNBQVQsQ0FBeUIscUJBQXpCLENBQWI7QUFDQSxPQUFJLFNBQVMsSUFBYixFQUFrQjtBQUNqQixTQUFLLGdCQUFMLENBQXVCLFFBQXZCLEVBQWlDLFNBQVMsR0FBVCxDQUFhLE9BQTlDO0FBQ0E7QUFDRDs7O3NDQUVtQjtBQUNuQixPQUFLLE9BQU8sUUFBUCxLQUFvQixXQUFwQixJQUFtQyxPQUFPLFNBQVMsUUFBaEIsS0FBNkIsV0FBaEUsSUFBK0UsT0FBTyxTQUFTLFFBQVQsQ0FBa0IsTUFBekIsS0FBb0MsV0FBeEgsRUFBc0k7QUFDckk7QUFDQTs7QUFFRCxZQUFTLFFBQVQsQ0FBa0IsTUFBbEIsQ0FBeUIsVUFBekIsQ0FBcUMsZUFBZSxnQkFBcEQsRUFDRSxJQURGLENBQ1E7QUFBQSxXQUFNLFNBQVMsUUFBVCxDQUFrQixNQUFsQixDQUF5QixXQUF6QixDQUFzQyxpQkFBdEMsRUFBeUQsY0FBekQsRUFBeUUsZUFBekUsQ0FBTjtBQUFBLElBRFI7QUFFQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgWW9hc3RTRU8gKi9cbi8qIGdsb2JhbCB3cHNlb0xvY2FsTDEwbiAqL1xuXG4vKiBnbG9iYWwgWW9hc3RTRU86IHRydWUsIHdwc2VvTG9jYWxMMTBuICovXG5cblxuaWYgKCB0eXBlb2YgWW9hc3RTRU8gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBZb2FzdFNFTy5hbmFseXNpc1dvcmtlciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdG5ldyBZb2FzdExvY2FsU0VPUGFnZXNQbHVnaW4oKTtcbn1cbmVsc2Uge1xuXHRqUXVlcnkoIHdpbmRvdyApLm9uKCAnWW9hc3RTRU86cmVhZHknLCAoKSA9PiBuZXcgWW9hc3RMb2NhbFNFT1BhZ2VzUGx1Z2luKCkgKTtcbn1cblxuY2xhc3MgWW9hc3RMb2NhbFNFT1BhZ2VzUGx1Z2luIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5iaW5kRXZlbnRMaXN0ZW5lcigpO1xuXHRcdHRoaXMubG9hZFdvcmtlclNjcmlwdHMoKTtcblx0fVxuXG5cdGJpbmRFdmVudExpc3RlbmVyKCkge1xuXHRcdGNvbnN0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3dwc2VvX2J1c2luZXNzX2NpdHknICk7XG5cdFx0aWYoIGVsZW0gIT09IG51bGwpe1xuXHRcdFx0ZWxlbS5hZGRFdmVudExpc3RlbmVyKCAnY2hhbmdlJywgWW9hc3RTRU8uYXBwLnJlZnJlc2ggKTtcblx0XHR9XG5cdH1cblxuXHRsb2FkV29ya2VyU2NyaXB0cygpIHtcblx0XHRpZiAoIHR5cGVvZiBZb2FzdFNFTyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIFlvYXN0U0VPLmFuYWx5c2lzID09PSBcInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBZb2FzdFNFTy5hbmFseXNpcy53b3JrZXIgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0WW9hc3RTRU8uYW5hbHlzaXMud29ya2VyLmxvYWRTY3JpcHQoIHdwc2VvTG9jYWxMMTBuLnBhZ2VzX3NjcmlwdF91cmwgKVxuXHRcdFx0LnRoZW4oICgpID0+IFlvYXN0U0VPLmFuYWx5c2lzLndvcmtlci5zZW5kTWVzc2FnZSggJ2luaXRpYWxpemVQYWdlcycsIHdwc2VvTG9jYWxMMTBuLCAnWW9hc3RMb2NhbFNFTycgKSApO1xuXHR9XG59XG4iXX0=
