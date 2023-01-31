/* eslint-disable */
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import ReportForm from './ReportForm';
import Card from '../../components/bootstrap/Card';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getAllReport, getAllReportByUserId } from './service';
import { Col, Row, Table } from 'antd';

const columns = [
	{
		title: 'STT',
		dataIndex: 'stt',
		key: 'stt',
	},
	{
		title: 'Tên biên bản',
		dataIndex: 'title',
		key: 'title',
	},
	{
		title: 'File biên bản',
		dataIndex: 'file',
		key: 'file',
		render: (file) => (
			<a href={file} target='_blank' rel='noreferrer'>
				{file.split('/').pop()}
			</a>
		),
	},
];
const UploadReport = () => {
	const rolesString = window.localStorage.getItem('roles') || '[]';
	const roles = JSON.parse(rolesString);
	const isAdmin = roles.includes('admin');
	const userId = window.localStorage.getItem('userId');
	const {
		data = [],
		isLoading,
		isError,
		refetch,
	} = useQuery(['getAllReport', isAdmin, userId], ({ queryKey }) => {
		const [, isAdmin, userId] = queryKey;
		if (isAdmin) {
			return getAllReport();
		}
		return getAllReportByUserId(userId);
	});
	const tableData = data.map((item, index) => ({
		...item,
		stt: index + 1,
		key: item.id,
	}));
	return (
		<PageWrapper title='Biên bản họp'>
			<Page container='fluid'>
				<Card>
					<Row gutter={24}>
						{isAdmin && (
							<Col span={10}>
								<ReportForm onSuccess={refetch} />
							</Col>
						)}

						<Col span={isAdmin ? 14 : 24}>
							<h4 className='my-4 p-4'>Danh sách biên bản</h4>
							{isError ? (
								<p>Đã có lỗi xảy ra</p>
							) : (
								<Table
									columns={columns}
									dataSource={tableData}
									loading={isLoading}
								/>
							)}
						</Col>
					</Row>
				</Card>
			</Page>
		</PageWrapper>
	);
};
export default UploadReport;
