import { eachWeekOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { useMemo } from "react";

export const useGenerateWeeks = (startDate: Date, endDate: Date): Date[][] => {
	return useMemo(() => {
		const startDateTime = startOfWeek(startDate, { weekStartsOn: 1 });
		const endDateTime = endOfWeek(endDate, { weekStartsOn: 1 });

		const weeks = eachWeekOfInterval({
			start: startDateTime,
			end: endDateTime,
		});

		// Generate an array of 7 days for each week
		const weeksArray = weeks.map((weekStart) => {
			const days: Date[] = [];
			const currentWeekStart = new Date(weekStart);

			// For each week, generate 7 days starting from the week start date
			for (let i = 0; i < 7; i++) {
				const day = new Date(currentWeekStart);
				day.setDate(day.getDate() + i);
				days.push(day);
			}

			return days;
		});

		return weeksArray;
	}, [endDate, startDate]);
};

export const getTheNameOfTheDay = (date: Date) => {
	return format(date, "EEEE");
};
