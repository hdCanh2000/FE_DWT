import axios from 'axios';

const API_URL = process.env.REACT_APP_DEV_API_URL;

const axiosClient = axios.create({
	baseURL: `${API_URL}`,
});
axiosClient.interceptors.request.use(async (config) => {
	// Handle token here ...
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		config.headers['Access-Control-Allow-Headers'] = '*';
		config.headers['Access-Control-Allow-Origin'] = '*';
	}
	return config;
});
axiosClient.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response;
		}
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	},
);
export default axiosClient;
