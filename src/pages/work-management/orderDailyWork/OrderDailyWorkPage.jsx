/* eslint-disable */
import Page from '../../../layout/Page/Page';
import {
	Button as AntButton,
	Col,
	DatePicker,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Table,
} from 'antd';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import React, { useMemo, useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { useQuery } from 'react-query';
import { getDailyWorks, getListTarget } from '../../dailyWorkTracking/services';
import moment from 'moment/moment';
import dailyWorkApi from '../../dailyWork/services';
import { updateTarget } from '../../kpiNorm/services';
import { toast } from 'react-toastify';
import ModalOrderDailyWork from './ModalOrderDailyWork';
import Button from '../../../components/bootstrap/Button';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
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
			defaultSortOrder: 'ascend',
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
					children: <div className='text-over-flow-lg'>{text}</div>,
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
			title: 'CST',
			dataIndex: 'monthKey',
			key: 'monthKey',
			render: shareRender,
			sorter: (a, b) => a.monthKey - b.monthKey,
			sortDirections: ['descend', 'ascend', 'descend'],
			defaultSortOrder: 'descend',
		},

		{
			title: 'DVT',
			dataIndex: 'unitText',
			key: 'unit',
			render: shareRender,
			sorter: (a, b) => (a?.unitText || '').localeCompare(b?.unitText || ''),
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
		title: 'Tên tiêu chí',
		dataIndex: 'name',
		key: 'name',
		render: (text) => {
			return <div className='text-over-flow-lg'>{text}</div>;
		},
		sorter: (a, b) => (a?.name || '').localeCompare(b?.name || ''),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},
	{
		title: 'CST',
		dataIndex: 'monthKey',
		key: 'monthKey',
		sorter: (a, b) => a.monthKey - b.monthKey,
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
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
const OrderDailyWorkPage = () => {
	const [assignedParams, setAssignedParams] = useState({
		q: '',
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
	});
	const [assignedSearch, setAssignedSearch] = useState('');

	const [unAssignedParams, setUnAssignedParams] = useState({
		q: '',
	});
	const [unAssignedSearch, setUnAssignedSearch] = useState('');

	const [openConfirmCancelAssignTask, setOpenConfirmCancelAssignTask] = useState(false);
	const [cancelAssignTaskId, setCancelAssignTaskId] = useState(null);
	const [currentDailyWork, setCurrentDailyWork] = useState(null);
	const [openOrderDailyWorkModal, setOpenOrderDailyWorkModal] = useState(false);
	const {
		data: assignedDailyWorks = [],
		isLoading: isLoadingAssignedDailyWorks,
		isError: isErrorAssignedDailyWorks,
		refetch: refetchAssignedDailyWorks,
	} = useQuery(['getListTarget', assignedParams], ({ queryKey }) =>
		getDailyWorks({ ...queryKey[1], status: 'assigned' }),
	);
	const assignedTaskData = useMemo(() => {
		return assignedDailyWorks.map((item, index) => ({
			...item,
			key: index + 1,
			stt: assignedDailyWorks.length - index,
			statusText: item.status === 'inProgress' ? 'Đang làm' : 'Đã hoàn thành',
			userName: item.user ? item.user.name : '',
			monthKey: item.monthKey,
			unitText: item?.unit?.name,
		}));
	}, [assignedDailyWorks]);

	const {
		data: unAssignedTasks = [],
		isLoading: isLoadingUnAssignedTasks,
		isError: isErrorUnAssignedTasks,
		refetch: refetchUnAssignedTasks,
	} = useQuery(['getListTargetUnAssign', unAssignedParams], ({ queryKey }) =>
		getDailyWorks({ ...queryKey[1] }),
	);

	const unAssignedTaskData = useMemo(() => {
		return unAssignedTasks.map((item, index) => ({
			...item,
			key: index + 1,
			statusText: item.status === 'inProgress' ? 'Đang làm' : 'Đã hoàn thành',
			monthKey: item.monthKey,
			unitText: item?.unit?.name,
		}));
	}, [unAssignedTasks]);

	const handleCancelAssign = async () => {
		if (!cancelAssignTaskId) return;
		try {
			await dailyWorkApi.updateDailyWork(cancelAssignTaskId, { userId: null });
			await refetchAssignedDailyWorks();
			await refetchUnAssignedTasks();
			toast.success('Hủy giao nhiệm vụ thành công');
		} catch (err) {
			toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
		} finally {
			setOpenConfirmCancelAssignTask(false);
			setCancelAssignTaskId(null);
		}
	};
	const handleSearchAssigned = (value) => {
		setAssignedParams((prev) => ({ ...prev, q: value }));
	};
	const handleSearchUnAssigned = (value) => {
		setUnAssignedParams((prev) => ({ ...prev, q: value }));
	};
	return (
		<PageWrapper title='Giao việc hàng ngày'>
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
									<Col lg={12} md={24} className='d-flex align-items-center'>
										<Input.Search
											placeholder='Tìm'
											onSearch={handleSearchAssigned}
											value={assignedSearch}
											onChange={(e) => setAssignedSearch(e.target.value)}
										/>
										{assignedParams.q && (
											<Button
												color='link'
												onClick={() => {
													setAssignedSearch('');
													setAssignedParams((prev) => ({
														...prev,
														q: '',
													}));
												}}>
												reset
											</Button>
										)}
									</Col>

									<Col
										md={12}
										lg={12}
										sm={24}
										className='d-flex justify-content-end align-items-center'>
										<span className='mx-2'>Tháng: </span>
										<DatePicker.MonthPicker
											format='MM/YYYY'
											locale={locale}
											value={dayjs(assignedParams.start, 'M-DD-YYYY')}
											onChange={(updatedDate) => {
												setAssignedParams({
													...assignedParams,
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
								{isErrorAssignedDailyWorks ? (
									<div>không thể lấy dữ liệu</div>
								) : (
									<Table
										columns={assignedTaskColumns(
											(id) => {
												setOpenConfirmCancelAssignTask(true);
												setCancelAssignTaskId(id);
											},
											(record) => {
												setCurrentDailyWork(record);
												setOpenOrderDailyWorkModal(true);
											},
										)}
										bordered
										scroll={{ x: 'max-content' }}
										loading={isLoadingAssignedDailyWorks}
										dataSource={assignedTaskData}
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
									<Col lg={12} md={24} className='d-flex align-items-center'>
										<Input.Search
											placeholder='Tìm'
											onSearch={handleSearchUnAssigned}
											value={unAssignedSearch}
											onChange={(e) => setUnAssignedSearch(e.target.value)}
										/>
										{unAssignedParams.q && (
											<Button
												color='link'
												onClick={() => {
													setUnAssignedSearch('');
													setUnAssignedParams((prev) => ({
														...prev,
														q: '',
													}));
												}}>
												reset
											</Button>
										)}
									</Col>
									<Col
										md={12}
										lg={12}
										sm={24}
										className='d-flex justify-content-end align-items-center'>
										<span className='mx-2'>Tháng: </span>
										<DatePicker.MonthPicker
											format='MM/YYYY'
											locale={locale}
											value={
												unAssignedParams.start
													? dayjs(unAssignedParams.start, 'M-DD-YYYY')
													: null
											}
											onChange={(updatedDate) => {
												if (updatedDate === null) {
													setUnAssignedParams({
														...assignedParams,
														start: null,
														end: null,
													});
													return;
												}
												setUnAssignedParams({
													...assignedParams,
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
								{isErrorUnAssignedTasks ? (
									<div>Không thế lấy dữ liệu</div>
								) : (
									<Table
										columns={unAssignedTaskColumns}
										dataSource={unAssignedTaskData}
										bordered
										scroll={{ x: 'max-content' }}
										loading={isLoadingUnAssignedTasks}
										onRow={(record) => {
											return {
												onClick: () => {
													setCurrentDailyWork(record);
													setOpenOrderDailyWorkModal(true);
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
					<AntButton danger onClick={handleCancelAssign} key='del'>
						Xóa
					</AntButton>,
				]}>
				<p>Bạn có chắc chắn muốn hủy giao việc cho nhiệm vụ này</p>
			</Modal>
			<ModalOrderDailyWork
				data={currentDailyWork}
				open={openOrderDailyWorkModal}
				onClose={async (isUpdate) => {
					if (isUpdate) {
						await refetchAssignedDailyWorks();
						await refetchUnAssignedTasks();
					}
					setOpenOrderDailyWorkModal(false);
				}}
			/>
		</PageWrapper>
	);
};

export default OrderDailyWorkPage;
