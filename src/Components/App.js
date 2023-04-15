import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);

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
					if(json.success) {
						setPluginOptions(JSON.parse(json.data));
					}
				});
		};
		getData();
	}, [setPluginOptions]);

	console.log(pluginOptions);

	return (
		<>
			{!data && !pluginOptions && <Spinner />}
			{data && <div>
				<div>{JSON.stringify(data)}</div>				
				<div>{JSON.stringify(pluginOptions)}</div>
				<span>{__('Hello from JavaScript!', 'vuejs-challenge')}</span>
				{/* <button onClick={getData}>Get data</button> */}
				
				<form id="myForm">
					<div className="form-row">
						<label for="rating">Rating (1-5):</label>
						<input type="number" id="rating" name="rating" min="1" max="5" step="1" value={pluginOptions?.numrows} />
					</div>
					<div className="form-row">
						<label for="humandate">Human Date:</label>
						<input type="checkbox" id="humandate" name="humandate" checked={pluginOptions?.humandate === true} />
					</div>
					<div className="form-row">
						<label for="emails">Emails:</label>
						<div id="emails">
							{pluginOptions?.emails.map((email, index) => {
								return (
									<div className="email">
										<input type="email" name="email[]" placeholder="Email 1" value={email} />
										<button type="button" onclick="deleteEmail(0)" title="Delete email"><span class="dashicons dashicons-no"></span></button>
									</div>
								);
							})}
						</div>
					</div>
					<div className="form-row right">
						<button type="button" onclick="addEmail()" title="Add a new email">Add Email</button>
					</div>
					<div className="form-row save">
						<button type="button" onclick="saveChanges()">Save Changes</button>
					</div>
				</form>
			</div>}			
		</>
	);
}
