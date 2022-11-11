/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _, { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useTable, useExpanded } from 'react-table';
import styled from 'styled-components';
import { L10n } from '@syncfusion/ej2-base';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';
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
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import Button from '../../components/bootstrap/Button';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog } from './services';
import {
	calcCurrentKPIOfWorkTrack,
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
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

const DailyWorkTracking = () => {
	const dispatch = useDispatch();
	const worktrack = useSelector((state) => state.worktrack.worktrack);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const params = useParams();
	const { id } = params;

	useEffect(() => {
		dispatch(fetchWorktrackList(`${id}${handleDate(0)}`));
	}, [dispatch, id]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTreeTable(
				worktrack.workTracks
					?.filter((item) => {
						return item?.workTrackUsers?.isResponsible === true;
					})
					.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							totalKPI: calcTotalKPIOfWorkTrack(item),
							totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
							currentKPI: calcCurrentKPIOfWorkTrack(item),
							parentId: item.parent_id,
						};
					}),
			);
			setTreeValue(treeData);
		}
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
		const dataSubmit = {
			status: item.status,
			date: dataShow.valueForm.date,
			note: item.note,
			quantity: item.quantity || null,
			workTrack_id: item.data.dataWorktrack.id,
		};
		addWorktrackLog(dataSubmit)
			.then(() => {
				handleClose();
				dispatch(fetchWorktrackList(id));
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
		dispatch(fetchWorktrackList(`${id}${handleDate(data.value)}`));
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
			accessor: 'name',
			maxWidth: 400,
			minWidth: 400,
			Cell: ({ row }) => {
				return (
					<div className='d-flex'>
						<span
							className='cursor-pointer d-block w-100 fw-bold fs-6'
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
								<CardHeader>
									<CardLabel icon='TaskAlt' iconColor='primary'>
										<CardTitle>
											<CardLabel>
												Danh sách nhiệm vụ của {_.get(worktrack, 'name')}
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardActions style={{ display: 'inline-flex' }}>
										<Button
											color='info'
											icon='ChangeCircle'
											tag='button'
											type='button'
											isOutline={false}
											isLight
											onClick={() => dispatch(fetchWorktrackList(id))}>
											Tải lại
										</Button>
										<Dropdown>
											<Dropdown.Toggle variant='primary' id='dropdown-basic'>
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
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI:
											<span className='text-primary ms-2'>
												{calcTotalKPIWorkTrackByUser(worktrack)}
											</span>
										</CardFooterRight>
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI hiện tại:
											<span className='text-primary ms-2'>
												{calcTotalCurrentKPIWorkTrackByUser(worktrack)}
											</span>
										</CardFooterRight>
									</CardFooter>
								</CardBody>
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
