/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-Exit': '&#xe901;',
		'icon-EXPLAINCLICKED': '&#xe902;',
		'icon-EXPLAIN': '&#xe903;',
		'icon-FLAG': '&#xe904;',
		'icon-HINTCLICKED': '&#xe905;',
		'icon-HINT': '&#xe906;',
		'icon-INFO': '&#xe907;',
		'icon-lock1': '&#xe908;',
		'icon-lock2': '&#xe909;',
		'icon-NEXT': '&#xe90a;',
		'icon-next20': '&#xe90b;',
		'icon-PREV': '&#xe90c;',
		'icon-prev20': '&#xe90d;',
		'icon-PROCEED': '&#xe90e;',
		'icon-SAVE': '&#xe90f;',
		'icon-SUBMIT': '&#xe910;',
		'icon-home': '&#xe900;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
