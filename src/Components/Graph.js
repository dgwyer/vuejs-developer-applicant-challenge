import { v4 as uuidv4 } from 'uuid';

export const Graph = (props) => {
	const { data, setData } = props;

	// Convert indexed data object with numbered keys, to an array of values and return the max value.
	const maxValue = Math.max(...Object.values(data?.graph).map(bar => bar.value));
	const offset = 55;

	const refreshData = () => {
		const fetchArgs = {
			headers: {
				'X-WP-Nonce': window.testProjectApp.nonce,
			}
		};
		fetch(`${window.testProjectApp.site}/wp-json/vuejs-challenge/v1/refresh-api-data/`, fetchArgs)
			.then(response => response.json())
			.then(json => {
				setData(JSON.parse(json));
			});
	};

	return (
		<div id="graph">
			<svg width="400" height="320">
				<rect
					x="20"
					y="20"
					width="400"
					height="230"
					fill="rgba(255,255,255,0.4)"
				/>
				{Object.values(data?.graph).map((bar, index) => {
					return <g key={uuidv4()}>
						<rect
							x={20 + index * offset}
							y={250 - (bar.value * 200) / maxValue}
							width="50"
							height={(bar.value * 200) / maxValue}
							fill="#3498db"
						/>
						<text
							x={index * offset}
							y={300}
							textAnchor="middle"
							fill="black"
							fontSize="10"
							transform={`rotate(-35, ${index * offset}, 300)`}
						>
							<tspan x={45 + index * offset}>
								{new Date(bar.date * 1000).toLocaleDateString()}
							</tspan>
						</text>
						<text
							x={45 + index * offset}
							y={245 - (bar.value * 200) / maxValue}
							textAnchor="middle"
							fill="black"
							fontSize="12"
						>
							{bar.value}
						</text>
					</g>;
				})}
				<line x1="20" y1="250" x2="20" y2="20" stroke="black" strokeWidth="1" />
				<line x1="20" y1="250" x2="600" y2="250" stroke="black" strokeWidth="1" />
				<text x="10" y="120" textAnchor="middle" fill="black" fontSize="14" transform="rotate(-90, 10, 120)" fontWeight="bold">Value</text>
				<text x="210" y="310" textAnchor="middle" fill="black" fontSize="14" fontWeight="bold">Date</text>
			</svg>
			<div><button onClick={refreshData} title="Refresh chart data">Refresh</button></div>			
		</div>
	);
};