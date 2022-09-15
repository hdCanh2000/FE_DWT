import axiosClient from '../../utils/axiosClient';

const getAllUnits = () => {
	return axiosClient({
		method: 'GET',
		url: '/unit',
	});
};

const getUnitByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/unit/${id}`,
	});
};

const addUnit = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/unit`,
		data,
	});
};

const updateUnit = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/unit/${data.id}`,
		data,
	});
};
const deleteUnit = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/deleteUnit/${id}`,
	});
};

export { getAllUnits, getUnitByIdWithUser, addUnit, updateUnit, deleteUnit };
