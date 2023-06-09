import { useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { fetchArgs } from '../utility/network';
import { __ } from '@wordpress/i18n';

const validator = require("email-validator");

export const Settings = (props) => {
	const { pluginOptions, setPluginOptions } = props;
	const addEmailRef = useRef(null);

	const updateRows = (event) => {
		const numrows = parseInt(event.target.value);
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/numrows`, fetchArgs('POST', numrows));
		setPluginOptions({ ...pluginOptions, numrows });
	};

	const updateHumanDate = (event) => {
		const humandate = event.target.checked;
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/humandate`, fetchArgs('POST', humandate));
		setPluginOptions({ ...pluginOptions, humandate });
	};

	const addEmail = () => {
		const emails = [...pluginOptions.emails];
		const newEmail = addEmailRef.current.value;

		if (!newEmail) {
			alert(__('Email field is empty. Please enter a valid email address.', 'vuejs-challenge'));
			return;
		}

		if (newEmail && validator.validate(newEmail)) {
			emails.push(newEmail);
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/emails`, fetchArgs('POST', emails));
			setPluginOptions({ ...pluginOptions, emails });
			addEmailRef.current.value = '';
		} else {
			alert(__('Invalid email. Please enter a valid email address.', 'vuejs-challenge'));
		}
	};

	const deleteEmail = (index) => {
		const emails = [...pluginOptions.emails];
		emails.splice(index, 1);

		if (confirm(__('Are you sure? Click \'OK\' to delete, or \'Cancel\' to keep the email address.', 'vuejs-challenge')) == true) {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/emails`, fetchArgs('POST', emails));
			setPluginOptions({ ...pluginOptions, emails });
		}
	};

	return (
		<>
			<h2>{__('Edit Settings')}</h2>
			<form id="pluginOptionsForm">
				<div className="form-row">
					<div className="label-wrapper"><label for="rating">{__('Number of rows', 'vuejs-challenge')}</label></div>
					<div className="label-field"><input type="number" id="rating" name="rating" min="1" max="5" step="1"
						value={pluginOptions?.numrows} onChange={updateRows} />
						<p className="desc">{__('Number of rows displayed in the table (1-5).', 'vuejs-challenge')}</p>
					</div>
				</div>
				<div className="form-row" style={{ alignItems: "center" }}>
					<div className="label-wrapper">{__('Human Date', 'vuejs-challenge')}</div>
					<div className="label-field"><input type="checkbox" id="humandate" name="humandate" checked={pluginOptions?.humandate === true ? true : false} onChange={updateHumanDate} />
						<label for="humandate">&nbsp;{__('Date Format', 'vuejs-challenge')}</label>
						<p className="desc">{__('When checked, a human readable date is used in the table.', 'vuejs-challenge')}</p>
					</div>
				</div>
				<div className="form-row">
					<div className="label-wrapper">{__('Emails', 'vuejs-challenge')}</div>
					<div className="label-field" id="emails">
						{pluginOptions?.emails.length === 0 && <div>{__('No emails found. Add one or more emails via the text field below.', 'vuejs-challenge')}</div>}
						{pluginOptions?.emails.length >= 1 && pluginOptions?.emails.map((email, index) => {
							return (
								<div className="email">
									<input type="email" name="email" value={email} readOnly />
									<div className="delete-email" role="button" onClick={e => deleteEmail(index)} title="Delete email"><span class="dashicons dashicons-no"></span></div>
								</div>
							);
						})}
						{pluginOptions?.emails && pluginOptions?.emails.length <= 4 && (
							<>
								<hr className="hr-sep" />
								<div className="add-email">
									<input ref={addEmailRef} type="email" id="add-email" />
									<Button variant="secondary" onClick={addEmail} title="Add a new email">{__('Add Email', 'vuejs-challenge')}</Button>
								</div>
								<div>
									<p className="desc">{__('Add up to 5 email addresses. These are also displayed on the Table tab.', 'vuejs-challenge')}</p>
								</div>
							</>
						)}
					</div>
				</div>
			</form>
		</>			
	);
};
