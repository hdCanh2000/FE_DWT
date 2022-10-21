import axiosClient from '../../utils/axiosClient';

const getAllWorktrackByUserId = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/user/${id}`,
	});
};
const deleteWorkTrack = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/worktracks/${id}`,
	});
};

const getAllWorktrack = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks`,
	});
};

const getAllWorktrackByUser = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks`,
	});
};

const getAllWorktrackMe = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/workTrackMe`,
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
		url: `/worktracks/${data.id}`,
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
};
