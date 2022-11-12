import { isArray, isEmpty } from 'lodash';

export const calcTotalKPIOfWorkTrack = (worktrack) => {
	const { kpiNorm } = worktrack;
	if (isEmpty(kpiNorm)) return 0;
	return ((kpiNorm.kpi_value / kpiNorm.quantity) * worktrack.quantity).toFixed(2);
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
	return (kpiNorm.kpi_value / kpiNorm.quantity) * worktrack.quantity;
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

export const calcTotalKPIAllWorkTrack = (worktracks) => {
	if (isEmpty(worktracks) || !isArray(worktracks)) return 0;
	let total = 0;
	worktracks.forEach((worktrack) => {
		const totalKPIOfWorktrack = calcTotalKPIOfWorkTrackItem(worktrack);
		total += totalKPIOfWorktrack;
	});
	return total.toFixed(2);
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

export const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
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
