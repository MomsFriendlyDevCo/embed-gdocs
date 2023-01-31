/**
* Embed a Google-Docs document within a webpage
* @param {Object} options Options to configure behaviour
* @param {String|HTMLElement} options.selector Either the DOM node to replace or a selector to use
* @param {String} options.url The Google Docs published URL to embed - this generally ends in `/pub?embedded=true`
* @param {Object} [options.urlOptions] Additional Fetch options when retrieving the document from the `url`
* @param {Boolean} [options.keepStyle=true] Keep the source document style, if false this removes the style completely
* @param {Boolean} [options.fixContentTrim=true] Remove the outer wrapping of the element and just use the embedded content
* @param {Boolean} [options.fixWidth=true] Remove page width restrictions
* @param {Boolean} [options.fixParaMargins=true] Add slight margin to paragraphs
* @param {Boolean} [options.fixTableWidth=true] Remove table width restrictions
* @param {Boolean} [options.fixPadding=true] Remove page padding
* @param {Boolean} [options.fixLinkTargets=true] Make all links open in a new tab instead of replacing the current one
* @param {Boolean} [options.fixLinkShorten=true] Remove Google tracking URL prefix from links
* @param {Boolean} [options.fixImageTitleAsLink=true] If an image "alternative text" (actually the `title` attribute) looks like a link make the image linkable - this is to fix how Google Docs weirdly handles image linking
*
*/
window.embedGDoc = function embedGdoc(options) {
	let settings = {
		selector: null,
		url: null,
		urlOptions: {
			cache: 'default',
			headers: {
				'Accept': 'text/html',
			},
		},
		keepStyle: true,
		fixContentTrim: true,
		fixWidth: true,
		fixTableWidth: true,
		fixPadding: true,
		fixLinkTargets: true,
		fixLinkShorten: true,
		fixImageTitleAsLink: true,
		...options,
	};

	/**
	* Shiv wrapper as setHTML doesn't seem to be used everywhere
	*/
    let setHtml = (el, html) => el.setHTML ? el.setHTML(html) : el.innerHTML = html;

	if (!settings.selector) throw new Error('Selector must be specified');
	if (!settings.url) throw new Error('URL must be specified');

	let embedEl = typeof settings.selector == 'string'
		? document.querySelector(settings.selector)
		: settings.selector;

	if (!embedEl) throw new Error(`Cannot find selector "${settings.selector} to embed GDoc`);

	return fetch(settings.url, settings.urlOptions)
		.then(res => res.text())
		.then(html => {
			let sourceDoc = document.createElement('div')
			let styleRules = []; // Additional style rules to prepend when done
			setHtml(sourceDoc, html); // Splat HTML into temporary div

			let doc = settings.fixContentTrim
				? sourceDoc.querySelector('.doc-content') // Narrow down to just the contents
				: sourceDoc

			if (settings.keepStyle) {
				let style = sourceDoc.querySelector('style[type="text/css"]');
				console.log('Reinject style', style);
				doc.prepend(style);
			}

			// fixWidth and/or fixPadding {{{
			if (settings.fixWidth || settings.fixPadding) {
				doc.setAttribute('style', [
					settings.fixWidth && 'max-width: none',
					settings.fixPadding && 'padding: 0 20px',
				]
					.filter(Boolean)
					.join(';\n')
				);
			}
			// }}}
			// fixTableWidth {{{
			if (settings.fixTableWidth) {
				styleRules.push(
					`${settings.selector} table { max-width: none !important; padding: 1.5rem 0 }`, // Let last table row max out width
					`${settings.selector} table td:last-child { width: auto !important }`, // Let last table row max out width
				);
			}
			// }}}
			// fixParaMargins {{{
			if (settings.fixParaMargins) {
				styleRules.push(`${settings.selector} p { margin-bottom: 1rem }`);
			}
			// }}}
			// fixLinkTargets and/or fixLinkShorten {{{
			if (settings.fixLinkTargets || settings.fixLinkShorten) {
				doc.querySelectorAll('a')
					|> els => Array.from(els)
					.filter(el => /^https?:\/\//.test(el.getAttribute('href')))
					.forEach(el => {
						// fixLinkTargets
						if (settings.fixLinkTargets) el.setAttribute('target', '_blank')

						// fixLinkShorten
						if (settings.fixLinkShorten) el.setAttribute('href', el.getAttribute('href')
							.replace(/^https:\/\/www\.google\.com\/url\?q=(.*?)&.*$/, '$1') // Remove `&...` slush from GitHub URLs
							.replace(/^https:\/\/www\.google\.com\/url\?q=/, '') // Rewrite all other URLs
						);
					});
			}
			// }}}
			// fixImageTitleAsLink {{{
			if (settings.fixImageTitleAsLink) {
				doc.querySelectorAll('img[title]')
					|> els => Array.from(els)
					.filter(el => /^https?:\/\//.test(el.getAttribute('title')))
					.forEach(el => {
						let wrapper = document.createElement('a');
						wrapper.setAttribute('href', el.getAttribute('title'));
						if (settings.fixLinkTargets) wrapper.setAttribute('target', '_blank');

						el.replaceWith(wrapper);
						wrapper.replaceChildren(el);
					})
			}
			// }}}

			if (styleRules.length > 0) { // Append any override styles we have
				let styleSheet = document.createElement('style');
				styleSheet.setAttribute('type', 'text/css');
				setHtml(styleSheet, styleRules.join('\n'));
				doc.prepend(styleSheet);
			}

			embedEl.replaceChildren(doc);
		})
}
