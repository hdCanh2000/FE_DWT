import axiosClient from '../../utils/axiosClient';

const getAllKpiNorm = () => {
	return axiosClient({
		method: 'GET',
		url: `/kpiNorm`,
	});
};
const addKpiNorm = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/kpiNorm`,
		data,
	});
};
const updateKpiNorm = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/kpiNorm/${data.id}`,
		data,
	});
};
const deleteKpiNorm = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/kpiNorm/${id}`,
	});
};
export { getAllKpiNorm, addKpiNorm, updateKpiNorm, deleteKpiNorm };
