import * as Yup from 'yup';

const validate = Yup.object().shape({
	// unit: Yup.string().nullable().required('Vui lòng chọn đơn vị'),
	name: Yup.string().required('Vui lòng nhập tên tiêu chí kinh doanh'),
});

export default validate;
