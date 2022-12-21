import React from 'react';
import { toast } from 'react-toastify';
import { L10n } from '@syncfusion/ej2-base';
import { Table } from 'antd';
import { useQuery } from 'react-query';
import _ from 'lodash';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { exportExcel } from './services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';

import { getListTarget } from '../dailyWorkTracking/services';
import ModalTargetForm from './ModalTargetForm';

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
		},
	},
});

const antdTableCols = [
	{
		title: 'STT',
		dataIndex: 'key',
		key: 'key',
	},
	{
		title: 'Tên nhiệm vụ',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Vị trí',
		dataIndex: 'positionName',
		key: 'position',
	},
	{
		title: 'Phòng ban',
		dataIndex: 'departmentName',
		key: 'departmentName',
	},
	{
		title: 'Man Day',
		dataIndex: 'manDay',
		key: 'manday',
	},

	{
		title: 'Số lượng',
		dataIndex: 'quantity',
		key: 'quantity',
	},
	{
		title: 'Đơn vị',
		dataIndex: 'unitName',
		key: 'unit',
	},
];

const KpiNormPage = () => {
	const [dataSearch] = React.useState({
		q: '',
	});
	const [openTargetForm, setOpenTargetForm] = React.useState(false);
	const [target, setTarget] = React.useState(null);
	const {
		data: listTarget = [],
		isLoading: isLoadingListTarget,
		isError: isErrorListTarget,
		refetch: refetchListTarget,
	} = useQuery(['getListTarget', dataSearch], ({ queryKey }) => getListTarget(queryKey[1]));

	// normalize data
	const antdTableData = React.useMemo(() => {
		return listTarget.map((item, index) => ({
			...item,
			key: index + 1,
			positionName: item.position?.name,
			departmentName: item.position?.department?.name,
			unitName: item.unit?.name,
		}));
	}, [listTarget]);
	const handleExportExcel = async () => {
		try {
			const response = await exportExcel();
			let filename = 'Danh mục định mức lao động.xlsx';
			const disposition = _.get(response.headers, 'content-disposition');
			if (disposition && disposition.indexOf('attachment') !== -1) {
				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
				const matches = filenameRegex.exec(disposition);
				if (matches != null && matches[1]) {
					filename = matches[1].replace(/['"]/g, '');
				}
			}
			const url = window.URL.createObjectURL(
				new Blob([response.data], { type: _.get(response.headers, 'content-type') }),
			);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
			toast.success('Xuất Excel thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		} catch (error) {
			toast.error('Xuất Excel không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	return (
		<PageWrapper title='Danh sách nhiệm vụ'>
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
												<CardLabel>Danh sách nhiệm vụ</CardLabel>
											</CardTitle>
										</CardLabel>
										{verifyPermissionHOC(
											<CardActions>
												<Button
													color='info'
													icon='AddCircleOutline'
													tag='button'
													onClick={() => {
														setTarget(null);
														setOpenTargetForm(true);
													}}>
													Thêm mới
												</Button>
												<Button
													color='primary'
													icon='FileDownload'
													tag='button'
													onClick={() => handleExportExcel()}>
													Xuất Excel
												</Button>
											</CardActions>,
											['admin', 'manager'],
										)}
									</CardHeader>
									<CardBody>
										<div className='control-pane'>
											<div className='control-section'>
												{isErrorListTarget ? (
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
														loading={isLoadingListTarget}
														onRow={(record) => {
															return {
																onClick: () => {
																	setTarget(record);
																	setOpenTargetForm(true);
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

			<ModalTargetForm
				open={openTargetForm}
				onClose={async (isDone) => {
					if (isDone) {
						await refetchListTarget();
					}
					setOpenTargetForm(false);
				}}
				data={target}
			/>
		</PageWrapper>
	);
};

export default KpiNormPage;
