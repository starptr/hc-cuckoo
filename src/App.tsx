import React from "react";
import Timer from "react-compound-timer";
import "./App.css";

type Props = {};

const App: React.FC<Props> = () => {
	return (
		<Timer>
			<Timer.Seconds />
		</Timer>
	);
};

export default App;
