import type { ReactNode } from "react";

import type { RefObject } from "react";
import type { FlatList } from "react-native";
import type { PagerView } from "react-native-pager-view/lib/typescript/PagerView";

export interface CalendarContextValue {
	activeDate: Date;
	weeks: Date[][];
	days: Date[];
	stripRef: RefObject<FlatList<Date[]>>;
	pagerRef: RefObject<PagerView>;
	handleInternalDateChange: (newDate: Date) => void;
	setPage: (page: number) => void;
	dimWeekends: boolean;
	offsetPageLimit: number;
}

export interface CalendarProviderProps {
	children: ReactNode;
	/**Initial date to set the calendar to */
	initialDate?: Date;
	/**Array of weeks, each week is an array of dates */
	weeks: Date[][];
	/**Callback to call when the active date changes */
	onDateChange?: (date: Date) => void;
	/**Should dim the weekends */
	dimWeekends?: boolean;
	/**N amount of pages left and right to render, 1 means 1 page left, current page, and right page ( 3 total pages), default is 7*/
	offsetPageLimit?: number;
}
