/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTable, useExpanded } from 'react-table';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Card, {
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import CommonSalePerformance from '../../common/CRMDashboard/CommonSalePerformance';
import CommonApprovedAppointmentChart from '../../common/SubHeaders/CommonApprovedAppointmentChart';
import { toggleFormSlice } from '../../../redux/common/toggleFormSlice';
import { fetchEmployeeList } from '../../../redux/slice/employeeSlice';
import { LIST_STATUS } from '../../../utils/constants';
import DailyWorktrackInfo from '../../dailyWorkTracking/DailyWorktrackInfo';
import DailyWorktrackForm from '../../dailyWorkTracking/DailyWorktrackForm';
import { addWorktrackLog, uploadFileReport } from '../../dailyWorkTracking/services';
import { fetchWorktrackListMe } from '../../../redux/slice/worktrackSlice';
import Icon from '../../../components/icon/Icon';
import {
	calcCurrentKPIOfWorkTrack,
	calcProgressTask,
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
} from '../../../utils/function';

const createDataTreeTable = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { ...aData, subRows: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (aData.parentId) {
			hashTable[aData.parentId]?.subRows.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const Styles = styled.div`
	table {
		border-spacing: 0;
		border: 1px solid black;
		width: 100%;
		margin-left: 5px;
		margin-right: 5px;
		&::-webkit-scrollbar {
			height: 1px;
			border: 1px solid #d5d5d5;
		}
		tbody {
			overflow-y: auto;
		}
		tr {
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid black;
			border-right: 1px solid black;

			:last-child {
				border-right: 1px;
			}
		}
	}
`;

const TableContainerOuter = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: hidden;
	padding-bottom: 20px;
`;

const TableContainer = styled.div`
	width: 100%;
	height: 100%;
	min-width: 900px;
`;

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

const Table = ({ columns: userColumns, data }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		// eslint-disable-next-line no-unused-vars
		state: { expanded },
	} = useTable(
		{
			columns: userColumns,
			data,
			initialState: {
				expanded: {
					0: true,
					1: true,
					2: true,
					3: true,
					4: true,
					5: true,
					6: true,
					7: true,
					8: true,
					9: true,
					10: true,
				},
			},
		},
		useExpanded,
	);

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								{...column.getHeaderProps({
									style: {
										minWidth: column.minWidth,
										width: column.width,
										textAlign: column.align ? column.align : 'left',
									},
								})}>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => {
								return (
									<td
										{...cell.getCellProps({
											style: {
												minWidth: cell.column.minWidth,
												width: cell.column.width,
												textAlign: cell.column.align
													? cell.column.align
													: 'left',
											},
										})}>
										{cell.render('Cell')}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

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
			const treeData = createDataTreeTable(
				worktrack?.workTracks
					?.filter((item) => item.workTrackUsers.isResponsible === true)
					?.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							parentId: item.parent_id,
							totalKPI: calcTotalKPIOfWorkTrack(item),
							totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
							currentKPI: calcCurrentKPIOfWorkTrack(item),
							progress: `${calcProgressTask(item)}%`,
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

	const handleSubmit = (item) => {
		const selectedFile = item.files;
		const formData = new FormData();
		// eslint-disable-next-line no-restricted-syntax
		for (const key of Object.keys(selectedFile)) {
			formData.append('files', selectedFile[key], selectedFile[key].name);
		}
		uploadFileReport(formData)
			.then((res) => {
				const dataSubmit = {
					status: item.status,
					date: dataShow.valueForm.date,
					note: item.note,
					quantity: item.quantity || null,
					files: JSON.stringify(res.data.data),
					workTrack_id: item.data.dataWorktrack.id,
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
			})
			.catch((error) => {
				toast.error('Upload file không thành công. Vui lòng thử lại.', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			});
	};

	const columnTables = [
		{
			id: 'expander',
			Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
				<span {...getToggleAllRowsExpandedProps()}>
					{isAllRowsExpanded ? (
						<Icon icon='KeyboardArrowDown' color='dark' size='md' />
					) : (
						<Icon icon='KeyboardArrowRight' color='dark' size='md' />
					)}
				</span>
			),
			Cell: ({ row }) =>
				row.canExpand ? (
					<span
						{...row.getToggleRowExpandedProps({
							style: {
								paddingLeft: `${row.depth * 2}rem`,
							},
						})}>
						{row.isExpanded ? (
							<Icon icon='KeyboardArrowDown' color='dark' size='md' />
						) : (
							<Icon icon='KeyboardArrowRight' color='dark' size='md' />
						)}
					</span>
				) : null,
			maxWidth: 25,
			minWidth: 25,
		},
		{
			Header: 'Tên nhiệm vụ',
			accessor: 'name',
			maxWidth: 350,
			minWidth: 350,
			Cell: ({ row }) => {
				return (
					<div className='d-flex'>
						<span
							className='cursor-pointer d-block w-100 fw-bold fs-6'
							style={{ marginLeft: `${row.depth * 1.5}rem` }}
							onClick={() =>
								handleOpenForm({
									...row.original,
									parent: worktrack.workTracks?.find(
										(i) => i.id === row.original.parentId,
									),
								})
							}>
							{row.original.kpiNorm.name}
						</span>
					</div>
				);
			},
		},
		{
			Header: 'Trạng thái',
			accessor: 'statusName',
			maxWidth: 100,
			minWidth: 100,
		},
		{
			Header: 'Tỉ lệ hoàn thành',
			accessor: 'progress',
			maxWidth: 120,
			minWidth: 120,
			align: 'right',
		},
		{
			Header: 'Tổng điểm KPI',
			accessor: 'totalKPI',
			maxWidth: 120,
			minWidth: 120,
			align: 'right',
		},
		{
			Header: 'KPI đạt được',
			accessor: 'currentKPI',
			maxWidth: 100,
			minWidth: 100,
			align: 'right',
		},
		{
			Header: 'Số lượng hoàn thành',
			accessor: 'totalQuantity',
			maxWidth: 150,
			minWidth: 150,
			align: 'right',
		},
		{
			Header: 'Nhật trình công việc',
			accessor: 'log',
			Cell: ({ row }) => {
				const { workTrackLogs } = row.original;
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
											workTrackLogs?.find((i) => i?.date === item?.date)
												?.status,
										),
										borderRadius: 0,
									}}
									onClick={() =>
										handleShowForm(
											workTrackLogs?.find((i) => i?.date === item?.date),
											item,
											row.original,
										)
									}
									className='rounded-none cursor-pointer d-flex justify-content-center align-items-center'>
									{item?.day}
								</div>
							);
						})}
					</div>
				);
			},
		},
	];

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
										<th>Vị trí</th>
										<th className='text-center'>Số nhiệm vụ đang thực hiện</th>
										{/* <th className='text-center'>Tỉ lệ hoàn thành</th> */}
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
												<td>{item?.position?.name}</td>
												<td className='text-center'>
													{item?.workTracks?.filter((wt) => {
														return (
															wt?.workTrackUsers?.isResponsible ===
															true
														);
													})?.length || 0}
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
						<CardBody>
							<TableContainerOuter>
								<TableContainer>
									<Styles>
										<Table columns={columnTables} data={treeValue} />
									</Styles>
								</TableContainer>
							</TableContainerOuter>
							<CardFooter
								tag='div'
								className=''
								size='lg'
								borderSize={1}
								borderColor='primary'>
								<CardFooterRight tag='div' className='fw-bold fs-5 d-flex'>
									<span>KPI hoàn thành:</span>
									<div>
										<span className='text-success me-1'>
											{calcTotalCurrentKPIWorkTrackByUser(worktrack)}
										</span>
										<span>/</span>
										<span className='text-primary ms-1'>
											{calcTotalKPIWorkTrackByUser(worktrack)}
										</span>
									</div>
								</CardFooterRight>
							</CardFooter>
						</CardBody>
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
