import axiosClient from '../../utils/axiosClient';

const getAllWorktrackByUserId = (id) => {
	return axiosClient({
		method: 'GET',
		url: `/worktracks_by_user/${id}`,
	});
};

const getAllWorktrackByUser = () => {
	return axiosClient({
		method: 'GET',
		url: `/worktracks_by_user`,
	});
};

const addWorktrack = (data) => {
	return axiosClient({
		method: 'POST',
		url: `/worktracks`,
		data,
	});
};

const updateWorktrack = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/worktracks/${data.id}`,
		data,
	});
};

export { getAllWorktrackByUserId, getAllWorktrackByUser, addWorktrack, updateWorktrack };
