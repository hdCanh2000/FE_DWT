import * as Yup from 'yup';

const validate = Yup.object().shape({
	phone: Yup.string()
		.nullable()
		.min(10, 'Số điện thoại tối thiểu 10 ký tự')
		.required('Vui lòng nhập số điện thoại'),
	name: Yup.string()
		.nullable()
		.max(30, 'Họ tên tối đa 30 kí tự')
		.min(3, 'Họ tên tối thiểu 3 kí tự')
		.required('Vui lòng nhập họ tên'),
	dateOfBirth: Yup.string().nullable().required('Vui lòng nhập ngày sinh'),
	address: Yup.string().nullable().required('Vui lòng nhập địa chỉ'),
});

export default validate;
