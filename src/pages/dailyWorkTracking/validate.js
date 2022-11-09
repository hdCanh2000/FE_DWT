import * as Yup from 'yup';

const validate = Yup.object().shape({
	note: Yup.string().required('Vui lòng nhập ghi chú'),
	quantity: Yup.string().required('Vui lòng nhập số lượng'),
	status: Yup.string().required('Vui lòng chọn trạng thái'),
});

export default validate;
