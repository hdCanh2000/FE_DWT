/* eslint-disable */
import React, { useMemo, useState } from 'react';
import { L10n } from '@syncfusion/ej2-base';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import { getListTarget } from '../../dailyWorkTracking/services';

import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { Table } from 'antd';
import ModalTargetInfo from '../../../components/TargetTable/ModalTargetInfo';
import Button from '../../../components/bootstrap/Button';

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
		},
	},
});
const columns = [
	{
		title: 'Mục tiêu/Nhiệm vụ',
		dataIndex: 'name',
		key: 'name',
	},
	{
		key: 'description',
		title: 'Diễn giải',
		dataIndex: 'description',
	},
	{
		key: 'userName',
		title: 'Người phụ trách',
		dataIndex: 'userName',
	},
	{
		key: 'deadline',
		title: 'Thời hạn',
		dataIndex: 'deadLine',
	},
	{
		key: 'manday',
		title: 'Man day',
		dataIndex: 'manDay',
	},
	{
		key: 'quantity',
		title: 'Số lượng',
		dataIndex: 'quantity',
	},
	{
		key: 'unit',
		title: 'Đơn vị',
		dataIndex: 'unit',
	},
	{
		key: 'executionPlan',
		title: 'KHTT',
		dataIndex: 'executionPlan',
	},
];
const OrderTaskPage = () => {
	const [targetInfoModalData, setTargetInfoModalData] = useState(false);
	const [isOpenTargetInfoModal, setIsOpenTargetInfoModal] = useState(false);
	const [dataSearch, setDataSearch] = useState({
		q: '',
	});
	const {
		data: listTarget = [],
		isLoading: isLoadingListTarget,
		isError: isErrorListTarget,
		refetch: reFetchListTarget,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) => getListTarget(queryKey[1]));
	const tableData = useMemo(
		() =>
			listTarget.map((item) => ({
				...item,
				key: item.id,
				deadLine: dayjs(item.deadLine).format('DD/MM/YYYY'),
				userName: item.user?.name || '',
				unit: item.unit?.name || '',
			})),
		[listTarget],
	);
	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				<Card style={{ height: '800px' }}>
					<CardHeader>
						<CardLabel>
							<CardTitle>
								<CardLabel>Danh sách nhiệm vụ</CardLabel>
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardHeader>
						<CardActions>
							<div className='d-flex '>
								<Button icon='plus' color='primary'>
									Giao việc
								</Button>
							</div>
						</CardActions>
					</CardHeader>
					<CardBody className='mh-100' isScrollable>
						<div className='control-pane h-100'>
							<div className='control-section h-100'>
								<Table
									columns={columns}
									dataSource={tableData}
									scroll={{ x: 'max-content' }}
									loading={isLoadingListTarget}
									onRow={(record) => {
										return {
											onClick: () => {
												setTargetInfoModalData(record);
												setIsOpenTargetInfoModal(true);
											},
										};
									}}
								/>
							</div>
						</div>
					</CardBody>
				</Card>
			</Page>

			<ModalTargetInfo
				open={isOpenTargetInfoModal}
				target={targetInfoModalData}
				onOk={() => setIsOpenTargetInfoModal(false)}
			/>
		</PageWrapper>
	);
};
export default OrderTaskPage;
