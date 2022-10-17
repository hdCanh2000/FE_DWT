import axiosClient from '../../utils/axiosClient';

const getAllDepartment = () => {
	return axiosClient({
		method: 'GET',
		url: '/api/departments',
	});
};

const getAllDepartmentWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/api/departments',
	});
};

const getDepartmentByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/departments/${id}`,
	});
};
const deleteDepartment = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/departments/${id}`,
	});
};

const addDepartment = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/departments`,
		data,
	});
};

const updateDepartment = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/departments/${data.id}`,
		data,
	});
};

export {
	getAllDepartment,
	getAllDepartmentWithUser,
	getDepartmentByIdWithUser,
	addDepartment,
	updateDepartment,
	deleteDepartment,
};
