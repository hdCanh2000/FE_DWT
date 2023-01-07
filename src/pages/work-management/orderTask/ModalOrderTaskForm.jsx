/* eslint no-nested-ternary: 0 */
/* eslint react/prop-types: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint react/no-unstable-nested-components: 0 */
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { getAllPositions, getAllUnits, getAllUsers, updateTarget } from '../../kpiNorm/services';
import ModalCreateUnit from '../../../components/ModalCreateUnit';

const ModalOrderTaskForm = ({ open, onClose, data }) => {
	const [loading, setLoading] = useState(false);
	const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
	const [currentOrderTask, setCurrentOrderTask] = useState(data);
	const [form] = Form.useForm();

	useEffect(() => {
		setCurrentOrderTask(data);
		if (data) {
			// set default value for form and deadline field
			const deadline = data.deadline ? dayjs(data.deadline) : dayjs().add(1, 'day');
			const positions = data.positions.map((item) => item.id);
			const users = data.users.map((item) => item.id);
			form.setFieldsValue({ ...data, deadline, positions, users });
		} else {
			form.resetFields();
		}
	}, [data]);
	const handleFinish = async (values) => {
		try {
			setLoading(true);
			if (!currentOrderTask || !currentOrderTask.id) {
				throw new Error('Không tìm thấy công việc');
			}
			const isOrder = !!currentOrderTask.users.length > 0;
			await updateTarget(currentOrderTask.id, values);
			toast.success(!isOrder ? 'Giao việc thành công' : 'cập nhật nhiệm vụ thành công');
		} catch (err) {
			toast.error('Thao tác không thành công');
		} finally {
			setLoading(false);
			onClose(true);
		}
	};
	const handleFinishFail = () => {};
	const { data: listUnitData = { data: [] }, refetch: reFetchUnits } = useQuery(
		'getAllUnits',
		() => getAllUnits(),
	);

	const { data: listPositionData = { data: [] } } = useQuery('getAllPositions', () =>
		getAllPositions(),
	);

	const { data: listUsersData = { data: [] } } = useQuery('getAllUsers', () => getAllUsers());

	const listUsers = listUsersData.data;
	const listUnits = listUnitData.data;
	const listPositions = listPositionData.data;
	const isOrdered = currentOrderTask && currentOrderTask.users.length > 0;
	return (
		<Modal
			forceRender
			width={800}
			title={
				currentOrderTask && currentOrderTask.users.length > 0
					? 'Chỉnh sửa nhiệm vụ'
					: 'Giao nhiệm vụ'
			}
			open={open}
			onCancel={() => onClose(false)}
			footer={[
				<Button key='close' onClick={() => onClose(false)}>
					Đóng
				</Button>,
				<Button type='primary' key='save' onClick={form.submit} disabled={loading}>
					{loading ? 'Đang lưu...' : 'Lưu'}
				</Button>,
			]}>
			<Form
				name='createTarget'
				onFinish={handleFinish}
				onFinishFailed={handleFinishFail}
				layout='vertical'
				form={form}
				disabled={loading}>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item
							name='name'
							label='Tên nhiệm vụ'
							rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}>
							<Input placeholder='Nhập tên nhiệm vụ' disabled={!isOrdered} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='positions' label='Vị trí đảm nhiệm'>
							<Select
								showSearch
								placeholder='Chọn vị trí'
								optionFilterProp='children'
								filterOption={(input, option) =>
									(option?.label.toLowerCase() ?? '').includes(
										input.toLowerCase(),
									)
								}
								options={listPositions.map((item) => ({
									label: item.name,
									value: item.id,
								}))}
								disabled={!isOrdered}
								mode='multiple'
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='users' label='Người đảm nhiệm'>
							<Select
								showSearch
								optionFilterProp='children'
								filterOption={(input, option) =>
									(option?.label.toLowerCase() ?? '').includes(
										input.toLowerCase(),
									)
								}
								options={listUsers.map((item) => ({
									label: item.name,
									value: item.id,
								}))}
								allowClear
								mode='multiple'
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='deadline'
							label='Hạn hoàn thành'
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn hạn hoàn thành',
								},
							]}>
							<DatePicker
								style={{ width: '100%' }}
								placeholder='mm/dd/yyyy'
								format='DD/MM/YYYY'
								disabledDate={(current) => {
									return current && current < dayjs().endOf('day');
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='description' label='Mô tả / diễn giải'>
							<Input.TextArea
								placeholder='Nhập mô tả nhiệm vụ'
								disabled={!isOrdered}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='executionPlan' label='Kế hoạch thực hiện'>
							<Input.TextArea placeholder='Nhập kế hoạch thực hiện' />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item name='manDay' label='ManDay'>
							<InputNumber min={0} style={{ width: 200 }} disabled={!isOrdered} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='quantity' label='Số lượng'>
							<InputNumber min={0} style={{ width: 200 }} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='unitId' label='Đơn vị'>
							<Select
								showSearch
								disabled={!isOrdered}
								optionFilterProp='children'
								filterOption={(input, option) =>
									(option?.label.toLowerCase() ?? '').includes(
										input.toLowerCase(),
									)
								}
								options={listUnits.map((item) => ({
									label: item.name,
									value: item.id,
								}))}
								dropdownRender={(menu) => (
									<>
										{menu}
										<Divider
											style={{
												margin: '8px 0',
											}}
										/>
										<div className='p-2'>
											<Button
												type='primary'
												style={{ width: '100%' }}
												onClick={() => {
													setOpenCreateUnitModal(true);
												}}>
												Thêm đơn vị
											</Button>
										</div>
									</>
								)}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<ModalCreateUnit
				isOpen={openCreateUnitModal}
				onClose={() => setOpenCreateUnitModal(false)}
				onCreateSuccess={async (createdUnit) => {
					await reFetchUnits();
					setOpenCreateUnitModal(false);
					form.setFieldsValue({
						unitId: createdUnit.id,
					});
				}}
			/>
		</Modal>
	);
};
export default ModalOrderTaskForm;
