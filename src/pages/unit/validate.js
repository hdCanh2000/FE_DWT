import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().required('Vui lòng nhập mã đơn vị'),
	name: Yup.string().max(30, 'Đơn vị tối đa 30 kí tự').required('Vui lòng nhập đơn vị'),
});

export default validate;
