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
