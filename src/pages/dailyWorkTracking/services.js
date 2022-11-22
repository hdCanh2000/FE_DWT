import axiosClient from '../../utils/axiosClient';

const getAllWorktrackByUserId = (data) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/user/${data.id}`,
		params: data.params,
	});
};
const deleteWorkTrack = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/worktracks/${id}`,
	});
};

const getAllWorktrack = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks`,
		params,
	});
};

const getAllWorktrackByUser = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks`,
	});
};

const getAllWorktrackMe = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/workTrackMe`,
		params,
	});
};

const getWorktrackById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/${id}`,
	});
};

const addWorktrack = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/worktracks`,
		data,
	});
};

const updateWorktrack = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/worktracks/${data.id}`,
		data,
	});
};

const addWorktrackLog = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/worktrackLogs`,
		data,
	});
};

const updateWorktrackLog = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/worktrackLogs/${data.id}`,
		data,
	});
};

const uploadFileReport = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/file/upload`,
		data,
	});
};

const downloadFileReport = (name) => {
	return axiosClient({
		method: 'GET',
		url: `/api/file/download/${name}`,
	});
};

export {
	getAllWorktrackByUserId,
	getAllWorktrackByUser,
	addWorktrack,
	updateWorktrack,
	addWorktrackLog,
	updateWorktrackLog,
	getAllWorktrack,
	getWorktrackById,
	deleteWorkTrack,
	getAllWorktrackMe,
	uploadFileReport,
	downloadFileReport,
};
