/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _, { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Toast } from 'react-bootstrap';
import { addDays } from 'date-fns';
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
	calcTotalCurrentKPIWorkTrackByUser,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
	calcTotalKPIWorkTrackByUser,
	columns,
	createDataTreeTable,
	renderColor,
} from '../../utils/function';
import Icon from '../../components/icon/Icon';
import { getQueryDate } from '../../utils/utils';
import Table from './Table';
import Button from '../../components/bootstrap/Button';
import { inputRanges, staticRanges } from './customReactDateRange';

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
			startDate: new Date(),
			endDate: addDays(new Date(), 7),
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
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardActions style={{ display: 'inline-flex' }}>
										<Toast
											style={{
												width: 'auto',
												top: '7vh',
												right: '0',
												position: 'absolute',
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
											<Toast.Body>
												<div
													style={{ float: 'right', marginBottom: '5px' }}>
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
											Lọc theo ngày
										</Button>
									</CardActions>
								</CardHeader>
								<CardBody>
									<TableContainerOuter>
										{isEmpty(treeValue) ? (
											<h5
												style={{
													textAlign: 'center',
													border: '1px solid',
													padding: '20px',
												}}>
												Chưa có nhiệm vụ nào !
											</h5>
										) : (
											<TableContainer>
												<Styles>
													<Table
														columns={columnTables}
														data={treeValue}
													/>
												</Styles>
											</TableContainer>
										)}
									</TableContainerOuter>
									<CardFooter
										tag='div'
										className=''
										size='lg'
										borderColor='primary'>
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI:
											<span className='text-primary ms-2'>
												{calcTotalKPIWorkTrackByUser(worktrack)}
											</span>
										</CardFooterRight>
										<CardFooterRight tag='div' className='fw-bold fs-5'>
											Tổng điểm KPI hoàn thành:
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
export default DailyWorkTrackingUser;
