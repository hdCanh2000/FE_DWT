import axiosClient from '../../utils/axiosClient';

const getAllDepartmentWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/departments?_embed=users',
	});
};

const getDepartmentByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/departments/${id}?_embed=users`,
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

export { getAllDepartmentWithUser, getDepartmentByIdWithUser, addDepartment, updateDepartment };
