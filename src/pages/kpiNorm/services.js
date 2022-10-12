import axiosClient from '../../utils/axiosClient';

const getAllKpiNorm = () => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms`,
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

export {
	getAllKpiNorm,
	addKpiNorm,
	updateKpiNorm,
	deleteKpiNorm,
	fetchAllKpiNorms,
	fetchAllSubKpiNorms,
	getAllKpiNormbyId,
};
