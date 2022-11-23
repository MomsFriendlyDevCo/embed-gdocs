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
			let doc = document.createElement('div')
			doc.setHTML(html); // Splat HTML into temporary div

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
