import axiosClient from '../../utils/axiosClient';

const updateInformation = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/users/me`,
		data,
	});
};

export default updateInformation;
