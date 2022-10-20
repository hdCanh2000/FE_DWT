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
