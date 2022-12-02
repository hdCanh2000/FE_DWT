import { isArray, isEmpty } from 'lodash';
import moment from 'moment';

export const calcTotalKPIOfWorkTrack = (worktrack) => {
	const { kpiNorm } = worktrack;
	if (isEmpty(kpiNorm)) return 0;
	return (
		(kpiNorm.kpi_value / kpiNorm.manday) *
		(kpiNorm.quantity ? kpiNorm.quantity : 1) *
		worktrack.quantity
	).toFixed(2);
};

export const calcTotalFromWorkTrackLogs = (workTrackLogs) => {
	if (isEmpty(workTrackLogs) || !isArray(workTrackLogs)) return 0;
	let total = 0;
	workTrackLogs.forEach((workTrackLog) => {
		total += workTrackLog.quantity;
	});
	return total;
};

export const calcCurrentKPIOfWorkTrack = (worktrack) => {
	if (isEmpty(worktrack)) return 0;
	const { workTrackLogs } = worktrack;
	if (isEmpty(workTrackLogs) || !isArray(workTrackLogs)) return 0;
	const totalQuantity = calcTotalFromWorkTrackLogs(workTrackLogs);
	const total = calcTotalKPIOfWorkTrack(worktrack);
	return ((totalQuantity / worktrack.quantity) * total).toFixed(2);
};

export const calcProgressWokTrack = (worktrack) => {
	if (isEmpty(worktrack)) return 0;
	const { workTrackLogs } = worktrack;
	if (isEmpty(workTrackLogs) || !isArray(workTrackLogs)) return 0;
	let total = 0;
	workTrackLogs.forEach((workTrackLog) => {
		total += workTrackLog.quantity;
	});
	return Math.round((total / worktrack.quantity) * 100) || 0;
};

const calcTotalKPIOfWorkTrackItem = (worktrack) => {
	const { kpiNorm } = worktrack;
	if (isEmpty(kpiNorm)) return 0;
	return (
		(kpiNorm.kpi_value / kpiNorm.manday) *
		(kpiNorm.quantity ? kpiNorm.quantity : 1) *
		worktrack.quantity
	);
};

const calcCurrentKPIOfWorkTrackItem = (worktrack) => {
	if (isEmpty(worktrack)) return 0;
	const { workTrackLogs } = worktrack;
	if (isEmpty(workTrackLogs) || !isArray(workTrackLogs)) return 0;
	const totalQuantity = calcTotalFromWorkTrackLogs(workTrackLogs);
	const total = calcTotalKPIOfWorkTrack(worktrack);
	return (totalQuantity / worktrack.quantity) * total;
};

export const calcTotalKPIWorkTrackByUser = (worktracks) => {
	const { workTracks } = worktracks;
	if (isEmpty(workTracks) || !isArray(workTracks)) return 0;
	let total = 0;
	workTracks
		.filter((item) => {
			return item?.workTrackUsers?.isResponsible === true;
		})
		.forEach((worktrack) => {
			const totalKPIOfWorktrack = calcTotalKPIOfWorkTrackItem(worktrack);
			total += totalKPIOfWorktrack;
		});
	return total.toFixed(2);
};

export const calcTotalCurrentKPIWorkTrackByUser = (worktracks) => {
	const { workTracks } = worktracks;
	if (isEmpty(workTracks) || !isArray(workTracks)) return 0;
	let total = 0;
	workTracks
		.filter((item) => {
			return item?.workTrackUsers?.isResponsible === true;
		})
		.forEach((worktrack) => {
			const totalKPIOfWorktrack = calcCurrentKPIOfWorkTrackItem(worktrack);
			total += totalKPIOfWorktrack;
		});
	return total.toFixed(2);
};
const loop = (data) => {
	let totals = 0.0;
	data.forEach((ele) => {
		totals += parseFloat(ele?.totalKPI, 10);
		if (!isEmpty(ele?.subRows)) {
			totals += loop(ele?.subRows);
		}
	});
	return totals;
};
export const calcTotalKPIAllWorkTrack = (worktracks) => {
	if (isEmpty(worktracks) || !isArray(worktracks)) return 0;
	// eslint-disable-next-line prefer-const
	return loop(worktracks).toFixed(2);
};

export const calcTotalCurrentKPIAllWorkTrack = (worktracks) => {
	if (isEmpty(worktracks) || !isArray(worktracks)) return 0;
	let total = 0;
	worktracks.forEach((worktrack) => {
		const totalKPIOfWorktrack = calcCurrentKPIOfWorkTrackItem(worktrack);
		total += totalKPIOfWorktrack;
	});
	return total.toFixed(2);
};

export const calcProgressTask = (worktrack) => {
	if (!worktrack.quantity) return '--';
	const progress = Math.round(
		(calcCurrentKPIOfWorkTrack(worktrack) / calcTotalKPIOfWorkTrack(worktrack)) * 100,
	);
	return `${progress}%`;
};

export const calcProgressWorktrack = (worktrack) => {
	return (
		Math.round(
			(calcTotalCurrentKPIWorkTrackByUser(worktrack) /
				calcTotalKPIWorkTrackByUser(worktrack)) *
				100,
		) || 0
	);
};

export const calcRealKPIPointByUser = (worktrack) => {
	let total = 0;
	if (isEmpty(worktrack)) return 0;
	const { workTracks } = worktrack;
	if (isEmpty(workTracks) || !isArray(workTracks)) return 0;
	workTracks.forEach((item) => {
		total += item.kpi_point;
	});
	return total || 0;
};

export const createDataTreeTable = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { ...aData, subRows: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId]?.subRows.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

export const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

// const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysOfWeekVN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const columns = (selectedDate) => {
	const startDate = moment(selectedDate && selectedDate[0].startDate);
	const timeEnd = moment(selectedDate && selectedDate[0].endDate);
	const diff = timeEnd.diff(moment(startDate));
	const diffDuration = moment.duration(diff);
	const result = [];
	for (let i = 0; i <= diffDuration.days(); i += 1) {
		const cloneDate = startDate.clone();
		const currentDate = cloneDate.add(i, 'days');
		result.push({
			day: currentDate.format('DD'),
			date: currentDate.format('DD-MM-YYYY'),
			textDate: daysOfWeekVN[currentDate.day()],
			color: currentDate.day() === 0 ? 'danger' : '',
		});
	}
	return result;
};

export const renderColor = (status) => {
	switch (status) {
		case 'inProgress':
			return '#ffc000';
		case 'completed':
			return '#c5e0b3';
		case 'expired':
			return '#f97875';
		default:
			return 'transparent';
	}
};

export const convertDate = (date = '') => {
	const dateStr = date.toLocaleDateString().split('/');
	const y = dateStr[2];
	const m = dateStr[1];
	const d = dateStr[0];
	return `${d >= 10 ? d : `0${d}`}/${m >= 10 ? m : `0${m}`}/${y}`;
};
