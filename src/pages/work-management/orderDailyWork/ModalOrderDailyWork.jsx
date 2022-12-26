/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Skeleton } from 'antd';
import { useQuery } from 'react-query';
import {getAllUnits, getAllUsers, updateTarget} from '../../kpiNorm/services';
import dailyWorkApi from '../../dailyWork/services';
import { toast } from 'react-toastify';

const ModalOrderDailyWork = ({ open, onClose, data }) => {
	const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
	const [currentDailyWork, setCurrentDailyWork] = useState(data);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	useEffect(() => {
		setCurrentDailyWork(data);
		if (data) {
			form.setFieldsValue(data);
		} else {
			form.resetFields();
		}
	}, [data]);

	const { data: listUnitData = { data: [] } } = useQuery('getAllUnits', () => getAllUnits());

	const listUnits = listUnitData.data;

	const { data: listUsersData = { data: [] } } = useQuery('getAllUsers', () => getAllUsers());

	const listUsers = listUsersData.data;

	const handleFinish = async (values) => {
		try {
			setLoading(true);
			if (!currentDailyWork || !currentDailyWork.id) {
				throw new Error('Không tìm thấy nhiệm vụ');
			}
			const isOrder = !!currentDailyWork.user;
			await dailyWorkApi.updateDailyWork(currentDailyWork.id, values);
			toast.success(!isOrder ? 'Giao việc thành công' : 'cập nhật nhiệm vụ thành công');
		} catch (err) {
			toast.error('Thao tác không thành công');
		} finally {
			setLoading(false);
			onClose(true);
		}
	};
	const handleFinishFail = () => {
		toast.error('Please check your input again');
	};

	const handleDelete = async () => {
		if (!currentDailyWork) return;
		try {
			setLoading(true);
			await dailyWorkApi.deleteDailyWork(currentDailyWork.id);
			toast.success('Xóa tiêu chí thành công');
		} catch (e) {
			toast.error('Xóa tiêu chí thất bại');
		} finally {
			setLoading(false);
			setOpenConfirmDeleteModal(false);
			onClose(true);
		}
	};

	return (
		<Modal
			forceRender
			title={
				currentDailyWork && currentDailyWork.user ? 'Chỉnh sửa nhiệm vụ' : 'Giao nhiệm vụ'
			}
			onOk={() => onClose(false)}
			onCancel={() => onClose(false)}
			open={open}
			footer={[
				<Button key='close'>Đóng</Button>,
				currentDailyWork && (
					<Button
						danger
						key='delete'
						onClick={() => setOpenConfirmDeleteModal(true)}
						disabled={loading}>
						Xóa
					</Button>
				),
				<Button type='primary' key='save' onClick={form.submit} disabled={loading}>
					{loading ? 'Loading...' : currentDailyWork ? 'Cập nhật' : 'Thêm mới'}
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
					<Col span={12}>
						<Form.Item
							name='name'
							label='Tên tiêu chí'
							rules={[{ required: true, message: 'Vui lòng nhập tên tiêu chí' }]}>
							<Input placeholder='Nhập tên nhiệm vụ' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='userId' label='Người đảm nhiệm'>
							<Select>
								{listUsers.map((item) => (
									<Select.Option value={item.id} key={item.id}>
										{item.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='monthKey'
							label='CST'
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập CST',
								},
							]}>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name='unitId'
							label='DVT'
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn đơn vị tính',
								},
							]}>
							<Select>
								{listUnits.map((unit) => (
									<Select.Option value={unit.id} key={unit.id}>
										{unit.name}
									</Select.Option>
								))}
							</Select>
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
				<p>Bạn có chắc chắn muốn xóa tiêu chí này ?</p>
			</Modal>
		</Modal>
	);
};

export default ModalOrderDailyWork;
