import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().required('Vui lòng nhập mã nhân sự'),
	name: Yup.string()
		.max(30, 'Họ tên tối đa 30 kí tự')
		.min(3, 'Họ tên tối thiểu 3 kí tự')
		.required('Vui lòng nhập họ tên'),
	email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
	sex: Yup.string().nullable().required('Vui lòng chọn giới tính'),
	role: Yup.string().nullable().required('Vui lòng chọn chức vụ'),
});

export default validate;
