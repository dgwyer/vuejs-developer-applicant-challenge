import { version } from "react";
import { createRoot, render } from "@wordpress/element";
import { App } from "./Components/App";
import "./app.scss";

const domNode = document.getElementById('test-project-app');

// Initialize React correctly depending on the version.
if (parseInt(version) < 18) {
	render(<App />, domNode);
} else {
	const root = createRoot(domNode);
	root.render(<App />);
}
