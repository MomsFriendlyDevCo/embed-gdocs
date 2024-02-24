import clean from './clean.js';
import {JSDOM} from 'jsdom';

export default function embedGDocFormatHtml(html, options) {
	let rootDom = new JSDOM('<!DOCTYPE html><body><div id="embed"></div></body>');

	// Run main cleaning function
	let resultEl = clean(html, {
		...options,

		createElement(type) {
			return rootDom.window.document.createElement(type);
		},
	});

	// Return back HTML of our mutated DOM element
	return resultEl.innerHTML;
}
