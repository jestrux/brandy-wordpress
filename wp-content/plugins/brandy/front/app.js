((document, url) => {
	const script = document.createElement("script");
	script.src = url;
	script.onload = async () => {
		if (!window.CCEverywhere) {
			return;
		}

		window.CCEverywhere.initialize({
			clientId: "a100ff2a80f3491cacfa57be8aafb805",
			appName: "Brandy",
			// appVersion: { major: 1, minor: 0 },
			// platformCategory: "web",
			// redirectUri: "https://app.brandyhq.com/",
		}).then((result) => {
			window.adobeExpressEmbedSdk = result;
		});
	};
	document.body.appendChild(script);
})(document, "https://sdk.cc-embed.adobe.com/v2/CCEverywhere.js");

(() => {
	var $;
	window.addEventListener("DOMContentLoaded", function () {
		$ = jQuery;

		function insertBrandyEditButton() {
			if ($(".brandy-edit-attachment-button").text().length)
				return console.log("Brandy edit button already exists!");

			var el = $(".edit-attachment");
			var newEditButton = $(
				'<button class="brandy-edit-attachment-button">Edit using Adobe Expres</button>'
			);
			newEditButton.insertAfter(el);
			newEditButton.on("click", function (e) {
				setTimeout(async () => {
					const src = $(".details-image").attr("src");
					const assetId = new URL(
						window.location.href
					).searchParams.get("item");

					$(".media-modal-close").click();

					console.log("Image: ", assetId, src);

					const blob = await fetch(src).then((response) =>
						response.blob()
					);

					const asset = await blobToBase64(blob);

					console.log("Asset: ", asset);

					window.createFileOnExpress(asset);
				}, 500);
			});
		}

		function uploadImage() {
			//localhost:8000/wp-admin/async-upload.php,
			var data = new FormData();
			data.append("name", "Untitled.png");
			data.append("action", "upload-attachment");
			data.append("_wpnonce", "5644b5036d");
			data.append("async-upload", file);
			fetch();
		}

		var el = $(".page-title-action");
		var newAddButton = $(
			'<button class="brandy-toolbar-action-button">Add using Adobe Expres</button>'
		);
		newAddButton.insertAfter(el);
		newAddButton.on("click", function (e) {
			createFileOnExpress();
			e.stopImmediatePropagation();
		});

		if (new URL(window.location.href).searchParams.get("item")) {
			setTimeout(() => {
				insertBrandyEditButton();
			}, 500);
		}

		$(document).on("click", ".attachments-wrapper li", function () {
			console.log("Attachment clicked!");
			insertBrandyEditButton();
		});
	});

	window.DataURIToBlob = (dataURI) => {
		var splitDataURI = dataURI.split(",");
		var byteString =
			splitDataURI[0].indexOf("base64") >= 0
				? atob(splitDataURI[1])
				: decodeURI(splitDataURI[1]);
		var mimeString = splitDataURI[0].split(":")[1].split(";")[0];

		var ia = new Uint8Array(byteString.length);

		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	};

	window.blobToBase64 = async (blob) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.error = (err) => reject(err);
			reader.readAsDataURL(blob);
		});
	};

	window.createFileOnExpress = function (asset) {
		adobeExpressEmbedSdk.createDesign({
			modalParams: {},
			inputParams: !asset
				? {}
				: {
						asset: {
							type: "image",
							dataType: "base64",
							data: asset,
						},
				  },
			callbacks: {
				onPublishStart: () => {},
				onPublish: (publishParams) => {
					$("ul.attachments .attachment")
						.first()
						.find("img")
						.attr("src", publishParams.asset.data);

					console.log("New image: ", publishParams.asset.data);

					const fileBlob = window.DataURIToBlob(
						publishParams.asset.data
					);

					// const data = new FormData();
					// data.append("file", fileBlob, "Adobe Express Project");
					// data.append("projectId", publishParams.projectId);

					// Collection.uploadAssets(
					// 	this.collection._id,
					// 	publishParams.asset.type,
					// 	data
					// ).then((response) => {
					// 	this.assets.splice.apply(
					// 		this.assets,
					// 		[index, 0].concat([response.data])
					// 	);
					// 	this.onOrderUpdate(this.assets);
					// });
				},
			},
			outputParams: {
				outputType: "base64",
			},
		});

		window.getAllTagMatches = function (regEx) {
			return Array.prototype.slice
				.call(document.querySelectorAll("*"))
				.find(function (el) {
					return el.tagName.match(regEx);
				});
		};

		setTimeout(() => {
			var expressIframe = getAllTagMatches(/^cc-everywhere-container/i);
			console.log("IFrame: ", expressIframe);
			expressIframe.shadowRoot.querySelector(
				"#cc-everywhere-root"
			).style.zIndex = 999999;
		}, 500);
	};
})();
