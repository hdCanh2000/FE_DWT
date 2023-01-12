import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Col, Row, Table, Input, DatePicker } from 'antd';
import { useQuery } from 'react-query';
import locale from 'antd/es/date-picker/locale/vi_VN';
import _ from 'lodash';
import dayjs from 'dayjs';
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

const antdTableCols = [
	{
		title: 'STT',
		dataIndex: 'key',
		key: 'key',
	},
	{
		title: 'Tên định mức',
		dataIndex: 'name',
		key: 'name',
		render: (text) => <div className='text-over-flow-md'>{text}</div>,
	},
	{
		title: 'Mô tả',
		dataIndex: 'description',
		key: 'description',
		render: (text) => <div className='text-over-flow-md'>{text}</div>,
	},
	{
		title: 'Vị trí',
		dataIndex: 'positionText',
		key: 'positionText',
	},
	{
		title: 'KHTT',
		dataIndex: 'executionPlan',
		key: 'executionPlan',
		render: (text) => <div className='text-over-flow-md'>{text}</div>,
	},
	{
		title: 'Man Day',
		dataIndex: 'manDay',
		key: 'manday',
	},
];

const KpiNormPage = () => {
	const [date, setDate] = useState(dayjs());
	const [dataSearch, setDataSearch] = React.useState({
		q: '',
		start: `${dayjs().month() + 1}-01-${dayjs().year()}`,
		end: `${dayjs().month() + 1}-${dayjs().daysInMonth()}-${dayjs().year()}`,
	});
	const [openTargetForm, setOpenTargetForm] = React.useState(false);
	const [target, setTarget] = React.useState(null);
	const [search, setSearch] = React.useState('');
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
			positionText: item.position?.name ?? '-',
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

	const handleChangeMonth = (updatedDate) => {
		setDate(updatedDate);
		setDataSearch({
			...dataSearch,
			start: `${updatedDate.month() + 1}-01-${updatedDate.year()}`,
			end: `${updatedDate.month() + 1}-${updatedDate.daysInMonth()}-${updatedDate.year()}`,
		});
	};

	const handleSearch = (value) => {
		setDataSearch({
			...dataSearch,
			q: value,
		});
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
												<CardLabel>Danh sách định mức lao động</CardLabel>
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
											<Row gutter={24} className='mt-2 mb-4'>
												<Col
													lg={6}
													md={12}
													sm={24}
													className='d-flex align-items-center'>
													<Input.Search
														placeholder='Tìm kiếm nhiệm vụ'
														value={search}
														onChange={(e) => setSearch(e.target.value)}
														onSearch={handleSearch}
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
															reset
														</Button>
													)}
												</Col>
												<Col lg={12} md={12} sm={24} />
												<Col
													lg={6}
													md={12}
													sm={24}
													className='d-flex justify-content-end align-items-center'>
													<div className='mx-2 font-weight-bold'>
														Tháng:
													</div>
													<DatePicker.MonthPicker
														format='MM/YYYY'
														locale={locale}
														style={{ width: 100 }}
														value={date}
														onChange={handleChangeMonth}
													/>
												</Col>
											</Row>
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
				onCancel={() => setOpenTargetForm(false)}
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
