import { createStaticRanges } from 'react-date-range';
import {
	addDays,
	endOfDay,
	startOfDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	startOfWeek,
	endOfWeek,
	startOfYear,
	endOfYear,
	addYears,
} from 'date-fns';

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}
const _isSameDay = _interopRequireDefault(require('date-fns/isSameDay'));
const _differenceInCalendarDays = _interopRequireDefault(
	require('date-fns/differenceInCalendarDays'),
);

const defineds = {
	startOfWeek: startOfWeek(new Date()),
	endOfWeek: endOfWeek(new Date()),
	startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
	endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
	startOfToday: startOfDay(new Date()),
	startOfLastSevenDay: startOfDay(addDays(new Date(), -7)),
	startOfLastThirtyDay: startOfDay(addDays(new Date(), -30)),
	startOfLastNintyDay: startOfDay(addDays(new Date(), -90)),
	endOfToday: endOfDay(new Date()),
	startOfYesterday: startOfDay(addDays(new Date(), -1)),
	endOfYesterday: endOfDay(addDays(new Date(), -1)),
	startOfMonth: startOfMonth(new Date()),
	endOfMonth: endOfMonth(new Date()),
	startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
	endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
	startOfYear: startOfYear(new Date()),
	endOfYear: endOfYear(new Date()),
	startOflastYear: startOfYear(addYears(new Date(), -1)),
	endOflastYear: endOfYear(addYears(new Date(), -1)),
	startAll: endOfYear(addYears(new Date(), -999)),
	endAll: endOfDay(new Date()),
};

const sideBarOptions = () => {
	const customDateObjects = [
		{
			label: 'Hôm nay',
			range: () => ({
				startDate: defineds.startOfToday,
				endDate: defineds.endOfToday,
			}),
		},
		{
			label: 'Hôm qua',
			range: () => ({
				startDate: defineds.startOfYesterday,
				endDate: defineds.endOfYesterday,
			}),
		},
		{
			label: '7 ngày trước',
			range: () => ({
				startDate: defineds.startOfLastSevenDay,
				endDate: defineds.endOfToday,
			}),
		},
		{
			label: 'Tuần này',
			range: () => ({
				startDate: defineds.startOfWeek,
				endDate: defineds.endOfWeek,
			}),
		},
		{
			label: 'Tuần trước',
			range: () => ({
				startDate: defineds.startOfLastWeek,
				endDate: defineds.endOfLastWeek,
			}),
		},
		{
			label: 'Tháng này',
			range: () => ({
				startDate: defineds.startOfMonth,
				endDate: defineds.endOfMonth,
			}),
		},
		{
			label: 'Tháng trước',
			range: () => ({
				startDate: defineds.startOfLastMonth,
				endDate: defineds.endOfLastMonth,
			}),
		},
		{
			label: 'Tất cả',
			range: () => ({
				startDate: defineds.startAll,
				endDate: defineds.endAll,
			}),
		},
	];

	return customDateObjects;
};

const sideBar = sideBarOptions();

const staticRanges = [
	// ...defaultStaticRanges,
	...createStaticRanges(sideBar),
];

//-------------------------------------------------------------
const inputRanges = [
	{
		label: 'ngày đến hôm nay',
		range: function range(value) {
			return {
				startDate: (0, addDays.default)(
					defineds.startOfToday,
					(Math.max(Number(value), 1) - 1) * -1,
				),
				endDate: defineds.endOfToday,
			};
		},
		getCurrentValue: function getCurrentValue(range) {
			if (!(0, _isSameDay.default)(range.endDate, defineds.endOfToday)) return '-';
			if (!range.startDate) return '∞';
			return (0, _differenceInCalendarDays.default)(defineds.endOfToday, range.startDate) + 1;
		},
	},
	{
		label: 'ngày bắt đầu từ hôm nay',
		range: function range(value) {
			const today = new Date();
			return {
				startDate: today,
				endDate: (0, addDays.default)(today, Math.max(Number(value), 1) - 1),
			};
		},
		getCurrentValue: function getCurrentValue(range) {
			if (!(0, _isSameDay.default)(range.startDate, defineds.startOfToday)) return '-';
			if (!range.endDate) return '∞';
			return (0, _differenceInCalendarDays.default)(range.endDate, defineds.startOfToday) + 1;
		},
	},
];
export { staticRanges, inputRanges };
