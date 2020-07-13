import React, { useState, useEffect } from "react";
import Timer from "react-compound-timer";
import io from "socket.io-client";
import "./App.css";
import { time } from "console";

type Function = (...args: any) => any;

const ENDPOINT =
	process.env.REACT_APP_SERVER_ENDPOINT ||
	process.env.REACT_APP_LOCAL_ENDPOINT ||
	"localhost:2000";

let socket = io(ENDPOINT as string);

const callAndEmit = (
	{ callback, args }: { callback: (...args: any) => any; args?: any[] },
	eventName: string
) => {
	return () => {
		if (Array.isArray(args)) {
			callback(...args);
		} else {
			callback();
		}
		socket.emit(eventName);
	};
};

const stopAndReset = (stop: () => void, reset: () => void) => {
	return () => {
		stop();
		reset();
	};
};

type Props = {};

const App: React.FC<Props> = () => {
	const [timeleft, setTimeleft] = useState(5999);
	const [eventStart, setEventStart] = useState(false);
	const [eventPause, setEventPause] = useState(false);
	const [eventResume, setEventResume] = useState(false);
	const [eventStopAndReset, setEventStopAndReset] = useState(false);
	const [msg, setMsg] = useState("hi");

	useEffect(() => {
		socket.emit("join", (res: any) => {
			setMsg(() => res.msg);
		});
	}, []);

	useEffect(() => {
		socket.on("start", () => {
			setEventStart(() => true);
		});

		socket.on("pause", () => {
			setEventPause(() => true);
		});

		socket.on("resume", () => {
			setEventResume(() => true);
		});

		socket.on("stopAndReset", () => {
			setEventStopAndReset(() => true);
		});
	});

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
				}: {
					start: Function;
					resume: Function;
					pause: Function;
					stop: Function;
					reset: Function;
					getTimerState: Function;
					getTime: Function;
				}) => {
					//INITED, STOPPED, PLAYING, PAUSED
					let timerState = getTimerState();

					if (getTime() <= 0) stopAndReset(stop, reset)();

					if (eventStart) {
						setEventStart(() => false);
						start();
					}
					if (eventPause) {
						setEventPause(() => false);
						pause();
					}
					if (eventResume) {
						setEventResume(() => false);
						resume();
					}
					if (eventStopAndReset) {
						setEventStopAndReset(() => false);
						stopAndReset(stop, reset)();
					}

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
								{(timerState === "INITED" || timerState === "STOPPED") &&
									getTime() > 0 && (
										<button onClick={callAndEmit({ callback: start }, "start")}>
											Start
										</button>
									)}
								{timerState === "PLAYING" && (
									<button onClick={callAndEmit({ callback: pause }, "pause")}>
										Pause
									</button>
								)}
								{timerState === "PAUSED" && (
									<button onClick={callAndEmit({ callback: resume }, "resume")}>
										Resume
									</button>
								)}
								{false && <button onClick={stop}>Stop</button>}
								{timerState === "PAUSED" && (
									<button
										onClick={callAndEmit(
											{ callback: stopAndReset, args: [stop, reset] },
											"stopAndReset"
										)}
									>
										Reset
									</button>
								)}
							</div>
							<div>{msg}</div>
						</>
					);
				}}
			</Timer>
		</div>
	);
};

export default App;
