const validate = (values) => {
	const errors = {};
	if (!values.slug) {
		errors.slug = 'Vui lòng nhập mã phòng ban';
	}

	if (!values.name) {
		errors.name = 'Vui lòng nhập tên phòng ban';
	} else if (values.name.length < 3) {
		errors.name = 'Tên phòng ban tối thiểu 3 ký tự';
	}
	if (!values.address) {
		errors.address = 'Vui lòng nhập địa chỉ phòng ban';
	} else if (values.address.length < 3) {
		errors.address = 'Địa chỉ phòng ban tối thiểu 3 ký tự';
	}
	return errors;
};

export default validate;
