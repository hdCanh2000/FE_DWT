import axiosClient from '../../utils/axiosClient';

const getAllUnits = () => {
	return axiosClient({
		method: 'GET',
		url: '/units',
	});
};

const getUnitByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/units/${id}`,
	});
};

const addUnit = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/units`,
		data,
	});
};

const updateUnit = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/units/${data.id}`,
		data,
	});
};
const deleteUnit = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/units/${id}`,
	});
};

export { getAllUnits, getUnitByIdWithUser, addUnit, updateUnit, deleteUnit };
