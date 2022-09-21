import axiosClient from '../../utils/axiosClient';

const getAllRequirement = () => {
	return axiosClient({
		method: 'GET',
		url: '/requirements',
	});
};

const getRequirementById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/requirements/${id}`,
	});
};

const addRequirement = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/requirements`,
		data,
	});
};

const updateRequirement = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/requirements/${data.id}`,
		data,
	});
};

const deleteRequirement = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/requirements/${id}`,
	});
};

export {
	getAllRequirement,
	getRequirementById,
	addRequirement,
	updateRequirement,
	deleteRequirement,
};
