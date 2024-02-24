/**
* Take input HTML and return a "clean" version of the same fixing various issues
*
* All of the options are copied from embedGDoc() but this function adds some low-level subclassable options also
*
* @see embedGDoc()
*/
export default function embedGDocClean(html, options) {
	let settings = {
		keepStyle: true,
		fixContentTrim: true,
		fixWidth: true,
		fixTableWidth: true,
		fixPadding: true,
		fixLinkTargets: true,
		fixLinkShorten: true,
		fixImageTitleAsLink: true,


		createElement(type) {
			return document.createElement('div');
		},

		onLoad: html => html,
		onMount: el => null,

		...options,
	};
	let styleRules = []; // Additional style rules to prepend when done

	let sourceDoc = settings.createElement('div');
	sourceDoc.innerHTML = html;

	let doc = settings.fixContentTrim
		? sourceDoc.querySelector('.doc-content') // Narrow down to just the contents
		: sourceDoc

	if (settings.keepStyle) {
		let style = sourceDoc.querySelector('style[type="text/css"]');
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
		Array.from(
			doc.querySelectorAll('a')
		)
			.filter(el => /^https?:\/\//.test(el.getAttribute('href')))
			.forEach(el => {
				// fixLinkTargets
				if (settings.fixLinkTargets) el.setAttribute('target', '_blank')

				// fixLinkShorten
				if (settings.fixLinkShorten) el.setAttribute('href', el.getAttribute('href')
					.replace(/^https:\/\/www\.google\.com\/url\?q=(.*?)&.*$/, '$1') // Remove `&...` slush from GitHub URLs
					.replace(/^https:\/\/www\.google\.com\/url\?q=/, '') // Rewrite all other URLs,
					.replace(/^(.+)$/, link => unescape(link)) // De-encode URL characters like '#'
				);
			});
	}
	// }}}
	// fixImageTitleAsLink {{{
	if (settings.fixImageTitleAsLink) {
		Array.from(
			doc.querySelectorAll('img[title]')
		)
			.filter(el => /^https?:\/\//.test(el.getAttribute('title')))
			.forEach(el => {
				let wrapper = settings.createElement('a');
				wrapper.setAttribute('href', el.getAttribute('title'));
				if (settings.fixLinkTargets) wrapper.setAttribute('target', '_blank');

				el.replaceWith(wrapper);
				wrapper.replaceChildren(el);
			})
	}
	// }}}

	if (styleRules.length > 0) { // Append any override styles we have
		let styleSheet = settings.createElement('style');
		styleSheet.setAttribute('type', 'text/css');
		styleSheet.innerHTML = styleRules.join('\n');
		doc.prepend(styleSheet);
	}

	settings.onMount(doc);

	return doc;
}
