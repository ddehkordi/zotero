﻿(function (global, ns) {
	"use strict";

	var nsx, nss = ns.split("."), ns = global;
	while (nsx = nss.shift())
		ns = (ns[nsx] = ns[nsx] || {});

	if (!!ns.MagnetLeads)
		return;

	var api_token, rmrcpi;
	var url_base = "https://tracking.magnetmail.net";
	var max_arg_len = 1000;

	var sendRequest = function (url, callback, post_data, content_type) {
		var container = global.document.getElementsByTagName("head")[0] || global.document.getElementsByTagName("body")[0];
		if (!container) return;
		var script = global.document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", url);
		container.appendChild(script);
	};

	var mkUrl = function () {
		var parts = [].slice.call(arguments, 0);
		for (var i = 0, n = parts.length; i != n; ++i)
			parts[i] = global.encodeURIComponent(parts[i]);
		parts.unshift(api_token);
		parts.unshift(url_base);
		return parts.join("/");
	};

	var dashify = function (s) {
		return s.replace(/[A-Z]/g, function (match, offset) { return (!!offset ? "-" : "") + match.toLowerCase(); });
	};

	var appendArgs = function (url, detail) {
		if (!url)
			return url;

		var parts = (url).split("#");
		var new_url = parts.shift();
		//var fragment = parts.join("#");
		//if (fragment)
		//	fragment = "#" + fragment;
		parts = new_url.split("?");
		new_url = parts.shift();
		var args = [new_url, "?_=", String((new Date()).getTime())];
		var push = false;
		var len = 0;
		for (var p in detail) {
			if (Object.prototype.hasOwnProperty.call(detail, p) && p != "_") {
				var v = detail[p];
				push = false;
				if (null === v)
					push = true;
				else switch (typeof v) {
					case "string":
					case "number":
					case "boolean":
						push = true;
				}
				if (push) {
					p = global.encodeURIComponent(p);
					v = (null === v) ? "" : global.encodeURIComponent(String(v));
					if (max_arg_len >= len + p.length + v.length) {
						args.push("&");
						args.push(p);
						args.push("=");
						args.push(v);
						len = len + p.length + v.length;
					}
				}
			}
		}
		//args.push(fragment);
		return args.join("");
	}

	var convertLead = function (info, sig) {
		if (!info || !info["Email"] || !sig)
			return;
		info["Hash"] = sig;
		createEvent("convert-lead", info);
	}

	var createEvent = function (ev, detail) {
		sendRequest(appendArgs(mkUrl(dashify(ev)), detail));
	};

	ns.MagnetLeads = {
		init: function (t) {
			api_token = t;
			this.createEvent = function () { if ("convert-lead" == args[0]) return; return createEvent.apply(this, arguments); };
			this.convertLead = function () { return convertLead.apply(this, arguments); };
			this.visitPage   = function () { return createEvent.apply(this,[].concat.apply(["visit-page"],arguments)); };
			delete this.init;
		}
	};
})(window, "com.realmagnet");
