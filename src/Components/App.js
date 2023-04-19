import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { Settings } from './Settings';
import { Table } from './Table';
import { Graph } from './Graph';

const Tabs = props => {
	const { tabData } = props;
	const activeTabFromStorage = localStorage.getItem("activeTabId");
	const [activeTab, setActiveTab] = useState(activeTabFromStorage ? activeTabFromStorage : 'table');

	const handleTabClick = (tabId) => {
		setActiveTab(tabId);
		localStorage.setItem("activeTabId", tabId);
	};

	const titles = tabData.map((item) =>
		<a onClick={() => handleTabClick(item.id)} className={activeTab === item.id ? "tab-title tab-title-active" : "tab-title"}>{item.tabTitle}</a>
	);
	const content = tabData.map((item) =>
		<p style={activeTab === item.id ? {} : { display: 'none' }}>{item.tabContent}</p>
	);

	return (
		<div id="tabs">
			<div className="tab-titles">
				{titles}
			</div>
			<div className="tab-content">
				{content}
			</div>
		</div>
	)
}

export const App = () => {
	const [data, setData] = useState(null);
	const [pluginOptions, setPluginOptions] = useState(null);
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
					setData(JSON.parse(json));
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

	const tabData = [
		{
			id: 'table',
			tabTitle: "Table",
			tabContent: <Table data={data} pluginOptions={pluginOptions} />
		},
		{
			id: 'graph',
			tabTitle: "Graph",
			tabContent: <Graph data={data} setData={setData} pluginOptions={pluginOptions} />
		},
		{
			id: 'settings',
			tabTitle: "Settings",
			tabContent: <Settings pluginOptions={pluginOptions} setPluginOptions={setPluginOptions} />
		}
	];

	return (
		<>
			{!data && !pluginOptions && <div className="spinner-wrapper"><Spinner /></div>}
			{data && <div>
				<Tabs tabData={tabData} />
			</div>}
		</>
	);
}
