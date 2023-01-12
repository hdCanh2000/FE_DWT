import axiosClient from '../../utils/axiosClient';

const getAllKpiNorm = (params = {}) => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms`,
		params,
	});
};
const getAllKpiNormbyId = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms/${id}`,
	});
};

const addKpiNorm = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/kpiNorms`,
		data,
	});
};

const updateKpiNorm = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/kpiNorms/${data.id}`,
		data,
	});
};

const deleteKpiNorm = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/kpiNorms/${id}`,
	});
};

const fetchAllKpiNorms = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms`,
		params,
	});
};

const fetchAllSubKpiNorms = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/kpiNorms`,
		data,
	});
};
const exportExcel = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms/exportExcel`,
		responseType: 'blob',
	});
};

const createTarget = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/targets`,
		data,
	});
};

const updateTarget = async (id, data) => {
	const resp = await axiosClient.put(`/api/targets/${id}`, data);
	return resp.data;
};

const updateTargetInfo = async (id, data) => {
	const resp = await axiosClient.put(`/api/targets/target_infos/${id}`, data);
	return resp.data;
};

const deleteTarget = async (id) => {
	const resp = await axiosClient.delete(`/api/targets/${id}`);
	return resp.data;
};

const deleteTargetInfo = async (id) => {
	const resp = await axiosClient.delete(`/api/targets/target_infos/${id}`);
	return resp.data;
};
const getAllUnits = async () => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/units`,
	});
	return resp.data;
};

const getAllPositions = async () => {
	const resp = await axiosClient({
		method: 'GET',
		url: '/api/positions',
	});
	return resp.data;
};

const getAllUsers = async (params = {}) => {
	const resp = await axiosClient({
		method: 'GET',
		url: `/api/users`,
		params,
	});
	return resp.data;
};

const createTargetInfo = async (data) => {
	const resp = await axiosClient({
		method: 'POST',
		url: `/api/targets/target_infos`,
		data,
	});
	return resp.data;
};

export {
	exportExcel,
	getAllKpiNorm,
	addKpiNorm,
	updateKpiNorm,
	deleteKpiNorm,
	fetchAllKpiNorms,
	fetchAllSubKpiNorms,
	getAllKpiNormbyId,
	createTarget,
	getAllUnits,
	getAllPositions,
	updateTarget,
	deleteTarget,
	getAllUsers,
	updateTargetInfo,
	createTargetInfo,
	deleteTargetInfo,
};
