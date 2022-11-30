/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { useTable } from 'react-table';
import Select from 'react-select';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import { LIST_STATUS_PENDING } from '../../utils/constants';
import { getAllWorktrackByStatus, updateStatusWorktrack } from './services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';
import Alert from '../../components/bootstrap/Alert';
import Loading from '../../components/Loading/Loading';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import DetailPendingWorkTrack from './DetailPendingWorktrack';
import ConfirmForm from './ConfirmForm';
import {
	calcCurrentKPIOfWorkTrack,
	calcProgressTask,
	calcTotalFromWorkTrackLogs,
	calcTotalKPIOfWorkTrack,
} from '../../utils/function';

const Styles = styled.div`
	table {
		border-spacing: 0;
		border: 1px solid black;
		width: 100%;
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
				border-right: 0;
			}
		}
	}
`;

const Table = ({ columns, data }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns,
		data,
	});

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<th
								{...column.getHeaderProps({
									style: {
										textAlign: column.align,
									},
								})}>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.slice(0, 10).map((row) => {
					prepareRow(row);
					return (
						<tr {...row.getRowProps()}>
							{row.cells.map((cell) => {
								return (
									<td
										{...cell.getCellProps({
											style: {
												textAlign: cell.column.align,
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

const PendingWorktrackPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [dataWorktracks, setDataWorktracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusOption, setStatusOption] = useState({
		label: 'Chờ duyệt',
		value: 'pending',
	});
	const dispatch = useDispatch();
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const item = useSelector((state) => state.toggleForm.data);

	const [isConfirmForm, setIsConfirmForm] = useState(false);
	const [selectedRow, setSelectedRow] = useState({});

	const handleOpenConfirm = (row) => {
		setIsConfirmForm(true);
		setSelectedRow(row);
	};

	async function fetchDataWorktracksByStatus(status) {
		try {
			const response = await getAllWorktrackByStatus(status);
			setDataWorktracks(
				// eslint-disable-next-line no-nested-ternary
				response.data.data !== null
					? response.data?.data?.map((item) => {
							return {
								...item,
								deadlineText: item.deadline
									? moment(item.deadline).format('DD-MM-YYYY')
									: '--',
								statusName: LIST_STATUS_PENDING.find(
									(st) => st.value === item.status,
								).label,
								userResponsible: item.users.find(
									(item) => item?.workTrackUsers?.isResponsible === true,
								)?.name,
								totalKPI: calcTotalKPIOfWorkTrack(item),
								totalQuantity: calcTotalFromWorkTrackLogs(item.workTrackLogs),
								currentKPI: calcCurrentKPIOfWorkTrack(item),
								progress: calcProgressTask(item),
							};
					  })
					: [],
			);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setDataWorktracks([]);
		}
	}

	useEffect(() => {
		fetchDataWorktracksByStatus(statusOption.value);
	}, [statusOption.value]);

	const handleChangeStatus = (row) => {
		const dataSubmit = {
			id: row?.id,
			status: row.status === 'pending' ? 'accepted' : 'closed',
		};
		updateStatusWorktrack(
			isConfirmForm ? { ...dataSubmit, kpi_point: row.kpi_point } : dataSubmit,
		)
			.then(() => {
				fetchDataWorktracksByStatus(statusOption.value);
				setIsConfirmForm(false);
				toast.success('Duyệt công việc thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			})
			.catch((error) => {
				toast.error('Duyệt công việc không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			});
	};

	const columns = React.useMemo(
		() => [
			{
				Header: 'Tên nhiệm vụ',
				accessor: 'kpiNorm.name',
			},
			{
				Header: 'Người thực hiện',
				accessor: 'userResponsible',
			},
			{
				Header: 'Số lượng',
				accessor: 'quantity',
				align: 'right',
			},
			{
				Header: 'Giá trị KPI',
				accessor: 'totalKPI',
				align: 'right',
			},
			{
				Header: 'Số lượng hoàn thành',
				accessor: 'totalQuantity',
				align: 'right',
			},
			{
				Header: 'KPI tạm tính',
				accessor: 'currentKPI',
				align: 'right',
			},
			{
				Header: 'Hành động',
				accessor: 'action',
				align: 'center',
				Cell: ({ row }) => (
					<div className='align-items-center'>
						<Button
							style={{ marginRight: '10px' }}
							isOutline={!darkModeStatus}
							color='primary'
							isLight={darkModeStatus}
							className='text-nowrap'
							icon='RemoveRedEye'
							size='sm'
							onClick={() =>
								handleOpenForm({
									...row.original,
								})
							}>
							Xem
						</Button>
						<Button
							isOutline={!darkModeStatus}
							color='success'
							isLight={darkModeStatus}
							className='text-nowrap'
							icon='Check'
							size='sm'
							onClick={
								statusOption.value === 'pending'
									? () => handleChangeStatus(row.original)
									: () => handleOpenConfirm(row.original)
							}>
							Duyệt
						</Button>
					</div>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const data = React.useMemo(() => dataWorktracks, [dataWorktracks]);

	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<div
						className='row mb-0 h-100'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						{loading ? (
							<Loading />
						) : (
							<div className='col-12'>
								<Card className='w-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel
												icon='FormatListBulleted'
												iconColor='primary'>
												<CardTitle>
													<CardLabel>
														Danh sách công việc chờ duyệt
													</CardLabel>
												</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='w-100'>
											<div className='w-100 mb-3'>
												<div className='row g-2'>
													<div className='col-5'>
														<Select
															className='w-100'
															placeholder='Trạng thái'
															value={statusOption}
															defaultValue={statusOption}
															onChange={setStatusOption}
															options={LIST_STATUS_PENDING}
														/>
													</div>
												</div>
											</div>
											{!_.isEmpty(data) ? (
												<Styles>
													<Table columns={columns} data={data} />
												</Styles>
											) : (
												<Alert
													color='warning'
													isLight
													icon='Report'
													className='mt-0'>
													Chưa có công việc cần duyệt!
												</Alert>
											)}
										</CardBody>
									</div>
								</Card>
							</div>
						)}
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
			</Page>
			<DetailPendingWorkTrack data={item} handleClose={handleCloseForm} show={toggleForm} />
			<ConfirmForm
				show={isConfirmForm}
				item={selectedRow}
				handleClose={() => setIsConfirmForm(false)}
				handleSubmit={handleChangeStatus}
			/>
		</PageWrapper>
	);
};

export default PendingWorktrackPage;
