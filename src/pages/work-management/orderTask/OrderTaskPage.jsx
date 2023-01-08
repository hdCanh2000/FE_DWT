/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import {
	Button as AntButton,
	Row,
	Col,
	Table,
	Space,
	Modal,
	Input,
	Select,
	DatePicker,
	Tooltip,
} from 'antd';
import moment from 'moment';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { getListTarget, getUserDetail } from '../../dailyWorkTracking/services';

import { updateTarget } from '../../kpiNorm/services';
import ModalOrderTaskForm from './ModalOrderTaskForm';
import Button from '../../../components/bootstrap/Button';
import { getAllDepartment } from '../../department/services';

const assignedTaskColumns = (handleClickDeleteBtn, handleRowClick) => {
	const shareRender = (text, record) => {
		return {
			props: {
				onClick: () => handleRowClick(record),
				style: { cursor: 'pointer' },
			},
			children: <div>{text}</div>,
		};
	};
	return [
		{
			title: 'STT',
			dataIndex: 'stt',
			key: 'key',
			render: shareRender,
			sorter: (a, b) => a.stt > b.stt,
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: 'Tên nhiệm vụ',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => {
				return {
					props: {
						onClick: () => handleRowClick(record),
						style: { cursor: 'pointer' },
					},
					children: (
						<Tooltip title={text} className='text-over-flow-lg'>
							<span>{text}</span>
						</Tooltip>
					),
				};
			},
			sorter: (a, b) => a.name.localeCompare(b.name),
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: 'Người được giao',
			dataIndex: 'userName',
			key: 'userName',
			render: shareRender,
			sorter: (a, b) => a.userName.localeCompare(b.userName),
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: 'Phòng ban',
			dataIndex: 'positionText',
			key: 'position',
			render: shareRender,
		},
		{
			title: 'Thời hạn',
			dataIndex: 'deadlineText',
			key: 'deadline',
			render: shareRender,
			sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusText',
			key: 'status',
			render: shareRender,
			filters: [
				{
					text: 'Đã hoàn thành',
					value: 'completed',
				},
				{
					text: 'Đang làm',
					value: 'inProgress',
				},
			],
			onFilter: (value, record) => record.status === value,
		},
		{
			title: 'KPI',
			dataIndex: 'kpiValue',
			key: 'kipValue',
			render: shareRender,
			sorter: (a, b) => {
				const aManDay = a.manDay || 0;
				const bManDay = b.manDay || 0;
				return aManDay - bManDay;
			},
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},
		{
			title: '',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<AntButton danger onClick={() => handleClickDeleteBtn(record.id)}>
						x
					</AntButton>
				</Space>
			),
		},
	];
};
const unAssignedTaskColumns = [
	{
		title: 'STT',
		dataIndex: 'key',
		key: 'key',
		sorter: (a, b) => a.key - b.key,
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},
	{
		title: 'Tên nhiệm vụ',
		dataIndex: 'name',
		key: 'name',
		render: (text) => {
			return (
				<Tooltip title={text} className='text-over-flow-lg'>
					<span>{text}</span>
				</Tooltip>
			);
		},
		sorter: (a, b) => a.name.localeCompare(b.name),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},
	{
		title: 'Vị trí đảm nhiệm',
		dataIndex: 'positionText',
		key: 'position',
	},
	{
		title: 'Số lượng',
		dataIndex: 'quantity',
		key: 'quantity',
		sorter: (a, b) => a.quantity - b.quantity,
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
		render: (text) => {
			return <div style={{ textAlign: 'end' }}>{text}</div>;
		},
	},
	{
		title: 'Đơn vị',
		dataIndex: 'unitText',
		key: 'unit',
		sorter: (a, b) => (a?.unitText || '').localeCompare(b?.unitText || ''),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},
];
const OrderTaskPage = () => {
	const [assignedTableParams, setAssignedTableParams] = useState({
		q: '',
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
	});
	const [assignedTableSearch, setAssignedTableSearch] = useState('');

	const [unAssignedTableParams, setUnAssignedTableParams] = useState({
		q: '',
	});
	const [unAssignedTableSearch, setUnAssignedTableSearch] = useState('');

	const [assignedTaskDepartmentId, setAssignedTaskDepartmentId] = useState('');
	const [unAssignedTaskDepartmentId, setUnAssignedTaskDepartmentId] = useState('');

	const [openConfirmCancelAssignTask, setOpenConfirmCancelAssignTask] = useState(false);
	const [cancelAssignTaskId, setCancelAssignTaskId] = useState(null);
	const [currentTarget, setCurrentTarget] = useState(null);
	const [openOrderTaskModal, setOpenOrderTaskModal] = useState(false);
	const {
		data: assignedTargets = [],
		isLoading: loadingSignedTargets,
		isError: errorSignedTargets,
		refetch: refetchSignedTargets,
	} = useQuery(['getListTarget', assignedTableParams], ({ queryKey }) =>
		getListTarget({ ...queryKey[1], status: 'assigned' }),
	);
	const assignedTaskData = useMemo(() => {
		return assignedTargets.map((item, index) => ({
			...item,
			key: index + 1,
			stt: assignedTargets.length - index,
			deadlineText: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
			statusText: item.status === 'inProgress' ? 'Đang làm' : 'Đã hoàn thành',
			userName: item.user ? item.user.name : '',
			kpiValue: `${item?.manDay || '_'} MD`,
			positionText: item.position ? item.position.name : '',
		}));
	}, [assignedTargets]);

	const {
		data: unAssignedTargets = [],
		isLoading: loadingUnSignedTargets,
		isError: errorUnSignedTargets,
		refetch: refetchUnSignedTargets,
	} = useQuery(['getListTargetUnAssigned', unAssignedTableParams], ({ queryKey }) =>
		getListTarget({ ...queryKey[1] }),
	);

	// get list departments
	const { data: listDepartmentsData = { data: { data: [] } } } = useQuery(
		['getListDepartment'],
		() => getAllDepartment(),
	);
	const listDepartments = listDepartmentsData.data.data;
	const userId = localStorage.getItem('userId');

	const { data: user = { department_id: null, role: '' } } = useQuery(
		['getUserDetail', userId],
		({ queryKey }) => getUserDetail(queryKey[1]),
	);

	useEffect(() => {
		if (!user) return;
		if (!user.department_id) return;
		if (user.role !== 'manager') return;
		setAssignedTaskDepartmentId(user.department_id || null);
		setUnAssignedTaskDepartmentId(user.department_id || null);

		setAssignedTableParams({ ...assignedTableParams, departmentId: user.department_id });
		setUnAssignedTableParams({ ...unAssignedTableParams, departmentId: user.department_id });
	}, [user]);

	const unAssignedTaskData = useMemo(() => {
		return unAssignedTargets.map((item, index) => ({
			...item,
			key: index + 1,
			unitText: item?.unit?.name,
			positionText: item.position ? item.position.name : '',
		}));
	}, [unAssignedTargets]);
	const handleDeleteAssignedTask = async () => {
		if (!cancelAssignTaskId) return;
		try {
			await updateTarget(cancelAssignTaskId, { userId: null });
			await refetchSignedTargets();
			await refetchUnSignedTargets();
			toast.success('Hủy giao nhiệm vụ thành công');
		} catch (err) {
			toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
		} finally {
			setOpenConfirmCancelAssignTask(false);
			setCancelAssignTaskId(null);
		}
	};
	const handleSearchAssignedTask = (value) => {
		setAssignedTableParams({
			...assignedTableParams,
			q: value,
		});
	};
	const handleSearchUnAssignedTask = (value) => {
		setUnAssignedTableParams({
			...unAssignedTableParams,
			q: value,
		});
	};

	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				<Row gutter={24}>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Lịch sử giao việc</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<Row gutter={24} className='mb-2'>
									<Col
										lg={8}
										md={8}
										sm={24}
										className='d-flex align-items-center'>
										<Input.Search
											onSearch={handleSearchAssignedTask}
											onChange={(e) => setAssignedTableSearch(e.target.value)}
											value={assignedTableSearch}
											placeholder='Tìm kiếm nhiệm vụ'
										/>
										{assignedTableParams.q && (
											<Button
												color='link'
												className='mx-2'
												onClick={() => {
													setAssignedTableSearch('');
													setAssignedTableParams({
														...assignedTableParams,
														q: '',
													});
												}}>
												Reset
											</Button>
										)}
									</Col>
									<Col md={8} lg={8} sm={24}>
										<Select
											placeholder='Chọn phòng ban'
											value={assignedTaskDepartmentId}
											onChange={(value) => {
												setAssignedTaskDepartmentId(value);
												setAssignedTableParams({
													...assignedTableParams,
													departmentId: value,
												});
											}}
											style={{ width: '100%' }}
											optionFilterProp='children'
											showSearch
											filterOption={(input, option) =>
												(option?.label.toLowerCase() ?? '').includes(
													input.toLowerCase(),
												)
											}
											options={[
												{
													label: 'Chọn phòng ban',
													value: null,
													disabled: true,
												},
												{
													label: 'Tất cả',
													value: '',
												},
												...listDepartments.map((item) => ({
													label: item.name,
													value: item.id,
												})),
											]}
										/>
									</Col>

									<Col md={8} lg={8} sm={24}>
										<DatePicker.MonthPicker
											format='MM/YYYY'
											locale={locale}
											value={dayjs(assignedTableParams.start, 'M-DD-YYYY')}
											onChange={(updatedDate) => {
												setAssignedTableParams({
													...assignedTableParams,
													start: `${
														updatedDate.month() + 1
													}-01-${updatedDate.year()}`,
													end: `${
														updatedDate.month() + 1
													}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
												});
											}}
										/>
									</Col>
								</Row>
								{!errorSignedTargets && (
									<Table
										columns={assignedTaskColumns(
											(id) => {
												setOpenConfirmCancelAssignTask(true);
												setCancelAssignTaskId(id);
											},
											(record) => {
												setCurrentTarget(record);
												setOpenOrderTaskModal(true);
											},
										)}
										dataSource={assignedTaskData}
										scroll={{ x: 'max-content' }}
										pagination={{ position: ['bottomCenter'] }}
										loading={loadingSignedTargets}
									/>
								)}
							</CardBody>
						</Card>
					</Col>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Danh sách nhiệm vụ</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<Row gutter={24} className='mb-2'>
									<Col
										lg={8}
										md={8}
										sm={24}
										className='d-flex align-items-center'>
										<Input.Search
											onSearch={handleSearchUnAssignedTask}
											onChange={(e) =>
												setUnAssignedTableSearch(e.target.value)
											}
											value={unAssignedTableSearch}
											placeholder='Tìm kiếm nhiệm vụ'
										/>
										{unAssignedTableParams.q && (
											<Button
												color='link'
												className='mx-2'
												onClick={() => {
													setUnAssignedTableSearch('');
													setUnAssignedTableParams({
														...unAssignedTableParams,
														q: '',
													});
												}}>
												Reset
											</Button>
										)}
									</Col>
									<Col md={8} lg={8} sm={24}>
										<Select
											placeholder='Chọn phòng ban'
											value={unAssignedTaskDepartmentId}
											onChange={(value) => {
												setUnAssignedTaskDepartmentId(value);
												setUnAssignedTableParams({
													...assignedTableParams,
													departmentId: value,
												});
											}}
											style={{ width: '100%' }}
											optionFilterProp='children'
											showSearch
											filterOption={(input, option) =>
												(option?.label.toLowerCase() ?? '').includes(
													input.toLowerCase(),
												)
											}
											options={[
												{
													label: 'Chọn phòng ban',
													value: null,
													disabled: true,
												},
												{
													label: 'Tất cả',
													value: '',
												},
												...listDepartments.map((item) => ({
													label: item.name,
													value: item.id,
												})),
											]}
										/>
									</Col>

									<Col md={8} lg={8} sm={24}>
										<DatePicker.MonthPicker
											format='MM/YYYY'
											locale={locale}
											value={
												unAssignedTableParams.start
													? dayjs(
															unAssignedTableParams.start,
															'M-DD-YYYY',
													  )
													: null
											}
											onChange={(updatedDate) => {
												if (updatedDate === null) {
													setUnAssignedTableParams({
														...unAssignedTableParams,
														start: null,
														end: null,
													});
													return;
												}
												setUnAssignedTableParams({
													...unAssignedTableParams,
													start: `${
														updatedDate.month() + 1
													}-01-${updatedDate.year()}`,
													end: `${
														updatedDate.month() + 1
													}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
												});
											}}
										/>
									</Col>
								</Row>
								{!errorUnSignedTargets && (
									<Table
										columns={unAssignedTaskColumns}
										dataSource={unAssignedTaskData}
										scroll={{ x: 'max-content' }}
										pagination={{ position: ['bottomCenter'] }}
										loading={loadingUnSignedTargets}
										onRow={(record) => {
											return {
												onClick: () => {
													setCurrentTarget(record);
													setOpenOrderTaskModal(true);
												},
											};
										}}
									/>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Page>
			<Modal
				title='Xác nhận hủy giao việc'
				open={openConfirmCancelAssignTask}
				onOk={() => setOpenConfirmCancelAssignTask(false)}
				onCancel={() => setOpenConfirmCancelAssignTask(false)}
				footer={[
					<AntButton onClick={() => setOpenConfirmCancelAssignTask(false)} key='cancel'>
						HỦy
					</AntButton>,
					<AntButton danger onClick={handleDeleteAssignedTask} key='del'>
						Xóa
					</AntButton>,
				]}>
				<p>Bạn có chắc chắn muốn hủy giao việc cho nhiệm vụ này</p>
			</Modal>
			<ModalOrderTaskForm
				open={openOrderTaskModal}
				onClose={async (isUpdate) => {
					if (isUpdate) {
						await refetchUnSignedTargets();
						await refetchSignedTargets();
					}
					setOpenOrderTaskModal(false);
				}}
				data={currentTarget}
			/>
		</PageWrapper>
	);
};
export default OrderTaskPage;
