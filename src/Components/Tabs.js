import { useState } from '@wordpress/element';
import { Settings } from './Settings';
import { Table } from './Table';
import { Graph } from './Graph';
import { __ } from '@wordpress/i18n';

export const Tabs = props => {
	const { data, setData, pluginOptions, setPluginOptions } = props;
	const activeTabFromStorage = localStorage.getItem("activeTabId");
	const [activeTab, setActiveTab] = useState(activeTabFromStorage ? activeTabFromStorage : 'table');

	const tabData = [
		{
			id: 'table',
			tabTitle: __('Table', 'vuejs-challenge'),
			tabContent: <Table data={data} pluginOptions={pluginOptions} />
		},
		{
			id: 'graph',
			tabTitle: __('Graph', 'vuejs-challenge'),
			tabContent: <Graph data={data} setData={setData} pluginOptions={pluginOptions} />
		},
		{
			id: 'settings',
			tabTitle: __('Settings', 'vuejs-challenge'),
			tabContent: <Settings pluginOptions={pluginOptions} setPluginOptions={setPluginOptions} />
		}
	];

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
};
