/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Toast } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment/moment';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { LIST_STATUS } from '../../utils/constants';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import DailyWorktrackForm from './DailyWorktrackForm';
import Button from '../../components/bootstrap/Button';
import { fetchWorktrackListMe } from '../../redux/slice/worktrackSlice';
import { addWorktrackLog, uploadFileReport } from './services';
import { updateStatusWorktrack } from '../pendingWorktrack/services';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
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
import Table from './Table';
import { inputRanges, staticRanges } from './customReactDateRange';

const DailyWorkTrackingMe = () => {
	const dispatch = useDispatch();
	const worktrack = useSelector((state) => state.worktrack.worktrack);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const [treeValue, setTreeValue] = React.useState([]);
	const [showForm, setShowForm] = React.useState(false);
	const [open, setOpen] = useState(false);
	const [state, setState] = useState([
		{
			startDate: getFirstAndLastDateOfMonth().firstDay,
			endDate: getFirstAndLastDateOfMonth().lastDay,
			key: 'selection',
		},
	]);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const fetchData = () => {
		const query = getQueryDate(0);
		dispatch(fetchWorktrackListMe(query));
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTreeTable(
				worktrack.workTracks
					?.filter((item) => {
						return item?.workTrackUsers?.isResponsible === true;
					})
					?.map((item) => {
						return {
							...item,
							statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
							parentId: item.parent_id,
							kpiPoint: item.kpi_point ? item.kpi_point : '--',
							totalKPI: calcTotalKPIOfWorkTrack(item),
							totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
							currentKPI: calcCurrentKPIOfWorkTrack(item),
							progress: calcProgressTask(item),
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
		if (selectedFile && selectedFile.length > 0) {
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
		} else {
			const dataSubmit = {
				status: item.status,
				date: dataShow.valueForm.date,
				note: item.note,
				quantity: item.quantity || null,
				files: null,
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
		}
	};

	const handleChangeDate = () => {
		const startDate = moment(state[0].startDate).format('YYYY-MM-DD');
		const endDate = moment(state[0].endDate).format('YYYY-MM-DD');
		dispatch(fetchWorktrackListMe({ startDate, endDate }));
		setOpen(false);
	};

	const handleChangeStatus = (worktrackSubmit) => {
		const dataSubmit = {
			id: worktrackSubmit?.id,
			status: 'completed',
		};
		updateStatusWorktrack(dataSubmit)
			.then(() => {
				dispatch(fetchWorktrackListMe());
				handleCloseForm();
				toast.success('Báo cáo nhiệm vụ thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			})
			.catch((error) => {
				toast.error('Báo cáo nhiệm vụ không thành công!', {
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
							style={{ marginLeft: `${row.depth * 1.5}rem` }}
							onClick={() =>
								handleOpenForm({
									...row.original,
									parent: worktrack.workTracks?.find(
										(i) => i.id === row.original.parentId,
									),
									user: { name: worktrack?.name, id: worktrack?.id },
								})
							}>
							{row.original.name || row.original.kpiNorm.name}
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
			Header: 'Báo cáo',
			accessor: 'report',
			maxWidth: 100,
			minWidth: 100,
			align: 'center',
			Cell: ({ row }) => {
				return (
					<div className='d-flex'>
						<Button
							type='button'
							isOutline={false}
							color='success'
							isLight
							className='text-nowrap ms-2'
							onClick={() => handleOpenFormDelete(row.original)}
							icon='Check'>
							Báo cáo
						</Button>
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
						{columns().map((item) => {
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
						{columns().map((item) => {
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
									onClick={() =>
										handleShowForm(
											workTrackLogs?.find((i) => i?.date === item?.date),
											item,
											row.original,
										)
									}
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

	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div className='row mb-0 h-100'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader className='w-100 text-center'>
									<CardLabel className='d-block w-100'>
										<CardTitle className='fs-4 my-2'>
											Danh sách nhiệm vụ của tôi
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
												right: '0',
												top: '7vh',
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
									</CardActions>
								</CardHeader>
								<CardBody>
									<Table columns={columnTables} data={treeValue} />
									<CardFooter
										tag='div'
										className=''
										size='lg'
										borderColor='primary'>
										<CardFooterRight className='fw-bold fs-5 d-flex'>
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
				<AlertConfirm
					openModal={toggleFormDelete}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleChangeStatus(itemEdit)}
					title='Báo cáo công việc'
					content='Xác nhận báo cáo công việc?'
				/>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingMe;
