import { useContext } from "react";
import { CalendarContext } from "./components/calendar-provider";

export const useCalendar = () => {
	const context = useContext(CalendarContext);
	if (!context) {
		throw new Error("useCalendar must be used within a Calendar provider");
	}
	return context;
};
