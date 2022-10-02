import axiosClientNode from '../../utils/axiosClientNode';

const getAllDepartment = () => {
	return axiosClientNode({
		method: 'GET',
		url: '/api/departments',
	});
};

const getAllDepartmentWithUser = () => {
	return axiosClientNode({
		method: 'GET',
		url: '/api/departments',
	});
};

const getDepartmentByIdWithUser = (id) => {
	return axiosClientNode({
		method: 'GET',
		url: `/api/departments/${id}`,
	});
};

const addDepartment = (data) => {
	return axiosClientNode({
		method: 'POST',
		url: `/api/departments`,
		data,
	});
};

const updateDepartment = (data) => {
	return axiosClientNode({
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
};
