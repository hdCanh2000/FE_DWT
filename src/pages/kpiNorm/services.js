import axiosClient from '../../utils/axiosClient';

const getAllKpiNorm = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/kpiNorms?_expand=department`,
		params,
	});
};

const addKpiNorm = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/kpiNorms`,
		data,
	});
};

const updateKpiNorm = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/kpiNorms/${data.id}`,
		data,
	});
};

const deleteKpiNorm = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/kpiNorms/${id}`,
	});
};

const fetchAllKpiNorms = (params) => {
	return axiosClient({
		method: 'GET',
		url: `/api/kpiNorms?_expand=department`,
		params,
	});
};

export { getAllKpiNorm, addKpiNorm, updateKpiNorm, deleteKpiNorm, fetchAllKpiNorms };
