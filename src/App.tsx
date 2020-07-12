import React, { useState, useEffect } from "react";
import Timer from "react-compound-timer";
import io from "socket.io-client";
import "./App.css";
import { time } from "console";

const ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT || process.env.REACT_APP_LOCAL_ENDPOINT;

let socket = io(ENDPOINT as string);

type Props = {};

const App: React.FC<Props> = () => {
	const [timeleft, setTimeleft] = useState(5999);

	useEffect(() => {
		socket.emit("join", (res: any) => {});
	}, []);

	return (
		<div>
			<Timer
				direction="backward"
				initialTime={timeleft}
				startImmediately={false}
			>
				{({
					start,
					resume,
					pause,
					stop,
					reset,
					getTimerState,
					getTime,
				}: any) => {
					//INITED, STOPPED, PLAYING, PAUSED
					let timerState = getTimerState();

					return (
						<>
							<div>
								<Timer.Days /> days
								<Timer.Hours /> hours
								<Timer.Minutes /> minutes
								<Timer.Seconds /> seconds
							</div>
							<div>{getTimerState()}</div>
							<div>{getTime()}</div>
							<br />
							<div>
								{timerState === "INITED" && (
									<button onClick={start}>Start</button>
								)}
								{timerState === "PLAYING" && (
									<button onClick={pause}>Pause</button>
								)}
								{timerState === "PAUSED" && (
									<button onClick={resume}>Resume</button>
								)}
								{false && <button onClick={stop}>Stop</button>}
								{timerState === "PAUSED" && (
									<button onClick={reset}>Reset</button>
								)}
							</div>
						</>
					);
				}}
			</Timer>
		</div>
	);
};

export default App;
