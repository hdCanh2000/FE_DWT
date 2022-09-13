import * as Yup from 'yup';

const validate = Yup.object({
	name: Yup.string().required('Vui lòng nhập tên cấp nhân sự'),
	code: Yup.string().required('Vui lòng nhập mã cấp nhân sự'),
});

export default validate;
