/*! modernizr 3.11.8 (Custom Build) | MIT *
 * https://modernizr.com/download/?-backgroundsize-cssanimations-csscolumns-cssgradients-cssgrid_cssgridlegacy-csstransforms-csstransforms3d-csstransitions-flexbox-flexboxlegacy-flexboxtweener-flexwrap-supports-svg-touchevents-prefixed-printshiv-setclasses !*/
!(function (e, t, n, r) {
	function o(e, t) {
		return typeof e === t
	}
	function a(e, t) {
		return !!~('' + e).indexOf(t)
	}
	function i() {
		return 'function' != typeof n.createElement
			? n.createElement(arguments[0])
			: C
				? n.createElementNS.call(n, 'http://www.w3.org/2000/svg', arguments[0])
				: n.createElement.apply(n, arguments)
	}
	function s() {
		var e = n.body
		return e || ((e = i(C ? 'svg' : 'body')), (e.fake = !0)), e
	}
	function l(e, t, r, o) {
		var a,
			l,
			c,
			u,
			d = 'modernizr',
			f = i('div'),
			p = s()
		if (parseInt(r, 10)) for (; r--; ) (c = i('div')), (c.id = o ? o[r] : d + (r + 1)), f.appendChild(c)
		return (
			(a = i('style')),
			(a.type = 'text/css'),
			(a.id = 's' + d),
			(p.fake ? p : f).appendChild(a),
			p.appendChild(f),
			a.styleSheet ? (a.styleSheet.cssText = e) : a.appendChild(n.createTextNode(e)),
			(f.id = d),
			p.fake &&
				((p.style.background = ''),
				(p.style.overflow = 'hidden'),
				(u = x.style.overflow),
				(x.style.overflow = 'hidden'),
				x.appendChild(p)),
			(l = t(f, e)),
			p.fake && p.parentNode
				? (p.parentNode.removeChild(p), (x.style.overflow = u), x.offsetHeight)
				: f.parentNode.removeChild(f),
			!!l
		)
	}
	function c(e) {
		return e
			.replace(/([A-Z])/g, function (e, t) {
				return '-' + t.toLowerCase()
			})
			.replace(/^ms-/, '-ms-')
	}
	function u(e, n, r) {
		var o
		if ('getComputedStyle' in t) {
			o = getComputedStyle.call(t, e, n)
			var a = t.console
			if (null !== o) r && (o = o.getPropertyValue(r))
			else if (a) {
				var i = a.error ? 'error' : 'log'
				a[i].call(a, 'getComputedStyle returning null, its possible modernizr test results are inaccurate')
			}
		} else o = !n && e.currentStyle && e.currentStyle[r]
		return o
	}
	function d(e, n) {
		var o = e.length
		if ('CSS' in t && 'supports' in t.CSS) {
			for (; o--; ) if (t.CSS.supports(c(e[o]), n)) return !0
			return !1
		}
		if ('CSSSupportsRule' in t) {
			for (var a = []; o--; ) a.push('(' + c(e[o]) + ':' + n + ')')
			return (
				(a = a.join(' or ')),
				l('@supports (' + a + ') { #modernizr { position: absolute; } }', function (e) {
					return 'absolute' === u(e, null, 'position')
				})
			)
		}
		return r
	}
	function f(e) {
		return e
			.replace(/([a-z])-([a-z])/g, function (e, t, n) {
				return t + n.toUpperCase()
			})
			.replace(/^-/, '')
	}
	function p(e, t, n, s) {
		function l() {
			u && (delete _.style, delete _.modElem)
		}
		if (((s = !o(s, 'undefined') && s), !o(n, 'undefined'))) {
			var c = d(e, n)
			if (!o(c, 'undefined')) return c
		}
		for (var u, p, m, h, v, g = ['modernizr', 'tspan', 'samp']; !_.style && g.length; )
			(u = !0), (_.modElem = i(g.shift())), (_.style = _.modElem.style)
		for (m = e.length, p = 0; p < m; p++)
			if (((h = e[p]), (v = _.style[h]), a(h, '-') && (h = f(h)), _.style[h] !== r)) {
				if (s || o(n, 'undefined')) return l(), 'pfx' !== t || h
				try {
					_.style[h] = n
				} catch (e) {}
				if (_.style[h] !== v) return l(), 'pfx' !== t || h
			}
		return l(), !1
	}
	function m(e, t) {
		return function () {
			return e.apply(t, arguments)
		}
	}
	function h(e, t, n) {
		var r
		for (var a in e) if (e[a] in t) return !1 === n ? e[a] : ((r = t[e[a]]), o(r, 'function') ? m(r, n || t) : r)
		return !1
	}
	function v(e, t, n, r, a) {
		var i = e.charAt(0).toUpperCase() + e.slice(1),
			s = (e + ' ' + w.join(i + ' ') + i).split(' ')
		return o(t, 'string') || o(t, 'undefined')
			? p(s, t, r, a)
			: ((s = (e + ' ' + N.join(i + ' ') + i).split(' ')), h(s, t, n))
	}
	function g(e, t, n) {
		return v(e, r, r, t, n)
	}
	var y = [],
		S = {
			_version: '3.11.8',
			_config: { classPrefix: '', enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
			_q: [],
			on: function (e, t) {
				var n = this
				setTimeout(function () {
					t(n[e])
				}, 0)
			},
			addTest: function (e, t, n) {
				y.push({ name: e, fn: t, options: n })
			},
			addAsyncTest: function (e) {
				y.push({ name: null, fn: e })
			},
		},
		Modernizr = function () {}
	;(Modernizr.prototype = S), (Modernizr = new Modernizr())
	var b = [],
		x = n.documentElement,
		C = 'svg' === x.nodeName.toLowerCase()
	C ||
		(function (e, t) {
			function n(e, t) {
				var n = e.createElement('p'),
					r = e.getElementsByTagName('head')[0] || e.documentElement
				return (n.innerHTML = 'x<style>' + t + '</style>'), r.insertBefore(n.lastChild, r.firstChild)
			}
			function r() {
				var e = E.elements
				return 'string' == typeof e ? e.split(' ') : e
			}
			function o(e, t) {
				var n = E.elements
				'string' != typeof n && (n = n.join(' ')),
					'string' != typeof e && (e = e.join(' ')),
					(E.elements = n + ' ' + e),
					c(t)
			}
			function a(e) {
				var t = C[e[b]]
				return t || ((t = {}), x++, (e[b] = x), (C[x] = t)), t
			}
			function i(e, n, r) {
				if ((n || (n = t), v)) return n.createElement(e)
				r || (r = a(n))
				var o
				return (
					(o = r.cache[e]
						? r.cache[e].cloneNode()
						: S.test(e)
							? (r.cache[e] = r.createElem(e)).cloneNode()
							: r.createElem(e)),
					!o.canHaveChildren || y.test(e) || o.tagUrn ? o : r.frag.appendChild(o)
				)
			}
			function s(e, n) {
				if ((e || (e = t), v)) return e.createDocumentFragment()
				n = n || a(e)
				for (var o = n.frag.cloneNode(), i = 0, s = r(), l = s.length; i < l; i++) o.createElement(s[i])
				return o
			}
			function l(e, t) {
				t.cache ||
					((t.cache = {}),
					(t.createElem = e.createElement),
					(t.createFrag = e.createDocumentFragment),
					(t.frag = t.createFrag())),
					(e.createElement = function (n) {
						return E.shivMethods ? i(n, e, t) : t.createElem(n)
					}),
					(e.createDocumentFragment = Function(
						'h,f',
						'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' +
							r()
								.join()
								.replace(/[\w\-:]+/g, function (e) {
									return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
								}) +
							');return n}'
					)(E, t.frag))
			}
			function c(e) {
				e || (e = t)
				var r = a(e)
				return (
					!E.shivCSS ||
						h ||
						r.hasCSS ||
						(r.hasCSS = !!n(
							e,
							'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}'
						)),
					v || l(e, r),
					e
				)
			}
			function u(e) {
				for (
					var t,
						n = e.getElementsByTagName('*'),
						o = n.length,
						a = RegExp('^(?:' + r().join('|') + ')$', 'i'),
						i = [];
					o--;

				)
					(t = n[o]), a.test(t.nodeName) && i.push(t.applyElement(d(t)))
				return i
			}
			function d(e) {
				for (
					var t, n = e.attributes, r = n.length, o = e.ownerDocument.createElement(T + ':' + e.nodeName);
					r--;

				)
					(t = n[r]), t.specified && o.setAttribute(t.nodeName, t.nodeValue)
				return (o.style.cssText = e.style.cssText), o
			}
			function f(e) {
				for (
					var t,
						n = e.split('{'),
						o = n.length,
						a = RegExp('(^|[\\s,>+~])(' + r().join('|') + ')(?=[[\\s,>+~#.:]|$)', 'gi'),
						i = '$1' + T + '\\:$2';
					o--;

				)
					(t = n[o] = n[o].split('}')),
						(t[t.length - 1] = t[t.length - 1].replace(a, i)),
						(n[o] = t.join('}'))
				return n.join('{')
			}
			function p(e) {
				for (var t = e.length; t--; ) e[t].removeNode()
			}
			function m(e) {
				function t() {
					clearTimeout(i._removeSheetTimer), r && r.removeNode(!0), (r = null)
				}
				var r,
					o,
					i = a(e),
					s = e.namespaces,
					l = e.parentWindow
				return !_ || e.printShived
					? e
					: (void 0 === s[T] && s.add(T),
						l.attachEvent('onbeforeprint', function () {
							t()
							for (var a, i, s, l = e.styleSheets, c = [], d = l.length, p = Array(d); d--; ) p[d] = l[d]
							for (; (s = p.pop()); )
								if (!s.disabled && w.test(s.media)) {
									try {
										;(a = s.imports), (i = a.length)
									} catch (e) {
										i = 0
									}
									for (d = 0; d < i; d++) p.push(a[d])
									try {
										c.push(s.cssText)
									} catch (e) {}
								}
							;(c = f(c.reverse().join(''))), (o = u(e)), (r = n(e, c))
						}),
						l.attachEvent('onafterprint', function () {
							p(o), clearTimeout(i._removeSheetTimer), (i._removeSheetTimer = setTimeout(t, 500))
						}),
						(e.printShived = !0),
						e)
			}
			var h,
				v,
				g = e.html5 || {},
				y = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
				S =
					/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
				b = '_html5shiv',
				x = 0,
				C = {}
			!(function () {
				try {
					var e = t.createElement('a')
					;(e.innerHTML = '<xyz></xyz>'),
						(h = 'hidden' in e),
						(v =
							1 == e.childNodes.length ||
							(function () {
								t.createElement('a')
								var e = t.createDocumentFragment()
								return (
									void 0 === e.cloneNode ||
									void 0 === e.createDocumentFragment ||
									void 0 === e.createElement
								)
							})())
				} catch (e) {
					;(h = !0), (v = !0)
				}
			})()
			var E = {
				elements:
					g.elements ||
					'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',
				version: '3.7.3',
				shivCSS: !1 !== g.shivCSS,
				supportsUnknownElements: v,
				shivMethods: !1 !== g.shivMethods,
				type: 'default',
				shivDocument: c,
				createElement: i,
				createDocumentFragment: s,
				addElements: o,
			}
			;(e.html5 = E), c(t)
			var w = /^$|\b(?:all|print)\b/,
				T = 'html5shiv',
				_ =
					!v &&
					(function () {
						var n = t.documentElement
						return !(
							void 0 === t.namespaces ||
							void 0 === t.parentWindow ||
							void 0 === n.applyElement ||
							void 0 === n.removeNode ||
							void 0 === e.attachEvent
						)
					})()
			;(E.type += ' print'),
				(E.shivPrint = m),
				m(t),
				'object' == typeof module && module.exports && (module.exports = E)
		})(void 0 !== t ? t : this, n)
	var E = 'Moz O ms Webkit',
		w = S._config.usePrefixes ? E.split(' ') : []
	S._cssomPrefixes = w
	var T = { elem: i('modernizr') }
	Modernizr._q.push(function () {
		delete T.elem
	})
	var _ = { style: T.elem.style }
	Modernizr._q.unshift(function () {
		delete _.style
	})
	var N = S._config.usePrefixes ? E.toLowerCase().split(' ') : []
	;(S._domPrefixes = N), (S.testAllProps = v)
	var k = function (e) {
		var n,
			o = j.length,
			a = t.CSSRule
		if (void 0 === a) return r
		if (!e) return !1
		if (((e = e.replace(/^@/, '')), (n = e.replace(/-/g, '_').toUpperCase() + '_RULE') in a)) return '@' + e
		for (var i = 0; i < o; i++) {
			var s = j[i]
			if (s.toUpperCase() + '_' + n in a) return '@-' + s.toLowerCase() + '-' + e
		}
		return !1
	}
	S.atRule = k
	S.prefixed = function (e, t, n) {
		return 0 === e.indexOf('@') ? k(e) : (-1 !== e.indexOf('-') && (e = f(e)), t ? v(e, t, n) : v(e, 'pfx'))
	}
	;(S.testAllProps = g),
		Modernizr.addTest('cssanimations', g('animationName', 'a', !0)),
		Modernizr.addTest('backgroundsize', g('backgroundSize', '100%', !0)),
		(function () {
			Modernizr.addTest('csscolumns', function () {
				var e = !1,
					t = g('columnCount')
				try {
					;(e = !!t), e && (e = new Boolean(e))
				} catch (e) {}
				return e
			})
			for (
				var e,
					t,
					n = [
						'Width',
						'Span',
						'Fill',
						'Gap',
						'Rule',
						'RuleColor',
						'RuleStyle',
						'RuleWidth',
						'BreakBefore',
						'BreakAfter',
						'BreakInside',
					],
					r = 0;
				r < n.length;
				r++
			)
				(e = n[r].toLowerCase()),
					(t = g('column' + n[r])),
					('breakbefore' !== e && 'breakafter' !== e && 'breakinside' !== e) || (t = t || g(n[r])),
					Modernizr.addTest('csscolumns.' + e, t)
		})(),
		Modernizr.addTest('cssgridlegacy', g('grid-columns', '10px', !0)),
		Modernizr.addTest('cssgrid', g('grid-template-rows', 'none', !0)),
		Modernizr.addTest('flexbox', g('flexBasis', '1px', !0)),
		Modernizr.addTest('flexboxlegacy', g('boxDirection', 'reverse', !0)),
		Modernizr.addTest('flexboxtweener', g('flexAlign', 'end', !0)),
		Modernizr.addTest('flexwrap', g('flexWrap', 'wrap', !0))
	var j = S._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['', '']
	;(S._prefixes = j),
		Modernizr.addTest('cssgradients', function () {
			for (var e, t = 'background-image:', n = '', r = 0, o = j.length - 1; r < o; r++)
				(e = 0 === r ? 'to ' : ''), (n += t + j[r] + 'linear-gradient(' + e + 'left top, #9f9, white);')
			Modernizr._config.usePrefixes &&
				(n += t + '-webkit-gradient(linear,left top,right bottom,from(#9f9),to(white));')
			var a = i('a'),
				s = a.style
			return (s.cssText = n), ('' + s.backgroundImage).indexOf('gradient') > -1
		})
	var z = 'CSS' in t && 'supports' in t.CSS,
		P = 'supportsCSS' in t
	Modernizr.addTest('supports', z || P),
		Modernizr.addTest('csstransforms', function () {
			return -1 === navigator.userAgent.indexOf('Android 2.') && g('transform', 'scale(1)', !0)
		}),
		Modernizr.addTest('csstransforms3d', function () {
			return !!g('perspective', '1px', !0)
		}),
		Modernizr.addTest('csstransitions', g('transition', 'all', !0)),
		Modernizr.addTest(
			'svg',
			!!n.createElementNS && !!n.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
		)
	var R = (function () {
		var e = t.matchMedia || t.msMatchMedia
		return e
			? function (t) {
					var n = e(t)
					return (n && n.matches) || !1
				}
			: function (e) {
					var t = !1
					return (
						l('@media ' + e + ' { #modernizr { position: absolute; } }', function (e) {
							t = 'absolute' === u(e, null, 'position')
						}),
						t
					)
				}
	})()
	;(S.mq = R),
		Modernizr.addTest('touchevents', function () {
			if ('ontouchstart' in t || t.TouchEvent || (t.DocumentTouch && n instanceof DocumentTouch)) return !0
			var e = ['(', j.join('touch-enabled),('), 'heartz', ')'].join('')
			return R(e)
		}),
		(function () {
			var e, t, n, r, a, i, s
			for (var l in y)
				if (y.hasOwnProperty(l)) {
					if (
						((e = []),
						(t = y[l]),
						t.name &&
							(e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
					)
						for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase())
					for (r = o(t.fn, 'function') ? t.fn() : t.fn, a = 0; a < e.length; a++)
						(i = e[a]),
							(s = i.split('.')),
							1 === s.length
								? (Modernizr[s[0]] = r)
								: ((Modernizr[s[0]] && (!Modernizr[s[0]] || Modernizr[s[0]] instanceof Boolean)) ||
										(Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
									(Modernizr[s[0]][s[1]] = r)),
							b.push((r ? '' : 'no-') + s.join('-'))
				}
		})(),
		(function (e) {
			var t = x.className,
				n = Modernizr._config.classPrefix || ''
			if ((C && (t = t.baseVal), Modernizr._config.enableJSClass)) {
				var r = new RegExp('(^|\\s)' + n + 'no-js(\\s|$)')
				t = t.replace(r, '$1' + n + 'js$2')
			}
			Modernizr._config.enableClasses &&
				(e.length > 0 && (t += ' ' + n + e.join(' ' + n)), C ? (x.className.baseVal = t) : (x.className = t))
		})(b),
		delete S.addTest,
		delete S.addAsyncTest
	for (var A = 0; A < Modernizr._q.length; A++) Modernizr._q[A]()
	e.Modernizr = Modernizr
})(window, window, document) /*! For license information please see bundle.global-scripts.js.LICENSE.txt */
!(function () {
	var e = {
			510: function () {
				window.addEventListener('scroll', () => {
					let e = window.pageYOffset || document.documentElement.scrollTop,
						n = document.getElementById('top_header')
					e > 50
						? n.classList.add('smaller')
						: n.classList.contains('smaller') && n.classList.remove('smaller')
				})
			},
			511: function () {
				let e = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
					n = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
					t = navigator.userAgent.toLowerCase().indexOf('msie') > -1
				;(e || n || t) &&
					document.getElementById &&
					window.addEventListener &&
					window.addEventListener(
						'hashchange',
						function () {
							var e,
								n = location.hash.substring(1)
							;/^[A-z0-9_-]+$/.test(n) &&
								(e = document.getElementById(n)) &&
								(/^(?:a|select|input|button|textarea)$/i.test(e.tagName) || (e.tabIndex = -1),
								e.focus())
						},
						!1
					)
			},
			609: function (e, n, t) {
				'use strict'
				var o = t(307),
					a = t.n(o),
					r = t(562),
					i = t.n(r)()(a())
				i.push([
					e.id,
					'.token a {\n\tcolor: inherit;\n}',
					'',
					{
						version: 3,
						sources: [
							'webpack://./node_modules/.pnpm/prismjs@1.26.0/node_modules/prismjs/plugins/autolinker/prism-autolinker.css',
						],
						names: [],
						mappings: 'AAAA;CACC,cAAc;AACf',
						sourcesContent: ['.token a {\n\tcolor: inherit;\n}'],
						sourceRoot: '',
					},
				]),
					(n.Z = i)
			},
			443: function (e, n, t) {
				'use strict'
				var o = t(307),
					a = t.n(o),
					r = t(562),
					i = t.n(r)()(a())
				i.push([
					e.id,
					'pre[class*="language-"].line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre[class*="language-"].line-numbers > code {\n\tposition: relative;\n\twhite-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}\n',
					'',
					{
						version: 3,
						sources: [
							'webpack://./node_modules/.pnpm/prismjs@1.26.0/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css',
						],
						names: [],
						mappings:
							'AAAA;CACC,kBAAkB;CAClB,mBAAmB;CACnB,yBAAyB;AAC1B;;AAEA;CACC,kBAAkB;CAClB,oBAAoB;AACrB;;AAEA;CACC,kBAAkB;CAClB,oBAAoB;CACpB,MAAM;CACN,eAAe;CACf,YAAY;CACZ,UAAU,EAAE,4CAA4C;CACxD,oBAAoB;CACpB,4BAA4B;;CAE5B,yBAAyB;CACzB,sBAAsB;CACtB,qBAAqB;CACrB,iBAAiB;;AAElB;;CAEC;EACC,cAAc;EACd,6BAA6B;CAC9B;;EAEC;GACC,4BAA4B;GAC5B,WAAW;GACX,cAAc;GACd,oBAAoB;GACpB,iBAAiB;EAClB',
						sourcesContent: [
							'pre[class*="language-"].line-numbers {\n\tposition: relative;\n\tpadding-left: 3.8em;\n\tcounter-reset: linenumber;\n}\n\npre[class*="language-"].line-numbers > code {\n\tposition: relative;\n\twhite-space: inherit;\n}\n\n.line-numbers .line-numbers-rows {\n\tposition: absolute;\n\tpointer-events: none;\n\ttop: 0;\n\tfont-size: 100%;\n\tleft: -3.8em;\n\twidth: 3em; /* works for line-numbers below 1000 lines */\n\tletter-spacing: -1px;\n\tborder-right: 1px solid #999;\n\n\t-webkit-user-select: none;\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n\tuser-select: none;\n\n}\n\n\t.line-numbers-rows > span {\n\t\tdisplay: block;\n\t\tcounter-increment: linenumber;\n\t}\n\n\t\t.line-numbers-rows > span:before {\n\t\t\tcontent: counter(linenumber);\n\t\t\tcolor: #999;\n\t\t\tdisplay: block;\n\t\t\tpadding-right: 0.8em;\n\t\t\ttext-align: right;\n\t\t}\n',
						],
						sourceRoot: '',
					},
				]),
					(n.Z = i)
			},
			183: function (e, n, t) {
				'use strict'
				var o = t(307),
					a = t.n(o),
					r = t(562),
					i = t.n(r)()(a())
				i.push([
					e.id,
					"div.code-toolbar {\n\tposition: relative;\n}\n\ndiv.code-toolbar > .toolbar {\n\tposition: absolute;\n\tz-index: 10;\n\ttop: .3em;\n\tright: .2em;\n\ttransition: opacity 0.3s ease-in-out;\n\topacity: 0;\n}\n\ndiv.code-toolbar:hover > .toolbar {\n\topacity: 1;\n}\n\n/* Separate line b/c rules are thrown out if selector is invalid.\n   IE11 and old Edge versions don't support :focus-within. */\ndiv.code-toolbar:focus-within > .toolbar {\n\topacity: 1;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item {\n\tdisplay: inline-block;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a {\n\tcursor: pointer;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > button {\n\tbackground: none;\n\tborder: 0;\n\tcolor: inherit;\n\tfont: inherit;\n\tline-height: normal;\n\toverflow: visible;\n\tpadding: 0;\n\t-webkit-user-select: none; /* for button */\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a,\ndiv.code-toolbar > .toolbar > .toolbar-item > button,\ndiv.code-toolbar > .toolbar > .toolbar-item > span {\n\tcolor: #bbb;\n\tfont-size: .8em;\n\tpadding: 0 .5em;\n\tbackground: #f5f2f0;\n\tbackground: rgba(224, 224, 224, 0.2);\n\tbox-shadow: 0 2px 0 0 rgba(0,0,0,0.2);\n\tborder-radius: .5em;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > a:focus,\ndiv.code-toolbar > .toolbar > .toolbar-item > button:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > button:focus,\ndiv.code-toolbar > .toolbar > .toolbar-item > span:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > span:focus {\n\tcolor: inherit;\n\ttext-decoration: none;\n}\n",
					'',
					{
						version: 3,
						sources: [
							'webpack://./node_modules/.pnpm/prismjs@1.26.0/node_modules/prismjs/plugins/toolbar/prism-toolbar.css',
						],
						names: [],
						mappings:
							'AAAA;CACC,kBAAkB;AACnB;;AAEA;CACC,kBAAkB;CAClB,WAAW;CACX,SAAS;CACT,WAAW;CACX,oCAAoC;CACpC,UAAU;AACX;;AAEA;CACC,UAAU;AACX;;AAEA;4DAC4D;AAC5D;CACC,UAAU;AACX;;AAEA;CACC,qBAAqB;AACtB;;AAEA;CACC,eAAe;AAChB;;AAEA;CACC,gBAAgB;CAChB,SAAS;CACT,cAAc;CACd,aAAa;CACb,mBAAmB;CACnB,iBAAiB;CACjB,UAAU;CACV,yBAAyB,EAAE,eAAe;CAC1C,sBAAsB;CACtB,qBAAqB;AACtB;;AAEA;;;CAGC,WAAW;CACX,eAAe;CACf,eAAe;CACf,mBAAmB;CACnB,oCAAoC;CACpC,qCAAqC;CACrC,mBAAmB;AACpB;;AAEA;;;;;;CAMC,cAAc;CACd,qBAAqB;AACtB',
						sourcesContent: [
							"div.code-toolbar {\n\tposition: relative;\n}\n\ndiv.code-toolbar > .toolbar {\n\tposition: absolute;\n\tz-index: 10;\n\ttop: .3em;\n\tright: .2em;\n\ttransition: opacity 0.3s ease-in-out;\n\topacity: 0;\n}\n\ndiv.code-toolbar:hover > .toolbar {\n\topacity: 1;\n}\n\n/* Separate line b/c rules are thrown out if selector is invalid.\n   IE11 and old Edge versions don't support :focus-within. */\ndiv.code-toolbar:focus-within > .toolbar {\n\topacity: 1;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item {\n\tdisplay: inline-block;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a {\n\tcursor: pointer;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > button {\n\tbackground: none;\n\tborder: 0;\n\tcolor: inherit;\n\tfont: inherit;\n\tline-height: normal;\n\toverflow: visible;\n\tpadding: 0;\n\t-webkit-user-select: none; /* for button */\n\t-moz-user-select: none;\n\t-ms-user-select: none;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a,\ndiv.code-toolbar > .toolbar > .toolbar-item > button,\ndiv.code-toolbar > .toolbar > .toolbar-item > span {\n\tcolor: #bbb;\n\tfont-size: .8em;\n\tpadding: 0 .5em;\n\tbackground: #f5f2f0;\n\tbackground: rgba(224, 224, 224, 0.2);\n\tbox-shadow: 0 2px 0 0 rgba(0,0,0,0.2);\n\tborder-radius: .5em;\n}\n\ndiv.code-toolbar > .toolbar > .toolbar-item > a:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > a:focus,\ndiv.code-toolbar > .toolbar > .toolbar-item > button:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > button:focus,\ndiv.code-toolbar > .toolbar > .toolbar-item > span:hover,\ndiv.code-toolbar > .toolbar > .toolbar-item > span:focus {\n\tcolor: inherit;\n\ttext-decoration: none;\n}\n",
						],
						sourceRoot: '',
					},
				]),
					(n.Z = i)
			},
			928: function (e, n, t) {
				'use strict'
				var o = t(307),
					a = t.n(o),
					r = t(562),
					i = t.n(r)()(a())
				i.push([
					e.id,
					'/**\n * okaidia theme for JavaScript, CSS and HTML\n * Loosely based on Monokai textmate theme by http://www.monokai.nl/\n * @author ocodia\n */\n\ncode[class*="language-"],\npre[class*="language-"] {\n\tcolor: #f8f8f2;\n\tbackground: none;\n\ttext-shadow: 0 1px rgba(0, 0, 0, 0.3);\n\tfont-family: Consolas, Monaco, \'Andale Mono\', \'Ubuntu Mono\', monospace;\n\tfont-size: 1em;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\n/* Code blocks */\npre[class*="language-"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n\tborder-radius: 0.3em;\n}\n\n:not(pre) > code[class*="language-"],\npre[class*="language-"] {\n\tbackground: #272822;\n}\n\n/* Inline code */\n:not(pre) > code[class*="language-"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: #8292a2;\n}\n\n.token.punctuation {\n\tcolor: #f8f8f2;\n}\n\n.token.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #f92672;\n}\n\n.token.boolean,\n.token.number {\n\tcolor: #ae81ff;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #a6e22e;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string,\n.token.variable {\n\tcolor: #f8f8f2;\n}\n\n.token.atrule,\n.token.attr-value,\n.token.function,\n.token.class-name {\n\tcolor: #e6db74;\n}\n\n.token.keyword {\n\tcolor: #66d9ef;\n}\n\n.token.regex,\n.token.important {\n\tcolor: #fd971f;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n',
					'',
					{
						version: 3,
						sources: [
							'webpack://./node_modules/.pnpm/prismjs@1.26.0/node_modules/prismjs/themes/prism-okaidia.css',
						],
						names: [],
						mappings:
							'AAAA;;;;EAIE;;AAEF;;CAEC,cAAc;CACd,gBAAgB;CAChB,qCAAqC;CACrC,sEAAsE;CACtE,cAAc;CACd,gBAAgB;CAChB,gBAAgB;CAChB,oBAAoB;CACpB,kBAAkB;CAClB,iBAAiB;CACjB,gBAAgB;;CAEhB,gBAAgB;CAChB,cAAc;CACd,WAAW;;CAEX,qBAAqB;CACrB,kBAAkB;CAClB,iBAAiB;CACjB,aAAa;AACd;;AAEA,gBAAgB;AAChB;CACC,YAAY;CACZ,cAAc;CACd,cAAc;CACd,oBAAoB;AACrB;;AAEA;;CAEC,mBAAmB;AACpB;;AAEA,gBAAgB;AAChB;CACC,aAAa;CACb,mBAAmB;CACnB,mBAAmB;AACpB;;AAEA;;;;CAIC,cAAc;AACf;;AAEA;CACC,cAAc;AACf;;AAEA;CACC,WAAW;AACZ;;AAEA;;;;;CAKC,cAAc;AACf;;AAEA;;CAEC,cAAc;AACf;;AAEA;;;;;;CAMC,cAAc;AACf;;AAEA;;;;;;CAMC,cAAc;AACf;;AAEA;;;;CAIC,cAAc;AACf;;AAEA;CACC,cAAc;AACf;;AAEA;;CAEC,cAAc;AACf;;AAEA;;CAEC,iBAAiB;AAClB;AACA;CACC,kBAAkB;AACnB;;AAEA;CACC,YAAY;AACb',
						sourcesContent: [
							'/**\n * okaidia theme for JavaScript, CSS and HTML\n * Loosely based on Monokai textmate theme by http://www.monokai.nl/\n * @author ocodia\n */\n\ncode[class*="language-"],\npre[class*="language-"] {\n\tcolor: #f8f8f2;\n\tbackground: none;\n\ttext-shadow: 0 1px rgba(0, 0, 0, 0.3);\n\tfont-family: Consolas, Monaco, \'Andale Mono\', \'Ubuntu Mono\', monospace;\n\tfont-size: 1em;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\n/* Code blocks */\npre[class*="language-"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n\tborder-radius: 0.3em;\n}\n\n:not(pre) > code[class*="language-"],\npre[class*="language-"] {\n\tbackground: #272822;\n}\n\n/* Inline code */\n:not(pre) > code[class*="language-"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: #8292a2;\n}\n\n.token.punctuation {\n\tcolor: #f8f8f2;\n}\n\n.token.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #f92672;\n}\n\n.token.boolean,\n.token.number {\n\tcolor: #ae81ff;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #a6e22e;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string,\n.token.variable {\n\tcolor: #f8f8f2;\n}\n\n.token.atrule,\n.token.attr-value,\n.token.function,\n.token.class-name {\n\tcolor: #e6db74;\n}\n\n.token.keyword {\n\tcolor: #66d9ef;\n}\n\n.token.regex,\n.token.important {\n\tcolor: #fd971f;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n',
						],
						sourceRoot: '',
					},
				]),
					(n.Z = i)
			},
			562: function (e) {
				'use strict'
				e.exports = function (e) {
					var n = []
					return (
						(n.toString = function () {
							return this.map(function (n) {
								var t = '',
									o = void 0 !== n[5]
								return (
									n[4] && (t += '@supports ('.concat(n[4], ') {')),
									n[2] && (t += '@media '.concat(n[2], ' {')),
									o && (t += '@layer'.concat(n[5].length > 0 ? ' '.concat(n[5]) : '', ' {')),
									(t += e(n)),
									o && (t += '}'),
									n[2] && (t += '}'),
									n[4] && (t += '}'),
									t
								)
							}).join('')
						}),
						(n.i = function (e, t, o, a, r) {
							'string' == typeof e && (e = [[null, e, void 0]])
							var i = {}
							if (o)
								for (var s = 0; s < this.length; s++) {
									var l = this[s][0]
									null != l && (i[l] = !0)
								}
							for (var c = 0; c < e.length; c++) {
								var u = [].concat(e[c])
								;(o && i[u[0]]) ||
									(void 0 !== r &&
										(void 0 === u[5] ||
											(u[1] = '@layer'
												.concat(u[5].length > 0 ? ' '.concat(u[5]) : '', ' {')
												.concat(u[1], '}')),
										(u[5] = r)),
									t &&
										(u[2]
											? ((u[1] = '@media '.concat(u[2], ' {').concat(u[1], '}')), (u[2] = t))
											: (u[2] = t)),
									a &&
										(u[4]
											? ((u[1] = '@supports ('.concat(u[4], ') {').concat(u[1], '}')), (u[4] = a))
											: (u[4] = ''.concat(a))),
									n.push(u))
							}
						}),
						n
					)
				}
			},
			307: function (e) {
				'use strict'
				e.exports = function (e) {
					var n = e[1],
						t = e[3]
					if (!t) return n
					if ('function' == typeof btoa) {
						var o = btoa(unescape(encodeURIComponent(JSON.stringify(t)))),
							a = 'sourceMappingURL=data:application/json;charset=utf-8;base64,'.concat(o),
							r = '/*# '.concat(a, ' */'),
							i = t.sources.map(function (e) {
								return '/*# sourceURL='.concat(t.sourceRoot || '').concat(e, ' */')
							})
						return [n].concat(i).concat([r]).join('\n')
					}
					return [n].join('\n')
				}
			},
			126: function () {
				!(function (e) {
					var n =
							'\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b',
						t = {
							pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
							lookbehind: !0,
							alias: 'punctuation',
							inside: null,
						},
						o = {
							bash: t,
							environment: { pattern: RegExp('\\$' + n), alias: 'constant' },
							variable: [
								{
									pattern: /\$?\(\([\s\S]+?\)\)/,
									greedy: !0,
									inside: {
										variable: [{ pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 }, /^\$\(\(/],
										number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
										operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
										punctuation: /\(\(?|\)\)?|,|;/,
									},
								},
								{
									pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
									greedy: !0,
									inside: { variable: /^\$\(|^`|\)$|`$/ },
								},
								{
									pattern: /\$\{[^}]+\}/,
									greedy: !0,
									inside: {
										operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
										punctuation: /[\[\]]/,
										environment: {
											pattern: RegExp('(\\{)' + n),
											lookbehind: !0,
											alias: 'constant',
										},
									},
								},
								/\$(?:\w+|[#?*!@$])/,
							],
							entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/,
						}
					;(e.languages.bash = {
						shebang: { pattern: /^#!\s*\/.*/, alias: 'important' },
						comment: { pattern: /(^|[^"{\\$])#.*/, lookbehind: !0 },
						'function-name': [
							{
								pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
								lookbehind: !0,
								alias: 'function',
							},
							{ pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/, alias: 'function' },
						],
						'for-or-select': {
							pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
							alias: 'variable',
							lookbehind: !0,
						},
						'assign-left': {
							pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
							inside: {
								environment: {
									pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + n),
									lookbehind: !0,
									alias: 'constant',
								},
							},
							alias: 'variable',
							lookbehind: !0,
						},
						string: [
							{
								pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
								lookbehind: !0,
								greedy: !0,
								inside: o,
							},
							{
								pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
								lookbehind: !0,
								greedy: !0,
								inside: { bash: t },
							},
							{
								pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
								lookbehind: !0,
								greedy: !0,
								inside: o,
							},
							{ pattern: /(^|[^$\\])'[^']*'/, lookbehind: !0, greedy: !0 },
							{ pattern: /\$'(?:[^'\\]|\\[\s\S])*'/, greedy: !0, inside: { entity: o.entity } },
						],
						environment: { pattern: RegExp('\\$?' + n), alias: 'constant' },
						variable: o.variable,
						function: {
							pattern:
								/(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
							lookbehind: !0,
						},
						keyword: {
							pattern:
								/(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
							lookbehind: !0,
						},
						builtin: {
							pattern:
								/(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
							lookbehind: !0,
							alias: 'class-name',
						},
						boolean: { pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/, lookbehind: !0 },
						'file-descriptor': { pattern: /\B&\d\b/, alias: 'important' },
						operator: {
							pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
							inside: { 'file-descriptor': { pattern: /^\d/, alias: 'important' } },
						},
						punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
						number: { pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/, lookbehind: !0 },
					}),
						(t.inside = e.languages.bash)
					for (
						var a = [
								'comment',
								'function-name',
								'for-or-select',
								'assign-left',
								'string',
								'environment',
								'function',
								'keyword',
								'builtin',
								'boolean',
								'file-descriptor',
								'operator',
								'punctuation',
								'number',
							],
							r = o.variable[1].inside,
							i = 0;
						i < a.length;
						i++
					)
						r[a[i]] = e.languages.bash[a[i]]
					e.languages.shell = e.languages.bash
				})(Prism)
			},
			226: function () {
				Prism.languages.clike = {
					comment: [
						{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
						{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
					],
					string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
					'class-name': {
						pattern:
							/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
						lookbehind: !0,
						inside: { punctuation: /[.\\]/ },
					},
					keyword:
						/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
					boolean: /\b(?:false|true)\b/,
					function: /\b\w+(?=\()/,
					number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
					operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
					punctuation: /[{}[\];(),.:]/,
				}
			},
			323: function (e, n, t) {
				var o = (function (e) {
					var n = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
						t = 0,
						o = {},
						a = {
							manual: e.Prism && e.Prism.manual,
							disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
							util: {
								encode: function e(n) {
									return n instanceof r
										? new r(n.type, e(n.content), n.alias)
										: Array.isArray(n)
											? n.map(e)
											: n
													.replace(/&/g, '&amp;')
													.replace(/</g, '&lt;')
													.replace(/\u00a0/g, ' ')
								},
								type: function (e) {
									return Object.prototype.toString.call(e).slice(8, -1)
								},
								objId: function (e) {
									return e.__id || Object.defineProperty(e, '__id', { value: ++t }), e.__id
								},
								clone: function e(n, t) {
									var o, r
									switch (((t = t || {}), a.util.type(n))) {
										case 'Object':
											if (((r = a.util.objId(n)), t[r])) return t[r]
											for (var i in ((o = {}), (t[r] = o), n))
												n.hasOwnProperty(i) && (o[i] = e(n[i], t))
											return o
										case 'Array':
											return (
												(r = a.util.objId(n)),
												t[r]
													? t[r]
													: ((o = []),
														(t[r] = o),
														n.forEach(function (n, a) {
															o[a] = e(n, t)
														}),
														o)
											)
										default:
											return n
									}
								},
								getLanguage: function (e) {
									for (; e; ) {
										var t = n.exec(e.className)
										if (t) return t[1].toLowerCase()
										e = e.parentElement
									}
									return 'none'
								},
								setLanguage: function (e, t) {
									;(e.className = e.className.replace(RegExp(n, 'gi'), '')),
										e.classList.add('language-' + t)
								},
								currentScript: function () {
									if ('undefined' == typeof document) return null
									if ('currentScript' in document) return document.currentScript
									try {
										throw new Error()
									} catch (o) {
										var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(o.stack) || [])[1]
										if (e) {
											var n = document.getElementsByTagName('script')
											for (var t in n) if (n[t].src == e) return n[t]
										}
										return null
									}
								},
								isActive: function (e, n, t) {
									for (var o = 'no-' + n; e; ) {
										var a = e.classList
										if (a.contains(n)) return !0
										if (a.contains(o)) return !1
										e = e.parentElement
									}
									return !!t
								},
							},
							languages: {
								plain: o,
								plaintext: o,
								text: o,
								txt: o,
								extend: function (e, n) {
									var t = a.util.clone(a.languages[e])
									for (var o in n) t[o] = n[o]
									return t
								},
								insertBefore: function (e, n, t, o) {
									var r = (o = o || a.languages)[e],
										i = {}
									for (var s in r)
										if (r.hasOwnProperty(s)) {
											if (s == n) for (var l in t) t.hasOwnProperty(l) && (i[l] = t[l])
											t.hasOwnProperty(s) || (i[s] = r[s])
										}
									var c = o[e]
									return (
										(o[e] = i),
										a.languages.DFS(a.languages, function (n, t) {
											t === c && n != e && (this[n] = i)
										}),
										i
									)
								},
								DFS: function e(n, t, o, r) {
									r = r || {}
									var i = a.util.objId
									for (var s in n)
										if (n.hasOwnProperty(s)) {
											t.call(n, s, n[s], o || s)
											var l = n[s],
												c = a.util.type(l)
											'Object' !== c || r[i(l)]
												? 'Array' !== c || r[i(l)] || ((r[i(l)] = !0), e(l, t, s, r))
												: ((r[i(l)] = !0), e(l, t, null, r))
										}
								},
							},
							plugins: {},
							highlightAll: function (e, n) {
								a.highlightAllUnder(document, e, n)
							},
							highlightAllUnder: function (e, n, t) {
								var o = {
									callback: t,
									container: e,
									selector:
										'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
								}
								a.hooks.run('before-highlightall', o),
									(o.elements = Array.prototype.slice.apply(
										o.container.querySelectorAll(o.selector)
									)),
									a.hooks.run('before-all-elements-highlight', o)
								for (var r, i = 0; (r = o.elements[i++]); ) a.highlightElement(r, !0 === n, o.callback)
							},
							highlightElement: function (n, t, o) {
								var r = a.util.getLanguage(n),
									i = a.languages[r]
								a.util.setLanguage(n, r)
								var s = n.parentElement
								s && 'pre' === s.nodeName.toLowerCase() && a.util.setLanguage(s, r)
								var l = { element: n, language: r, grammar: i, code: n.textContent }
								function c(e) {
									;(l.highlightedCode = e),
										a.hooks.run('before-insert', l),
										(l.element.innerHTML = l.highlightedCode),
										a.hooks.run('after-highlight', l),
										a.hooks.run('complete', l),
										o && o.call(l.element)
								}
								if (
									(a.hooks.run('before-sanity-check', l),
									(s = l.element.parentElement) &&
										'pre' === s.nodeName.toLowerCase() &&
										!s.hasAttribute('tabindex') &&
										s.setAttribute('tabindex', '0'),
									!l.code)
								)
									return a.hooks.run('complete', l), void (o && o.call(l.element))
								if ((a.hooks.run('before-highlight', l), l.grammar))
									if (t && e.Worker) {
										var u = new Worker(a.filename)
										;(u.onmessage = function (e) {
											c(e.data)
										}),
											u.postMessage(
												JSON.stringify({
													language: l.language,
													code: l.code,
													immediateClose: !0,
												})
											)
									} else c(a.highlight(l.code, l.grammar, l.language))
								else c(a.util.encode(l.code))
							},
							highlight: function (e, n, t) {
								var o = { code: e, grammar: n, language: t }
								return (
									a.hooks.run('before-tokenize', o),
									(o.tokens = a.tokenize(o.code, o.grammar)),
									a.hooks.run('after-tokenize', o),
									r.stringify(a.util.encode(o.tokens), o.language)
								)
							},
							tokenize: function (e, n) {
								var t = n.rest
								if (t) {
									for (var o in t) n[o] = t[o]
									delete n.rest
								}
								var a = new l()
								return (
									c(a, a.head, e),
									s(e, a, n, a.head, 0),
									(function (e) {
										for (var n = [], t = e.head.next; t !== e.tail; ) n.push(t.value), (t = t.next)
										return n
									})(a)
								)
							},
							hooks: {
								all: {},
								add: function (e, n) {
									var t = a.hooks.all
									;(t[e] = t[e] || []), t[e].push(n)
								},
								run: function (e, n) {
									var t = a.hooks.all[e]
									if (t && t.length) for (var o, r = 0; (o = t[r++]); ) o(n)
								},
							},
							Token: r,
						}
					function r(e, n, t, o) {
						;(this.type = e), (this.content = n), (this.alias = t), (this.length = 0 | (o || '').length)
					}
					function i(e, n, t, o) {
						e.lastIndex = n
						var a = e.exec(t)
						if (a && o && a[1]) {
							var r = a[1].length
							;(a.index += r), (a[0] = a[0].slice(r))
						}
						return a
					}
					function s(e, n, t, o, l, d) {
						for (var p in t)
							if (t.hasOwnProperty(p) && t[p]) {
								var m = t[p]
								m = Array.isArray(m) ? m : [m]
								for (var g = 0; g < m.length; ++g) {
									if (d && d.cause == p + ',' + g) return
									var f = m[g],
										b = f.inside,
										h = !!f.lookbehind,
										A = !!f.greedy,
										v = f.alias
									if (A && !f.pattern.global) {
										var y = f.pattern.toString().match(/[imsuy]*$/)[0]
										f.pattern = RegExp(f.pattern.source, y + 'g')
									}
									for (
										var k = f.pattern || f, w = o.next, C = l;
										w !== n.tail && !(d && C >= d.reach);
										C += w.value.length, w = w.next
									) {
										var S = w.value
										if (n.length > e.length) return
										if (!(S instanceof r)) {
											var E,
												x = 1
											if (A) {
												if (!(E = i(k, C, e, h)) || E.index >= e.length) break
												var B = E.index,
													P = E.index + E[0].length,
													T = C
												for (T += w.value.length; B >= T; ) T += (w = w.next).value.length
												if (((C = T -= w.value.length), w.value instanceof r)) continue
												for (
													var L = w;
													L !== n.tail && (T < P || 'string' == typeof L.value);
													L = L.next
												)
													x++, (T += L.value.length)
												x--, (S = e.slice(C, T)), (E.index -= C)
											} else if (!(E = i(k, 0, S, h))) continue
											B = E.index
											var F = E[0],
												_ = S.slice(0, B),
												O = S.slice(B + F.length),
												M = C + S.length
											d && M > d.reach && (d.reach = M)
											var N = w.prev
											if (
												(_ && ((N = c(n, N, _)), (C += _.length)),
												u(n, N, x),
												(w = c(n, N, new r(p, b ? a.tokenize(F, b) : F, v, F))),
												O && c(n, w, O),
												x > 1)
											) {
												var I = { cause: p + ',' + g, reach: M }
												s(e, n, t, w.prev, C, I), d && I.reach > d.reach && (d.reach = I.reach)
											}
										}
									}
								}
							}
					}
					function l() {
						var e = { value: null, prev: null, next: null },
							n = { value: null, prev: e, next: null }
						;(e.next = n), (this.head = e), (this.tail = n), (this.length = 0)
					}
					function c(e, n, t) {
						var o = n.next,
							a = { value: t, prev: n, next: o }
						return (n.next = a), (o.prev = a), e.length++, a
					}
					function u(e, n, t) {
						for (var o = n.next, a = 0; a < t && o !== e.tail; a++) o = o.next
						;(n.next = o), (o.prev = n), (e.length -= a)
					}
					if (
						((e.Prism = a),
						(r.stringify = function e(n, t) {
							if ('string' == typeof n) return n
							if (Array.isArray(n)) {
								var o = ''
								return (
									n.forEach(function (n) {
										o += e(n, t)
									}),
									o
								)
							}
							var r = {
									type: n.type,
									content: e(n.content, t),
									tag: 'span',
									classes: ['token', n.type],
									attributes: {},
									language: t,
								},
								i = n.alias
							i && (Array.isArray(i) ? Array.prototype.push.apply(r.classes, i) : r.classes.push(i)),
								a.hooks.run('wrap', r)
							var s = ''
							for (var l in r.attributes)
								s += ' ' + l + '="' + (r.attributes[l] || '').replace(/"/g, '&quot;') + '"'
							return (
								'<' +
								r.tag +
								' class="' +
								r.classes.join(' ') +
								'"' +
								s +
								'>' +
								r.content +
								'</' +
								r.tag +
								'>'
							)
						}),
						!e.document)
					)
						return e.addEventListener
							? (a.disableWorkerMessageHandler ||
									e.addEventListener(
										'message',
										function (n) {
											var t = JSON.parse(n.data),
												o = t.language,
												r = t.code,
												i = t.immediateClose
											e.postMessage(a.highlight(r, a.languages[o], o)), i && e.close()
										},
										!1
									),
								a)
							: a
					var d = a.util.currentScript()
					function p() {
						a.manual || a.highlightAll()
					}
					if ((d && ((a.filename = d.src), d.hasAttribute('data-manual') && (a.manual = !0)), !a.manual)) {
						var m = document.readyState
						'loading' === m || ('interactive' === m && d && d.defer)
							? document.addEventListener('DOMContentLoaded', p)
							: window.requestAnimationFrame
								? window.requestAnimationFrame(p)
								: window.setTimeout(p, 16)
					}
					return a
				})(
					'undefined' != typeof window
						? window
						: 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
							? self
							: {}
				)
				e.exports && (e.exports = o), void 0 !== t.g && (t.g.Prism = o)
			},
			847: function () {
				!(function (e) {
					var n,
						t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/
					;(e.languages.css.selector = {
						pattern: e.languages.css.selector.pattern,
						lookbehind: !0,
						inside: (n = {
							'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
							'pseudo-class': /:[-\w]+/,
							class: /\.[-\w]+/,
							id: /#[-\w]+/,
							attribute: {
								pattern: RegExp('\\[(?:[^[\\]"\']|' + t.source + ')*\\]'),
								greedy: !0,
								inside: {
									punctuation: /^\[|\]$/,
									'case-sensitivity': { pattern: /(\s)[si]$/i, lookbehind: !0, alias: 'keyword' },
									namespace: {
										pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
										lookbehind: !0,
										inside: { punctuation: /\|$/ },
									},
									'attr-name': { pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/, lookbehind: !0 },
									'attr-value': [
										t,
										{ pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/, lookbehind: !0 },
									],
									operator: /[|~*^$]?=/,
								},
							},
							'n-th': [
								{
									pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
									lookbehind: !0,
									inside: { number: /[\dn]+/, operator: /[+-]/ },
								},
								{ pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i, lookbehind: !0 },
							],
							combinator: />|\+|~|\|\|/,
							punctuation: /[(),]/,
						}),
					}),
						(e.languages.css.atrule.inside['selector-function-argument'].inside = n),
						e.languages.insertBefore('css', 'property', {
							variable: {
								pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
								lookbehind: !0,
							},
						})
					var o = { pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/, lookbehind: !0 },
						a = { pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/, lookbehind: !0 }
					e.languages.insertBefore('css', 'function', {
						operator: { pattern: /(\s)[+\-*\/](?=\s)/, lookbehind: !0 },
						hexcode: { pattern: /\B#[\da-f]{3,8}\b/i, alias: 'color' },
						color: [
							{
								pattern:
									/(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
								lookbehind: !0,
							},
							{
								pattern:
									/\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
								inside: { unit: o, number: a, function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
							},
						],
						entity: /\\[\da-f]{1,8}/i,
						unit: o,
						number: a,
					})
				})(Prism)
			},
			809: function () {
				!(function (e) {
					var n = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/
					;(e.languages.css = {
						comment: /\/\*[\s\S]*?\*\//,
						atrule: {
							pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
							inside: {
								rule: /^@[\w-]+/,
								'selector-function-argument': {
									pattern:
										/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
									lookbehind: !0,
									alias: 'selector',
								},
								keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: !0 },
							},
						},
						url: {
							pattern: RegExp(
								'\\burl\\((?:' + n.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)',
								'i'
							),
							greedy: !0,
							inside: {
								function: /^url/i,
								punctuation: /^\(|\)$/,
								string: { pattern: RegExp('^' + n.source + '$'), alias: 'url' },
							},
						},
						selector: {
							pattern: RegExp(
								'(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + n.source + ')*(?=\\s*\\{)'
							),
							lookbehind: !0,
						},
						string: { pattern: n, greedy: !0 },
						property: {
							pattern:
								/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
							lookbehind: !0,
						},
						important: /!important\b/i,
						function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
						punctuation: /[(){};:,]/,
					}),
						(e.languages.css.atrule.inside.rest = e.languages.css)
					var t = e.languages.markup
					t && (t.tag.addInlined('style', 'css'), t.tag.addAttribute('style', 'css'))
				})(Prism)
			},
			181: function () {
				;(Prism.languages.javascript = Prism.languages.extend('clike', {
					'class-name': [
						Prism.languages.clike['class-name'],
						{
							pattern:
								/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
							lookbehind: !0,
						},
					],
					keyword: [
						{ pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
						{
							pattern:
								/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
							lookbehind: !0,
						},
					],
					function:
						/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
					number: {
						pattern: RegExp(
							/(^|[^\w$])/.source +
								'(?:' +
								/NaN|Infinity/.source +
								'|' +
								/0[bB][01]+(?:_[01]+)*n?/.source +
								'|' +
								/0[oO][0-7]+(?:_[0-7]+)*n?/.source +
								'|' +
								/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
								'|' +
								/\d+(?:_\d+)*n/.source +
								'|' +
								/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
									.source +
								')' +
								/(?![\w$])/.source
						),
						lookbehind: !0,
					},
					operator:
						/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
				})),
					(Prism.languages.javascript['class-name'][0].pattern =
						/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
					Prism.languages.insertBefore('javascript', 'keyword', {
						regex: {
							pattern:
								/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
							lookbehind: !0,
							greedy: !0,
							inside: {
								'regex-source': {
									pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
									lookbehind: !0,
									alias: 'language-regex',
									inside: Prism.languages.regex,
								},
								'regex-delimiter': /^\/|\/$/,
								'regex-flags': /^[a-z]+$/,
							},
						},
						'function-variable': {
							pattern:
								/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
							alias: 'function',
						},
						parameter: [
							{
								pattern:
									/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
								lookbehind: !0,
								inside: Prism.languages.javascript,
							},
							{
								pattern:
									/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
								lookbehind: !0,
								inside: Prism.languages.javascript,
							},
							{
								pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
								lookbehind: !0,
								inside: Prism.languages.javascript,
							},
							{
								pattern:
									/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
								lookbehind: !0,
								inside: Prism.languages.javascript,
							},
						],
						constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
					}),
					Prism.languages.insertBefore('javascript', 'string', {
						hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
						'template-string': {
							pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
							greedy: !0,
							inside: {
								'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
								interpolation: {
									pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
									lookbehind: !0,
									inside: {
										'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
										rest: Prism.languages.javascript,
									},
								},
								string: /[\s\S]+/,
							},
						},
						'string-property': {
							pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
							lookbehind: !0,
							greedy: !0,
							alias: 'property',
						},
					}),
					Prism.languages.insertBefore('javascript', 'operator', {
						'literal-property': {
							pattern:
								/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
							lookbehind: !0,
							alias: 'property',
						},
					}),
					Prism.languages.markup &&
						(Prism.languages.markup.tag.addInlined('script', 'javascript'),
						Prism.languages.markup.tag.addAttribute(
							/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
								.source,
							'javascript'
						)),
					(Prism.languages.js = Prism.languages.javascript)
			},
			628: function () {
				;(Prism.languages.json = {
					property: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, lookbehind: !0, greedy: !0 },
					string: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, lookbehind: !0, greedy: !0 },
					comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
					number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
					punctuation: /[{}[\],]/,
					operator: /:/,
					boolean: /\b(?:false|true)\b/,
					null: { pattern: /\bnull\b/, alias: 'keyword' },
				}),
					(Prism.languages.webmanifest = Prism.languages.json)
			},
			56: function () {
				!(function (e) {
					function n(e, n) {
						return '___' + e.toUpperCase() + n + '___'
					}
					Object.defineProperties((e.languages['markup-templating'] = {}), {
						buildPlaceholders: {
							value: function (t, o, a, r) {
								if (t.language === o) {
									var i = (t.tokenStack = [])
									;(t.code = t.code.replace(a, function (e) {
										if ('function' == typeof r && !r(e)) return e
										for (var a, s = i.length; -1 !== t.code.indexOf((a = n(o, s))); ) ++s
										return (i[s] = e), a
									})),
										(t.grammar = e.languages.markup)
								}
							},
						},
						tokenizePlaceholders: {
							value: function (t, o) {
								if (t.language === o && t.tokenStack) {
									t.grammar = e.languages[o]
									var a = 0,
										r = Object.keys(t.tokenStack)
									!(function i(s) {
										for (var l = 0; l < s.length && !(a >= r.length); l++) {
											var c = s[l]
											if ('string' == typeof c || (c.content && 'string' == typeof c.content)) {
												var u = r[a],
													d = t.tokenStack[u],
													p = 'string' == typeof c ? c : c.content,
													m = n(o, u),
													g = p.indexOf(m)
												if (g > -1) {
													++a
													var f = p.substring(0, g),
														b = new e.Token(
															o,
															e.tokenize(d, t.grammar),
															'language-' + o,
															d
														),
														h = p.substring(g + m.length),
														A = []
													f && A.push.apply(A, i([f])),
														A.push(b),
														h && A.push.apply(A, i([h])),
														'string' == typeof c
															? s.splice.apply(s, [l, 1].concat(A))
															: (c.content = A)
												}
											} else c.content && i(c.content)
										}
										return s
									})(t.tokens)
								}
							},
						},
					})
				})(Prism)
			},
			241: function () {
				;(Prism.languages.markup = {
					comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
					prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
					doctype: {
						pattern:
							/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
						greedy: !0,
						inside: {
							'internal-subset': {
								pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
								lookbehind: !0,
								greedy: !0,
								inside: null,
							},
							string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
							punctuation: /^<!|>$|[[\]]/,
							'doctype-tag': /^DOCTYPE/i,
							name: /[^\s<>'"]+/,
						},
					},
					cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
					tag: {
						pattern:
							/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
						greedy: !0,
						inside: {
							tag: {
								pattern: /^<\/?[^\s>\/]+/,
								inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
							},
							'special-attr': [],
							'attr-value': {
								pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
								inside: { punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/] },
							},
							punctuation: /\/?>/,
							'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
						},
					},
					entity: [{ pattern: /&[\da-z]{1,8};/i, alias: 'named-entity' }, /&#x?[\da-f]{1,8};/i],
				}),
					(Prism.languages.markup.tag.inside['attr-value'].inside.entity = Prism.languages.markup.entity),
					(Prism.languages.markup.doctype.inside['internal-subset'].inside = Prism.languages.markup),
					Prism.hooks.add('wrap', function (e) {
						'entity' === e.type && (e.attributes.title = e.content.replace(/&amp;/, '&'))
					}),
					Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
						value: function (e, n) {
							var t = {}
							;(t['language-' + n] = {
								pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
								lookbehind: !0,
								inside: Prism.languages[n],
							}),
								(t.cdata = /^<!\[CDATA\[|\]\]>$/i)
							var o = { 'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: t } }
							o['language-' + n] = { pattern: /[\s\S]+/, inside: Prism.languages[n] }
							var a = {}
							;(a[e] = {
								pattern: RegExp(
									/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
										/__/g,
										function () {
											return e
										}
									),
									'i'
								),
								lookbehind: !0,
								greedy: !0,
								inside: o,
							}),
								Prism.languages.insertBefore('markup', 'cdata', a)
						},
					}),
					Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
						value: function (e, n) {
							Prism.languages.markup.tag.inside['special-attr'].push({
								pattern: RegExp(
									/(^|["'\s])/.source +
										'(?:' +
										e +
										')' +
										/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
									'i'
								),
								lookbehind: !0,
								inside: {
									'attr-name': /^[^\s=]+/,
									'attr-value': {
										pattern: /=[\s\S]+/,
										inside: {
											value: {
												pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
												lookbehind: !0,
												alias: [n, 'language-' + n],
												inside: Prism.languages[n],
											},
											punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/],
										},
									},
								},
							})
						},
					}),
					(Prism.languages.html = Prism.languages.markup),
					(Prism.languages.mathml = Prism.languages.markup),
					(Prism.languages.svg = Prism.languages.markup),
					(Prism.languages.xml = Prism.languages.extend('markup', {})),
					(Prism.languages.ssml = Prism.languages.xml),
					(Prism.languages.atom = Prism.languages.xml),
					(Prism.languages.rss = Prism.languages.xml)
			},
			237: function () {
				Prism.languages.insertBefore('php', 'variable', {
					this: { pattern: /\$this\b/, alias: 'keyword' },
					global: /\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
					scope: {
						pattern: /\b[\w\\]+::/,
						inside: { keyword: /\b(?:parent|self|static)\b/, punctuation: /::|\\/ },
					},
				})
			},
			684: function () {
				!(function (e) {
					var n = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/,
						t = [
							{ pattern: /\b(?:false|true)\b/i, alias: 'boolean' },
							{ pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i, greedy: !0, lookbehind: !0 },
							{ pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i, greedy: !0, lookbehind: !0 },
							/\b(?:null)\b/i,
							/\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/,
						],
						o =
							/\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
						a = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/,
						r = /[{}\[\](),:;]/
					e.languages.php = {
						delimiter: { pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i, alias: 'important' },
						comment: n,
						variable: /\$+(?:\w+\b|(?=\{))/,
						package: {
							pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
							lookbehind: !0,
							inside: { punctuation: /\\/ },
						},
						'class-name-definition': {
							pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
							lookbehind: !0,
							alias: 'class-name',
						},
						'function-definition': {
							pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
							lookbehind: !0,
							alias: 'function',
						},
						keyword: [
							{
								pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
								alias: 'type-casting',
								greedy: !0,
								lookbehind: !0,
							},
							{
								pattern:
									/([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
								alias: 'type-hint',
								greedy: !0,
								lookbehind: !0,
							},
							{
								pattern:
									/(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string|void)\b/i,
								alias: 'return-type',
								greedy: !0,
								lookbehind: !0,
							},
							{
								pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
								alias: 'type-declaration',
								greedy: !0,
							},
							{
								pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
								alias: 'type-declaration',
								greedy: !0,
								lookbehind: !0,
							},
							{ pattern: /\b(?:parent|self|static)(?=\s*::)/i, alias: 'static-context', greedy: !0 },
							{ pattern: /(\byield\s+)from\b/i, lookbehind: !0 },
							/\bclass\b/i,
							{
								pattern:
									/((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|parent|print|private|protected|public|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
								lookbehind: !0,
							},
						],
						'argument-name': { pattern: /([(,]\s+)\b[a-z_]\w*(?=\s*:(?!:))/i, lookbehind: !0 },
						'class-name': [
							{
								pattern:
									/(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
								greedy: !0,
								lookbehind: !0,
							},
							{ pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i, greedy: !0, lookbehind: !0 },
							{ pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i, greedy: !0 },
							{
								pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
								alias: 'class-name-fully-qualified',
								greedy: !0,
								lookbehind: !0,
								inside: { punctuation: /\\/ },
							},
							{
								pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
								alias: 'class-name-fully-qualified',
								greedy: !0,
								inside: { punctuation: /\\/ },
							},
							{
								pattern:
									/(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
								alias: 'class-name-fully-qualified',
								greedy: !0,
								lookbehind: !0,
								inside: { punctuation: /\\/ },
							},
							{ pattern: /\b[a-z_]\w*(?=\s*\$)/i, alias: 'type-declaration', greedy: !0 },
							{
								pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
								alias: ['class-name-fully-qualified', 'type-declaration'],
								greedy: !0,
								inside: { punctuation: /\\/ },
							},
							{ pattern: /\b[a-z_]\w*(?=\s*::)/i, alias: 'static-context', greedy: !0 },
							{
								pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
								alias: ['class-name-fully-qualified', 'static-context'],
								greedy: !0,
								inside: { punctuation: /\\/ },
							},
							{
								pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
								alias: 'type-hint',
								greedy: !0,
								lookbehind: !0,
							},
							{
								pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
								alias: ['class-name-fully-qualified', 'type-hint'],
								greedy: !0,
								lookbehind: !0,
								inside: { punctuation: /\\/ },
							},
							{
								pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
								alias: 'return-type',
								greedy: !0,
								lookbehind: !0,
							},
							{
								pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
								alias: ['class-name-fully-qualified', 'return-type'],
								greedy: !0,
								lookbehind: !0,
								inside: { punctuation: /\\/ },
							},
						],
						constant: t,
						function: {
							pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
							lookbehind: !0,
							inside: { punctuation: /\\/ },
						},
						property: { pattern: /(->\s*)\w+/, lookbehind: !0 },
						number: o,
						operator: a,
						punctuation: r,
					}
					var i = {
							pattern:
								/\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
							lookbehind: !0,
							inside: e.languages.php,
						},
						s = [
							{
								pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
								alias: 'nowdoc-string',
								greedy: !0,
								inside: {
									delimiter: {
										pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
										alias: 'symbol',
										inside: { punctuation: /^<<<'?|[';]$/ },
									},
								},
							},
							{
								pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
								alias: 'heredoc-string',
								greedy: !0,
								inside: {
									delimiter: {
										pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
										alias: 'symbol',
										inside: { punctuation: /^<<<"?|[";]$/ },
									},
									interpolation: i,
								},
							},
							{ pattern: /`(?:\\[\s\S]|[^\\`])*`/, alias: 'backtick-quoted-string', greedy: !0 },
							{ pattern: /'(?:\\[\s\S]|[^\\'])*'/, alias: 'single-quoted-string', greedy: !0 },
							{
								pattern: /"(?:\\[\s\S]|[^\\"])*"/,
								alias: 'double-quoted-string',
								greedy: !0,
								inside: { interpolation: i },
							},
						]
					e.languages.insertBefore('php', 'variable', {
						string: s,
						attribute: {
							pattern:
								/#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
							greedy: !0,
							inside: {
								'attribute-content': {
									pattern: /^(#\[)[\s\S]+(?=\]$)/,
									lookbehind: !0,
									inside: {
										comment: n,
										string: s,
										'attribute-class-name': [
											{
												pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
												alias: 'class-name',
												greedy: !0,
												lookbehind: !0,
											},
											{
												pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
												alias: ['class-name', 'class-name-fully-qualified'],
												greedy: !0,
												lookbehind: !0,
												inside: { punctuation: /\\/ },
											},
										],
										constant: t,
										number: o,
										operator: a,
										punctuation: r,
									},
								},
								delimiter: { pattern: /^#\[|\]$/, alias: 'punctuation' },
							},
						},
					}),
						e.hooks.add('before-tokenize', function (n) {
							;/<\?/.test(n.code) &&
								e.languages['markup-templating'].buildPlaceholders(
									n,
									'php',
									/<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g
								)
						}),
						e.hooks.add('after-tokenize', function (n) {
							e.languages['markup-templating'].tokenizePlaceholders(n, 'php')
						})
				})(Prism)
			},
			93: function () {
				;(Prism.languages.scss = Prism.languages.extend('css', {
					comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/, lookbehind: !0 },
					atrule: {
						pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
						inside: { rule: /@[\w-]+/ },
					},
					url: /(?:[-a-z]+-)?url(?=\()/i,
					selector: {
						pattern:
							/(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
						inside: {
							parent: { pattern: /&/, alias: 'important' },
							placeholder: /%[-\w]+/,
							variable: /\$[-\w]+|#\{\$[-\w]+\}/,
						},
					},
					property: {
						pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
						inside: { variable: /\$[-\w]+|#\{\$[-\w]+\}/ },
					},
				})),
					Prism.languages.insertBefore('scss', 'atrule', {
						keyword: [
							/@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i,
							{ pattern: /( )(?:from|through)(?= )/, lookbehind: !0 },
						],
					}),
					Prism.languages.insertBefore('scss', 'important', { variable: /\$[-\w]+|#\{\$[-\w]+\}/ }),
					Prism.languages.insertBefore('scss', 'function', {
						'module-modifier': { pattern: /\b(?:as|hide|show|with)\b/i, alias: 'keyword' },
						placeholder: { pattern: /%[-\w]+/, alias: 'selector' },
						statement: { pattern: /\B!(?:default|optional)\b/i, alias: 'keyword' },
						boolean: /\b(?:false|true)\b/,
						null: { pattern: /\bnull\b/, alias: 'keyword' },
						operator: { pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/, lookbehind: !0 },
					}),
					(Prism.languages.scss.atrule.inside.rest = Prism.languages.scss)
			},
			309: function () {
				!(function (e) {
					var n = /[*&][^\s[\]{},]+/,
						t = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
						o =
							'(?:' +
							t.source +
							'(?:[ \t]+' +
							n.source +
							')?|' +
							n.source +
							'(?:[ \t]+' +
							t.source +
							')?)',
						a =
							/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
								/<PLAIN>/g,
								function () {
									return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
										.source
								}
							),
						r = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source
					function i(e, n) {
						n = (n || '').replace(/m/g, '') + 'm'
						var t =
							/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
								.replace(/<<prop>>/g, function () {
									return o
								})
								.replace(/<<value>>/g, function () {
									return e
								})
						return RegExp(t, n)
					}
					;(e.languages.yaml = {
						scalar: {
							pattern: RegExp(
								/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
									/<<prop>>/g,
									function () {
										return o
									}
								)
							),
							lookbehind: !0,
							alias: 'string',
						},
						comment: /#.*/,
						key: {
							pattern: RegExp(
								/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
									.replace(/<<prop>>/g, function () {
										return o
									})
									.replace(/<<key>>/g, function () {
										return '(?:' + a + '|' + r + ')'
									})
							),
							lookbehind: !0,
							greedy: !0,
							alias: 'atrule',
						},
						directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: 'important' },
						datetime: {
							pattern: i(
								/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
									.source
							),
							lookbehind: !0,
							alias: 'number',
						},
						boolean: { pattern: i(/false|true/.source, 'i'), lookbehind: !0, alias: 'important' },
						null: { pattern: i(/null|~/.source, 'i'), lookbehind: !0, alias: 'important' },
						string: { pattern: i(r), lookbehind: !0, greedy: !0 },
						number: {
							pattern: i(
								/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,
								'i'
							),
							lookbehind: !0,
						},
						tag: t,
						important: n,
						punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
					}),
						(e.languages.yml = e.languages.yaml)
				})(Prism)
			},
			103: function () {
				!(function () {
					if ('undefined' != typeof Prism) {
						var e =
								/\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:=&@]+(?:\?[\w\-+%~/.:=?&!$'()*,;@]*)?(?:#[\w\-+%~/.:#=?&!$'()*,;@]*)?/,
							n = /\b\S+@[\w.]+[a-z]{2}/,
							t = /\[([^\]]+)\]\(([^)]+)\)/,
							o = ['comment', 'url', 'attr-value', 'string']
						;(Prism.plugins.autolinker = {
							processGrammar: function (a) {
								a &&
									!a['url-link'] &&
									(Prism.languages.DFS(a, function (a, r, i) {
										o.indexOf(i) > -1 &&
											!Array.isArray(r) &&
											(r.pattern || (r = this[a] = { pattern: r }),
											(r.inside = r.inside || {}),
											'comment' == i && (r.inside['md-link'] = t),
											'attr-value' == i
												? Prism.languages.insertBefore(
														'inside',
														'punctuation',
														{ 'url-link': e },
														r
													)
												: (r.inside['url-link'] = e),
											(r.inside['email-link'] = n))
									}),
									(a['url-link'] = e),
									(a['email-link'] = n))
							},
						}),
							Prism.hooks.add('before-highlight', function (e) {
								Prism.plugins.autolinker.processGrammar(e.grammar)
							}),
							Prism.hooks.add('wrap', function (e) {
								if (/-link$/.test(e.type)) {
									e.tag = 'a'
									var n = e.content
									if ('email-link' == e.type && 0 != n.indexOf('mailto:')) n = 'mailto:' + n
									else if ('md-link' == e.type) {
										var o = e.content.match(t)
										;(n = o[2]), (e.content = o[1])
									}
									e.attributes.href = n
									try {
										e.content = decodeURIComponent(e.content)
									} catch (e) {}
								}
							})
					}
				})()
			},
			549: function () {
				!(function () {
					function e(e) {
						var n = document.createElement('textarea')
						;(n.value = e.getText()),
							(n.style.top = '0'),
							(n.style.left = '0'),
							(n.style.position = 'fixed'),
							document.body.appendChild(n),
							n.focus(),
							n.select()
						try {
							var t = document.execCommand('copy')
							setTimeout(function () {
								t ? e.success() : e.error()
							}, 1)
						} catch (n) {
							setTimeout(function () {
								e.error(n)
							}, 1)
						}
						document.body.removeChild(n)
					}
					'undefined' != typeof Prism &&
						'undefined' != typeof document &&
						(Prism.plugins.toolbar
							? Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (n) {
									var t = n.element,
										o = (function (e) {
											var n = {
												copy: 'Copy',
												'copy-error': 'Press Ctrl+C to copy',
												'copy-success': 'Copied!',
												'copy-timeout': 5e3,
											}
											for (var t in n) {
												for (var o = 'data-prismjs-' + t, a = e; a && !a.hasAttribute(o); )
													a = a.parentElement
												a && (n[t] = a.getAttribute(o))
											}
											return n
										})(t),
										a = document.createElement('button')
									;(a.className = 'copy-to-clipboard-button'), a.setAttribute('type', 'button')
									var r = document.createElement('span')
									return (
										a.appendChild(r),
										s('copy'),
										(function (n, t) {
											n.addEventListener('click', function () {
												!(function (n) {
													navigator.clipboard
														? navigator.clipboard
																.writeText(n.getText())
																.then(n.success, function () {
																	e(n)
																})
														: e(n)
												})(t)
											})
										})(a, {
											getText: function () {
												return t.textContent
											},
											success: function () {
												s('copy-success'), i()
											},
											error: function () {
												s('copy-error'),
													setTimeout(function () {
														!(function (e) {
															window.getSelection().selectAllChildren(e)
														})(t)
													}, 1),
													i()
											},
										}),
										a
									)
									function i() {
										setTimeout(function () {
											s('copy')
										}, o['copy-timeout'])
									}
									function s(e) {
										;(r.textContent = o[e]), a.setAttribute('data-copy-state', e)
									}
								})
							: console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.'))
				})()
			},
			44: function () {
				!(function () {
					if ('undefined' != typeof Prism && 'undefined' != typeof document) {
						var e = 'line-numbers',
							n = /\n(?!$)/g,
							t = (Prism.plugins.lineNumbers = {
								getLine: function (n, t) {
									if ('PRE' === n.tagName && n.classList.contains(e)) {
										var o = n.querySelector('.line-numbers-rows')
										if (o) {
											var a = parseInt(n.getAttribute('data-start'), 10) || 1,
												r = a + (o.children.length - 1)
											t < a && (t = a), t > r && (t = r)
											var i = t - a
											return o.children[i]
										}
									}
								},
								resize: function (e) {
									a([e])
								},
								assumeViewportIndependence: !0,
							}),
							o = void 0
						window.addEventListener('resize', function () {
							;(t.assumeViewportIndependence && o === window.innerWidth) ||
								((o = window.innerWidth),
								a(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers'))))
						}),
							Prism.hooks.add('complete', function (t) {
								if (t.code) {
									var o = t.element,
										r = o.parentNode
									if (
										r &&
										/pre/i.test(r.nodeName) &&
										!o.querySelector('.line-numbers-rows') &&
										Prism.util.isActive(o, e)
									) {
										o.classList.remove(e), r.classList.add(e)
										var i,
											s = t.code.match(n),
											l = s ? s.length + 1 : 1,
											c = new Array(l + 1).join('<span></span>')
										;(i = document.createElement('span')).setAttribute('aria-hidden', 'true'),
											(i.className = 'line-numbers-rows'),
											(i.innerHTML = c),
											r.hasAttribute('data-start') &&
												(r.style.counterReset =
													'linenumber ' + (parseInt(r.getAttribute('data-start'), 10) - 1)),
											t.element.appendChild(i),
											a([r]),
											Prism.hooks.run('line-numbers', t)
									}
								}
							}),
							Prism.hooks.add('line-numbers', function (e) {
								;(e.plugins = e.plugins || {}), (e.plugins.lineNumbers = !0)
							})
					}
					function a(e) {
						if (
							0 !=
							(e = e.filter(function (e) {
								var n,
									t = ((n = e),
									n
										? window.getComputedStyle
											? getComputedStyle(n)
											: n.currentStyle || null
										: null)['white-space']
								return 'pre-wrap' === t || 'pre-line' === t
							})).length
						) {
							var t = e
								.map(function (e) {
									var t = e.querySelector('code'),
										o = e.querySelector('.line-numbers-rows')
									if (t && o) {
										var a = e.querySelector('.line-numbers-sizer'),
											r = t.textContent.split(n)
										a ||
											(((a = document.createElement('span')).className = 'line-numbers-sizer'),
											t.appendChild(a)),
											(a.innerHTML = '0'),
											(a.style.display = 'block')
										var i = a.getBoundingClientRect().height
										return (
											(a.innerHTML = ''),
											{ element: e, lines: r, lineHeights: [], oneLinerHeight: i, sizer: a }
										)
									}
								})
								.filter(Boolean)
							t.forEach(function (e) {
								var n = e.sizer,
									t = e.lines,
									o = e.lineHeights,
									a = e.oneLinerHeight
								;(o[t.length - 1] = void 0),
									t.forEach(function (e, t) {
										if (e && e.length > 1) {
											var r = n.appendChild(document.createElement('span'))
											;(r.style.display = 'block'), (r.textContent = e)
										} else o[t] = a
									})
							}),
								t.forEach(function (e) {
									for (var n = e.sizer, t = e.lineHeights, o = 0, a = 0; a < t.length; a++)
										void 0 === t[a] && (t[a] = n.children[o++].getBoundingClientRect().height)
								}),
								t.forEach(function (e) {
									var n = e.sizer,
										t = e.element.querySelector('.line-numbers-rows')
									;(n.style.display = 'none'),
										(n.innerHTML = ''),
										e.lineHeights.forEach(function (e, n) {
											t.children[n].style.height = e + 'px'
										})
								})
						}
					}
				})()
			},
			398: function (e) {
				!(function () {
					if ('undefined' != typeof Prism) {
						var n =
							Object.assign ||
							function (e, n) {
								for (var t in n) n.hasOwnProperty(t) && (e[t] = n[t])
								return e
							}
						;(t.prototype = {
							setDefaults: function (e) {
								this.defaults = n(this.defaults, e)
							},
							normalize: function (e, t) {
								for (var o in (t = n(this.defaults, t))) {
									var a = o.replace(/-(\w)/g, function (e, n) {
										return n.toUpperCase()
									})
									'normalize' !== o &&
										'setDefaults' !== a &&
										t[o] &&
										this[a] &&
										(e = this[a].call(this, e, t[o]))
								}
								return e
							},
							leftTrim: function (e) {
								return e.replace(/^\s+/, '')
							},
							rightTrim: function (e) {
								return e.replace(/\s+$/, '')
							},
							tabsToSpaces: function (e, n) {
								return (n = 0 | n || 4), e.replace(/\t/g, new Array(++n).join(' '))
							},
							spacesToTabs: function (e, n) {
								return (n = 0 | n || 4), e.replace(RegExp(' {' + n + '}', 'g'), '\t')
							},
							removeTrailing: function (e) {
								return e.replace(/\s*?$/gm, '')
							},
							removeInitialLineFeed: function (e) {
								return e.replace(/^(?:\r?\n|\r)/, '')
							},
							removeIndent: function (e) {
								var n = e.match(/^[^\S\n\r]*(?=\S)/gm)
								return n && n[0].length
									? (n.sort(function (e, n) {
											return e.length - n.length
										}),
										n[0].length ? e.replace(RegExp('^' + n[0], 'gm'), '') : e)
									: e
							},
							indent: function (e, n) {
								return e.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++n).join('\t') + '$&')
							},
							breakLines: function (e, n) {
								n = !0 === n ? 80 : 0 | n || 80
								for (var t = e.split('\n'), a = 0; a < t.length; ++a)
									if (!(o(t[a]) <= n)) {
										for (var r = t[a].split(/(\s+)/g), i = 0, s = 0; s < r.length; ++s) {
											var l = o(r[s])
											;(i += l) > n && ((r[s] = '\n' + r[s]), (i = l))
										}
										t[a] = r.join('')
									}
								return t.join('\n')
							},
						}),
							e.exports && (e.exports = t),
							(Prism.plugins.NormalizeWhitespace = new t({
								'remove-trailing': !0,
								'remove-indent': !0,
								'left-trim': !0,
								'right-trim': !0,
							})),
							Prism.hooks.add('before-sanity-check', function (e) {
								var n = Prism.plugins.NormalizeWhitespace
								if (
									(!e.settings || !1 !== e.settings['whitespace-normalization']) &&
									Prism.util.isActive(e.element, 'whitespace-normalization', !0)
								)
									if ((e.element && e.element.parentNode) || !e.code) {
										var t = e.element.parentNode
										if (e.code && t && 'pre' === t.nodeName.toLowerCase()) {
											for (
												var o = t.childNodes, a = '', r = '', i = !1, s = 0;
												s < o.length;
												++s
											) {
												var l = o[s]
												l == e.element
													? (i = !0)
													: '#text' === l.nodeName &&
														(i ? (r += l.nodeValue) : (a += l.nodeValue),
														t.removeChild(l),
														--s)
											}
											if (e.element.children.length && Prism.plugins.KeepMarkup) {
												var c = a + e.element.innerHTML + r
												;(e.element.innerHTML = n.normalize(c, e.settings)),
													(e.code = e.element.textContent)
											} else (e.code = a + e.code + r), (e.code = n.normalize(e.code, e.settings))
										}
									} else e.code = n.normalize(e.code, e.settings)
							})
					}
					function t(e) {
						this.defaults = n({}, e)
					}
					function o(e) {
						for (var n = 0, t = 0; t < e.length; ++t) e.charCodeAt(t) == '\t'.charCodeAt(0) && (n += 3)
						return e.length + n
					}
				})()
			},
			571: function () {
				!(function () {
					if ('undefined' != typeof Prism && 'undefined' != typeof document)
						if (Prism.plugins.toolbar) {
							var e = {
								none: 'Plain text',
								plain: 'Plain text',
								plaintext: 'Plain text',
								text: 'Plain text',
								txt: 'Plain text',
								html: 'HTML',
								xml: 'XML',
								svg: 'SVG',
								mathml: 'MathML',
								ssml: 'SSML',
								rss: 'RSS',
								css: 'CSS',
								clike: 'C-like',
								js: 'JavaScript',
								abap: 'ABAP',
								abnf: 'ABNF',
								al: 'AL',
								antlr4: 'ANTLR4',
								g4: 'ANTLR4',
								apacheconf: 'Apache Configuration',
								apl: 'APL',
								aql: 'AQL',
								ino: 'Arduino',
								arff: 'ARFF',
								asciidoc: 'AsciiDoc',
								adoc: 'AsciiDoc',
								aspnet: 'ASP.NET (C#)',
								asm6502: '6502 Assembly',
								asmatmel: 'Atmel AVR Assembly',
								autohotkey: 'AutoHotkey',
								autoit: 'AutoIt',
								avisynth: 'AviSynth',
								avs: 'AviSynth',
								'avro-idl': 'Avro IDL',
								avdl: 'Avro IDL',
								basic: 'BASIC',
								bbcode: 'BBcode',
								bnf: 'BNF',
								rbnf: 'RBNF',
								bsl: 'BSL (1C:Enterprise)',
								oscript: 'OneScript',
								csharp: 'C#',
								cs: 'C#',
								dotnet: 'C#',
								cpp: 'C++',
								cfscript: 'CFScript',
								cfc: 'CFScript',
								cil: 'CIL',
								cmake: 'CMake',
								cobol: 'COBOL',
								coffee: 'CoffeeScript',
								conc: 'Concurnas',
								csp: 'Content-Security-Policy',
								'css-extras': 'CSS Extras',
								csv: 'CSV',
								dataweave: 'DataWeave',
								dax: 'DAX',
								django: 'Django/Jinja2',
								jinja2: 'Django/Jinja2',
								'dns-zone-file': 'DNS zone file',
								'dns-zone': 'DNS zone file',
								dockerfile: 'Docker',
								dot: 'DOT (Graphviz)',
								gv: 'DOT (Graphviz)',
								ebnf: 'EBNF',
								editorconfig: 'EditorConfig',
								ejs: 'EJS',
								etlua: 'Embedded Lua templating',
								erb: 'ERB',
								'excel-formula': 'Excel Formula',
								xlsx: 'Excel Formula',
								xls: 'Excel Formula',
								fsharp: 'F#',
								'firestore-security-rules': 'Firestore security rules',
								ftl: 'FreeMarker Template Language',
								gml: 'GameMaker Language',
								gamemakerlanguage: 'GameMaker Language',
								gap: 'GAP (CAS)',
								gcode: 'G-code',
								gdscript: 'GDScript',
								gedcom: 'GEDCOM',
								glsl: 'GLSL',
								gn: 'GN',
								gni: 'GN',
								'go-module': 'Go module',
								'go-mod': 'Go module',
								graphql: 'GraphQL',
								hbs: 'Handlebars',
								hs: 'Haskell',
								hcl: 'HCL',
								hlsl: 'HLSL',
								http: 'HTTP',
								hpkp: 'HTTP Public-Key-Pins',
								hsts: 'HTTP Strict-Transport-Security',
								ichigojam: 'IchigoJam',
								'icu-message-format': 'ICU Message Format',
								idr: 'Idris',
								ignore: '.ignore',
								gitignore: '.gitignore',
								hgignore: '.hgignore',
								npmignore: '.npmignore',
								inform7: 'Inform 7',
								javadoc: 'JavaDoc',
								javadoclike: 'JavaDoc-like',
								javastacktrace: 'Java stack trace',
								jq: 'JQ',
								jsdoc: 'JSDoc',
								'js-extras': 'JS Extras',
								json: 'JSON',
								webmanifest: 'Web App Manifest',
								json5: 'JSON5',
								jsonp: 'JSONP',
								jsstacktrace: 'JS stack trace',
								'js-templates': 'JS Templates',
								keepalived: 'Keepalived Configure',
								kts: 'Kotlin Script',
								kt: 'Kotlin',
								kumir: 'KuMir (КуМир)',
								kum: 'KuMir (КуМир)',
								latex: 'LaTeX',
								tex: 'TeX',
								context: 'ConTeXt',
								lilypond: 'LilyPond',
								ly: 'LilyPond',
								emacs: 'Lisp',
								elisp: 'Lisp',
								'emacs-lisp': 'Lisp',
								llvm: 'LLVM IR',
								log: 'Log file',
								lolcode: 'LOLCODE',
								magma: 'Magma (CAS)',
								md: 'Markdown',
								'markup-templating': 'Markup templating',
								matlab: 'MATLAB',
								maxscript: 'MAXScript',
								mel: 'MEL',
								mongodb: 'MongoDB',
								moon: 'MoonScript',
								n1ql: 'N1QL',
								n4js: 'N4JS',
								n4jsd: 'N4JS',
								'nand2tetris-hdl': 'Nand To Tetris HDL',
								naniscript: 'Naninovel Script',
								nani: 'Naninovel Script',
								nasm: 'NASM',
								neon: 'NEON',
								nginx: 'nginx',
								nsis: 'NSIS',
								objectivec: 'Objective-C',
								objc: 'Objective-C',
								ocaml: 'OCaml',
								opencl: 'OpenCL',
								openqasm: 'OpenQasm',
								qasm: 'OpenQasm',
								parigp: 'PARI/GP',
								objectpascal: 'Object Pascal',
								psl: 'PATROL Scripting Language',
								pcaxis: 'PC-Axis',
								px: 'PC-Axis',
								peoplecode: 'PeopleCode',
								pcode: 'PeopleCode',
								php: 'PHP',
								phpdoc: 'PHPDoc',
								'php-extras': 'PHP Extras',
								plsql: 'PL/SQL',
								powerquery: 'PowerQuery',
								pq: 'PowerQuery',
								mscript: 'PowerQuery',
								powershell: 'PowerShell',
								promql: 'PromQL',
								properties: '.properties',
								protobuf: 'Protocol Buffers',
								purebasic: 'PureBasic',
								pbfasm: 'PureBasic',
								purs: 'PureScript',
								py: 'Python',
								qsharp: 'Q#',
								qs: 'Q#',
								q: 'Q (kdb+ database)',
								qml: 'QML',
								rkt: 'Racket',
								cshtml: 'Razor C#',
								razor: 'Razor C#',
								jsx: 'React JSX',
								tsx: 'React TSX',
								renpy: "Ren'py",
								rpy: "Ren'py",
								rest: 'reST (reStructuredText)',
								robotframework: 'Robot Framework',
								robot: 'Robot Framework',
								rb: 'Ruby',
								sas: 'SAS',
								sass: 'Sass (Sass)',
								scss: 'Sass (Scss)',
								'shell-session': 'Shell session',
								'sh-session': 'Shell session',
								shellsession: 'Shell session',
								sml: 'SML',
								smlnj: 'SML/NJ',
								solidity: 'Solidity (Ethereum)',
								sol: 'Solidity (Ethereum)',
								'solution-file': 'Solution file',
								sln: 'Solution file',
								soy: 'Soy (Closure Template)',
								sparql: 'SPARQL',
								rq: 'SPARQL',
								'splunk-spl': 'Splunk SPL',
								sqf: 'SQF: Status Quo Function (Arma 3)',
								sql: 'SQL',
								iecst: 'Structured Text (IEC 61131-3)',
								systemd: 'Systemd configuration file',
								't4-templating': 'T4 templating',
								't4-cs': 'T4 Text Templates (C#)',
								t4: 'T4 Text Templates (C#)',
								't4-vb': 'T4 Text Templates (VB)',
								tap: 'TAP',
								tt2: 'Template Toolkit 2',
								toml: 'TOML',
								trickle: 'trickle',
								troy: 'troy',
								trig: 'TriG',
								ts: 'TypeScript',
								tsconfig: 'TSConfig',
								uscript: 'UnrealScript',
								uc: 'UnrealScript',
								uri: 'URI',
								url: 'URL',
								vbnet: 'VB.Net',
								vhdl: 'VHDL',
								vim: 'vim',
								'visual-basic': 'Visual Basic',
								vba: 'VBA',
								vb: 'Visual Basic',
								wasm: 'WebAssembly',
								'web-idl': 'Web IDL',
								webidl: 'Web IDL',
								wiki: 'Wiki markup',
								wolfram: 'Wolfram language',
								nb: 'Mathematica Notebook',
								wl: 'Wolfram language',
								xeoracube: 'XeoraCube',
								'xml-doc': 'XML doc (.net)',
								xojo: 'Xojo (REALbasic)',
								xquery: 'XQuery',
								yaml: 'YAML',
								yml: 'YAML',
								yang: 'YANG',
							}
							Prism.plugins.toolbar.registerButton('show-language', function (n) {
								var t = n.element.parentNode
								if (t && /pre/i.test(t.nodeName)) {
									var o,
										a =
											t.getAttribute('data-language') ||
											e[n.language] ||
											((o = n.language)
												? (o.substring(0, 1).toUpperCase() + o.substring(1)).replace(
														/s(?=cript)/,
														'S'
													)
												: o)
									if (a) {
										var r = document.createElement('span')
										return (r.textContent = a), r
									}
								}
							})
						} else console.warn('Show Languages plugin loaded before Toolbar plugin.')
				})()
			},
			559: function () {
				!(function () {
					if ('undefined' != typeof Prism && 'undefined' != typeof document) {
						var e = [],
							n = {},
							t = function () {}
						Prism.plugins.toolbar = {}
						var o = (Prism.plugins.toolbar.registerButton = function (t, o) {
								var a
								;(a =
									'function' == typeof o
										? o
										: function (e) {
												var n
												return (
													'function' == typeof o.onClick
														? (((n = document.createElement('button')).type = 'button'),
															n.addEventListener('click', function () {
																o.onClick.call(this, e)
															}))
														: 'string' == typeof o.url
															? ((n = document.createElement('a')).href = o.url)
															: (n = document.createElement('span')),
													o.className && n.classList.add(o.className),
													(n.textContent = o.text),
													n
												)
											}),
									t in n
										? console.warn('There is a button with the key "' + t + '" registered already.')
										: e.push((n[t] = a))
							}),
							a = (Prism.plugins.toolbar.hook = function (o) {
								var a = o.element.parentNode
								if (a && /pre/i.test(a.nodeName) && !a.parentNode.classList.contains('code-toolbar')) {
									var r = document.createElement('div')
									r.classList.add('code-toolbar'), a.parentNode.insertBefore(r, a), r.appendChild(a)
									var i = document.createElement('div')
									i.classList.add('toolbar')
									var s = e,
										l = (function (e) {
											for (; e; ) {
												var n = e.getAttribute('data-toolbar-order')
												if (null != n) return (n = n.trim()).length ? n.split(/\s*,\s*/g) : []
												e = e.parentElement
											}
										})(o.element)
									l &&
										(s = l.map(function (e) {
											return n[e] || t
										})),
										s.forEach(function (e) {
											var n = e(o)
											if (n) {
												var t = document.createElement('div')
												t.classList.add('toolbar-item'), t.appendChild(n), i.appendChild(t)
											}
										}),
										r.appendChild(i)
								}
							})
						o('label', function (e) {
							var n = e.element.parentNode
							if (n && /pre/i.test(n.nodeName) && n.hasAttribute('data-label')) {
								var t,
									o,
									a = n.getAttribute('data-label')
								try {
									o = document.querySelector('template#' + a)
								} catch (e) {}
								return (
									o
										? (t = o.content)
										: (n.hasAttribute('data-url')
												? ((t = document.createElement('a')).href = n.getAttribute('data-url'))
												: (t = document.createElement('span')),
											(t.textContent = a)),
									t
								)
							}
						}),
							Prism.hooks.add('complete', a)
					}
				})()
			},
			182: function (e) {
				'use strict'
				var n = []
				function t(e) {
					for (var t = -1, o = 0; o < n.length; o++)
						if (n[o].identifier === e) {
							t = o
							break
						}
					return t
				}
				function o(e, o) {
					for (var r = {}, i = [], s = 0; s < e.length; s++) {
						var l = e[s],
							c = o.base ? l[0] + o.base : l[0],
							u = r[c] || 0,
							d = ''.concat(c, ' ').concat(u)
						r[c] = u + 1
						var p = t(d),
							m = { css: l[1], media: l[2], sourceMap: l[3], supports: l[4], layer: l[5] }
						if (-1 !== p) n[p].references++, n[p].updater(m)
						else {
							var g = a(m, o)
							;(o.byIndex = s), n.splice(s, 0, { identifier: d, updater: g, references: 1 })
						}
						i.push(d)
					}
					return i
				}
				function a(e, n) {
					var t = n.domAPI(n)
					return (
						t.update(e),
						function (n) {
							if (n) {
								if (
									n.css === e.css &&
									n.media === e.media &&
									n.sourceMap === e.sourceMap &&
									n.supports === e.supports &&
									n.layer === e.layer
								)
									return
								t.update((e = n))
							} else t.remove()
						}
					)
				}
				e.exports = function (e, a) {
					var r = o((e = e || []), (a = a || {}))
					return function (e) {
						e = e || []
						for (var i = 0; i < r.length; i++) {
							var s = t(r[i])
							n[s].references--
						}
						for (var l = o(e, a), c = 0; c < r.length; c++) {
							var u = t(r[c])
							0 === n[u].references && (n[u].updater(), n.splice(u, 1))
						}
						r = l
					}
				}
			},
			322: function (e) {
				'use strict'
				var n = {}
				e.exports = function (e, t) {
					var o = (function (e) {
						if (void 0 === n[e]) {
							var t = document.querySelector(e)
							if (window.HTMLIFrameElement && t instanceof window.HTMLIFrameElement)
								try {
									t = t.contentDocument.head
								} catch (e) {
									t = null
								}
							n[e] = t
						}
						return n[e]
					})(e)
					if (!o)
						throw new Error(
							"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
						)
					o.appendChild(t)
				}
			},
			228: function (e) {
				'use strict'
				e.exports = function (e) {
					var n = document.createElement('style')
					return e.setAttributes(n, e.attributes), e.insert(n, e.options), n
				}
			},
			98: function (e, n, t) {
				'use strict'
				e.exports = function (e) {
					var n = t.nc
					n && e.setAttribute('nonce', n)
				}
			},
			18: function (e) {
				'use strict'
				e.exports = function (e) {
					var n = e.insertStyleElement(e)
					return {
						update: function (t) {
							!(function (e, n, t) {
								var o = ''
								t.supports && (o += '@supports ('.concat(t.supports, ') {')),
									t.media && (o += '@media '.concat(t.media, ' {'))
								var a = void 0 !== t.layer
								a && (o += '@layer'.concat(t.layer.length > 0 ? ' '.concat(t.layer) : '', ' {')),
									(o += t.css),
									a && (o += '}'),
									t.media && (o += '}'),
									t.supports && (o += '}')
								var r = t.sourceMap
								r &&
									'undefined' != typeof btoa &&
									(o += '\n/*# sourceMappingURL=data:application/json;base64,'.concat(
										btoa(unescape(encodeURIComponent(JSON.stringify(r)))),
										' */'
									)),
									n.styleTagTransform(o, e, n.options)
							})(n, e, t)
						},
						remove: function () {
							!(function (e) {
								if (null === e.parentNode) return !1
								e.parentNode.removeChild(e)
							})(n)
						},
					}
				}
			},
			251: function (e) {
				'use strict'
				e.exports = function (e, n) {
					if (n.styleSheet) n.styleSheet.cssText = e
					else {
						for (; n.firstChild; ) n.removeChild(n.firstChild)
						n.appendChild(document.createTextNode(e))
					}
				}
			},
		},
		n = {}
	function t(o) {
		var a = n[o]
		if (void 0 !== a) return a.exports
		var r = (n[o] = { id: o, exports: {} })
		return e[o](r, r.exports, t), r.exports
	}
	;(t.n = function (e) {
		var n =
			e && e.__esModule
				? function () {
						return e.default
					}
				: function () {
						return e
					}
		return t.d(n, { a: n }), n
	}),
		(t.d = function (e, n) {
			for (var o in n) t.o(n, o) && !t.o(e, o) && Object.defineProperty(e, o, { enumerable: !0, get: n[o] })
		}),
		(t.g = (function () {
			if ('object' == typeof globalThis) return globalThis
			try {
				return this || new Function('return this')()
			} catch (e) {
				if ('object' == typeof window) return window
			}
		})()),
		(t.o = function (e, n) {
			return Object.prototype.hasOwnProperty.call(e, n)
		}),
		(function () {
			'use strict'
			t(511), t(510)
			var e = function (e, n, t, o) {
					return (e /= o / 2) < 1 ? (t / 2) * e * e + n : (-t / 2) * (--e * (e - 2) - 1) + n
				},
				n =
					'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
						? function (e) {
								return typeof e
							}
						: function (e) {
								return e &&
									'function' == typeof Symbol &&
									e.constructor === Symbol &&
									e !== Symbol.prototype
									? 'symbol'
									: typeof e
							},
				o = (function () {
					var t = void 0,
						o = void 0,
						a = void 0,
						r = void 0,
						i = void 0,
						s = void 0,
						l = void 0,
						c = void 0,
						u = void 0,
						d = void 0,
						p = void 0,
						m = void 0
					function g() {
						return window.scrollY || window.pageYOffset
					}
					function f(e) {
						return e.getBoundingClientRect().top + o
					}
					function b(e) {
						u || (u = e),
							(p = i((d = e - u), o, l, c)),
							window.scrollTo(0, p),
							d < c
								? window.requestAnimationFrame(b)
								: (window.scrollTo(0, o + l),
									t && s && (t.setAttribute('tabindex', '-1'), t.focus()),
									'function' == typeof m && m(),
									(u = !1))
					}
					return function (u) {
						var d = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
						switch (
							((c = d.duration || 1e3),
							(r = d.offset || 0),
							(m = d.callback),
							(i = d.easing || e),
							(s = d.a11y || !1),
							(o = g()),
							void 0 === u ? 'undefined' : n(u))
						) {
							case 'number':
								;(t = void 0), (s = !1), (a = o + u)
								break
							case 'object':
								a = f((t = u))
								break
							case 'string':
								;(t = document.querySelector(u)), (a = f(t))
						}
						switch (((l = a - o + r), n(d.duration))) {
							case 'number':
								c = d.duration
								break
							case 'function':
								c = d.duration(l)
						}
						window.requestAnimationFrame(b)
					}
				})()
			let a = location.hash ? r(location.href) : location.href
			function r(e) {
				return e.slice(0, e.lastIndexOf('#'))
			}
			document.body.addEventListener(
				'click',
				function (e) {
					;(function (e) {
						return 'a' === e.tagName.toLowerCase() && e.hash.length > 0 && r(e.href) === a
					})(e.target) &&
						(e.stopPropagation(),
						e.preventDefault(),
						o(e.target.hash, {
							duration: 400,
							callback: function () {
								var n, t
								;(n = e.target.hash),
									(t = document.getElementById(n.substring(1))) &&
										(/^(?:a|select|input|button|textarea)$/i.test(t.tagName) || (t.tabIndex = -1),
										t.focus())
							},
						}))
				},
				!1
			)
			var i = t(323),
				s = t.n(i),
				l =
					(t(226),
					t(241),
					t(181),
					t(809),
					t(847),
					t(93),
					t(56),
					t(684),
					t(237),
					t(126),
					t(309),
					t(628),
					t(182)),
				c = t.n(l),
				u = t(18),
				d = t.n(u),
				p = t(322),
				m = t.n(p),
				g = t(98),
				f = t.n(g),
				b = t(228),
				h = t.n(b),
				A = t(251),
				v = t.n(A),
				y = t(443),
				k = {}
			;(k.styleTagTransform = v()),
				(k.setAttributes = f()),
				(k.insert = m().bind(null, 'head')),
				(k.domAPI = d()),
				(k.insertStyleElement = h()),
				c()(y.Z, k),
				y.Z && y.Z.locals && y.Z.locals,
				t(44)
			var w = t(609),
				C = {}
			;(C.styleTagTransform = v()),
				(C.setAttributes = f()),
				(C.insert = m().bind(null, 'head')),
				(C.domAPI = d()),
				(C.insertStyleElement = h()),
				c()(w.Z, C),
				w.Z && w.Z.locals && w.Z.locals,
				t(103)
			var S = t(183),
				E = {}
			;(E.styleTagTransform = v()),
				(E.setAttributes = f()),
				(E.insert = m().bind(null, 'head')),
				(E.domAPI = d()),
				(E.insertStyleElement = h()),
				c()(S.Z, E),
				S.Z && S.Z.locals && S.Z.locals,
				t(559),
				t(571),
				t(398),
				t(549)
			var x = t(928),
				B = {}
			function P(e) {
				return (
					(function (e) {
						if (Array.isArray(e)) return T(e)
					})(e) ||
					(function (e) {
						if ('undefined' != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e)
					})(e) ||
					(function (e, n) {
						if (e) {
							if ('string' == typeof e) return T(e, n)
							var t = Object.prototype.toString.call(e).slice(8, -1)
							return (
								'Object' === t && e.constructor && (t = e.constructor.name),
								'Map' === t || 'Set' === t
									? Array.from(e)
									: 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
										? T(e, n)
										: void 0
							)
						}
					})(e) ||
					(function () {
						throw new TypeError(
							'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
						)
					})()
				)
			}
			function T(e, n) {
				;(null == n || n > e.length) && (n = e.length)
				for (var t = 0, o = new Array(n); t < n; t++) o[t] = e[t]
				return o
			}
			;(B.styleTagTransform = v()),
				(B.setAttributes = f()),
				(B.insert = m().bind(null, 'head')),
				(B.domAPI = d()),
				(B.insertStyleElement = h()),
				c()(x.Z, B),
				x.Z && x.Z.locals && x.Z.locals
			var L,
				F,
				_,
				O,
				M,
				N =
					((L = [
						'a[href]',
						'area[href]',
						'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
						'select:not([disabled]):not([aria-hidden])',
						'textarea:not([disabled]):not([aria-hidden])',
						'button:not([disabled]):not([aria-hidden])',
						'iframe',
						'object',
						'embed',
						'[contenteditable]',
						'[tabindex]:not([tabindex^="-"])',
					]),
					(F = (function () {
						function e(n) {
							var t = n.targetModal,
								o = n.triggers,
								a = void 0 === o ? [] : o,
								r = n.onShow,
								i = void 0 === r ? function () {} : r,
								s = n.onClose,
								l = void 0 === s ? function () {} : s,
								c = n.openTrigger,
								u = void 0 === c ? 'data-micromodal-trigger' : c,
								d = n.closeTrigger,
								p = void 0 === d ? 'data-micromodal-close' : d,
								m = n.openClass,
								g = void 0 === m ? 'is-open' : m,
								f = n.disableScroll,
								b = void 0 !== f && f,
								h = n.disableFocus,
								A = void 0 !== h && h,
								v = n.awaitCloseAnimation,
								y = void 0 !== v && v,
								k = n.awaitOpenAnimation,
								w = void 0 !== k && k,
								C = n.debugMode,
								S = void 0 !== C && C
							!(function (e, n) {
								if (!(e instanceof n)) throw new TypeError('Cannot call a class as a function')
							})(this, e),
								(this.modal = document.getElementById(t)),
								(this.config = {
									debugMode: S,
									disableScroll: b,
									openTrigger: u,
									closeTrigger: p,
									openClass: g,
									onShow: i,
									onClose: l,
									awaitCloseAnimation: y,
									awaitOpenAnimation: w,
									disableFocus: A,
								}),
								a.length > 0 && this.registerTriggers.apply(this, P(a)),
								(this.onClick = this.onClick.bind(this)),
								(this.onKeydown = this.onKeydown.bind(this))
						}
						var n
						return (
							(n = [
								{
									key: 'registerTriggers',
									value: function () {
										for (var e = this, n = arguments.length, t = new Array(n), o = 0; o < n; o++)
											t[o] = arguments[o]
										t.filter(Boolean).forEach(function (n) {
											n.addEventListener('click', function (n) {
												return e.showModal(n)
											})
										})
									},
								},
								{
									key: 'showModal',
									value: function () {
										var e = this,
											n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null
										if (
											((this.activeElement = document.activeElement),
											this.modal.setAttribute('aria-hidden', 'false'),
											this.modal.classList.add(this.config.openClass),
											this.scrollBehaviour('disable'),
											this.addEventListeners(),
											this.config.awaitOpenAnimation)
										) {
											var t = function n() {
												e.modal.removeEventListener('animationend', n, !1),
													e.setFocusToFirstNode()
											}
											this.modal.addEventListener('animationend', t, !1)
										} else this.setFocusToFirstNode()
										this.config.onShow(this.modal, this.activeElement, n)
									},
								},
								{
									key: 'closeModal',
									value: function () {
										var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
											n = this.modal
										if (
											(this.modal.setAttribute('aria-hidden', 'true'),
											this.removeEventListeners(),
											this.scrollBehaviour('enable'),
											this.activeElement &&
												this.activeElement.focus &&
												this.activeElement.focus(),
											this.config.onClose(this.modal, this.activeElement, e),
											this.config.awaitCloseAnimation)
										) {
											var t = this.config.openClass
											this.modal.addEventListener(
												'animationend',
												function e() {
													n.classList.remove(t), n.removeEventListener('animationend', e, !1)
												},
												!1
											)
										} else n.classList.remove(this.config.openClass)
									},
								},
								{
									key: 'closeModalById',
									value: function (e) {
										;(this.modal = document.getElementById(e)), this.modal && this.closeModal()
									},
								},
								{
									key: 'scrollBehaviour',
									value: function (e) {
										if (this.config.disableScroll) {
											var n = document.querySelector('body')
											switch (e) {
												case 'enable':
													Object.assign(n.style, { overflow: '' })
													break
												case 'disable':
													Object.assign(n.style, { overflow: 'hidden' })
											}
										}
									},
								},
								{
									key: 'addEventListeners',
									value: function () {
										this.modal.addEventListener('touchstart', this.onClick),
											this.modal.addEventListener('click', this.onClick),
											document.addEventListener('keydown', this.onKeydown)
									},
								},
								{
									key: 'removeEventListeners',
									value: function () {
										this.modal.removeEventListener('touchstart', this.onClick),
											this.modal.removeEventListener('click', this.onClick),
											document.removeEventListener('keydown', this.onKeydown)
									},
								},
								{
									key: 'onClick',
									value: function (e) {
										;(e.target.hasAttribute(this.config.closeTrigger) ||
											e.target.parentNode.hasAttribute(this.config.closeTrigger)) &&
											(e.preventDefault(), e.stopPropagation(), this.closeModal(e))
									},
								},
								{
									key: 'onKeydown',
									value: function (e) {
										27 === e.keyCode && this.closeModal(e), 9 === e.keyCode && this.retainFocus(e)
									},
								},
								{
									key: 'getFocusableNodes',
									value: function () {
										var e = this.modal.querySelectorAll(L)
										return Array.apply(void 0, P(e))
									},
								},
								{
									key: 'setFocusToFirstNode',
									value: function () {
										var e = this
										if (!this.config.disableFocus) {
											var n = this.getFocusableNodes()
											if (0 !== n.length) {
												var t = n.filter(function (n) {
													return !n.hasAttribute(e.config.closeTrigger)
												})
												t.length > 0 && t[0].focus(), 0 === t.length && n[0].focus()
											}
										}
									},
								},
								{
									key: 'retainFocus',
									value: function (e) {
										var n = this.getFocusableNodes()
										if (0 !== n.length)
											if (
												((n = n.filter(function (e) {
													return null !== e.offsetParent
												})),
												this.modal.contains(document.activeElement))
											) {
												var t = n.indexOf(document.activeElement)
												e.shiftKey && 0 === t && (n[n.length - 1].focus(), e.preventDefault()),
													!e.shiftKey &&
														n.length > 0 &&
														t === n.length - 1 &&
														(n[0].focus(), e.preventDefault())
											} else n[0].focus()
									},
								},
							]) &&
								(function (e, n) {
									for (var t = 0; t < n.length; t++) {
										var o = n[t]
										;(o.enumerable = o.enumerable || !1),
											(o.configurable = !0),
											'value' in o && (o.writable = !0),
											Object.defineProperty(e, o.key, o)
									}
								})(e.prototype, n),
							e
						)
					})()),
					(_ = null),
					(O = function (e) {
						if (!document.getElementById(e))
							return (
								console.warn(
									"MicroModal: ❗Seems like you have missed %c'".concat(e, "'"),
									'background-color: #f8f9fa;color: #50596c;font-weight: bold;',
									'ID somewhere in your code. Refer example below to resolve it.'
								),
								console.warn(
									'%cExample:',
									'background-color: #f8f9fa;color: #50596c;font-weight: bold;',
									'<div class="modal" id="'.concat(e, '"></div>')
								),
								!1
							)
					}),
					(M = function (e, n) {
						if (
							((function (e) {
								e.length <= 0 &&
									(console.warn(
										"MicroModal: ❗Please specify at least one %c'micromodal-trigger'",
										'background-color: #f8f9fa;color: #50596c;font-weight: bold;',
										'data attribute.'
									),
									console.warn(
										'%cExample:',
										'background-color: #f8f9fa;color: #50596c;font-weight: bold;',
										'<a href="#" data-micromodal-trigger="my-modal"></a>'
									))
							})(e),
							!n)
						)
							return !0
						for (var t in n) O(t)
						return !0
					}),
					{
						init: function (e) {
							var n = Object.assign({}, { openTrigger: 'data-micromodal-trigger' }, e),
								t = P(document.querySelectorAll('['.concat(n.openTrigger, ']'))),
								o = (function (e, n) {
									var t = []
									return (
										e.forEach(function (e) {
											var o = e.attributes[n].value
											void 0 === t[o] && (t[o] = []), t[o].push(e)
										}),
										t
									)
								})(t, n.openTrigger)
							if (!0 !== n.debugMode || !1 !== M(t, o))
								for (var a in o) {
									var r = o[a]
									;(n.targetModal = a), (n.triggers = P(r)), (_ = new F(n))
								}
						},
						show: function (e, n) {
							var t = n || {}
							;(t.targetModal = e),
								(!0 === t.debugMode && !1 === O(e)) ||
									(_ && _.removeEventListeners(), (_ = new F(t)).showModal())
						},
						close: function (e) {
							e ? _.closeModalById(e) : _.closeModal()
						},
					})
			'undefined' != typeof window && (window.MicroModal = N)
			var I = N,
				$ = function (e, n, t) {
					if (t || 2 === arguments.length)
						for (var o, a = 0, r = n.length; a < r; a++)
							(!o && a in n) || (o || (o = Array.prototype.slice.call(n, 0, a)), (o[a] = n[a]))
					return e.concat(o || Array.prototype.slice.call(n))
				},
				R = function (e, n, t) {
					;(this.name = e), (this.version = n), (this.os = t), (this.type = 'browser')
				},
				D = function (e, n, t, o) {
					;(this.name = e), (this.version = n), (this.os = t), (this.bot = o), (this.type = 'bot-device')
				},
				z = function () {
					;(this.type = 'bot'), (this.bot = !0), (this.name = 'bot'), (this.version = null), (this.os = null)
				},
				j = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/,
				G = [
					['aol', /AOLShield\/([0-9\._]+)/],
					['edge', /Edge\/([0-9\._]+)/],
					['edge-ios', /EdgiOS\/([0-9\._]+)/],
					['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
					['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
					['samsung', /SamsungBrowser\/([0-9\.]+)/],
					['silk', /\bSilk\/([0-9._-]+)\b/],
					['miui', /MiuiBrowser\/([0-9\.]+)$/],
					['beaker', /BeakerBrowser\/([0-9\.]+)/],
					['edge-chromium', /EdgA?\/([0-9\.]+)/],
					['chromium-webview', /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
					['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
					['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
					['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
					['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
					['fxios', /FxiOS\/([0-9\.]+)/],
					['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
					['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
					['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
					['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
					[
						'pie',
						/^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer)(\d+\.\d+);.*Windows CE.*\)$/,
					],
					['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
					['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
					['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
					['ie', /MSIE\s(7\.0)/],
					['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
					['android', /Android\s([0-9\.]+)/],
					['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
					['safari', /Version\/([0-9\._]+).*Safari/],
					['facebook', /FB[AS]V\/([0-9\.]+)/],
					['instagram', /Instagram\s([0-9\.]+)/],
					['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
					['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
					['curl', /^curl\/([0-9\.]+)$/],
					[
						'searchbot',
						/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/,
					],
				],
				q = [
					['iOS', /iP(hone|od|ad)/],
					['Android OS', /Android/],
					['BlackBerry OS', /BlackBerry|BB10/],
					['Windows Mobile', /IEMobile/],
					['Amazon OS', /Kindle/],
					['Windows 3.11', /Win16/],
					['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
					['Windows 98', /(Windows 98)|(Win98)/],
					['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
					['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
					['Windows Server 2003', /(Windows NT 5.2)/],
					['Windows Vista', /(Windows NT 6.0)/],
					['Windows 7', /(Windows NT 6.1)/],
					['Windows 8', /(Windows NT 6.2)/],
					['Windows 8.1', /(Windows NT 6.3)/],
					['Windows 10', /(Windows NT 10.0)/],
					['Windows ME', /Windows ME/],
					['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
					['Open BSD', /OpenBSD/],
					['Sun OS', /SunOS/],
					['Chrome OS', /CrOS/],
					['Linux', /(Linux)|(X11)/],
					['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
					['QNX', /QNX/],
					['BeOS', /BeOS/],
					['OS/2', /OS\/2/],
				]
			function W(e) {
				var n = (function (e) {
					return (
						'' !== e &&
						G.reduce(function (n, t) {
							var o = t[0],
								a = t[1]
							if (n) return n
							var r = a.exec(e)
							return !!r && [o, r]
						}, !1)
					)
				})(e)
				if (!n) return null
				var t = n[0],
					o = n[1]
				if ('searchbot' === t) return new z()
				var a = o[1] && o[1].split('.').join('_').split('_').slice(0, 3)
				a
					? a.length < 3 &&
						(a = $(
							$([], a, !0),
							(function (e) {
								for (var n = [], t = 0; t < e; t++) n.push('0')
								return n
							})(3 - a.length),
							!0
						))
					: (a = [])
				var r = a.join('.'),
					i = (function (e) {
						for (var n = 0, t = q.length; n < t; n++) {
							var o = q[n],
								a = o[0]
							if (o[1].exec(e)) return a
						}
						return null
					})(e),
					s = j.exec(e)
				return s && s[1] ? new D(t, r, i, s[1]) : new R(t, r, i)
			}
			const H =
				'undefined' == typeof document && 'undefined' != typeof navigator && 'ReactNative' === navigator.product
					? new (function () {
							;(this.type = 'react-native'),
								(this.name = 'react-native'),
								(this.version = null),
								(this.os = null)
						})()
					: 'undefined' != typeof navigator
						? W(navigator.userAgent)
						: 'undefined' != typeof process && process.version
							? new (function (e) {
									;(this.version = e),
										(this.type = 'node'),
										(this.name = 'node'),
										(this.os = process.platform)
								})(process.version.slice(1))
							: null
			if (H) {
				const e = H.version.split('.')
				document.body.classList.add(`${H.name}-${e[0]}`)
			}
			const U = document.querySelectorAll('.regions')
			Array.from(U).map(e => {
				e.addEventListener('click', function (e) {
					e.preventDefault()
					const n = document.querySelectorAll('.placeHolderPosition')
					Array.from(n).map(e => {
						'none' === e.style.display ? (e.style.display = 'block') : (e.style.display = 'none')
					})
				})
			}),
				s().highlightAll(),
				Array.from(document.querySelectorAll('.js_sites-gallery__button')).map(e => {
					e.addEventListener('click', function (e) {
						e.preventDefault()
					})
				}),
				I.init({
					disableScroll: !0,
					onShow: e => {
						const n = e.getElementsByTagName('img')
						Array.from(n).forEach(e => {
							e.dataset.src && e.setAttribute('src', e.dataset.src)
						})
					},
				})
		})()
})()
function lazyLoadThumb(e, alt, l) {
	var t =
			'<img data-lazy-src="https://i.ytimg.com/vi/ID/hqdefault.webp" alt="" width="480" height="360"><noscript><img src="https://i.ytimg.com/vi/ID/hqdefault.webp" alt="" width="480" height="360"></noscript>',
		a = '<button class="play" aria-label="play Youtube video"></button>'
	if (l) {
		t = t.replace('data-lazy-', '')
		t = t.replace('loading="lazy"', '')
		t = t.replace(/<noscript>.*?<\/noscript>/g, '')
	}
	t = t.replace('alt=""', 'alt="' + alt + '"')
	return t.replace('ID', e) + a
}
function lazyLoadYoutubeIframe() {
	var e = document.createElement('iframe'),
		t = 'ID?autoplay=1'
	t += 0 === this.parentNode.dataset.query.length ? '' : '&' + this.parentNode.dataset.query
	e.setAttribute('src', t.replace('ID', this.parentNode.dataset.src)),
		e.setAttribute('frameborder', '0'),
		e.setAttribute('allowfullscreen', '1'),
		e.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'),
		this.parentNode.parentNode.replaceChild(e, this.parentNode)
}
document.addEventListener('DOMContentLoaded', function () {
	var exclusions = []
	var e,
		t,
		p,
		u,
		l,
		a = document.getElementsByClassName('rll-youtube-player')
	for (t = 0; t < a.length; t++)
		(e = document.createElement('div')),
			(u = 'https://i.ytimg.com/vi/ID/hqdefault.webp'),
			(u = u.replace('ID', a[t].dataset.id)),
			(l = exclusions.some(exclusion => u.includes(exclusion))),
			e.setAttribute('data-id', a[t].dataset.id),
			e.setAttribute('data-query', a[t].dataset.query),
			e.setAttribute('data-src', a[t].dataset.src),
			(e.innerHTML = lazyLoadThumb(a[t].dataset.id, a[t].dataset.alt, l)),
			a[t].appendChild(e),
			(p = e.querySelector('.play')),
			(p.onclick = lazyLoadYoutubeIframe)
})
