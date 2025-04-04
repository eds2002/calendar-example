import { endOfDay, isWithinInterval, startOfDay, subDays } from "date-fns";

import { memo, useCallback, useMemo } from "react";

import { addDays, isSameDay } from "date-fns";
import type { StyleProp, ViewStyle } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
	FadeIn,
	FadeOut,
	useSharedValue,
} from "react-native-reanimated";
import { useCalendar } from "../hooks";

const LazyLoadView = memo(
	({
		item,
		renderDay,
		style,
	}: {
		item: Date;
		renderDay: ({
			day,
			isActive,
		}: { day: Date; isActive: boolean }) => React.ReactNode;
		style?: StyleProp<ViewStyle>;
	}) => {
		const { activeDate, offsetPageLimit } = useCalendar();
		const isActive = useMemo(
			() => isSameDay(item, activeDate),
			[item, activeDate],
		);

		const isWithinRenderableDates = isWithinInterval(item, {
			start: startOfDay(subDays(activeDate, offsetPageLimit)),
			end: endOfDay(addDays(activeDate, offsetPageLimit)),
		});

		if (!isWithinRenderableDates) {
			return null;
		}

		return (
			<Animated.View entering={FadeIn} exiting={FadeOut} style={style}>
				{renderDay({ day: item, isActive })}
			</Animated.View>
		);
	},
);

export const CalendarScreen = ({
	renderDay,
	style,
	containerStyle,
}: {
	renderDay: ({
		day,
		isActive,
	}: { day: Date; isActive: boolean }) => React.ReactNode;
	style?: StyleProp<ViewStyle>;
	containerStyle?: StyleProp<ViewStyle>;
}) => {
	const {
		activeDate,
		days,
		handleInternalDateChange,
		pagerRef,
		stripRef,
		weeks,
	} = useCalendar();

	const activeDateIndex = useMemo(() => {
		const index = days.findIndex((day) => isSameDay(day, activeDate));
		return index >= 0 ? index : 0;
	}, [activeDate, days]);

	const userInitiatedDragRef = useSharedValue(false);

	const pageScrollHandler = useCallback(
		(e: {
			nativeEvent: {
				position: number;
				offset: number;
			};
		}) => {
			const { position, offset } = e.nativeEvent;

			if (!userInitiatedDragRef.value) {
				return;
			}

			let targetIndex: number;

			//   offset is either 0.0 -> 1.0, or 0.9 -> 0.0
			//   we use the offset of the page to determine if the user is swiping right or left
			//   if the offset is greater than 0.6, we consider the swipe to be right
			//   if the offset is less than 0.4, we consider the swipe to be left
			//   The numbers can be adjusted depending on our needs ( speed of changing active day)
			if (offset > 0.6 && position < days.length - 1) {
				targetIndex = position + 1;
			} else if (offset < 0.4 && position === activeDateIndex - 1) {
				targetIndex = position;
			} else if (offset === 0 && position === activeDateIndex) {
				targetIndex = activeDateIndex;
			} else {
				targetIndex = activeDateIndex;
			}

			const day = days[targetIndex];

			if (day && !isSameDay(day, activeDate)) {
				const originalIndex = weeks.findIndex((week) =>
					week.some((d) => isSameDay(d, activeDate)),
				);
				const newIndex = weeks.findIndex((week) =>
					week.some((d) => isSameDay(d, day)),
				);

				if (originalIndex !== newIndex) {
					stripRef.current?.scrollToIndex({
						index: newIndex,
						animated: true,
					});
				}
				handleInternalDateChange(day);
				userInitiatedDragRef.value = false;
			}
		},
		[
			activeDateIndex,
			days,
			activeDate,
			handleInternalDateChange,
			userInitiatedDragRef,
			stripRef,
			weeks,
		],
	);

	return (
		<PagerView
			style={containerStyle}
			initialPage={activeDateIndex}
			onPageScroll={pageScrollHandler} //You could switch this out for onPageSelected, but that is much slower when setting the active date
			onPageScrollStateChanged={(e) => {
				if (e.nativeEvent.pageScrollState === "dragging") {
					userInitiatedDragRef.value = true;
				}
			}}
			orientation="horizontal"
			ref={pagerRef}
			offscreenPageLimit={0}
		>
			{days.map((day) => (
				<LazyLoadView
					key={day.toString()}
					item={day}
					renderDay={renderDay}
					style={style}
				/>
			))}
		</PagerView>
	);
};
