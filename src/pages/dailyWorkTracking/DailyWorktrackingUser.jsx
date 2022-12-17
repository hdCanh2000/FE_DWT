/* eslint-disable */
import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { Table } from 'antd';
import moment from 'moment';

const columns = [
	{
		title: 'MỤC TIÊU NHIỆM VỤ (THÁNG)',
		colSpan: 9,
		dataIndex: 'key',
		fixed: 'left'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'name',
		fixed: 'left',
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'description'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'deadline'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'quantity'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'unit'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'manDay'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'manDayEstimated'
	},
	{
		title: '',
		colSpan: 0,
		dataIndex: 'plan'
	},
	{
		title: 'Nhật trình công việc',
		colSpan: 31,
		dataIndex: 'day1',
	},
];
for (let i = 0; i < 30; i++) {
	columns.push({
		title: '',
		colSpan: 0,
		dataIndex: `day${i + 2}`,
	});
}
columns.push({
	title: 'Đánh giá KQ/Chấm KPI',
	colSpan: 2,
	dataIndex: 'currentManDay',
});
columns.push({
	title: '',
	colSpan: 0,
	dataIndex: 'comment',
});

const DailyWorkTrackingUser = () => {
	const params = useParams();
	const { id } = params;
	console.log('id', id);
	const headerRow = {
		key: 'STT',
		name: 'Mục tiêu/Nhiệm vụ',
		description: 'Diễn giải',
		deadline: 'Thời hạn',
		quantity: 'SL',
		unit: 'DVT',
		manDay: '~ MD',
		manDayEstimated: 'KQT MD',
		plan: 'KHTT (nêu có)',
		currentManDay: 'MD',
		comment: 'Ý kiến',
	};
	for (let i = 0; i < 31; i++) {
		const dayName = moment(`2022-12-${i + 1}`, 'YYYY-MM-DD').format('ddd');
		console.log(dayName);
		headerRow[`day${i + 1}`] = `${i + 1} \n ${dayName}`;
	}
	const data = [
		//header row
		headerRow,
		{
			key: '1',
			name: 'sửa bảng',
			description: 'sửa bảng theo dõi',
			deadline: '20-12-2022',
			quantity: 1,
			unit: 'bảng',
			manDay: 2,
			manDayEstimated: 2,
			plan: 'dùng antd sửa bảng',
			day1: '!1',
			day2: '1',
			day15: 2,
			currentManDay: '4',
			comment: 'Em huy dứt khoát',
		},
	];

	return (
		<PageWrapper title='Danh sách công việc'>
			<Page container='fluid'>
				<Card className='w-100'>
					<div style={{ margin: '24px 24px 0' }}>
						<CardHeader>
							<CardLabel icon='TaskAlt' iconColor='primary'>
								<CardTitle>
									<CardLabel>Danh sách nhiệm vụ của</CardLabel>
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='control-pane'>
								<div className='control-section'>
									<Table
										columns={columns}
										dataSource={data}
										bordered
										scroll={{ x: 'max-content' }}
									/>
								</div>
							</div>
						</CardBody>
					</div>
				</Card>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingUser;
