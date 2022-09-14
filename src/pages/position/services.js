import axiosClient from '../../utils/axiosClient';

const getAllPositionWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/positions?_embed=users',
	});
};

const getPositionById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/positions/${id}`,
	});
};

const addPosition = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/positions`,
		data,
	});
};

const updatePosition = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/positions/${data.id}`,
		data,
	});
};

export { getAllPositionWithUser, getPositionById, addPosition, updatePosition };
