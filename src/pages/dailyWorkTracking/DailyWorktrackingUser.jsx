/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
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
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog, uploadFileReport } from './services';
import {
	calcCurrentKPIOfWorkTrack,
	calcProgressTask,
	calcProgressWorktrack,
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
	columns,
	createDataTreeTable,
	renderColor,
} from '../../utils/function';
import Icon from '../../components/icon/Icon';
import { getFirstAndLastDateOfMonth, getQueryDate } from '../../utils/utils';
import Table from './Table';
import Button from '../../components/bootstrap/Button';
import { inputRanges, staticRanges } from './customReactDateRange';

const DailyWorkTrackingUser = () => {
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
							progress: `${calcProgressTask(item)}%`,
							parentId: item.parent_id,
						};
					}),
			);
			setTreeValue(treeData);
		} else {
			setTreeValue([]);
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
						fetchData();
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
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				{loading && !_.isEmpty(worktrack) ? (
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
												<span className='mx-2'>-</span>
												{_.get(worktrack, 'department.name')}
											</CardLabel>
										</CardTitle>
										<CardSubTitle className='fs-5 text-info'>
											Từ {state[0].startDate.toLocaleDateString()}
											<span className='mx-2'>-</span>
											{state[0].endDate.toLocaleDateString()}
										</CardSubTitle>
									</CardLabel>
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
											icon='ChangeCircle'
											size='sm'
											onClick={() => fetchData()}
											color='primary'>
											Tải lại
										</Button>
										<Button
											icon='DateRange'
											onClick={() => setOpen(!open)}
											color='primary'>
											Lọc theo tháng
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
export default DailyWorkTrackingUser;
