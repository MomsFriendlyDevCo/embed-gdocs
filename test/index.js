import {expect} from 'chai';
import html from '../lib/html.js';

describe('EmbedGDoc -> HTML', ()=> {

	it('Basic HTML test', async ()=> {
		let baseDoc = await fetch('https://docs.google.com/document/d/e/2PACX-1vSMaEiS-SvH-8ymVp_oKVhbyTUJKpHKayN4hgFAlyBHJFrGcby_KOHS-yAhD87XB2yODkdnOD0wEKEG/pub?embedded=true')

		let result = html(await baseDoc.text());

		expect(result).to.not.equal('', 'Result should not be empty');
	})

});
