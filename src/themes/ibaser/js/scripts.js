(function() {
	var nav = document.querySelector('.nav__toggle');
  var toggleState = function (elem, close, open) {
    var elem = document.querySelector(elem);
    elem.setAttribute('data-state', elem.getAttribute('data-state') === close ? open : close);
  };

  nav.onclick = function (e) {
    toggleState('.mob', 'closed', 'open');
    e.preventDefault();
  };
})();
