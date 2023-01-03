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
const ModalTargetInfo = ({ open, onOk, target }) => {
	const [currentTarget, setCurrentTarget] = useState(target);

	useEffect(() => {
		setCurrentTarget(target);
	}, [target]);
	const dataToRender = useMemo(
		() => [
			{
				label: 'Tên nhiệm vụ',
				value: currentTarget?.name,
			},
			{
				label: 'Mô tả',
				value: currentTarget?.description,
			},
			{
				label: 'Người phụ trách',
				value: currentTarget?.user?.name || '',
			},
			{
				label: 'Ngày bắt đầu',
				value: moment(currentTarget?.createdAt).format('DD/MM/YYYY'),
			},
			{
				label: 'Hạn hoàn thành',
				value: currentTarget.deadLine
					? moment(currentTarget.deadLine).format('DD/MM/YYYY')
					: '',
			},
			{
				label: 'Số lượng',
				value: `${currentTarget?.quantity} ${
					typeof currentTarget?.unit === 'object'
						? currentTarget?.unit?.name
						: currentTarget?.unit || ''
				}`,
			},
			{
				label: 'Man day',
				value: `${currentTarget?.manDay || '_'} ngày`,
			},
			{
				label: 'Kế hoạch thực hiện',
				value: currentTarget.executionPlan,
			},
		],
		[currentTarget],
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
								{file.split('/').pop()}
							</a>
						</li>
					</ul>
				));
			},
		},
	];

	const data = _.isEmpty(currentTarget)
		? []
		: currentTarget?.TargetLogs.filter((x) => x.reportDate !== null && x.deletedAt === null)
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
			title='Thông tin nhiệm vụ'
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

export default ModalTargetInfo;
