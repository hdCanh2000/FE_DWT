/*eslint-disable */
import { Col, DatePicker, Input, Row, Table, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import Button from '../../../components/bootstrap/Button';
import { getListTarget } from '../../dailyWorkTracking/services';
import ModalOrderTaskForm from './ModalOrderTaskForm';
import { toast } from 'react-toastify';

const rolesString = window.localStorage.getItem('roles') || '[]';
const roles = JSON.parse(rolesString);

const isAdmin = roles.includes('admin') || roles.includes('manager');

const columns = [
	{
		title: 'STT',
		dataIndex: 'key',
		key: 'key',
		sorter: (a, b) => a.key - b.key,
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},
	{
		title: 'Tên định mức',
		dataIndex: 'name',
		key: 'name',
		render: (text) => {
			return (
				<Tooltip title={text} className='text-over-flow-lg'>
					<span>{text}</span>
				</Tooltip>
			);
		},
		sorter: (a, b) => a.name.localeCompare(b.name),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},

	{
		title: 'Mô tả',
		dataIndex: 'description',
		key: 'description',
		render: (text) => {
			return (
				<Tooltip title={text} className='text-over-flow-lg'>
					<span>{text}</span>
				</Tooltip>
			);
		},
		sorter: (a, b) => a.description?.localeCompare(b.description),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},

	{
		title: 'KHTT',
		dataIndex: 'executionPlan',
		key: 'executionPlan',
		render: (text) => {
			return (
				<Tooltip title={text} className='text-over-flow-lg'>
					<span>{text}</span>
				</Tooltip>
			);
		},
		sorter: (a, b) => a.executionPlan?.localeCompare(b.executionPlan),
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
	},

	{
		title: 'Man Day',
		dataIndex: 'manDay',
		key: 'manDay',
		sorter: (a, b) => a.manDay - b.manDay,
		sortDirections: ['descend', 'ascend', 'descend'],
		defaultSortOrder: 'descend',
		render: (text) => {
			return <div style={{ textAlign: 'end' }}>{text} Ngày</div>;
		},
	},
];
const TableListTarget = ({ onUpdateTargetInfo }) => {
	const [dataSearch, setDataSearch] = useState({
		q: '',
	});
	const [search, setSearch] = useState('');
	const [openOrderTask, setOpenOrderTask] = useState(false);
	const [selectedTarget, setSelectedTarget] = useState(null);
	const {
		data: listTargets = [],
		isLoading: loadingListTargets,
		isError: errorListTargets,
		refetch: reFetchListTargets,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) =>
		getListTarget({ ...queryKey[1] }),
	);
	const tableData = useMemo(
		() =>
			listTargets.map((item, index) => ({
				...item,
				key: index + 1,
			})),
		[listTargets],
	);
	const handleSearchTarget = (value) => {
		setDataSearch({
			...dataSearch,
			q: value,
		});
	};
	return (
		<>
			<Row gutter={24} className='mb-2'>
				<Col lg={8} md={8} sm={24} className='d-flex align-items-center'>
					<Input.Search
						onSearch={handleSearchTarget}
						onChange={(e) => setSearch(e.target.value)}
						value={search}
						placeholder='Tìm kiếm định mức'
					/>
					{dataSearch.q && (
						<Button
							color='link'
							className='mx-2'
							onClick={() => {
								setSearch('');
								setDataSearch({
									...dataSearch,
									q: '',
								});
							}}>
							Reset
						</Button>
					)}
				</Col>

				<Col md={8} lg={8} sm={24}>
					<DatePicker.MonthPicker
						format='MM/YYYY'
						locale={locale}
						value={dataSearch.start ? dayjs(dataSearch.start, 'M-DD-YYYY') : null}
						onChange={(updatedDate) => {
							if (updatedDate === null) {
								setDataSearch({
									...dataSearch,
									start: null,
									end: null,
								});
								return;
							}
							setDataSearch({
								...dataSearch,
								start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
								end: `${
									updatedDate.month() + 1
								}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
							});
						}}
					/>
				</Col>
			</Row>

			{!errorListTargets && (
				<Table
					columns={columns}
					dataSource={tableData}
					scroll={{ x: 'max-content' }}
					pagination={{ position: ['bottomCenter'] }}
					loading={loadingListTargets}
					onRow={(record) => {
						return {
							onClick: () => {
								if (isAdmin) {
									setSelectedTarget(record);
									setOpenOrderTask(true);
								} else {
									toast.warning('Không có quyền truy cập');
								}
							},
							style: {
								cursor: 'pointer',
							},
						};
					}}
				/>
			)}
			<ModalOrderTaskForm
				onClose={() => setOpenOrderTask(false)}
				open={openOrderTask}
				data={selectedTarget}
				isCreate
				onSuccess={reFetchListTargets}
				onUpdateTargetInfo={onUpdateTargetInfo}
			/>
		</>
	);
};
export default TableListTarget;
