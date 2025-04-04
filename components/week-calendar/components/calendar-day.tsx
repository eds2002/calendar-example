import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

import { useCalendar } from "../hooks";

import { isSameDay, isWeekend } from "date-fns";
import { CustomEnteringAnimation, CustomExitingAnimation } from "../animations";
import { getTheNameOfTheDay } from "../utils";

export const CalendarDay = memo(({ day, onPress }: CalendarDayProps) => {
	const today = new Date();
	const isToday = isSameDay(day, today);
	const { activeDate, dimWeekends } = useCalendar();

	const isSelected = isSameDay(day, activeDate);

	const animatedActiveDayIndicatorStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: "purple",
		};
	});

	const animatedTextStyle = useAnimatedStyle(() => {
		// Define base colors

		// Determine the appropriate text color based on day state
		let textColor: string;
		if (isSelected) {
			textColor = "#FFF";
		} else {
			textColor = isToday ? "purple" : "black";
		}

		return {
			color: withTiming(textColor),
		};
	});

	const style = styles(isWeekend(day), isToday, dimWeekends);
	return (
		<Pressable style={style.dayContainer} onPress={onPress}>
			<Text style={style.dayText}>{getTheNameOfTheDay(day).slice(0, 1)}</Text>
			<View style={style.dayNumberContainer}>
				<Animated.Text style={[style.dayNumberText, animatedTextStyle]}>
					{day.getDate()}
				</Animated.Text>
				{isSelected && (
					<Animated.View
						entering={CustomEnteringAnimation}
						exiting={CustomExitingAnimation}
						style={[
							{
								borderRadius: 99,
								backgroundColor: "purple",
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
							},
							animatedActiveDayIndicatorStyle,
						]}
					/>
				)}
			</View>
		</Pressable>
	);
});

interface CalendarDayProps {
	day: Date;
	onPress: () => void;
}

const styles = (isWeekend: boolean, isToday: boolean, dimWeekends: boolean) =>
	StyleSheet.create({
		dayContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			gap: 8,
		},
		dayText: {
			fontSize: 9,
			fontWeight: "500",
			opacity: isWeekend && dimWeekends ? 0.5 : 1,
			color: "black",
		},
		dayNumberText: {
			fontSize: 16,
			fontWeight: "500",
			color: isToday ? "purple" : "black",
			zIndex: 1,
		},
		dayNumberContainer: {
			width: 35,
			height: 35,
			borderRadius: 99,
			justifyContent: "center",
			alignItems: "center",
		},
	});
