import axiosClient from '../../utils/axiosClient';

const getAllKeys = () => {
	return axiosClient({
		method: 'GET',
		url: '/keys?_expand=unit',
	});
};

const getKeyByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/keys/${id}`,
	});
};

const addKey = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/keys`,
		data,
	});
};

const updateKey = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/keys/${data.id}`,
		data,
	});
};
const deleteKey = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/keys/${id}`,
	});
};

export { getAllKeys, getKeyByIdWithUser, addKey, updateKey, deleteKey };
