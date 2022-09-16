import * as Yup from 'yup';

const validate = Yup.object().shape({
	unit: Yup.string()
		.required('Vui lòng chọn đơn vị đo lường chỉ số key'),
	name: Yup.string()
		.max(30, 'Tên chỉ số key tối đa 30 kí tự')
		.min(3, 'Tên chỉ số key tối thiểu 3 kí tự')
		.required('Vui lòng nhập tên key'),
});

export default validate;
