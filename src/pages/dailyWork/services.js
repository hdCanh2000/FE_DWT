import axiosClient from '../../utils/axiosClient';

const dailyWorkApi = {
	updateDailyWork: async (id, data) => {
		const url = `/api/dailyWorks/${id}`;
		const res = await axiosClient.put(url, data);
		return res.data;
	},
	createDailyWork: async (data) => {
		const url = `/api/dailyWorks`;
		const res = await axiosClient.post(url, data);
		return res.data;
	},
	deleteDailyWork: async (id) => {
		const url = `/api/dailyWorks/${id}`;
		const res = await axiosClient.delete(url);
		return res.data;
	},
};

export default dailyWorkApi;
