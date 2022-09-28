import axiosClient from '../../utils/axiosClient';

const getAllWorktrack = () => {
	return axiosClient({
		method: 'GET',
		url: `/worktracks?_expand=unit`,
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

export { getAllWorktrack, addWorktrack, updateWorktrack };
