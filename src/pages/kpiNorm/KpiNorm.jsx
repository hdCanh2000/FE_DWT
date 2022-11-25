import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
	Filter,
	Toolbar,
	Inject,
	Resize,
} from '@syncfusion/ej2-react-treegrid';
import { L10n } from '@syncfusion/ej2-base';
import _, { isEmpty } from 'lodash';
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
import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';
import { exportExcel } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import KPINormForm from './KPINormForm';
import Loading from '../../components/Loading/Loading';
import { fetchUnitList } from '../../redux/slice/unitSlice';

L10n.load({
	'vi-VI': {
		grid: {
			EmptyDataSourceError: 'Có lỗi xảy ra, vui lòng tải lại trang.',
			EmptyRecord: 'Không có dữ liệu nhiệm vụ.',
		},
	},
});

const KpiNormPage = () => {
	const dispatch = useDispatch();
	const kpiNorm = useSelector((state) => state.kpiNorm.kpiNorms);
	const units = useSelector((state) => state.unit.units);
	const loading = useSelector((state) => state.kpiNorm.loading);
	const positions = useSelector((state) => state.position.positions);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const toolbarOptions = ['Search'];
	const searchOptions = {
		fields: ['data.name', 'data.position.name'],
		ignoreCase: true,
		key: '',
		operator: 'contains',
	};

	useEffect(() => {
		dispatch(fetchPositionList());
		dispatch(fetchKpiNormList());
		dispatch(fetchUnitList());
	}, [dispatch]);

	const [treeValue, setTreeValue] = React.useState([]);

	const fixForm = () => {
		return kpiNorm.map((item) => ({
			...item,
			quantity: !_.isNumber(item.quantity) ? '--' : item.quantity,
			kpi_value: !_.isNumber(item.kpi_value) ? '--' : item.kpi_value,
		}));
	};

	const createDataTree = useCallback((dataset) => {
		const hashTable = Object.create(null);
		dataset.forEach((aData) => {
			hashTable[aData.id] = { data: aData, children: [] };
		});
		const dataTree = [];
		dataset.forEach((aData) => {
			if (aData.parentId) {
				hashTable[aData.parentId]?.children.push(hashTable[aData.id]);
			} else {
				dataTree.push(hashTable[aData.id]);
			}
		});
		return dataTree;
	}, []);

	useEffect(() => {
		if (!isEmpty(kpiNorm)) {
			const treeData = createDataTree(fixForm());
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [createDataTree, kpiNorm]);

	const columns = [
		{
			title: 'Tên nhiệm vụ',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'Vị trí đảm nhiệm',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			options: positions,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Thuộc nhiệm vụ cha (nếu có)',
			id: 'parent',
			key: 'parent',
			type: 'select',
			align: 'center',
			options: kpiNorm,
			isShow: true,
			isMulti: false,
			col: 6,
		},
		{
			title: 'Loại nhiệm vụ',
			id: 'taskType',
			key: 'taskType',
			type: 'select',
			align: 'center',
			options: [
				{
					label: 'Thường xuyên',
					value: 'Thường xuyên',
				},
				{
					label: 'Không thường xuyên',
					value: 'Không thường xuyên',
				},
				{
					label: 'Kinh doanh',
					value: 'Kinh doanh',
				},
			],
			isShow: true,
			isMulti: false,
			col: 6,
			render: (item) => <span>{item?.taskType?.value || 'No data'}</span>,
		},
		{
			title: 'Mô tả/Diễn giải',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'center',
			isShow: true,
		},
	];

	// const handleSubmitForm = async (data) => {
	// 	const dataSubmit = {
	// 		unit_id: data?.unit?.id,
	// 		id: parseInt(data?.id, 10),
	// 		name: data?.name,
	// 		description: data?.description,
	// 		descriptionKpiValue: data.descriptionKpiValue,
	// 		position_id: parseInt(data.position?.id, 10) || null,
	// 		department_id:
	// 			parseInt(data.position?.department?.id, 10) || parseInt(data?.department?.id, 10),
	// 		parent_id: parseInt(data?.parent?.id, 10) || null,
	// 		kpi_value: Number(data.kpi_value) || null,
	// 		manday: Number(data.manday) || null,
	// 		quantity: parseInt(data.quantity, 10) || null,
	// 		taskType: data?.taskType.value || 'Thường xuyên',
	// 	};
	// 	if (data.id) {
	// 		try {
	// 			const response = await updateKpiNorm(dataSubmit);
	// 			await response.data;
	// 			toast.success('Cập nhật định mức lao động thành công!', {
	// 				position: toast.POSITION.TOP_RIGHT,
	// 				autoClose: 1000,
	// 			});
	// 			dispatch(fetchKpiNormList());
	// 			handleCloseForm();
	// 		} catch (error) {
	// 			dispatch(fetchKpiNormList());
	// 			toast.error('Cập nhật định mức lao động không thành công!', {
	// 				position: toast.POSITION.TOP_RIGHT,
	// 				autoClose: 1000,
	// 			});
	// 			throw error;
	// 		}
	// 	} else {
	// 		try {
	// 			const response = await addKpiNorm(dataSubmit);
	// 			await response.data;
	// 			toast.success('Thêm định mức lao động thành công!', {
	// 				position: toast.POSITION.TOP_RIGHT,
	// 				autoClose: 1000,
	// 			});
	// 			dispatch(fetchKpiNormList());
	// 			handleCloseForm();
	// 		} catch (error) {
	// 			dispatch(fetchKpiNormList());
	// 			toast.error('Thêm định mức lao động không thành công!', {
	// 				position: toast.POSITION.TOP_RIGHT,
	// 				autoClose: 1000,
	// 			});
	// 			throw error;
	// 		}
	// 	}
	// };

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
		<PageWrapper title='Danh mục định mức lao động'>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						<div
							className='row mb-0'
							style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
							<div className='col-12'>
								<Card className='w-100 h-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel
												icon='FormatListBulleted'
												iconColor='primary'>
												<CardTitle>
													<CardLabel>
														Danh mục định mức lao động
													</CardLabel>
												</CardTitle>
											</CardLabel>
											{verifyPermissionHOC(
												<CardActions>
													<Button
														color='info'
														icon='AddCircleOutline'
														tag='button'
														onClick={() => handleOpenForm(null)}>
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
													<TreeGridComponent
														locale='vi-VI'
														dataSource={treeValue}
														treeColumnIndex={0}
														allowResizing
														allowReordering
														toolbar={toolbarOptions}
														searchSettings={searchOptions}
														className='cursor-pointer'
														rowSelected={(item) => {
															handleOpenForm(item.data.data);
														}}
														childMapping='children'
														height='600'>
														<Inject services={[Resize]} />
														<ColumnsDirective>
															<ColumnDirective
																field='data.name'
																headerText='Tên nhiệm vụ'
																width='200'
															/>
															<ColumnDirective
																field='data.position.name'
																headerText='Vị trí đảm nhiệm'
																width='90'
																textAlign='Left'
															/>
															<ColumnDirective
																field='data.manday'
																headerText='Ngày công cần thiết'
																width='90'
																textAlign='Center'
															/>
															<ColumnDirective
																field='data.kpi_value'
																headerText='Giá trị KPI'
																width='90'
																textAlign='Center'
															/>
															<ColumnDirective
																field='data.quantity'
																headerText='Số lượng'
																width='90'
																textAlign='Center'
															/>
														</ColumnsDirective>
														<Inject services={[Filter, Toolbar]} />
													</TreeGridComponent>
												</div>
											</div>
										</CardBody>
									</div>
								</Card>
							</div>
						</div>
					</div>
				)}
				<KPINormForm
					show={toggleForm}
					onClose={handleCloseForm}
					// handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={
						itemEdit?.id ? 'Cập nhật định mức lao động' : 'Thêm mới định mức lao động'
					}
					fields={columns}
					validate={validate}
					size='xl'
					units={units}
				/>
			</Page>
		</PageWrapper>
	);
};

export default KpiNormPage;
