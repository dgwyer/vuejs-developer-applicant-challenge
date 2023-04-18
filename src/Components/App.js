import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import { Button, Spinner } from '@wordpress/components';
const validator = require("email-validator");

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);
	const addEmailRef = useRef(null);
	const fetchArgs = {
		headers: {
			'X-WP-Nonce': window.testProjectApp.nonce,
		}
	};

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-api-data/`, fetchArgs)
				.then(response => response.json())
				.then(json => {
					setData(json);
				});
		};
		getData();
	}, [setData]);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-plugin-settings/`, fetchArgs)
				.then(response => response.json())
				.then(json => {
					if (json.success) {
						setPluginOptions(JSON.parse(json.data));
					}
				});
		};
		getData();
	}, [setPluginOptions]);

	const updateRows = (event) => {
		const numrows = parseInt(event.target.value);
		const fetchArgs = {
			method: 'POST',
			headers: {
				'X-WP-Nonce': window.testProjectApp.nonce,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ value: numrows })
		};
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/numrows`, fetchArgs);
		setPluginOptions({ ...pluginOptions, numrows: parseInt(numrows) });
	};

	const updateHumanDate = (event) => {
		const humandate = event.target.checked;
		const fetchArgs = {
			method: 'POST',
			headers: {
				'X-WP-Nonce': window.testProjectApp.nonce,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ value: humandate })
		};
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/humandate`, fetchArgs);
		setPluginOptions({ ...pluginOptions, humandate });
	};

	const addEmail = (event) => {
		const emails = [...pluginOptions.emails];
		const newEmail = addEmailRef.current.value;

		if (!newEmail) {
			alert('Email field is empty. Please enter a valid email address.');
			return;
		}

		if (newEmail && validator.validate(newEmail)) {
			emails.push(newEmail);
			const fetchArgs = {
				method: 'POST',
				headers: {
					'X-WP-Nonce': window.testProjectApp.nonce,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ value: emails })
			};
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/emails`, fetchArgs);
			setPluginOptions({ ...pluginOptions, emails });
			addEmailRef.current.value = '';
		} else {
			alert('Invalid email. Please enter a valid email address.');
		}
	};

	const deleteEmail = (event, index) => {
		const emails = [...pluginOptions.emails];
		emails.splice(index, 1);

		const fetchArgs = {
			method: 'POST',
			headers: {
				'X-WP-Nonce': window.testProjectApp.nonce,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ value: emails })
		};
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/update-setting/emails`, fetchArgs);
		setPluginOptions({ ...pluginOptions, emails });
	};

	return (
		<>
			{!data && !pluginOptions && <Spinner />}
			{data && <div>
				<div>{JSON.stringify(data)}</div>
				<div>{JSON.stringify(pluginOptions)}</div>
				<span>{__('Hello from JavaScript!', 'vuejs-challenge')}</span>

				<form id="pluginOptionsForm">
					<div className="form-row">
						<label for="rating">Rating (1-5):</label>
						<input type="number" id="rating" name="rating" min="1" max="5" step="1"
							value={pluginOptions?.numrows} onChange={updateRows} />
					</div>
					<div className="form-row" style={{ alignItems: "center" }}>
						<label for="humandate">Human Date:</label>
						<input type="checkbox" id="humandate" name="humandate" checked={pluginOptions?.humandate === true ? true : false} onChange={updateHumanDate} />
					</div>
					<div className="form-row">
						<label for="emails">Emails:</label>
						<div id="emails">
							{pluginOptions?.emails.length === 0 && <div>No emails found</div>}
							{pluginOptions?.emails.length >= 1 && pluginOptions?.emails.map((email, index) => {
								return (
									<div className="email">
										<input type="email" name="email" value={email} readOnly />
										<Button variant="secondary" onClick={e => deleteEmail(e, index)} title="Delete email"><span class="dashicons dashicons-no"></span></Button>
									</div>
								);
							})}
						</div>
					</div>
					{pluginOptions?.emails && pluginOptions?.emails.length <= 4 && (
						<>
							<div className="form-row right add-email">
								<Button variant="secondary" onClick={addEmail} title="Add a new email">Add Email</Button>
								<input ref={addEmailRef} type="email" id="add-email" />
							</div>
							<div className="right">
								<div style={{ fontStyle: "italic" }}>Add up to 5 email addresses.</div>
							</div>
						</>
					)}
				</form>
			</div>}
		</>
	);
}
