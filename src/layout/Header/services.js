import axiosClient from '../../utils/axiosClient';

const changePass = (data) => {
	return axiosClient({
		method: 'PUT',
		url: `/api/users/changePassword`,
		data,
	});
};
export default changePass;
