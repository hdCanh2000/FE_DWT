/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useTable, useExpanded } from 'react-table';
import { L10n } from '@syncfusion/ej2-base';
import moment from 'moment';
import { Dropdown } from 'react-bootstrap';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackListAll } from '../../redux/slice/worktrackSlice';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog } from './services';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import {
	calcCurrentKPIOfWorkTrack,
	calcTotalCurrentKPIAllWorkTrack,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIAllWorkTrack,
	calcTotalKPIOfWorkTrack,
} from '../../utils/function';
import Icon from '../../components/icon/Icon';

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

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
		},
	},
});

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
			initialState: { expanded: { 0: true } },
		},
		useExpanded,
	);

	return (
		<>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps({
										style: { minWidth: column.minWidth, width: column.width },
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
			{/* <br />
			<div>Showing the first 1 results of {rows.length} rows</div>
			<pre>
				<code>{JSON.stringify({ expanded }, null, 2)}</code>
			</pre> */}
		</>
	);
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

const DailyWorkTracking = () => {
	const dispatch = useDispatch();

	const worktrack = useSelector((state) => state.worktrack.worktracks);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const fixForm = useCallback(() => {
		return worktrack.map((item) => ({
			...item,
			user: item?.users?.find((u) => u?.workTrackUsers?.isResponsible === true),
			statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
			parentId: item.parent_id,
			totalKPI: calcTotalKPIOfWorkTrack(item),
			totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
			currentKPI: calcCurrentKPIOfWorkTrack(item),
		}));
	}, [worktrack]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTreeTable(fixForm());
			setTreeValue(treeData);
		}
	}, [fixForm, worktrack]);

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
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			quantity: item.quantity || null,
			workTrack_id: item.data.dataWorktrack.id || null,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleClose();
				dispatch(fetchWorktrackListAll());
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

	const handleDate = (month) => {
		if (month === '/') {
			return '/';
		}
		const date = new Date();
		const y = date.getFullYear();
		const m = date.getMonth();
		const start = new Date(y, m - month, 1);
		const end = new Date(y, m + 1 - month, 0);
		const startDate = moment(start).format('YYYY-MM-DD');
		const endDate = moment(end).format('YYYY-MM-DD');
		return `?startDate=${startDate}&endDate=${endDate}`;
	};

	useEffect(() => {
		dispatch(fetchWorktrackListAll(handleDate(0)));
	}, [dispatch]);

	const selectDate = [
		{
			label: 'Tháng này',
			value: '0',
		},
		{
			label: 'Tháng trước',
			value: '1',
		},
		{
			label: 'Tất cả',
			value: '/',
		},
	];

	const [labelDropdow, setLabelDropdow] = React.useState('Tháng này');
	const handleChangeDate = (data) => {
		setLabelDropdow(data.label);
		dispatch(fetchWorktrackListAll(`${handleDate(data.value)}`));
	};

	const columnTables = [
		{
			id: 'expander',
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
			accessor: 'kpiNorm.name',
			maxWidth: 400,
			minWidth: 400,
		},
		{
			Header: 'Người phụ trách',
			accessor: 'user.name',
			maxWidth: 200,
			minWidth: 200,
		},
		{
			Header: 'Tổng điểm KPI',
			accessor: 'totalKPI',
			maxWidth: 200,
			minWidth: 200,
		},
		{
			Header: 'KPI đạt được',
			accessor: 'currentKPI',
			maxWidth: 200,
			minWidth: 200,
		},
		{
			Header: 'Số lượng hoàn thành',
			accessor: 'totalQuantity',
			maxWidth: 200,
			minWidth: 200,
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
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='TaskAlt' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions style={{ display: 'inline-flex' }}>
											<Dropdown>
												<Dropdown.Toggle
													variant='primary'
													id='dropdown-basic'>
													{labelDropdow}
												</Dropdown.Toggle>
												<Dropdown.Menu>
													{selectDate.map((ele) => (
														<Dropdown.Item
															onClick={() => handleChangeDate(ele)}>
															{ele.label}
														</Dropdown.Item>
													))}
												</Dropdown.Menu>
											</Dropdown>
										</CardActions>
									</CardHeader>
									<CardBody className='w-100'>
										<TableContainerOuter>
											<TableContainer>
												<Styles>
													<Table
														columns={columnTables}
														data={treeValue}
													/>
												</Styles>
											</TableContainer>
										</TableContainerOuter>
										<CardFooter
											tag='div'
											className=''
											size='lg'
											borderColor='primary'>
											<CardFooterRight tag='div' className='fw-bold fs-5'>
												Tổng điểm KPI:
												<span className='text-primary ms-2'>
													{calcTotalKPIAllWorkTrack(worktrack)}
												</span>
											</CardFooterRight>
											<CardFooterRight tag='div' className='fw-bold fs-5'>
												Tổng điểm KPI hiện tại:
												<span className='text-primary ms-2'>
													{calcTotalCurrentKPIAllWorkTrack(worktrack)}
												</span>
											</CardFooterRight>
										</CardFooter>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>
				)}
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
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTracking;
