import { withSpring } from "react-native-reanimated";

export function CustomEnteringAnimation() {
	"worklet";
	const animations = {
		transform: [
			{
				scale: withSpring(1, {
					damping: 100,
					stiffness: 500,
				}),
			},
		],
		opacity: withSpring(1, {
			damping: 100,
			stiffness: 500,
		}),
	};
	const initialValues = {
		transform: [{ scale: 0.5 }],
		opacity: 0,
	};

	return {
		initialValues,
		animations,
	};
}

export function CustomExitingAnimation() {
	"worklet";
	const animations = {
		transform: [
			{
				scale: withSpring(0.5, {
					damping: 100,
					stiffness: 500,
				}),
			},
		],
		opacity: withSpring(0, {
			damping: 100,
			stiffness: 500,
		}),
	};
	const initialValues = {
		transform: [{ scale: 1 }],
		opacity: 1,
	};

	return {
		initialValues,
		animations,
	};
}
