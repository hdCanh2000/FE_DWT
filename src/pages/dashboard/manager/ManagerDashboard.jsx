/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Filter,
	Toolbar,
	Resize,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import CommonSalePerformance from '../../common/CRMDashboard/CommonSalePerformance';
import CommonApprovedAppointmentChart from '../../common/SubHeaders/CommonApprovedAppointmentChart';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { LIST_STATUS } from '../../../utils/constants';
import DailyWorktrackInfo from '../../dailyWorkTracking/DailyWorktrackInfo';
import DailyWorktrackForm from '../../dailyWorkTracking/DailyWorktrackForm';
import Button from '../../../components/bootstrap/Button';
import { addWorktrackLog } from '../../dailyWorkTracking/services';
import { fetchWorktrackListMe } from '../../../redux/slice/worktrackSlice';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const columns = () => {
	const date = new Date();
	const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	const result = [];
	for (let i = 1; i <= days; i += 1) {
		result.push({
			day: i,
			date: `${i >= 10 ? i : `0${i}`}-${date.getMonth() + 1}-${date.getFullYear()}`,
		});
	}
	return result;
};

const renderColor = (status) => {
	switch (status) {
		case 'inProgress':
			return '#ffc000';
		case 'completed':
			return '#c5e0b3';
		case 'expired':
			return '#f97875';
		default:
			return 'transparent';
	}
};

const toolbarOptions = ['Search'];
const searchOptions = {
	fields: ['data.kpiNorm.name', 'data.mission.name'],
	ignoreCase: true,
	key: '',
	operator: 'contains',
};

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Hiện tại chưa có công việc.',
		},
	},
});

