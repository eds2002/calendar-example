import { isSameDay } from "date-fns";
import { memo, useCallback, useMemo } from "react";
import {
	Dimensions,
	type StyleProp,
	StyleSheet,
	View,
	type ViewStyle,
	type ViewToken,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useCalendar } from "../hooks";
import { CalendarDay } from "./calendar-day";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WeekView = memo(
	({
		item,
	}: {
		item: Date[];
	}) => {
		const { handleInternalDateChange, setPage, days, activeDate } =
			useCalendar();

		const renderDay = useCallback(
			(day: Date) => {
				const handlePress = () => {
					handleInternalDateChange(day);
					setPage(days.findIndex((d) => isSameDay(d, day)));
				};

				return (
					<CalendarDay
						key={day.toISOString()}
						onPress={handlePress}
						day={day}
					/>
				);
			},
			[handleInternalDateChange, setPage, days],
		);
		return (
			<View style={styles.weekContainer}>
				{item.map((day) => renderDay(day))}
			</View>
		);
	},
);

export const CalendarStrip = ({
	style,
	contentContainerStyle,
}: {
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
}) => {
	const {
		days,
		weeks,
		activeDate,
		handleInternalDateChange,
		stripRef,
		setPage,
	} = useCalendar();

	const initialScrollIndex = useMemo(() => {
		const index = weeks.findIndex((week) =>
			week.some((day) => isSameDay(day, activeDate)),
		);
		return index >= 0 ? index : 0;
	}, [weeks, activeDate]);

	const getItemLayout = useCallback(
		(_data: ArrayLike<Date[]> | null | undefined, index: number) => {
			return {
				length: SCREEN_WIDTH, // Total space taken by item + gap
				offset: SCREEN_WIDTH * index, // Correct offset considering the gap
				index,
			};
		},
		[], // SCREEN_WIDTH is the only external dependency here
	);

	const previousIndexRef = useSharedValue(initialScrollIndex);
	const userInitiatedDragRef = useSharedValue(false);
	const onViewableItemsChanged = useCallback(
		async ({ viewableItems }: { viewableItems: ViewToken<Date[]>[] }) => {
			// Guard against race conditions ( screen and strip components )
			if (!userInitiatedDragRef.value) return;

			const viewableItem = viewableItems.find((item) => item.isViewable);

			const currentIndex = viewableItem?.index;
			const availableDates = viewableItem?.item;
			const previousAvailableDates = weeks[previousIndexRef.value];
			const previousActiveWeekLastDay = previousAvailableDates?.at(-1);
			const previousActiveWeekFirstDay = previousAvailableDates?.at(0);

			// Guard against null index before proceeding
			if (currentIndex == null || !availableDates) return;

			// Determine direction based on valid currentIndex
			const direction =
				currentIndex > previousIndexRef.value ? "forward" : "backward";

			let newDate: Date | null = null;

			const indexOfCurrentActiveDate =
				previousAvailableDates?.findIndex((day) =>
					isSameDay(day, activeDate),
				) ?? 0;

			if (direction === "forward") {
				if (!previousActiveWeekLastDay) {
					console.warn(
						"onViewableItemsChanged (forward): Could not find last day of previous week.",
					);
					return;
				}

				const wasPreviousWeekLastDaySelected = isSameDay(
					previousActiveWeekLastDay,
					activeDate,
				);

				// Ensure we have a valid date by providing a fallback
				const targetIndex = wasPreviousWeekLastDaySelected
					? 0
					: indexOfCurrentActiveDate;
				newDate = availableDates[targetIndex] ?? availableDates[0] ?? null;
			} else {
				if (!previousActiveWeekFirstDay) {
					console.warn(
						"onViewableItemsChanged (backward): Could not find first day of current week.",
					);
					return;
				}

				const wasPreviousWeekFirstDaySelected = isSameDay(
					previousActiveWeekFirstDay,
					activeDate,
				);

				const targetIndex = wasPreviousWeekFirstDaySelected
					? 6
					: indexOfCurrentActiveDate;

				newDate = availableDates[targetIndex] ?? availableDates[6] ?? null;
			}

			if (newDate && !isSameDay(newDate, activeDate)) {
				handleInternalDateChange(newDate);
				setPage(days.findIndex((d) => isSameDay(d, newDate)));
				userInitiatedDragRef.value = false;
			}
			previousIndexRef.value = currentIndex;
		},
		[
			activeDate,
			days,
			handleInternalDateChange,
			setPage,
			userInitiatedDragRef,
			previousIndexRef,
			weeks,
		],
	);

	const renderWeek = useCallback(
		({ item: week }: { item: Date[] }) => <WeekView item={week} />,
		[],
	);

	return (
		<Animated.FlatList
			ref={stripRef}
			data={weeks}
			renderItem={renderWeek}
			onTouchStart={() => {
				userInitiatedDragRef.value = true;
			}}
			onTouchCancel={() => {
				userInitiatedDragRef.value = false;
			}}
			keyExtractor={(_, index) => `week-${index}`}
			onViewableItemsChanged={onViewableItemsChanged}
			horizontal
			viewabilityConfig={{
				itemVisiblePercentThreshold: 50,
				minimumViewTime: 0,
			}}
			disableIntervalMomentum
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			style={style}
			contentContainerStyle={contentContainerStyle}
			initialScrollIndex={initialScrollIndex}
			getItemLayout={getItemLayout}
			decelerationRate="fast"
			// Performance optimizations
			initialNumToRender={1}
			maxToRenderPerBatch={1}
			windowSize={1}
			removeClippedSubviews={true}
			updateCellsBatchingPeriod={50}
			onEndReachedThreshold={0.5}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
			}}
		/>
	);
};

const styles = StyleSheet.create({
	weekContainer: {
		width: Dimensions.get("window").width,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	dayContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
	},
});
