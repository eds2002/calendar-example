import { Text, View } from "react-native";

import { Calendar } from "@/components/week-calendar";
import { useGenerateWeeks } from "@/components/week-calendar/utils";
import { subMonths } from "date-fns";
import { memo, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Day = memo(({ day, isActive }: { day: Date; isActive: boolean }) => {
	return (
		<View
			style={{
				backgroundColor: "lightgray",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text style={{ textAlign: "center", fontSize: 16, paddingVertical: 6 }}>
				{day.toLocaleDateString()}
			</Text>
			<Text
				style={{
					textAlign: "center",
					fontSize: 14,
					paddingVertical: 6,
					opacity: 0.5,
				}}
			>
				{isActive ? "Active" : "Inactive"}
			</Text>
		</View>
	);
});

export default function HomeScreen() {
	const weeks = useGenerateWeeks(subMonths(new Date(), 5), new Date());

	const renderDay = ({ day, isActive }: { day: Date; isActive: boolean }) => {
		return <Day day={day} isActive={isActive} />;
	};

	return (
		<SafeAreaView>
			<Calendar
				weeks={weeks}
				offsetPageLimit={7}
				onDateChange={(date) => {
					console.log(`New date: ${date.toLocaleDateString()}`);
				}}
				dimWeekends
				initialDate={new Date()}
			>
				<Calendar.Strip style={{ paddingVertical: 16 }} />
				<Calendar.Screen
					containerStyle={{
						height: 600,
					}}
					renderDay={renderDay}
				/>
			</Calendar>
		</SafeAreaView>
	);
}
