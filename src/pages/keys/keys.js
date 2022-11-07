import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
// import { addKey, getAllKeys, updateKey, deleteKey } from './services';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { fetchUnitList } from '../../redux/slice/unitSlice';
import NotPermission from '../presentation/auth/NotPermission';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { changeCurrentPage, fetchKeyList } from '../../redux/slice/keySlice';
import { addkey, deleteKey, updateKey } from './services';
import AlertConfirm from '../common/ComponentCommon/AlertConfirm';
import validate from './validate';

const Keys = () => {
	const [searchParams] = useSearchParams();
	const text = searchParams.get('text') || '';
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const localtion = useLocation();

	const { darkModeStatus } = useDarkMode();
	const units = useSelector((state) => state.unit.units);
	const keys = useSelector((state) => state.key.keys);
	const currentPage = useSelector((state) => state.key.currentPage);
	const pagination = useSelector((state) => state.key.pagination);
	const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const handleOpenFormDelete = (data) => dispatch(toggleFormSlice.actions.confirmForm(data));
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	// const toggleFormDelete = useSelector((state) => state.toggleForm.confirm);

	const fetch = () => {
		const query = {};
		query.text = text;
		query.page = currentPage;
		query.limit = 10;
		dispatch(fetchKeyList(query));
	};
	useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, currentPage, text]);
	useEffect(() => {
		dispatch(fetchUnitList());
	}, [dispatch]);
	const columns = [
		{
			title: 'Tên chỉ số key',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 6,
		},
		{
			title: 'Đơn vị',
			id: 'unit',
			key: 'unit',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.unit?.name}</span>,
			options: units,
			col: 6,
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
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
	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};
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
	const handleSubmitForm = async (data) => {
		const newValue = {
			id: get(itemEdit, 'id', null),
			name: data?.name,
			description: data?.description,
			unit_id: data?.unit?.id,
			unit: data.unit,
		};
		if (isEmpty(itemEdit)) {
			try {
				await addkey(newValue);
				toast.success('Thêm chỉ số key thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			} catch (error) {
				toast.error('Thêm chỉ số key không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		} else {
			try {
				await updateKey(newValue);
				toast.success('Thay đổi chỉ số key thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			} catch (error) {
				toast.error('Thay đổi chỉ số key không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
			}
		}
		fetch();
		handleCloseForm();
	};
	const handleDelete = async (data) => {
		try {
			await deleteKey(data?.id);
			toast.success('Xóa chỉ số key thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		} catch (error) {
			toast.error('Xóa chỉ số key không thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
		}
		fetch();
		handleCloseForm();
	};
	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};
	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.keys.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-0'>
							<div className='col-8' style={{ margin: '0 auto', height: '90vh' }}>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='VpnKey' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách chỉ số Key</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='VpnKey'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm mới
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={keys}
											onSubmitSearch={handleSubmitSearch}
											onChangeCurrentPage={handleChangeCurrentPage}
											currentPage={parseInt(currentPage, 10)}
											totalItem={pagination?.totalRows}
											total={pagination?.total}
											setCurrentPage={setCurrentPage}
											searchvalue={text}
											isSearch
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật key' : 'Tạo key mới'}
							fields={columns}
							validate={validate}
						/>
						<AlertConfirm
							openModal={toggleFormDelete}
							onCloseModal={handleCloseForm}
							onConfirm={() => handleDelete(itemEdit)}
							title='Xoá nhân viên'
							content={`Xác nhận xoá nhân viên <strong>${itemEdit?.name}</strong> ?`}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default Keys;
