"use strict"; debugger; (() => {
	let winTop = null;

	try {
		const top = win.top;
		if (top != null)
			winTop = top === win ? win : top.origin === win.origin ? top : null;
	} catch (err) {
		// ignore
	}

	const domParser = new DOMParser();

	function createFrameElement(url) {
		const elem = document.createElement("embed");
		elem.setAttribute("type", "text/plain");
		elem.setAttribute("width", "1024");
		elem.setAttribute("height", "768");
		elem.setAttribute("src", url);
		return elem;
	}

	function openInNewWindow(elem) {
		const win = window.open(void 0, "_blank", "");
		if (win == null) {
			error("Please allow popups in your browser settings and try again.");
			return;
		}
		win.stop();
		win.focus();

		const doc = domParser.parseFromString(`<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta http-equiv="Referrer-Policy" content="no-referrer" />
		<meta name="referrer" content="no-referrer" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<base href="${win.origin}" target="_blank" />
		<link rel="icon" type="image/x-icon" href="res/google.ico" />
		<style type="text/css">
body, embed, iframe {
	position: absolute;
	display: block;
	width: 100%;
	height: 100%;
	margin: 0px;
	padding: 0px;
	border: none;
	overflow: hidden;
}
		</style>
		<title>Google</title>
	</head>
	<body>
		<!-- dummy -->
	</body>
</html>`, "application/xml");

		elem.remove();
		doc.body.appendChild(elem);
		win.document.documentElement.replaceWith(doc.documentElement);
	}


	document.getElementById("test-a").onclick = (() => {
		// use the object with top window when possible to avoid issues
		// with iframe without setting 'allow="payment"'
		const prq = (winTop || window).PaymentRequest;
		if (typeof prq !== "function") { // this API is not available on Firefox
			error("Error: Your browser does not support this feature.");
			return;
		}

		new prq([
			{
				data: ["https://whitespider.dev/"],
				supportedMethods: "https://whitespider.dev/res/pay.json",
			}
		], {
			id: "dummy",
			total: {
				label: "Dummy Item",
				amount: {
					value: "200",
					currency: "USD"
				},
				pending: true
			},
			modifiers: [],
			displayItems: []
		}).show();
	});

	document.getElementById("test-b").onclick = (() => {
		openInNewWindow(createFrameElement(location.href))
	});
})();
