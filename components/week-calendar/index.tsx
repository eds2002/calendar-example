import { CalendarProvider } from "./components/calendar-provider";
import { CalendarScreen as ScreenComponent } from "./components/calendar-screen";
import { CalendarStrip as StripComponent } from "./components/calendar-strip";

export const Calendar = Object.assign(CalendarProvider, {
	Strip: StripComponent,
	Screen: ScreenComponent,
});
