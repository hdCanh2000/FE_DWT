import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Filter,
	Toolbar,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import _, { isEmpty } from 'lodash';
import Card, { CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import CommonSalePerformance from '../../common/CRMDashboard/CommonSalePerformance';
import CommonApprovedAppointmentChart from '../../common/SubHeaders/CommonApprovedAppointmentChart';
import { getAllWorktrackByUserId } from '../../dailyWorkTracking/services';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import DailyWorktrackingModal from '../../dailyWorkTracking/DailyWorktrackingModal';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { LIST_STATUS } from '../../../utils/constants';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (!_.isEmpty(aData.parentId)) {
			hashTable[aData.parentId].children.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
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
	const [worktrack, setWorktrack] = useState({});
	const [treeValue, setTreeValue] = React.useState([]);

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const users = useSelector((state) => state.employee.employees);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);
	const items = dataPagination(users, currentPage, perPage);
	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	const id = localStorage.getItem('userId');

	useEffect(() => {
		async function fetchData() {
			getAllWorktrackByUserId(id)
				.then((res) => {
					setWorktrack(res.data.data);
				})
				.catch((err) => {
					throw err;
				});
		}
		fetchData();
	}, [dispatch, id]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack?.workTracks
					?.filter((item) => {
						return item?.workTrackUsers?.isResponsible === true;
					})
					?.map((item) => {
						return {
							...item,
							label: item.name,
							value: item.id,
							text: item.name,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							deadline: item.deadline
								? moment(item.deadline).format('DD-MM-YYYY')
								: '--',
							parentId: item.parent_id,
							department: {
								name: _.get(worktrack, 'department.name', '--'),
							},
						};
					}),
			);
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [worktrack]);

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
									{items?.map((item) => (
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
							<hr />
							<footer>
								<PaginationButtons
									data={users}
									setCurrentPage={setCurrentPage}
									currentPage={currentPage}
									perPage={perPage}
									setPerPage={setPerPage}
								/>
							</footer>
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
										allowReordering
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
										height='410'>
										<ColumnsDirective>
											<ColumnDirective
												field='data.kpiNorm.name'
												headerText='Tên nhiệm vụ'
												width='200'
											/>
											<ColumnDirective
												field='data.mission.name'
												headerText='Thuộc mục tiêu'
												width='90'
												textAlign='Left'
											/>
											<ColumnDirective
												field='data.deadline'
												headerText='Hạn hoàn thành'
												format='yMd'
												width='90'
												textAlign='Center'
											/>
											<ColumnDirective
												field='data.statusName'
												headerText='Trạng thái'
												width='100'
												textAlign='Center'
											/>
											<ColumnDirective
												field='data.quantity'
												headerText='Số lượng'
												width='90'
												textAlign='Right'
											/>
										</ColumnsDirective>
										<Inject services={[Filter, Toolbar]} />
									</TreeGridComponent>
								</div>
							</div>
						</div>
					</Card>
				</div>
				<DailyWorktrackingModal
					data={itemEdit}
					worktrack={worktrack}
					handleClose={handleCloseForm}
					show={toggleForm}
				/>
			</div>
		</>
	);
};

export default ManagerDashboard;
