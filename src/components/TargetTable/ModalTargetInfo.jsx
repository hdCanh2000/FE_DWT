/* eslint react/prop-types: 0 */
import { Button, Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import _ from 'lodash';
import ModalCommentTarget from './ModalCommentTarget';

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
const ModalTargetInfo = ({ open, onOk, target, reFetchListTarget }) => {
	const [currentTarget, setCurrentTarget] = useState(target);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const roles = window.localStorage.getItem('roles') || "['']";
	const roleArr = JSON.parse(roles);
	const canComment = roleArr.includes('manager') || roleArr.includes('admin');

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
				// hack to ensure that the value is always an array when currentTarget is null that why js sucks
				value: (currentTarget?.users || []).map((item) => item.name).join(', '),
			},
			{
				label: 'Vụ trí phụ trách',
				// hack to ensure that the value is always an array that why js sucks
				value: (currentTarget?.positions || []).map((item) => item.name).join(', '),
			},
			{
				label: 'Ngày bắt đầu',
				value: moment(currentTarget?.createdAt).format('DD/MM/YYYY'),
			},
			{
				label: 'Hạn hoàn thành',
				value: currentTarget.deadline,
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
			{
				label: 'Ý kiến TPB',
				value: currentTarget.managerComment,
			},
			{
				label: 'Chấm điểm',
				value: currentTarget.recentManDay ? `${currentTarget.recentManDay} MD` : '',
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
		: currentTarget?.TargetLogs.filter((x) => x.reportDate !== null)
				.sort((a, b) => {
					return moment(a.reportDate).diff(moment(b.reportDate));
				})
				.map((item) => ({
					...item,
					key: item.id,
				}));
	return (
		<>
			<Modal
				forceRender
				onOk={onOk}
				onCancel={onOk}
				open={open}
				title='Thông tin nhiệm vụ'
				width={800}
				footer={[
					<Button onClick={onOk}>Đóng</Button>,
					canComment && (
						<Button
							onClick={() => {
								setOpenCommentModal(true);
							}}
							type='primary'>
							Nhận xét nhiệm vụ
						</Button>
					),
				]}>
				<div style={{ height: 500, overflowY: 'scroll' }}>
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
				</div>
			</Modal>
			<ModalCommentTarget
				open={openCommentModal}
				target={currentTarget}
				onClose={() => {
					setOpenCommentModal(false);
				}}
				onSuccess={async () => {
					await reFetchListTarget();
					onOk();
				}}
			/>
		</>
	);
};

export default ModalTargetInfo;
