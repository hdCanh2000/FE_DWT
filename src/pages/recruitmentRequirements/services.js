import axiosClient from '../../utils/axiosClient';

const getAllRequirement = (params) => {
	return axiosClient({
		method: 'GET',
		url: '/api/requirements',
		params,
	});
};

const getRequirementById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/requirements/${id}`,
	});
};

const addRequirement = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/requirements`,
		data,
	});
};

const updateRequirement = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/requirements/${data.id}`,
		data,
	});
};

const deleteRequirement = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/requirements/${id}`,
	});
};

export {
	getAllRequirement,
	getRequirementById,
	addRequirement,
	updateRequirement,
	deleteRequirement,
};
