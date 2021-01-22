//计算rem
(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if(clientWidth>768){
				docEl.style.fontSize = 100+'px';
			}else{
				docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
			}
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);

	//禁止ios缩放
	// 阻止双击放大
	var lastTouchEnd = 0;
	document.addEventListener('touchstart', function(event) {
		if (event.touches.length > 1) {
			event.preventDefault();
		}
	});
	document.addEventListener('touchend', function(event) {
		var now = (new Date()).getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);

	// 阻止双指放大
	document.addEventListener('gesturestart', function(event) {
		event.preventDefault();
	});

	//页面后退时禁用缓存
	iosLoc();
	//页面后退时禁用缓存
	function iosLoc(){
		var isPageHide = false;
		window.addEventListener('pageshow', function () {
			if (isPageHide) {
				window.location.reload();
			}
		});
		window.addEventListener('pagehide', function () {
			isPageHide = true;
		});
	}
})(document, window);