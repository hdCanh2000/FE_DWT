/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';
import Select from 'react-select';
import moment from 'moment';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import { LIST_STATUS_PENDING } from '../../utils/constants';
import { getAllWorktrackByStatus, updateStatusWorktrack } from './services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';

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

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
	const defaultRef = React.useRef();
	const resolvedRef = ref || defaultRef;

	React.useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate;
	}, [resolvedRef, indeterminate]);

	return <input type='checkbox' ref={resolvedRef} {...rest} />;
});

const Table = ({ columns, data, onChangeStatusMultiple, darkModeStatus }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		selectedFlatRows,
		// eslint-disable-next-line no-unused-vars
		state: { selectedRowIds },
	} = useTable(
		{
			columns,
			data,
		},
		useRowSelect,
		(hooks) => {
			hooks.visibleColumns.push((columns) => [
				{
					id: 'selection',
					Header: ({ getToggleAllRowsSelectedProps }) => (
						<div>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</div>
					),
					Cell: ({ row }) => (
						<div>
							<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
						</div>
					),
				},
				...columns,
			]);
		},
	);

	const handleChangeStatusMultiple = () => {
		onChangeStatusMultiple(selectedFlatRows.map((d) => d.original));
	};

	return (
		<>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className='w-25 m-auto mt-4'>
				<Button
					color='info'
					isOutline={!darkModeStatus}
					isLight={darkModeStatus}
					onClick={handleChangeStatusMultiple}
					isDisable={!selectedFlatRows?.length}
					className='text-nowrap ms-2 rounded-0 outline-none shadow-none'
					icon='Check'>
					Duyệt nhiều
				</Button>
			</div>
			{/* <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
			<pre>
				<code>
					{JSON.stringify(
						{
							selectedRowIds,
							'selectedFlatRows[].original': selectedFlatRows.map((d) => d.original),
						},
						null,
						2,
					)}
				</code>
			</pre> */}
		</>
	);
};

const PendingWorktrackPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [dataWorktracks, setDataWorktracks] = useState([]);
	const [statusOption, setStatusOption] = useState({
		label: 'Chờ duyệt',
		value: 'pending',
	});

	async function fetchDataWorktracksByStatus(status) {
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
							statusName: LIST_STATUS_PENDING.find((st) => st.value === item.status)
								.label,
							userResponsible: item.users.find(
								(item) => item?.workTrackUsers?.isResponsible === true,
							)?.name,
						};
				  })
				: [],
		);
	}

	useEffect(() => {
		fetchDataWorktracksByStatus(statusOption.value);
	}, [statusOption.value]);

	const handleChangeStatus = (row) => {
		const dataSubmit = {
			id: row?.id,
			status: row.status === 'pending' ? 'accepted' : 'closed',
		};
		updateStatusWorktrack(dataSubmit)
			.then(() => {
				fetchDataWorktracksByStatus(statusOption.value);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
			});
	};

	const handleChangeStatusMultiple = (rows) => {
		for (let i = 0; i < rows.length; i += 1) {
			updateStatusWorktrack({
				id: rows[i].id,
				status: rows[i].status === 'pending' ? 'accepted' : 'closed',
			})
				.then(() => {})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log(error);
				})
				.finally(() => {
					fetchDataWorktracksByStatus(statusOption.value);
				});
		}
	};

	const columns = React.useMemo(
		() => [
			{
				Header: 'Danh sách nhiệm vụ',
				columns: [
					{
						Header: 'Tên nhiệm vụ',
						accessor: 'kpiNorm.name',
					},
					{
						Header: 'Thuộc mục tiêu',
						accessor: 'mission.name',
					},
					{
						Header: 'Người thực hiện',
						accessor: 'userResponsible',
					},
					{
						Header: 'Hạn hoàn thành',
						accessor: 'deadlineText',
					},
					{
						Header: 'Số lượng',
						accessor: 'quantity',
					},
					{
						Header: 'Trạng thái',
						accessor: 'statusName',
					},
					{
						Header: 'Hành động',
						accessor: 'action',
						Cell: ({ row }) => (
							<div className='d-flex align-items-center justify-content-center'>
								<Button
									isOutline={!darkModeStatus}
									color='success'
									isLight={darkModeStatus}
									className='text-nowrap'
									icon='Check'
									size='sm'
									onClick={() => handleChangeStatus(row.original)}>
									Duyệt
								</Button>
							</div>
						),
					},
				],
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
						<div className='col-12'>
							<Card className='w-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='FormatListBulleted' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
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
										<Styles>
											<Table
												columns={columns}
												data={data}
												darkModeStatus={darkModeStatus}
												onChangeStatusMultiple={handleChangeStatusMultiple}
											/>
										</Styles>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>,
					['admin', 'manager'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default PendingWorktrackPage;
