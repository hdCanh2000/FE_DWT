/* eslint no-nested-ternary: 0 */
/* eslint react/prop-types: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint react/no-unstable-nested-components: 0 */
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createTarget, deleteTarget, updateTarget } from './services';

const ModalTargetForm = ({ open, onClose, data }) => {
	const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
	const [currentTarget, setCurrentTarget] = useState(data);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	useEffect(() => {
		setCurrentTarget(data);
		if (data) {
			form.setFieldsValue(data);
		} else {
			form.resetFields();
		}
	}, [data]);

	const handleFinish = async (values) => {
		try {
			setLoading(true);
			if (currentTarget && currentTarget.id) {
				await updateTarget(currentTarget.id, values);
				toast.success('Cập nhật mục tiêu thành công');
			} else {
				await createTarget(values);
				toast.success('Tạo mục tiêu thành công');
			}
		} catch (e) {
			const apiErrorMsg = e?.response?.data?.message || '';
			if (apiErrorMsg === 'Internal server error: Error: Target already exists') {
				toast.error('Mục tiêu này đã tồn tại vui lòng thử lại');
			} else {
				toast.error('Cập nhật mục tiêu không thành công');
			}
		} finally {
			setLoading(false);
			onClose(true);
		}
	};
	const handleFinishFail = () => {
		toast.error('Please check your input again');
	};

	const handleDelete = async () => {
		if (!currentTarget) return;
		try {
			setLoading(true);
			await deleteTarget(currentTarget.id);
			toast.success('Xóa mục tiêu thành công');
		} catch (e) {
			toast.error('Xóa nhiệm vụ thất bại');
		} finally {
			setLoading(false);
			setOpenConfirmDeleteModal(false);
			onClose(true);
		}
	};

	return (
		<Modal
			forceRender
			title={currentTarget ? 'Cập nhật định mức lao động' : 'Thêm mới định mức'}
			onOk={() => onClose(false)}
			onCancel={() => onClose(false)}
			open={open}
			footer={[
				<Button key='close' onClick={() => onClose(false)}>
					Đóng
				</Button>,
				currentTarget && (
					<Button
						danger
						key='delete'
						onClick={() => setOpenConfirmDeleteModal(true)}
						disabled={loading}>
						Xóa
					</Button>
				),
				<Button type='primary' key='save' onClick={form.submit} disabled={loading}>
					{loading ? 'Loading...' : currentTarget ? 'Cập nhật' : 'Thêm mới'}
				</Button>,
			]}
			width={800}>
			<Form
				disabled={loading}
				name='createTarget'
				onFinish={handleFinish}
				onFinishFailed={handleFinishFail}
				layout='vertical'
				form={form}>
				<Row gutter={24}>
					<Col span={24}>
						<Form.Item
							name='name'
							label='Tên định mức'
							rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}>
							<Input placeholder='Nhập tên nhiệm vụ' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='description' label='Mô tả / diễn giải'>
							<Input.TextArea placeholder='Nhập mô tả nhiệm vụ' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='executionPlan' label='Kế hoạch thực hiện'>
							<Input.TextArea placeholder='Nhập kế hoạch thực hiện' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='manDay' label='ManDay'>
							<InputNumber min={0} style={{ width: 200 }} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Modal
				title='Xác nhận xóa'
				open={openConfirmDeleteModal}
				onOk={() => setOpenConfirmDeleteModal(false)}
				onCancel={() => setOpenConfirmDeleteModal(false)}
				footer={[
					<Button key='close' onClick={() => setOpenConfirmDeleteModal(false)}>
						Hủy
					</Button>,
					<Button danger key='delete' onClick={handleDelete} disabled={loading}>
						Xóa
					</Button>,
				]}>
				<p>Bạn có chắc chắn muốn xóa nhiệm vụ này ?</p>
			</Modal>
		</Modal>
	);
};

export default ModalTargetForm;
