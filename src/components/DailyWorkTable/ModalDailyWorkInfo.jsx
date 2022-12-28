/* eslint react/prop-types: 0 */
import { Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';

const StyledTable = styled.table`
	width: 100%;
	margin: 20px 0;
	border-collapse: collapse;
	border: 1px solid #111;

	& tr {
		border: 1px solid #111;
	}

	& td {
		border: 1px solid #111;
	}

	td:first-child {
		font-weight: bold;
	}
`;
const ModalDailyWorkInfo = ({ open, onOk, dailyWork }) => {
	const [currentDailyWork, setCurrentDailyWork] = useState(dailyWork);

	useEffect(() => {
		setCurrentDailyWork(dailyWork);
	}, [dailyWork]);
	const dataToRender = useMemo(
		() => [
			{
				label: 'Tiêu chí',
				value: currentDailyWork?.name,
			},
			{
				label: 'Người phụ trách',
				value: currentDailyWork?.user?.name || '',
			},
			{
				label: 'CST',
				value: `${currentDailyWork?.monthKey}`,
			},
			{
				label: 'ĐVT',
				value: `${
					typeof currentDailyWork?.unit === 'object'
						? currentDailyWork?.unit?.name
						: currentDailyWork?.unit || ''
				}`,
			},

			{
				label: 'Kết quả tạm tính',
				value: `${currentDailyWork?.progress}`,
			},
		],
		[currentDailyWork],
	);
	const columns = [
		{
			key: 'reportDate',
			title: 'Ngày báo cáo',
			dataIndex: 'reportDate',
			render: (text) => moment(text).format('DD/MM/YYYY'),
		},
		{
			key: 'quantity',
			title: 'Số lượng',
			dataIndex: 'quantity',
		},
		{
			key: 'status',
			title: 'Trạng thái công việc',
			dataIndex: 'status',
			render: (text) => {
				if (text === 'completed') return 'Hoàn thành';
				if (text === 'inProgress') return 'Đang thực hiện';
				return text;
			},
		},
		{
			key: 'files',
			title: 'Files báo cáo',
			dataIndex: 'files',
			render: (text) => {
				const filesArr = JSON.parse(text || '[]');
				return filesArr.map((file) => (
					<ul key={file}>
						<li>
							<a href={file} target='_blank' rel='noreferrer'>
								{file}
							</a>
						</li>
					</ul>
				));
			},
		},
	];

	const data = _.isEmpty(currentDailyWork)
		? []
		: currentDailyWork?.DailyWorkLogs.filter((x) => x.reportDate !== null)
				.sort((a, b) => {
					return moment(a.reportDate).diff(moment(b.reportDate));
				})
				.map((item) => ({
					...item,
					key: item.id,
				}));
	return (
		<Modal
			forceRender
			onOk={onOk}
			onCancel={onOk}
			open={open}
			title='Thông tin tiêu chí báo cáo ngày'
			width={800}>
			<div>
				<StyledTable>
					<tbody>
						{dataToRender.map((item) => (
							<tr key={item.label}>
								<td className='p-2'>{item.label}</td>
								<td className='p-2'>{item.value}</td>
							</tr>
						))}
					</tbody>
				</StyledTable>
			</div>
			<div>
				<h5>Danh sách báo cáo công việc</h5>
				<Table
					columns={columns}
					dataSource={data}
					bordered
					pagination={{
						pageSize: 3,
					}}
				/>
			</div>
		</Modal>
	);
};

export default ModalDailyWorkInfo;
