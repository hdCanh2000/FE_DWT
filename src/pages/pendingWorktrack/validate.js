import * as Yup from 'yup';

const validate = Yup.object().shape({
	kpi_point: Yup.number().positive().required('Vui lòng nhập điểm đánh giá'),
});

export default validate;
