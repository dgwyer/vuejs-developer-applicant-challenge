import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import{ Spinner } from '@wordpress/components';

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-api-data/`)
				.then(response => response.json())
				.then(json => {
					setData(json);
					console.log(json)
				});
		};
		getData();
	}, []);

	useEffect(() => {
		const getData = () => {
			fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/get-plugin-settings/`)
				.then(response => response.json())
				.then(json => {
					setPluginOptions(json);
					console.log(json)
				});
		};
		getData();
	}, []);

	return (
		<>
			{!data && !pluginOptions && <Spinner/>}
			{data && <div>{JSON.stringify(data)}</div>}
			<hr/>
			{pluginOptions && <div>{JSON.stringify(pluginOptions)}</div>}
			<span>{__('Hello from JavaScript!', 'vuejs-challenge')}</span>
			{/* <button onClick={getData}>Get data</button> */}
		</>
	);
}
