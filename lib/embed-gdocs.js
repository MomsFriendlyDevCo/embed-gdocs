import clean from './clean.js';

/**
* Embed a Google-Docs document within a webpage
*
* @param {Object} options Options to configure behaviour
*
* @param {String|HTMLElement} options.selector Either the DOM node to replace or a selector to use
* @param {String} options.url The Google Docs published URL to embed - this generally ends in `/pub?embedded=true`
* @param {Object} [options.urlOptions] Additional Fetch options when retrieving the document from the `url`
* @param {Function} [options.fetcher] Wrapper around `fetch` which should retrieve the URL. Called as `(settings:Object)` and expected to return a string
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
* @param {Function} [options.onLoad] Called as `(html:String)` when the HTML has been loaded, expected to return the mutated input
* @param {Function} [options.onMount] Called as `(el:DomElement)` when the Dom element has been created but has not yet been added into the DOM, can mutate the input element
*
*/
export default function embedGdoc(options) {
	let settings = {
		selector: null,
		url: null,
		urlOptions: {
			cache: 'default',
			headers: {
				'Accept': 'text/html',
			},
		},
		fetcher(settings) {
			return fetch(settings.url, settings.options)
				.then(response => response.text())
		},
		keepStyle: true,
		fixContentTrim: true,
		fixWidth: true,
		fixTableWidth: true,
		fixPadding: true,
		fixLinkTargets: true,
		fixLinkShorten: true,
		fixImageTitleAsLink: true,

		onLoad: html => html,
		onMount: el => null,

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

	return Promise.resolve()
		.then(()=> settings.fetcher(settings))
		.then(html => settings.onLoad(html))
		.then(html => clean(html, options))
		.then(result => embedEl.replaceChildren(result))
}
