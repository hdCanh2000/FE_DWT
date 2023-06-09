/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { Toast } from 'react-bootstrap';
import moment from 'moment/moment';
import { DateRangePicker } from 'react-date-range';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
	CardSubTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';
import { fetchEmployeeById } from '../../redux/slice/employeeSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import { downLoadWorkTrack } from '../dailyWorkTracking/services';
import {
	calcCurrentKPIOfWorkTrack,
	calcProgressTask,
	calcProgressWorktrack,
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
	columns,
	convertDate,
	createDataTreeTable,
	renderColor,
} from '../../utils/function';
import Icon from '../../components/icon/Icon';
import { getFirstAndLastDateOfMonth, getQueryDate } from '../../utils/utils';
import Table from '../dailyWorkTracking/Table';
import Button from '../../components/bootstrap/Button';
import { inputRanges, staticRanges } from '../dailyWorkTracking/customReactDateRange';

const DailyWorkTrackingUser = () => {
	const dispatch = useDispatch();
	const worktrack = useSelector((state) => state.worktrack.worktrack);
	const employee = useSelector((state) => state.employee.employee);
	const loading = useSelector((state) => state.worktrack.loading);

	const [exporting, setExporting] = useState(false);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));

	const [treeValue, setTreeValue] = React.useState([]);

	const id = window.localStorage.getItem('userId');
	const [open, setOpen] = useState(false);
	const [state, setState] = useState([
		{
			startDate: getFirstAndLastDateOfMonth().firstDay,
			endDate: getFirstAndLastDateOfMonth().lastDay,
			key: 'selection',
		},
	]);

	const fetchData = () => {
		const query = getQueryDate(0);
		const data = {
			id,
			query,
		};
		dispatch(fetchWorktrackList(data));
	};

	useEffect(() => {
		fetchData();
		dispatch(fetchEmployeeById(id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, id]);

	useEffect(() => {
		if (!_.isEmpty(worktrack)) {
			const treeData = createDataTreeTable(
				worktrack.workTracks
					?.filter((item) => {
						return item?.workTrackUsers?.isResponsible === true;
					})
					?.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							totalKPI: calcTotalKPIOfWorkTrack(item),
							totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
							currentKPI: calcCurrentKPIOfWorkTrack(item),
							progress: calcProgressTask(item),
							kpiPoint: item.kpi_point ? item.kpi_point : '--',
							parentId: item.parent_id,
						};
					}),
			);
			setTreeValue(treeData);
		} else {
			setTreeValue([]);
		}
	}, [worktrack]);

	const handleChangeDate = () => {
		const startDate = moment(state[0].startDate).format('YYYY-MM-DD');
		const endDate = moment(state[0].endDate).format('YYYY-MM-DD');
		const query = {
			startDate,
			endDate,
		};
		const dataQuery = {
			id,
			query,
		};
		dispatch(fetchWorktrackList(dataQuery));
		setOpen(false);
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
								paddingLeft: `${row.depth * 1.5}rem`,
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
			sticky: 'left',
		},
		{
			Header: 'Tên nhiệm vụ',
			accessor: 'name',
			maxWidth: 350,
			minWidth: 350,
			sticky: 'left',
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
									user: { name: worktrack?.name, id: worktrack?.id },
								})
							}>
							<div style={{ marginLeft: `${row.depth * 1.5}rem` }}>
								{row.original.name || row.original.kpiNorm.name}
							</div>
						</span>
					</div>
				);
			},
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
			Header: 'KPI tạm tính',
			accessor: 'currentKPI',
			maxWidth: 100,
			minWidth: 100,
			align: 'right',
		},
		{
			Header: 'KPI thực tế',
			accessor: 'kpiPoint',
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
			Header: () => {
				return (
					<div className='d-flex'>
						{columns(state).map((item) => {
							return (
								<div
									key={item?.day}
									style={{
										border: '1px solid #c8c7c7',
										width: 48,
										height: 36,
										backgroundColor: item.color ? '#f97875' : '#fff',
										borderRadius: 0,
										color: item.color ? '#fff' : '#000',
									}}
									className='rounded-none d-flex justify-content-center align-items-center'>
									{`${item.textDate}`}
								</div>
							);
						})}
					</div>
				);
			},
			accessor: 'log',
			Cell: ({ row }) => {
				const { workTrackLogs } = row.original;
				return (
					<div className='d-flex'>
						{columns(state).map((item) => {
							return (
								<div
									key={item?.day}
									style={{
										border: '1px solid #c8c7c7',
										width: 48,
										height: 36,
										backgroundColor: item.color
											? '#f97875'
											: renderColor(
													workTrackLogs?.find(
														(i) => i?.date === item?.date,
													)?.status,
											  ),
										borderRadius: 0,
										color: item.color ? '#fff' : '#000',
									}}
									className='rounded-none cursor-pointer d-flex justify-content-center align-items-center'>
									{`${item?.day}`}
								</div>
							);
						})}
					</div>
				);
			},
		},
	];

	const handleExportExcel = async () => {
		try {
			setExporting(true);
			const startDate = moment(state[0].startDate).format('YYYY-MM-DD');
			const endDate = moment(state[0].endDate).format('YYYY-MM-DD');
			const res = await downLoadWorkTrack({ startDate, endDate, userId: employee.id });
			const { fileName } = res.data.data;

			let hostName = process.env.REACT_APP_DEV_API_URL;
			// remove last /
			if (hostName[hostName.length - 1] === '/') {
				hostName = hostName.slice(0, hostName.length - 1);
			}

			const fileUrl = `${process.env.REACT_APP_DEV_API_URL}/files/${fileName}`;
			// download file by create an a tag with download attribute and href is the file url then click it
			const link = document.createElement('a');
			link.href = fileUrl;
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (err) {
			toast.error('Export file không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		} finally {
			setExporting(false);
		}
	};
	return (
		<PageWrapper title='Xuất báo cáo công việc'>
			<Page container='fluid'>
				{loading && !_.isEmpty(worktrack) ? (
					<Loading />
				) : (
					<div className='row mb-0'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader className='w-100 text-center'>
									<CardLabel className='d-block w-100'>
										<CardTitle className='fs-4 my-2'>
											Báo cáo công việc của {_.get(employee, 'name')}
											<span className='mx-2'>-</span>
											{_.get(employee, 'department.name')}
										</CardTitle>
										<CardSubTitle className='fs-5 text-info'>
											Từ {convertDate(state[0].startDate)}
											<span className='mx-2'>-</span>
											{convertDate(state[0].endDate)}
										</CardSubTitle>
									</CardLabel>
								</CardHeader>
								<CardHeader
									className='d-block text-end py-0'
									style={{ minHeight: '100%' }}>
									<CardActions style={{ display: 'inline-flex' }}>
										<Toast
											style={{
												width: 'auto',
												top: '7vh',
												right: '0',
												position: 'absolute',
												zIndex: '100',
											}}
											onClose={() => setOpen(false)}
											show={open}
											animation={false}>
											<Toast.Header closeButton={false}>
												<DateRangePicker
													onChange={(item) => setState([item.selection])}
													showSelectionPreview
													moveRangeOnFirstSelection={false}
													months={1}
													ranges={state}
													direction='horizontal'
													staticRanges={staticRanges}
													inputRanges={inputRanges}
												/>
											</Toast.Header>
											<Toast.Body
												style={{
													background: '#fff',
													height: 60,
												}}>
												<div
													style={{
														float: 'right',
													}}>
													<Button
														onClick={() => setOpen(!open)}
														color='danger'>
														Đóng
													</Button>
													<Button
														style={{ marginLeft: '5px' }}
														onClick={() => handleChangeDate()}
														color='info'>
														Chấp nhận
													</Button>
												</div>
											</Toast.Body>
										</Toast>
										<Button
											icon='DateRange'
											onClick={() => setOpen(!open)}
											color='primary'>
											Lọc theo tháng
										</Button>

										<Button
											onClick={handleExportExcel}
											color='primary'
											isDisable={exporting}>
											Xuất báo cáo
										</Button>
									</CardActions>
								</CardHeader>
								<CardBody>
									<Table columns={columnTables} data={treeValue} />
									<CardFooter
										tag='div'
										className=''
										size='lg'
										borderColor='primary'>
										<CardFooterRight tag='div' className='fw-bold fs-5 d-flex'>
											<span>KPI tạm tính:</span>
											<div>
												<span className='text-success me-1'>
													{calcTotalCurrentKPIWorkTrackByUser(worktrack)}
												</span>
												<span>/</span>
												<span className='text-primary ms-1'>
													{calcTotalKPIWorkTrackByUser(worktrack)}
												</span>
											</div>
											<span>~</span>
											<div>
												<span className='text-danger me-1'>
													{calcProgressWorktrack(worktrack)}%
												</span>
											</div>
										</CardFooterRight>
									</CardFooter>
								</CardBody>
							</Card>
						</div>
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingUser;
