/* eslint-disable */
import Page from '../../../layout/Page/Page';
import { Button as AntButton, Col, Input, Modal, Row, Space, Table } from 'antd';
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
			fixed: 'left',
			render: shareRender,
		},
		{
			title: 'Tên nhiệm vụ',
			dataIndex: 'name',
			key: 'name',
			fixed: 'left',
			render: (text, record) => {
				return {
					props: {
						onClick: () => handleRowClick(record),
						style: { cursor: 'pointer' },
					},
					children: <div className='text-over-flow-md'>{text}</div>,
				};
			},
		},
		{
			title: 'Người được giao',
			dataIndex: 'userName',
			key: 'userName',
			render: shareRender,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusText',
			key: 'status',
			render: shareRender,
		},
		{
			title: 'CST',
			dataIndex: 'monthKey',
			key: 'monthKey',
			render: shareRender,
		},

		{
			title: 'DVT',
			dataIndex: 'unitText',
			key: 'unit',
			render: shareRender,
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
		fixed: 'left',
	},
	{
		title: 'Tên tiêu chí',
		dataIndex: 'name',
		key: 'name',
		fixed: 'left',
		render: (text) => {
			return <div className='text-over-flow-md'>{text}</div>;
		},
	},
	{
		title: 'CST',
		dataIndex: 'monthKey',
		key: 'monthKey',
	},
	{
		title: 'Đơn vị',
		dataIndex: 'unitText',
		key: 'unit',
	},
];
const OrderDailyWorkPage = () => {
	const [assignedParams, setAssignedParams] = useState({
		q: '',
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
