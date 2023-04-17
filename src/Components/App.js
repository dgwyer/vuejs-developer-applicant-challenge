import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import { Button, Spinner } from '@wordpress/components';
const validator = require("email-validator");

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);
	const addEmailRef = useRef(null);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-api-data/`)
				.then(response => response.json())
				.then(json => {
					setData(json);
				});
		};
		getData();
	}, [setData]);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-plugin-settings/`)
				.then(response => response.json())
				.then(json => {
					if (json.success) {
						setPluginOptions(JSON.parse(json.data));
					}
				});
		};
		getData();
	}, [setPluginOptions]);

	console.log(pluginOptions);

	const updateRows = (event) => {
		const numrows = event.target.value;
		setPluginOptions({ ...pluginOptions, numrows: parseInt(numrows) });
	};

	const updateHumanDate = (event) => {
		const humandate = event.target.checked;
		console.log('res:', humandate);
		setPluginOptions({ ...pluginOptions, humandate });
	};

	const addEmail = (event) => {
		const emails = pluginOptions.emails;
		const email = addEmailRef.current.value;

		if (!email) {
			alert('Email field is empty. Please enter a valid email address.');
			return;
		}

		if (email && validator.validate(email)) {
			emails.push(email);
			setPluginOptions({ ...pluginOptions, emails });
			addEmailRef.current.value = '';
		} else {
			alert('Invalid email. Please enter a valid email address.');
		}
	};

	const deleteEmail = (event, index) => {
		const emails = pluginOptions.emails;

		emails.splice(index, 1);
		console.log('resx:', index, emails);
		setPluginOptions({ ...pluginOptions, emails });
	};

	const saveChanges = (event) => {
		event.preventDefault();
		const index = event.target.dataset.index;
		const emails = pluginOptions.emails;

		console.log('res2:', index, emails);
		//emails.splice(index, 1);
		//setPluginOptions({ ...pluginOptions, emails });
	};

	return (
		<>
			{!data && !pluginOptions && <Spinner />}
			{data && <div>
				<div>{JSON.stringify(data)}</div>
				<div>{JSON.stringify(pluginOptions)}</div>
				<span>{__('Hello from JavaScript!', 'vuejs-challenge')}</span>

				<form id="pluginOptionsForm" onSubmit={saveChanges} autocomplete="chrome-off">
					<div className="form-row">
						<label for="rating">Rating (1-5):</label>
						<input type="number" id="rating" name="rating" min="1" max="5" step="1"
							value={pluginOptions?.numrows} onChange={updateRows} />
					</div>
					<div className="form-row" style={{alignItems: "center"}}>
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
										<input type="email" name="email" value={email} readOnly/>
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
					<div className="form-row save">
						<Button variant="primary" type="submit">Save Changes</Button>
					</div>
				</form>
			</div>}
		</>
	);
}
