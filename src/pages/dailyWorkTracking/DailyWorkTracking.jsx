/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Toast } from 'react-bootstrap';
import { addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment/moment';
import { isEmpty } from 'lodash';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { fetchWorktrackListAll } from '../../redux/slice/worktrackSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import Loading from '../../components/Loading/Loading';
import DailyWorktrackForm from './DailyWorktrackForm';
import { addWorktrackLog, uploadFileReport } from './services';
import DailyWorktrackInfo from './DailyWorktrackInfo';
import { columns, renderColor } from '../../utils/function';
import Icon from '../../components/icon/Icon';
import Table from './Table';
import { getQueryDate } from '../../utils/utils';
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

const DailyWorkTracking = () => {
	const dispatch = useDispatch();

	const worktrack = useSelector((state) => state.worktrack.worktracks);
	const loading = useSelector((state) => state.worktrack.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));

	const [showForm, setShowForm] = React.useState(false);
	const [dataShow, setDataShow] = React.useState({
		row: {},
		column: {},
		valueForm: {},
	});

	const [open, setOpen] = useState(false);
	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: addDays(new Date(), 7),
			key: 'selection',
		},
	]);

	useEffect(() => {
		const { startDate, endDate } = getQueryDate(0);
		dispatch(fetchWorktrackListAll({ startDate, endDate }));
	}, [dispatch]);

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
		dispatch(fetchWorktrackListAll({ startDate, endDate }));
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
								paddingLeft: `${row.depth * 1}rem`,
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
							style={{ marginLeft: `${row.depth * 1.5}rem` }}
							onClick={() =>
								handleOpenForm({
									...row.original,
									parent: worktrack.workTracks?.find(
										(i) => i.id === row.original.parentId,
									),
								})
							}>
							{row.original.name || row.original.kpiNorm.name}
						</span>
					</div>
				);
			},
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
								<CardHeader>
									<CardLabel icon='TaskAlt' iconColor='primary'>
										<CardTitle>
											<CardLabel>Danh sách nhiệm vụ</CardLabel>
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
											icon='DateRange'
											onClick={() => setOpen(!open)}
											color='primary'>
											Lọc theo ngày
										</Button>
									</CardActions>
								</CardHeader>
								<CardBody className='w-100'>
									<TableContainerOuter>
										{isEmpty(worktrack) ? (
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
														data={worktrack}
													/>
												</Styles>
											</TableContainer>
										)}
									</TableContainerOuter>
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
