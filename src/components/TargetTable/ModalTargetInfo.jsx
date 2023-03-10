/* eslint react/prop-types: 0 */
import { Button, Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { CardBody, CardLabel, CardSubTitle, CardTitle } from '../bootstrap/Card';
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
const ModalTargetInfo = ({ listTarget, open, onOk, target, reFetchListTarget }) => {
	const [currentTarget, setCurrentTarget] = useState(target);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const roles = window.localStorage.getItem('roles') || "['']";
	const roleArr = JSON.parse(roles);
	const canComment = roleArr.includes('manager') || roleArr.includes('admin');

	const dataReport = useSelector((state) => state.report.reports);

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
				label: 'Thuộc định mức lao động',
				value: currentTarget?.Target?.name,
			},
			{
				label: 'Mô tả',
				value: currentTarget?.description,
			},
			{
				label: 'Người phụ trách',
				// hack to ensure that the value is always an array when currentTarget is null that why js sucks
				value: currentTarget?.user?.name || '',
			},
			{
				label: 'Vụ trí phụ trách',
				// hack to ensure that the value is always an array that why js sucks
				value: currentTarget?.position?.name || '',
			},
			{
				label: 'Ngày bắt đầu',
				value: moment(currentTarget?.startDate).format('DD/MM/YYYY'),
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
				value: currentTarget.managerManDay ? `${currentTarget.managerManDay} MD` : '',
			},
		],
		[currentTarget],
	);

	// data table tiêu chí
	const filterReport = _.isEmpty(currentTarget)
		? []
		: currentTarget?.TargetLogs.filter((x) => x.reportDate !== null)
				.sort((a, b) => {
					return moment(a.reportDate).diff(moment(b.reportDate));
				})
				.map((item) => ({
					...item,
					key: item.id,
				}));
	const filterRecord = filterReport.map((item) => item.keyReports);
	const concatArrRecord = _.concat(...filterRecord);
	const arrDataRecord = concatArrRecord.map((item) => item.keyRecord);

	const columnsRecord = [
		{
			key: 'createdAt',
			title: 'Ngày tạo',
			sorter: (a, b) => (a?.createdAt || '').localeCompare(b?.createdAt || ''),
			render: (text) => {
				const findDate = filterReport.find((date) => date.id === text?.targetLogId);
				return findDate ? moment(findDate.reportDate).format('DD/MM/YYYY') : '--';
			},
		},
		{
			key: 'name',
			title: 'Tiêu chí',
			dataIndex: 'keyReportId',
			render: (keyReportId) => {
				const foundData = dataReport.find((data) => data.id === keyReportId);
				return foundData ? foundData.name : null;
			},
		},
		{
			key: 'value',
			title: 'Giá trị',
			dataIndex: 'value',
			sorter: (a, b) => a.value - b.value,
		},
	];

	// table list bao cao
	const columnsReport = [
		{
			key: 'reportDate',
			title: 'Ngày báo cáo',
			dataIndex: 'reportDate',
			sorter: (a, b) => (a?.reportDate || '').localeCompare(b?.reportDate || ''),
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

	const arrDataReport = _.isEmpty(currentTarget)
		? []
		: currentTarget?.TargetLogs.filter((x) => x.reportDate !== null)
				.sort((a, b) => {
					return moment(a.reportDate).diff(moment(b.reportDate));
				})
				.map((item) => ({
					...item,
					key: item.id,
				}));

	// total content
	const totalValue = arrDataRecord.map((item) => item.value);
	const keyReportInMonth = arrDataRecord.map((item) => item.keyReportId);
	const totalRecordInMonth = _.uniqWith(keyReportInMonth, _.isEqual);

	const filterFileReport = filterReport.map((item) => item.files);
	const fileReport = filterFileReport
		.map((item) => item.slice(1).slice(0, -1))
		.filter((item) => item !== '')
		.flatMap((x) => x.split(',')).length;

	const idTargetInfo = currentTarget.Target ? currentTarget.Target.id : null;
	const getTargetInfo = listTarget.filter((item) => item.Target.id === idTargetInfo);
	const getUserByTargetInfo = getTargetInfo.map((item) => item.user.id);
	const totalUserByTargetInfo = _.uniqWith(getUserByTargetInfo, _.isEqual);
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});

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
					<CardBody>
						<CardLabel icon='StackedBarChart'>
							<CardTitle tag='h4' className='h5'>
								Tổng hợp báo cáo
							</CardTitle>
							<CardSubTitle>Kết quả tạm tính</CardSubTitle>
						</CardLabel>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '20px',
							}}>
							<div>
								<h5>{`Số báo cáo đã lập trong tháng: ${
									fileReport || '0'
								} file`}</h5>
								<h5>{`Số nhân sự thực hiện: ${
									totalUserByTargetInfo.length || 'chưa có'
								} nhân sự`}</h5>
							</div>
							<div>
								<h5>{`Số tiêu chí đạt được trong tháng: ${
									totalRecordInMonth.length || '0'
								} tiêu chí`}</h5>
								<h5>{`Giá trị doanh thu: ${VND.format(
									_.sum(totalValue) || '0',
								)}`}</h5>
							</div>
						</div>
					</CardBody>
					<div>
						<h5>Danh sách tiêu chí công việc</h5>
						<Table
							columns={columnsRecord}
							dataSource={arrDataRecord}
							bordered
							pagination={{
								pageSize: 3,
							}}
						/>
					</div>
					<div>
						<h5>Danh sách báo cáo công việc</h5>
						<Table
							columns={columnsReport}
							dataSource={arrDataReport}
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
