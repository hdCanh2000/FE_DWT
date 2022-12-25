/* eslint-disable */
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import React from 'react';
import { useQuery } from 'react-query';
import { getDailyWorks } from '../dailyWorkTracking/services';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import Button from '../../components/bootstrap/Button';
import { Table } from 'antd';
import ModalDailyWorkForm from './ModalDailyWorkForm';

const antdTableCols = [
	{
		title: 'STT',
		dataIndex: 'key',
		key: 'key',
	},
	{
		title: 'Tên tiêu chí',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'CST',
		dataIndex: 'monthKey',
		key: 'monthKey',
	},
	{
		title: 'Đơn vị',
		dataIndex: 'unitName',
		key: 'unit',
	},
];

const DailyWork = () => {
	const [dataSearch] = React.useState({
		q: '',
	});
	const [openDailyWorkForm, setOpenDailyWorkForm] = React.useState(false);
	const [dailyWork, setDailyWork] = React.useState(null);

	const {
		data: listDailyWorks = [],
		isLoading: isLoadingListDailyWorks,
		isError: isErrorListDailyWorks,
		refetch: refetchListDailyWorks,
	} = useQuery(['getDailyWorks', dataSearch], ({ queryKey }) => getDailyWorks(queryKey[1]));

	// normalize data
	const antdTableData = React.useMemo(() => {
		return listDailyWorks.map((item, index) => ({
			...item,
			key: index + 1,
			unitName: item.unit?.name,
		}));
	}, [listDailyWorks]);

	return (
		<PageWrapper title='Tiêu chí ngày'>
			<Page container='fluid'>
				<div>
					<div
						className='row mb-0'
						style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
						<div className='col-12'>
							<Card className='w-100 h-100'>
								<div style={{ margin: '24px 24px 0' }}>
									<CardHeader>
										<CardLabel icon='FormatListBulleted' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách tiêu chí ngày</CardLabel>
											</CardTitle>
										</CardLabel>
										{verifyPermissionHOC(
											<CardActions>
												<Button
													color='info'
													icon='AddCircleOutline'
													tag='button'
													onClick={() => {
														setDailyWork(null);
														setOpenDailyWorkForm(true);
													}}>
													Thêm mới
												</Button>
											</CardActions>,
											['admin', 'manager'],
										)}
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												{isErrorListDailyWorks ? (
													<div>Không thể lấy dữ liệu</div>
												) : (
													<Table
														columns={antdTableCols}
														dataSource={antdTableData}
														pagination={{
															defaultPageSize: 10,
															position: ['bottomRight'],
															showSizeChanger: false,
														}}
														loading={isLoadingListDailyWorks}
														onRow={(record) => {
															return {
																onClick: () => {
																	setDailyWork(record);
																	setOpenDailyWorkForm(true);
																},
															};
														}}
													/>
												)}
											</div>
										</div>
									</CardBody>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</Page>

			<ModalDailyWorkForm
				open={openDailyWorkForm}
				data={dailyWork}
				onClose={async (isDone) => {
					if (isDone) {
						await refetchListDailyWorks();
					}
					setOpenDailyWorkForm(false);
				}}
			/>
		</PageWrapper>
	);
};

export default DailyWork;
