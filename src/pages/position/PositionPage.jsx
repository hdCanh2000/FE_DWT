// goij api  theem suwra xoas thuong viet controller

import React, { useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
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
import Toasts from '../../components/bootstrap/Toasts';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';
import { fetchDepartmentList } from '../../redux/slice/departmentSlice';
import { addPosition, updatePosition } from './services';
import { formatPosition } from '../../utils/constants';

const PositionPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const positions = useSelector((state) => state.position.positions);
	const departments = useSelector((state) => state.department.departments);

	useEffect(() => {
		dispatch(fetchPositionList());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchDepartmentList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên Vị Trí',
			placeholder: 'tên vị trí',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Mã Vị Trí',
			placeholder: 'mã vị trí',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Mô Tả Vị Trí',
			placeholder: 'mô tả vị trí',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'center',
			isShow: true,
		},
		{
			title: 'Cấp Nhân Sự',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			format: (value) => formatPosition(value),
			options: [
				{
					id: 1,
					text: 'Lao Động Phổ Thông',
					value: 0,
				},
				{
					id: 2,
					text: 'Lao động kĩ thuật - NV văn phòng',
					value: 1,
				},
				{
					id: 3,
					text: 'Chuyên viên',
					value: 2,
				},
				{
					id: 4,
					text: 'Trưởng nhóm',
					value: 3,
				},
				{
					id: 5,
					text: 'Trưởng phòng',
					value: 4,
				},
				{
					id: 6,
					text: 'QL cấp trung',
					value: 5,
				},
				{
					id: 7,
					text: 'QL cấp cao',
					value: 6,
				},
				{
					id: 8,
					text: 'Lãnh Đạo',
					value: 7,
				},
			],
		},
		{
			title: 'Phòng Ban',
			id: 'departmentId',
			key: 'departmentId',
			type: 'select',
			align: 'center',
			isShow: true,
			render: (item) => <span>{item?.department?.name || 'No data'}</span>,
			options: departments,
		},
		// {
		// 	title: 'Trạng thái',
		// 	id: 'status',
		// 	key: 'status',
		// 	type: 'switch',
		// 	align: 'center',
		// 	isShow: true,
		// 	format: (value) => (value === 1 ? 'Đang hoạt động' : 'Không hoạt động'),
		// },
		{
			title: 'Hành Động',
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
					{/* <Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='ArrowForward'
						onClick={() => navigate(`/quan-ly-vi-tri/${item.id}`)}
					/> */}
				</>
			),
			isShow: false,
		},
	];

	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data.name,
			code: data.code,
			description: data.description,
			position: Number.parseInt(data.position, 10),
			departmentId: data.departmentId,
		};
		if (data.id) {
			try {
				const response = await updatePosition(dataSubmit);
				const result = await response.data;
				dispatch(fetchPositionList());
				// handleClearValueForm();
				handleCloseForm();
				handleShowToast(
					`Cập nhật vị trí!`,
					`Vị trí ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(`Cập nhật phòng ban`, `Cập nhật phòng ban không thành công!`);
			}
		} else {
			try {
				const response = await addPosition(dataSubmit);
				const result = await response.data;
				dispatch(fetchPositionList());
				// handleClearValueForm();
				handleCloseForm();
				handleShowToast(`Thêm vị trí`, `Vị trí ${result.name} được thêm thành công!`);
			} catch (error) {
				handleShowToast(`Thêm vị trí`, `Thêm vị trí không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.position.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>Quản Lý Vị Trí</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='AccountCircle' iconColor='primary'>
											<CardTitle>
												<CardLabel>Quản Lý Vị Trí</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm vị trí
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={positions}
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
							label={itemEdit?.id ? 'Cập nhật vị trí' : 'Thêm mới vị trí'}
							fields={columns}
							validate={validate}
						/>
					</>,
					['admin'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default PositionPage;
