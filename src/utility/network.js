export const fetchArgs = (method = 'GET', value = null) => {
	const body = value ? JSON.stringify({ value }) : null;

	return {
		method,
		headers: {
			'X-WP-Nonce': window.testProjectApp.nonce,
			'Content-Type': 'application/json'
		},
		body
	};
};
