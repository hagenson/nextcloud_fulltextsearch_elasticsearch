/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** global: OC */
/** global: elasticsearch_elements */
/** global: fts_admin_settings */




var elasticsearch_settings = {

	config: null,

	refreshSettingPage: function () {

		fetch(OC.generateUrl('/apps/fulltextsearch_elasticsearch/admin/settings'), {
			headers: { requesttoken: OC.requestToken }
		}).then(function (r) { return r.json(); }).then(function (res) {
			elasticsearch_settings.updateSettingPage(res);
		}).catch(function (e) { console.error(e); });

	},

	/** @namespace result.elastic_host */
	/** @namespace result.elastic_index */
	updateSettingPage: function (result) {

		elasticsearch_elements.elasticsearch_host.value = result.elastic_host;
		elasticsearch_elements.elasticsearch_index.value = result.elastic_index;
		elasticsearch_elements.analyzer_tokenizer.value = result.analyzer_tokenizer;

		fts_admin_settings.tagSettingsAsSaved(elasticsearch_elements.elasticsearch_div);
	},


	saveSettings: function () {

		var data = {
			elastic_host: elasticsearch_elements.elasticsearch_host.value,
			elastic_index: elasticsearch_elements.elasticsearch_index.value,
			analyzer_tokenizer: elasticsearch_elements.analyzer_tokenizer.value
		};

		OC.msg.startSaving('#elastic_search .msg');
		var params = new URLSearchParams();
		for (var k in data) {
			params.append('data[' + k + ']', data[k]);
		}
		fetch(OC.generateUrl('/apps/fulltextsearch_elasticsearch/admin/settings'), {
			method: 'POST',
			headers: {
				requesttoken: OC.requestToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params.toString()
		}).then(function (r) { return r.json(); }).then(function (res) {
			elasticsearch_settings.updateSettingPage(res);
			OC.msg.finishedSuccess('#elastic_search .msg', t('fulltextsearch_elasticsearch', 'Saved'));
		}).catch(function () {
			OC.msg.finishedError('#elastic_search .msg', t('fulltextsearch_elasticsearch', 'Error'));
		});

	}


};
