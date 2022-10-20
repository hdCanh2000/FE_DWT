import axiosClient from '../../utils/axiosClient';

export const getAllWorktrackByStatus = (status) => {
	return axiosClient({
		method: 'GET',
		url: `/api/worktracks/workTrackPending`,
		params: { status },
	});
};

export const updateStatusWorktrack = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/worktracks/${data.id}`,
		data,
	});
};
