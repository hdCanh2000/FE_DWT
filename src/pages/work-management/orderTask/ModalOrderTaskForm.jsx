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
import _ from 'lodash';
import {
	createTargetInfo,
	getAllPositions,
	getAllUnits,
	getAllUsers,
	updateTargetInfo,
} from '../../kpiNorm/services';
import ModalCreateUnit from '../../../components/ModalCreateUnit';

const ModalOrderTaskForm = ({ open, onClose, data, isCreate, onSuccess, onUpdateTargetInfo }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({});
	const [form] = Form.useForm();
	const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);

	useEffect(() => {
		if (data) {
			setFormData(data);
			const startDate = data.startDate ? dayjs(data.startDate) : null;
			const deadline = data.deadline ? dayjs(data.deadline) : null;
			form.setFieldsValue({
				...data,
				targetDuration: [startDate, deadline],
			});
		} else {
			form.resetFields();
		}
	}, [data]);

	const { data: listUnitData = { data: [] }, refetch: reFetchUnits } = useQuery(
		'getAllUnits',
		() => getAllUnits(),
	);

	const { data: listPositionData = { data: [] } } = useQuery('getAllPositions', () =>
		getAllPositions(),
	);

	const { data: listUsersData = { data: [] } } = useQuery('getAllUsers', () => getAllUsers());
	const listUsers = listUsersData?.data;
	const listUnits = listUnitData?.data;
	const listPositions = listPositionData.data;
	const handleFinish = async (values) => {
		try {
			setLoading(true);
			if (isCreate) {
				await createTargetInfo({
					...values,
					startDate: values.targetDuration[0],
					deadline: values.targetDuration[1],
					targetId: formData.id,
				});
				toast.success('Giao việc thành công');
				form.resetFields();
				if (onUpdateTargetInfo) {
					// force update to refetch data
					onUpdateTargetInfo(new Date().getTime());
				}
				onClose();
			} else {
				await updateTargetInfo(formData.id, {
					...values,
					startDate: values.targetDuration[0],
					deadline: values.targetDuration[1],
					targetId: formData.targetId,
				});
				toast.success('Cập nhật thành công');
				form.resetFields();
				onClose();
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
			await onSuccess();
		}
	};
	return (
		<Modal
			forceRender
			width={800}
			title={isCreate ? `Giao việc cho định mức "${formData?.name}"` : `Chỉnh sửa nhiệm vụ`}
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
				name='createTargetInfo'
				onFinish={handleFinish}
				onFinishFailed={() => {
					toast.error('Thông tin không hợp lệ');
				}}
				layout='vertical'
				form={form}
				disabled={loading}>
				<Row gutter={24} className='align-items-center'>
					<Col span={8}>
						<Form.Item
							name='name'
							label='Tên nhiệm vụ'
							rules={[{ required: true, message: 'Vui lòng nhập tên nhiệm vụ' }]}>
							<Input placeholder='Nhập tên nhiệm vụ' />
						</Form.Item>
					</Col>
					<Col span={16}>
						<div className='pt-2'>
							{' '}
							Thuộc định mức{' '}
							<b>{isCreate ? formData?.name : formData?.Target?.name}</b>
						</div>
					</Col>
					<Col span={12}>
						<Form.Item
							name='positionId'
							label='Vị trí đảm nhiệm'
							rules={[{ required: true, message: 'Vui chọn vị trí' }]}>
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
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='userName'
							label='Người đảm nhiệm'
							rules={[{ required: true, message: 'Vui lòng chọn người đảm nhiệm' }]}>
							<Select
								showSearch
								optionFilterProp='children'
								filterOption={(input, option) =>
									(option?.label.toLowerCase() ?? '').includes(
										input.toLowerCase(),
									)
								}
								options={_.map(listUsers, (item) => ({
									label: item.name,
									value: item.id,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='targetDuration'
							label='Thời gian làm'
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn ngày bắt đầu và deadline',
								},
							]}>
							<DatePicker.RangePicker
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
							<Input.TextArea placeholder='Nhập mô tả nhiệm vụ' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='executionPlan' label='Kế hoạch thực hiện'>
							<Input.TextArea placeholder='Nhập kế hoạch thực hiện' />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item name='manDay' label='ManDay'>
							<InputNumber min={0} style={{ width: 200 }} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name='quantity'
							label='Số lượng'
							rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
							<InputNumber min={0} style={{ width: 200 }} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name='unitId'
							label='Đơn vị'
							rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}>
							<Select
								showSearch
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
