import axiosClient from '../../utils/axiosClient';

const getAllUnits = (params) => {
	return axiosClient({
		method: 'GET',
		url: '/api/units',
		params,
	});
};

const getUnitByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/units/${id}`,
	});
};

const addUnit = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/units`,
		data,
	});
};

const updateUnit = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/units/${data.id}`,
		data,
	});
};
const deleteUnit = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/units/${id}`,
	});
};

export { getAllUnits, getUnitByIdWithUser, addUnit, updateUnit, deleteUnit };
