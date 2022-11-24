/**
* Embed a Google-Docs document within a webpage
* @param {Object} options Options to configure behaviour
* @param {string|HTMLElement} options.selector Either the DOM node to replace or a selector to use
* @param {string} options.url The Google Docs published URL to embed - this generally ends in `/pub?embedded=true`
* @param {Object} [options.urlOptions] Additional Fetch options when retrieving the document from the `url`
* @param {boolean} [options.fixContentTrim=true] Remove the outer wrapping of the element and just use the embedded content
* @param {boolean} [options.fixWidth=true] Remove page width restrictions
* @param {boolean} [options.fixPadding=true] Remove page padding
* @param {boolean} [options.fixLinkTargets=true] Make all links open in a new tab instead of replacing the current one
* @param {boolean} [options.fixLinkShorten=true] Remove Google tracking URL prefix from links
* @param {boolean} [options.fixImageTitleAsLink=true] If an image "alternative text" (actually the `title` attribute) looks like a link make the image linkable - this is to fix how Google Docs weirdly handles image linking
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
		fixContentTrim: true,
		fixWidth: true,
		fixPadding: true,
		fixLinkTargets: true,
		fixLinkShorten: true,
		fixImageTitleAsLink: true,
		...options,
	};
	if (!settings.selector) throw new Error('Selector must be specified');
	if (!settings.url) throw new Error('URL must be specified');

	let embedEl = typeof settings.selector == 'string'
		? document.querySelector(settings.selector)
		: settings.selector;

	if (!embedEl) throw new Error(`Cannot find selector "${settings.selector} to embed GDoc`);

	return fetch(settings.url, settings.urlOptions)
		.then(res => res.text())
		.then(html => {
			let doc = document.createElement('div');
			(typeof doc.setHTML === 'function') ? doc.setHTML(html) : doc.innerHTML = html; // Splat HTML into temporary div

			if (settings.fixContentTrim) // Narrow down to just the contents
				doc = doc.querySelector('.doc-content');

			// fixWidth and/or fixPadding {{{
			if (settings.fixWidth || settings.fixPadding) {
				doc.querySelector('div').setAttribute('style', [
					settings.fixWidth && 'max-width: none',
					settings.fixPadding && 'padding: 0 20px',
				]
					.filter(Boolean)
					.join(';\n')
				);
			}
			// }}}
			// fixPadding {{{
			if (settings.fixPadding) {
				doc.querySelector('div').setAttribute('style', 'padding: 0 20px');
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

			embedEl.replaceChildren(doc);
		})
}
