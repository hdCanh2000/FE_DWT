/* eslint-disable */
import { Button, Form, Input, Modal } from 'antd';
import { toast } from 'react-toastify';
import { createUnit } from '../pages/dailyWorkTracking/services';

const ModalCreateUnit = ({ isOpen, onClose, onCreateSuccess }) => {
	const [form] = Form.useForm();
	const handleFinishFailed = () => {
		toast.error('Please check your input again');
	};
	const handleFinish = async (values) => {
		try {
			const resp = await createUnit(values);
			toast.success('Tạo đơn vị thành công');
			form.resetFields();
			onCreateSuccess(resp.data);
		} catch (err) {
			console.log(err);
			toast.error('Tạo đơn vị không thành công');
		}
	};
	return (
		<Modal
			title='Tạo mới đơn vị tính'
			open={isOpen}
			onOk={onClose}
			onCancel={onClose}
			footer={[
				<Button key='close' onClick={onClose}>
					Đóng
				</Button>,
				<Button key='save' onClick={form.submit} type='primary'>
					Lưu
				</Button>,
			]}>
			<Form
				name='createUnit'
				onFinish={handleFinish}
				onFinishFailed={handleFinishFailed}
				form={form}
				layout='vertical'>
				<Form.Item
					name='name'
					label='Tên đơn vị tính'
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập tên đơn vị tính',
						},
					]}>
					<Input placeholder='Tên đơn vị' />
				</Form.Item>

				<Form.Item
					name='code'
					label='Mã đơn vị tính'
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập mã đơn vị tính',
						},
					]}>
					<Input placeholder='Mã đơn vị' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalCreateUnit;
