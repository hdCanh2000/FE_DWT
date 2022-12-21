import React, { useMemo, useState } from 'react';
import { Button as AntButton, Row, Col, Table, Space, Modal } from 'antd';
import moment from 'moment';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { getListTarget } from '../../dailyWorkTracking/services';

import { updateTarget } from '../../kpiNorm/services';
import ModalOrderTaskForm from './ModalOrderTaskForm';

const assignedTaskColumns = (handleClickDeleteBtn, handleRowClick) => {
	const shareRender = (text, record) => {
		return {
			props: {
				onClick: () => handleRowClick(record),
			},
			children: <div>{text}</div>,
		};
	};
	return [
		{
			title: 'STT',
			dataIndex: 'key',
			key: 'key',
			fixed: 'left',
			render: shareRender,
		},
		{
			title: 'Tên nhiệm vụ',
			dataIndex: 'name',
			key: 'name',
			fixed: 'left',
			render: shareRender,
		},
		{
			title: 'Người được giao',
			dataIndex: 'userName',
			key: 'userName',
			render: shareRender,
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
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusText',
			key: 'status',
			render: shareRender,
		},
		{
			title: 'KPI',
			dataIndex: 'kpiValue',
			key: 'kipValue',
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
		title: 'Tên nhiệm vụ',
		dataIndex: 'name',
		key: 'name',
		fixed: 'left',
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
	},
	{
		title: 'Đơn vị',
		dataIndex: 'unitText',
		key: 'unit',
	},
];
const OrderTaskPage = () => {
	const [dataSearch] = useState({
		q: '',
	});
	const [openConfirmCancelAssignTask, setOpenConfirmCancelAssignTask] = useState(false);
	const [cancelAssignTaskId, setCancelAssignTaskId] = useState(null);
	const [currentTarget, setCurrentTarget] = useState(null);
	const [openOrderTaskModal, setOpenOrderTaskModal] = useState(false);
	const {
		data: assignedTargets = [],
		isLoading: loadingSignedTargets,
		isError: errorSignedTargets,
		refetch: refetchSignedTargets,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) =>
		getListTarget({ ...queryKey[1], status: 'assigned' }),
	);
	const assignedTaskData = useMemo(() => {
		return assignedTargets.map((item, index) => ({
			...item,
			key: index + 1,
			deadlineText: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
			statusText: item.status === 'inProgress' ? 'Đang làm' : 'Đã hoàn thành',
			userName: item.user ? item.user.name : '',
			kpiValue: `${item.manDay} MD`,
			positionText: item.position ? item.position.name : '',
		}));
	}, [assignedTargets]);

	const {
		data: unAssignedTargets = [],
		isLoading: loadingUnSignedTargets,
		isError: errorUnSignedTargets,
		refetch: refetchUnSignedTargets,
	} = useQuery(['getListTargetUnAssigned', dataSearch], ({ queryKey }) =>
		getListTarget({ ...queryKey[1] }),
	);

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
