/* eslint-disable */
import { Form, Modal, Input, InputNumber, Button } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateTarget } from '../../pages/kpiNorm/services';

const ModalCommentTarget = ({ open, target, onClose, onSuccess }) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (target.managerComment) {
			form.setFieldsValue({
				managerComment: target.managerComment,
			});
		}
		if (target.recentManDay) {
			form.setFieldsValue({
				recentManDay: target.recentManDay,
			});
		}
	}, [target]);
	const handleFinishForm = async (values) => {
		try {
			setLoading(true);
			await updateTarget(target.id, values);
			await onSuccess();
			toast.success('Đã thêm nhận xét cho nhiệm vụ ' + target.name);
			onClose();
		} catch (err) {
			toast.error('Nhận xét nhiệm vụ thất bại');
		} finally {
			setLoading(false);
		}
	};
	return (
		<Modal
			title='NHận xét nhiệm vụ'
			open={open}
			onCancel={onClose}
			onOk={onClose}
			footer={null}>
			<Form form={form} name='commentTarget' onFinish={handleFinishForm}>
				<Form.Item label='Ý kiến' name='managerComment'>
					<Input.TextArea />
				</Form.Item>
				<Form.Item label='Man Day' name='recentManDay'>
					<InputNumber min={0} />
				</Form.Item>
				<Button
					htmlType='submit'
					type='primary'
					style={{ width: '100%' }}
					loading={loading}>
					Gửi nhận xét
				</Button>
			</Form>
		</Modal>
	);
};

export default ModalCommentTarget;
