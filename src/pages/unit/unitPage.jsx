import React, { useEffect } from 'react';
import { useNavigate, useLocation, createSearchParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';
import Loading from '../../components/Loading/Loading';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { changeCurrentPage, fetchUnitList } from '../../redux/slice/unitSlice';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
import { addResource, deleteResouce, updateResouce } from '../../api/fetchApi';

const UnitPage = () => {
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const localtion = useLocation();
	const [searchParams] = useSearchParams();
	const dispatch = useDispatch();

	const units = useSelector((state) => state.unit.units);
	const pagination = useSelector((state) => state.unit.pagination);
	const loading = useSelector((state) => state.unit.loading);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);
	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const currentPage = useSelector((state) => state.unit.currentPage);

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const text = searchParams.get('text') || '';

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchUnitList(query));
	}, [dispatch, currentPage, text]);

	const handleSubmitSearch = (searchValue) => {
		if (searchValue.text === '') {
			searchParams.delete('text');
			navigate({
				pathname: localtion.pathname,
			});
		} else {
			navigate({
				pathname: localtion.pathname,
				search: createSearchParams({
					text: searchValue.text,
				}).toString(),
			});
		}
		setCurrentPage(1);
	};

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	const handleDelete = async (data) => {
		try {
			await deleteResouce('/api/units', data?.id);
			toast.success('Xoá đơn vị thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			const query = {};
			query.text = text;
			query.page = currentPage;
			query.limit = 10;
			dispatch(fetchUnitList(query));
			handleCloseForm();
		} catch (error) {
			toast.error('Xoá đơn vị không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	const columns = [
		{
			title: 'Tên đơn vị',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mã đơn vị',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Hành động',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenFormDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			name: data.name,
			code: data.code,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateResouce('/api/units', { id: data?.id, ...dataSubmit });
				await response.data;
				toast.success('Cập nhật đơn vị thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				handleCloseForm();
				const query = {};
				query.text = text;
				query.page = currentPage;
				query.limit = 10;
				dispatch(fetchUnitList(query));
			} catch (error) {
				toast.error('Cập nhật đơn vị không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addResource('/api/units', dataSubmit);
				await response.data;
				toast.success('Thêm đơn vị thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				handleCloseForm();
				const query = {};
				query.text = text;
				query.page = 1;
				query.limit = 10;
				dispatch(fetchUnitList(query));
			} catch (error) {
				toast.error('Thêm đơn vị không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.unit.text}>
			<Page container='fluid'>
				{loading ? (
					<Loading />
				) : (
					<div>
						{verifyPermissionHOC(
							<div className='row mb-0'>
								<div className='col-7' style={{ margin: '0 auto' }}>
									<Card className='w-100'>
										<CardHeader>
											<CardLabel icon='ReceiptLong' iconColor='primary'>
												<CardTitle>
													<CardLabel>Danh sách đơn vị tính</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='AddCircleOutline'
													tag='button'
													onClick={() =>
														handleOpenForm({ name: '', code: '' })
													}>
													Thêm mới
												</Button>
											</CardActions>
										</CardHeader>
										<CardBody>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={units}
												onSubmitSearch={handleSubmitSearch}
												onChangeCurrentPage={handleChangeCurrentPage}
												currentPage={parseInt(currentPage, 10)}
												totalItem={pagination?.totalRows}
												total={pagination?.total}
												setCurrentPage={setCurrentPage}
												searchvalue={text}
												isSearch
											/>
										</CardBody>
									</Card>
								</div>
							</div>,
							['admin'],
							<NotPermission />,
						)}
					</div>
				)}
				<CommonForm
					show={toggleForm}
					onClose={handleCloseForm}
					handleSubmit={handleSubmitForm}
					item={itemEdit}
					label={itemEdit?.id ? 'Cập nhật đơn vị tính' : 'Tạo đơn vị mới tính'}
					fields={columns}
				/>
				<AlertConfirm
					openModal={toggleFormDelete}
					onCloseModal={handleCloseForm}
					onConfirm={() => handleDelete(itemEdit)}
					title='Xoá đơn vị tính'
					content='Xác nhận xoá đơn vị tính?'
				/>
			</Page>
		</PageWrapper>
	);
};

export default UnitPage;
