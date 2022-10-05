import axiosClient from '../../utils/axiosClient';

const getAllDepartment = () => {
	return axiosClient({
		method: 'GET',
		url: '/departments',
	});
};

const getAllDepartmentWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/departments',
	});
};

const getDepartmentByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/departments/${id}`,
	});
};

const addDepartment = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/departments`,
		data,
	});
};

const updateDepartment = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/departments/${data.id}`,
		data,
	});
};

export {
	getAllDepartment,
	getAllDepartmentWithUser,
	getDepartmentByIdWithUser,
	addDepartment,
	updateDepartment,
};
