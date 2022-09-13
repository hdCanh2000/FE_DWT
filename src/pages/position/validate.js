const validate = (values) => {
	const errors = {};
	// if (!values.slug) {
	// 	errors.slug = 'Vui lòng nhập mã phòng ban';
	// }

	if (!values.name) {
		errors.name = 'Vui lòng nhập tên vị trí';
	} else if (values.name.length < 3) {
		errors.name = 'Tên vị trí tối thiểu 3 ký tự';
	}
	// if (!values.code) {
	// 	errors.code = 'Vui lòng nhập mã phòng ban';
	// } else if (values.code.length < 3) {
	// 	errors.code = 'Mã phòng ban tối thiểu 2 ký tự';
	// }
	return errors;
};

export default validate;