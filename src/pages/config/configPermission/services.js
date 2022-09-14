import axiosClient from '../../../utils/axiosClient';

const getAllRole = () => {
	return axiosClient({
		method: 'GET',
		url: `/roles`,
	});
};

const addRole = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/roles`,
		data,
	});
};

const updateRole = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/roles/${data.id}`,
		data,
	});
};

const deleteRole = (data) => {
	return axiosClient({
		method: 'DELETE',
		url: `/roles/${data.id}`,
	});
};

export { getAllRole, addRole, updateRole, deleteRole };
