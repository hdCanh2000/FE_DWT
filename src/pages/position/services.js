import axiosClient from '../../utils/axiosClient';

const getAllPositionWithUser = () => {
	return axiosClient({
		method: 'GET',
		url: '/api/positions?_embed=users',
	});
};
const getAllPosition = (params) => {
	return axiosClient({
		method: 'GET',
		url: '/api/positions',
		params,
	});
};

const getPositionById = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/api/positions/${id}`,
	});
};

const addPosition = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/api/positions`,
		data,
	});
};

const updatePosition = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/positions/${data.id}`,
		data,
	});
};

const deletePositions = (id) => {
	return axiosClient({
		method: 'DELETE',
		url: `/api/positions/${id}`,
	});
};

export {
	getAllPositionWithUser,
	getPositionById,
	addPosition,
	updatePosition,
	deletePositions,
	getAllPosition,
};
