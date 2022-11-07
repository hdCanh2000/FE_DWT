import axiosClient from '../../utils/axiosClient';

const getAllKey = (params) => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/keys`,
		params,
	});
};

const getKeyById = (id, params) => {
	// lấy danh sách nhân viên
	return axiosClient({
		method: 'GET',
		url: `/api/keys/${id}`,
		params,
	});
};

const addkey = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/keys`,
		data,
	});
};

const updateKey = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/keys/${data.id}`,
		data,
	});
};
const deleteKey = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/keys/${id}`,
	});
};

export { getAllKey, getKeyById, addkey, updateKey, deleteKey };
