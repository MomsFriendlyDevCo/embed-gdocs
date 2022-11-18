@MomsFriendlyDevCo/Embed-GDocs
==============================
Simple, agnostic component to embed a Google Doc into a webpage.

Features:
* Simple API to include a Google-Doc embed within any webpage
* Platform and framework agnostic - works as plain JS with no dependencies
* Included fixes for common issues with embeds (various style fixes, unminify links, retarget links to open in other tags)


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
