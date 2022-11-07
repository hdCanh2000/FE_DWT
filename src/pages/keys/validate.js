import * as Yup from 'yup';

const validate = Yup.object().shape({
	unit: Yup.string().nullable().required('Vui lòng chọn đơn vị'),
	name: Yup.string()
		.nullable()
		.max(30, 'Họ tên tối đa 30 kí tự')
		.min(3, 'Họ tên tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên chỉ số key'),
	dateOfBirth: Yup.string().nullable().required('Vui lòng nhập ngày sinh'),
	address: Yup.string().nullable().required('Vui lòng nhập địa chỉ'),
});

export default validate;
