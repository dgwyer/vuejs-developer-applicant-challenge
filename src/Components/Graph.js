export const Graph = (props) => {
	const { data } = props;

	// Convert indexed object with numbered keys, to an array of values and return the max value.
	const maxValue = Math.max(...Object.values(data?.graph).map(bar => bar.value));
	const offset = 55;

	return (
		<div id="table">
			<svg width="400" height="320">
				{Object.values(data?.graph).map((bar, index) => {
					return <g key={index}>
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
							y={270 - (bar.value * 200) / maxValue}
							textAnchor="middle"
							fill="white"
							fontSize="14"
						>
							{bar.value}
						</text>
					</g>;
				})}
				<line x1="20" y1="250" x2="20" y2="20" stroke="black" strokeWidth="2" />
				<line x1="20" y1="250" x2="600" y2="250" stroke="black" strokeWidth="2" />
				<text x="10" y="120" textAnchor="middle" fill="black" fontSize="14" transform="rotate(-90, 10, 120)" fontWeight="bold">Value</text>
				<text x="220" y="310" textAnchor="middle" fill="black" fontSize="14" fontWeight="bold">Date</text>
			</svg>
		</div>
	);
};