const ManagerDashboard = () => {
	const dispatch = useDispatch();
	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const worktrack = useSelector((state) => state.worktrack.worktrack);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);

	useEffect(() => {
		dispatch(fetchEmployeeList());
		dispatch(fetchWorktrackListMe());
	}, [dispatch]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack?.workTracks
					?.filter((item) => item.workTrackUsers.isResponsible === true)
					?.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							parentId: item.parent_id,
						};
					}),
			);
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [worktrack]);

	const handleShowForm = (row, item, dataWorktrack) => {
		setShowForm(true);
		setDataShow({
			valueForm: item,
			row,
			dataWorktrack,
		});
	};

	const handleClose = () => {
		setShowForm(false);
		setDataShow({
			valueForm: {},
			row: {},
		});
	};

	const customAttributesLog = { class: 'customcss_log' };
	const customAttributes = { class: 'customcss' };

	const treegridTemplate = (props) => {
		const { workTrackLogs } = props.data;
		return (
			<div className='d-flex'>
				{columns().map((item) => {
					return (
						<div
							key={item?.day}
							style={{
								border: '1px solid #c8c7c7',
								width: 48,
								height: 36,
								backgroundColor: renderColor(
									workTrackLogs?.find((i) => i?.date === item?.date)?.status,
								),
								borderRadius: 0,
							}}
							onClick={() =>
								handleShowForm(
									workTrackLogs?.find((i) => i?.date === item?.date),
									item,
									props.data,
								)
							}
							className='rounded-none cursor-pointer d-flex justify-content-center align-items-center'>
							{item?.day}
						</div>
					);
				})}
			</div>
		);
	};

	const viewTemplate = (props) => {
		const { data } = props;
		return (
			<Button
				type='button'
				isOutline={false}
				color='info'
				isLight
				className='text-nowrap mx-2'
				icon='Eye'
				onClick={() =>
					handleOpenForm({
						...data,
						parent: worktrack.workTracks?.find((i) => i.id === data.parentId),
					})
				}
			/>
		);
	};

	const handleSubmit = (item) => {
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			workTrack_id: item.data.dataWorktrack.id || null,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleClose();
				dispatch(fetchWorktrackListMe());
				toast.success('Báo cáo nhiệm vụ thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			})
			.catch((err) => {
				toast.error('Báo cáo nhiệm vụ không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw err;
			});
	};

	return (
		<>
			<div className='row mt-0'>
				<div className='col-md-6' style={{ marginTop: '1%' }}>
					<CommonSalePerformance />
				</div>
				<div className='col-md-6' style={{ marginTop: '1%' }}>
					<CommonApprovedAppointmentChart />
				</div>
			</div>
			<div className='row my-4'>
				<div className='col-md-12'>
					<Card>
						<CardHeader>
							<CardLabel icon='Task' iconColor='danger'>
								<CardTitle>
									<CardLabel>Thống kê công việc theo nhân viên</CardLabel>
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='p-4'>
							<table className='table table-modern mb-0' style={{ fontSize: 14 }}>
								<thead>
									<tr>
										<th>Họ và tên</th>
										<th>Phòng ban</th>
										<th>Vị trí</th>
										<th className='text-center'>Số nhiệm vụ đang có</th>
										<th>Chức vụ</th>
									</tr>
								</thead>
								<tbody>
									{users?.map((item) => (
										<React.Fragment key={item.id}>
											<tr>
												<td>
													<Link
														className='text-underline'
														to={`/cong-viec-cua-nhan-vien/${item.id}`}>
														{item.name}
													</Link>
												</td>
												<td>{item?.department?.name}</td>
												<td>{item?.position?.name}</td>
												<td className='text-center'>
													{item?.workTracks?.filter((wt) => {
														return (
															wt?.workTrackUsers?.isResponsible ===
															true
														);
													})?.length || 0}
												</td>
												<td>
													{item?.role === 'manager'
														? 'Quản lý '
														: 'Nhân viên'}
												</td>
											</tr>
										</React.Fragment>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>
			</div>
			<div className='row mt-4'>
				<div className='col-md-12 h-100'>
					<Card className='h-100'>
						<CardHeader>
							<CardLabel icon='Task' iconColor='danger'>
								<CardTitle>
									<CardLabel>Danh sách công việc đang thực hiện</CardLabel>
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<div className='p-4'>
							<div className='control-pane'>
								<div className='control-section'>
									<TreeGridComponent
										locale='vi-VI'
										dataSource={treeValue}
										treeColumnIndex={0}
										allowResizing
										toolbar={toolbarOptions}
										searchSettings={searchOptions}
										className='cursor-pointer user-select-none'
										rowSelected={(item) => {
											handleOpenForm({
												...item.data.data,
												parent: worktrack?.workTracks?.find(
													(i) => i.id === item.data.data.parentId,
												),
											});
										}}
										childMapping='children'
										height='500'>
										<Inject services={[Resize]} />
										<ColumnsDirective>
											<ColumnDirective
												field='data.kpiNorm.name'
												headerText='Tên nhiệm vụ'
												width='200'
											/>
											<ColumnDirective
												field='data.statusName'
												headerText='Trạng thái'
												width='100'
												textAlign='Center'
											/>
											<ColumnDirective
												headerText='Chi tiết'
												textAlign='Center'
												width='100'
												customAttributes={customAttributes}
												template={viewTemplate}
											/>
											<ColumnDirective
												headerText='Nhật trình công việc'
												textAlign='Left'
												width='900'
												minWidth='600'
												customAttributes={customAttributesLog}
												template={treegridTemplate}
											/>
										</ColumnsDirective>
										<Inject services={[Filter, Toolbar]} />
									</TreeGridComponent>
								</div>
							</div>
						</div>
					</Card>
				</div>
				<DailyWorktrackInfo
					item={itemEdit}
					worktrack={worktrack}
					onClose={handleCloseForm}
					show={toggleForm}
				/>
				<DailyWorktrackForm
					data={dataShow}
					show={showForm}
					handleClose={handleClose}
					handleSubmit={handleSubmit}
				/>
			</div>
		</>
	);
};

export default ManagerDashboard;
