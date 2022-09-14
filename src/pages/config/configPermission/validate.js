import * as Yup from 'yup';

const validate = Yup.object().shape({
	code: Yup.string().required('Vui lòng nhập mã quyền'),
	name: Yup.string().required('Vui lòng nhập tên quyền'),
});

export default validate;
