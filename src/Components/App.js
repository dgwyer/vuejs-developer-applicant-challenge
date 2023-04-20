import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { fetchArgs } from '../utility/network';
import { Tabs } from './Tabs';

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-api-data/`, fetchArgs())
				.then(response => response.json())
				.then(json => {
					setData(JSON.parse(json));
				});
		};
		getData();
	}, [setData]);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-plugin-settings/`, fetchArgs())
				.then(response => response.json())
				.then(json => {
					if (json.success) {
						setPluginOptions(JSON.parse(json.data));
					}
				});
		};
		getData();
	}, [setPluginOptions]);

	return (
		<>
			{!data && !pluginOptions && <div className="spinner-wrapper"><Spinner /></div>}
			{data && <div>
				<Tabs data={data} setData={setData} pluginOptions={pluginOptions} setPluginOptions={setPluginOptions} />
			</div>}
		</>
	);
}
