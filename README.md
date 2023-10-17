@MomsFriendlyDevCo/Embed-GDocs
==============================
Simple, agnostic component to embed a Google Doc into a webpage.

Features:
* Simple API to include a Google-Doc embed within any webpage
* Platform and framework agnostic - works as plain JS with no dependencies
* Included fixes for common issues with embeds (various style fixes, unminify links, retarget links to open in other tags)


Options are:

| Option                | Type                     | Default        | Description                                                                                                                                                              |
|-----------------------|--------------------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `selector`            | `String` / `HTMLElement` |                | Either the DOM node to replace or a selector to use                                                                                                                      |
| `url`                 | `String`                 |                | The Google Docs published URL to embed - this generally ends in `/pub?embedded=true`                                                                                     |
| `urlOptions`          | `Object`                 |                | Additional Fetch options when retrieving the document from the `url`                                                                                                     |
| `keepStyle`           | `Boolean`                | `true`         | Keep the source document style, if false this removes the style completely                                                                                               |
| `fixContentTrim`      | `Boolean`                | `true`         | Remove the outer wrapping of the element and just use the embedded content                                                                                               |
| `fixWidth`            | `Boolean`                | `true`         | Remove page width restrictions                                                                                                                                           |
| `fixParaMargins`      | `Boolean`                | `true`         | Add slight margin to paragraphs                                                                                                                                          |
| `fixTableWidth`       | `Boolean`                | `true`         | Remove table width restrictions                                                                                                                                          |
| `fixPadding`          | `Boolean`                | `true`         | Remove page padding                                                                                                                                                      |
| `fixLinkTargets`      | `Boolean`                | `true`         | Make all links open in a new tab instead of replacing the current one                                                                                                    |
| `fixLinkShorten`      | `Boolean`                | `true`         | Remove Google tracking URL prefix from links                                                                                                                             |
| `fixImageTitleAsLink` | `Boolean`                | `true`         | If an image "alternative text" (actually the `title` attribute) looks like a link make the image linkable - this is to fix how Google Docs weirdly handles image linking |
| `onLoad`              | `Function`               | `html => html` | Called as `(html:String)` when the HTML has been loaded, expected to return the mutated input                                                                            |
| `onMount`             | `Function`               | `el => null`   | Called as `(el:DomElement)` when the Dom element has been created but has not yet been added into the DOM, can mutate the input element                                  |


```html
<html>
<head>
	<title>@MomsFriendlyDevCo/Embed-GDocs Example</title>
	<script src="/dist/embed-gdocs.js"></script>
	<script>
	window.addEventListener('load', ()=> {
		embedGDoc({
			selector: '#gdoc',
			url: 'https://docs.google.com/document/d/e/2PACX-1vTasmjm8_rI_tzzzMs0xl5AhjafHXCPs33uyq6VShbMepnlkumS9rDBkxbEs0AAoAtdMRm-dmoGXxbR/pub?embedded=true',
		});
	});
	</script>
</head>
<body>
	<div id="gdoc"></div>
</body>
</html>
```
