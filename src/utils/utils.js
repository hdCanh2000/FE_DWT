import moment from 'moment';

export const mapOrder = (array, order, key) => {
	array.sort((a, b) => order.indexOf(a[key] - order.indexOf(b[key])));
	return array;
};

export const applyDrag = (arr, dragResult) => {
	const { removedIndex, addedIndex, payload } = dragResult;
	if (removedIndex === null && addedIndex === null) return arr;

	const result = [...arr];
	let itemToAdd = payload;

	if (removedIndex !== null) {
		// eslint-disable-next-line prefer-destructuring
		itemToAdd = result.splice(removedIndex, 1)[0];
	}

	if (addedIndex !== null) {
		result.splice(addedIndex, 0, itemToAdd);
	}

	return result;
};

export const generateItems = (count, creator) => {
	const result = [];
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < count; i++) {
		result.push(creator(i));
	}
	return result;
};

export const formatDateFromMiliseconds = (data) => {
	const d = new Date(data);
	let result = '';
	const year = d.getFullYear();
	let month = d.getMonth() + 1;
	if (month < 10) month = `0${month}`;
	const date = d.getDate();
	const hours = d.getHours();
	const minutes = d.getMinutes();
	result += `${date}/${month}/${year}, ${hours}:${minutes}`;
	return result;
};
export const handleLogout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('email');
	localStorage.removeItem('name');
	localStorage.removeItem('roles');
};

export const getQueryDate = (month) => {
	if (month === '' || month === '/') {
		return '/';
	}
	const date = new Date();
	const y = date.getFullYear();
	const m = date.getMonth();
	const start = new Date(y, m - month, 1);
	const end = new Date(y, m + 1 - month, 0);
	const startDate = moment(start).format('YYYY-MM-DD');
	const endDate = moment(end).format('YYYY-MM-DD');
	return {
		startDate,
		endDate,
	};
};

export const getFirstAndLastDateOfMonth = () => {
	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	return {
		firstDay,
		lastDay,
	};
};
