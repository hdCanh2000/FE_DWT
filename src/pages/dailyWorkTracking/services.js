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
/* when this api is called backend api will create an xls file then return the filename */
const downLoadWorkTrack = async (params = {}) => {
	const url = `/api/worktracks/export_all`;
	return axiosClient.get(url, { params });
};

const getListTarget = async (params) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/targets`,
		params,
	});
	return resp.data;
};

const getListTargetInfos = async (params) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/targets/target_infos`,
		params,
	});
	return resp.data;
};

const exportTargets = async (params) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/targets/export`,
		params,
	});
	return resp.data;
};

const getUserDetail = async (id) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/users/${id}`,
	});
	return resp.data.data;
};

const createTargetLog = async (data) => {
	const resp = await axiosClient({
		method: 'POST',
		url: `/api/targets/target_logs`,
		data,
	});
	return resp.data;
};

const deleteTargetLog = async (id) => {
	const resp = await axiosClient({
		method: 'DELETE',
		url: `/api/targets/target_logs/${id}`,
	});
	return resp.data;
};

const createDailyWorkLog = async (data) => {
	const resp = await axiosClient({
		method: 'POST',
		url: `/api/dailyWorks/logs`,
		data,
	});
	return resp.data;
};

const uploadFile = async (data) => {
	const resp = await axiosClient({
		method: 'POST',
		url: `/api/targets/upload`,
		data,
	});
	return resp.data;
};

const getDailyWorks = async (params) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/dailyWorks`,
		params,
	});
	return resp.data;
};

const createUnit = async (data) => {
	const resp = await axiosClient({
		method: 'POST',
		url: `/api/units`,
		data,
	});
	return resp.data;
};

const getAllReport = async (params) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/keysReport`,
		params,
	});
	return resp.data;
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
	downLoadWorkTrack,
	getListTarget,
	getUserDetail,
	createTargetLog,
	uploadFile,
	getDailyWorks,
	createDailyWorkLog,
	createUnit,
	deleteTargetLog,
	exportTargets,
	getListTargetInfos,
	getAllReport,
};
