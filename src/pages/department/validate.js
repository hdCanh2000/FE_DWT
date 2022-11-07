import * as Yup from 'yup';

const validate = Yup.object({
	code: Yup.string().required('Vui lòng nhập mã phòng ban'),
	name: Yup.string()
		.min(3, 'Tên phòng tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên phòng ban'),
	// address: Yup.string()
	// 	.min(3, 'Địa chỉ phòng ban tối thiểu 3 kí tự')
	// 	.required('Vui lòng nhập địa chỉ phòng ban'),
});

export default validate;
