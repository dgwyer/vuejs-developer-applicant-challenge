import { v4 as uuidv4 } from 'uuid';

export const Table = (props) => {
	const { data, pluginOptions } = props;
	const numrows = pluginOptions?.numrows;

	return (numrows &&
		<div id="table">
			<h2>{data?.table?.title}</h2>
			<table>
				<thead>
					<tr>
						{data?.table?.data?.headers.map((header) => {
							return (
								<th key={header.toLowerCase()}>{header}</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{data?.table?.data?.rows.map((row, index) => {
						const date = new Date(row?.date);
						const formattedDate = date.toLocaleString();

						return (index >= numrows ? null :
							<tr key={row?.id}>
								<td>{row?.id}</td>
								<td>{row?.url}</td>
								<td>{row?.title}</td>
								<td>{row?.pageviews}</td>
								<td>{pluginOptions?.humandate ? formattedDate : row?.date}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div>
				{pluginOptions?.emails && (
					<>
						<h2>Emails</h2>
						<ul>
							{pluginOptions?.emails.map(email => {
								return <li key={uuidv4()}>{email}</li>;
							})}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};
