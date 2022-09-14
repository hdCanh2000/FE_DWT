import axiosClient from '../../utils/axiosClient';

const getAllPositionWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/positions?_embed=users',
	});
};

const getPositionByIdWithUser = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/positions/${id}?_embed=users`,
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

export { getAllPositionWithUser, getPositionByIdWithUser, addPosition, updatePosition };
