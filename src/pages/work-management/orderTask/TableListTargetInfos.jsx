/*eslint-disable */
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
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
	Tooltip,
} from 'antd';
import moment from 'moment/moment';
import React, { useEffect, useMemo } from 'react';
import Button from '../../../components/bootstrap/Button';
import { getAllDepartment } from '../../department/services';
import { getListTargetInfos } from '../../dailyWorkTracking/services';
import ModalOrderTaskForm from './ModalOrderTaskForm';
import { deleteTargetInfo } from '../../kpiNorm/services';

const rolesString = window.localStorage.getItem('roles') || '[]';
const roles = JSON.parse(rolesString);

const isAdmin = roles.includes('admin') || roles.includes('manager');

const columns = (handleClickDeleteBtn, handleRowClick) => {
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
const TableListTargetInfos = ({ updateFlag }) => {
	const [params, setParams] = React.useState({
		q: '',
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
	});
	const [cancelAssignTaskId, setCancelAssignTaskId] = React.useState(null);
	const [openConfirmCancelAssignTask, setOpenConfirmCancelAssignTask] = React.useState(false);
	const [selectedTargetInfo, setSelectedTargetInfo] = React.useState(null);
	const [openModalTargetInfo, setOpenModalTargetInfo] = React.useState(false);
	const [search, setSearch] = React.useState('');
	const [departmentId, setDepartmentId] = React.useState(null);
	const {
		data: listTargetsInfos = [],
		isLoading: loadingListTargetsInfos,
		isError: errorListTargets,
		refetch: refetchListTargetsInfos,
	} = useQuery(['getListTargetInfos', params], ({ queryKey }) => getListTargetInfos(queryKey[1]));
	const tableData = useMemo(() => {
		return listTargetsInfos.map((item, index) => {
			return {
				...item,
				key: item.id,
				stt: listTargetsInfos.length - index,
				userName: item.user?.name || '',
				positionText: item?.position?.name || '',
				deadlineText: item.deadline ? dayjs(item.deadline).format('DD/MM/YYYY') : '-',
				statusText: item.status === 'completed' ? 'Đã hoàn thành' : 'Đang làm',
				kpiValue: `${item.manDay} ngày`,
			};
		});
	}, [listTargetsInfos]);
	// get list departments
	const { data: listDepartmentsData = { data: { data: [] } } } = useQuery(
		['getListDepartment'],
		() => getAllDepartment(),
	);
	const listDepartments = listDepartmentsData.data.data;
	const handeSearch = (value) => {
		setParams({
			...params,
			q: value,
		});
	};
	const handleCancelAssign = async () => {
		try {
			await deleteTargetInfo(cancelAssignTaskId);
			await refetchListTargetsInfos();
			setOpenConfirmCancelAssignTask(false);
		} catch (err) {
			toast.error('Có lỗi xảy ra');
		}
	};
	useEffect(() => {
		refetchListTargetsInfos();
	}, [updateFlag]);
	return (
		<>
			<Row gutter={24} className='mb-2'>
				<Col lg={8} md={8} sm={24} className='d-flex align-items-center'>
					<Input.Search
						onSearch={handeSearch}
						onChange={(e) => setSearch(e.target.value)}
						value={search}
						placeholder='Tìm kiếm nhiệm vụ'
					/>
					{params.q && (
						<Button
							color='link'
							className='mx-2'
							onClick={() => {
								setSearch('');
								setParams({
									...params,
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
						value={departmentId}
						onChange={(value) => {
							setDepartmentId(value);
							setParams({
								...params,
								departmentId: value,
							});
						}}
						style={{ width: '100%' }}
						optionFilterProp='children'
						showSearch
						filterOption={(input, option) =>
							(option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
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
						value={dayjs(params.start, 'M-DD-YYYY')}
						onChange={(updatedDate) => {
							setParams({
								...params,
								start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
								end: `${
									updatedDate.month() + 1
								}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
							});
						}}
					/>
				</Col>
			</Row>

			{!errorListTargets && (
				<Table
					columns={columns(
						(id) => {
							setOpenConfirmCancelAssignTask(true);
							setCancelAssignTaskId(id);
						},
						(record) => {
							if (isAdmin) {
								setSelectedTargetInfo(record);
								setOpenModalTargetInfo(true);
							} else {
								toast.warning('Không có quyền truy cập', {
									position: toast.POSITION.TOP_RIGHT,
									autoClose: 2000,
								});
							}
						},
					)}
					dataSource={tableData}
					scroll={{ x: 'max-content' }}
					pagination={{ position: ['bottomCenter'] }}
					loading={loadingListTargetsInfos}
				/>
			)}
			<Modal
				open={openConfirmCancelAssignTask}
				onClose={() => setOpenConfirmCancelAssignTask(false)}
				onCancel={() => setOpenConfirmCancelAssignTask(false)}
				title='Xác nhận hủy giao nhiệm vụ'
				footer={[
					<AntButton onClick={() => setOpenConfirmCancelAssignTask(false)} key='close'>
						Đóng
					</AntButton>,
					<AntButton danger onClick={handleCancelAssign} key='delete'>
						Xóa
					</AntButton>,
				]}>
				<div>Bạn có chắc chắn muốn hủy giao nhiệm vụ này không?</div>,
			</Modal>
			<ModalOrderTaskForm
				onClose={() => setOpenModalTargetInfo(false)}
				open={openModalTargetInfo}
				data={selectedTargetInfo}
				isCreate={false}
				onSuccess={refetchListTargetsInfos}
			/>
		</>
	);
};
export default TableListTargetInfos;
