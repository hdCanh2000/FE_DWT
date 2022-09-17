import axiosClient from '../../utils/axiosClient';

const getAllKpiNorm = () => {
	return axiosClient({
		method: 'GET',
		url: `/kpiNorms`,
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
export { getAllKpiNorm, addKpiNorm, updateKpiNorm, deleteKpiNorm };
