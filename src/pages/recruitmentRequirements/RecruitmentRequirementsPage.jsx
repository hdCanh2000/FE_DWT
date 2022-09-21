import React, { useEffect } from 'react';
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
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import { addRequirement, updateRequirement, deleteRequirement } from './services';
import CommonForm from '../common/ComponentCommon/CommonForm';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';

const RecruitmentRequirementPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();

	const dispatch = useDispatch();
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const requirements = useSelector((state) => state.requirement.requirements);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);

	useEffect(() => {
		dispatch(fetchRequirementList());
	}, [dispatch]);

	const columns = [
		{
			title: 'Tên yêu cầu tuyển dụng',
			placeholder: 'tên yêu cầu tuyển dụng',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Mô tả yêu cầu tuyển dụng',
			placeholder: 'mô tả yêu cầu tuyển dụng',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
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
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};

	const handleDeleteRequirement = async (data) => {
		try {
			await deleteRequirement(data);
			dispatch(fetchRequirementList());
			handleShowToast(`Xoá yêu cầu năng lực`, `Xoá yêu cầu năng lực thành công!`);
		} catch (error) {
			handleShowToast(`Xoá yêu cầu năng lực`, `Xoá yêu cầu năng lực thất bại!`);
		}
		handleCloseDelete();
	};

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
			id: parseInt(data?.id, 10),
			name: data.name,
			description: data.description,
		};
		if (data.id) {
			try {
				const response = await updateRequirement(dataSubmit);
				const result = await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
				handleShowToast(
					`Cập nhật yêu cầu năng lực!`,
					`Yêu câu năng lực ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				handleShowToast(
					`Cập nhật yêu cầu năng lực`,
					`Cập nhật yêu cầu năng lực không thành công!`,
				);
			}
		} else {
			try {
				const response = await addRequirement(dataSubmit);
				const result = await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
				handleShowToast(
					`Thêm yêu cầu năng lực`,
					`Yêu cầu năng lực ${result.name} được thêm thành công!`,
				);
			} catch (error) {
				handleShowToast(`Thêm yêu cầu năng lực`, `Thêm yêu cầu năng lực không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.recruitmentRequirements.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>
										Quản lý yêu cầu tuyển dụng
									</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
								<Card className='w-100'>
									<CardHeader>
										<CardLabel icon='AccountCircle' iconColor='primary'>
											<CardTitle>
												<CardLabel>Danh sách yêu cầu tuyển dụng</CardLabel>
											</CardTitle>
										</CardLabel>
										<CardActions>
											<Button
												color='info'
												icon='PersonPlusFill'
												tag='button'
												onClick={() => handleOpenForm(null)}>
												Thêm yêu cầu năng lực
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={requirements}
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
							label={
								itemEdit?.id
									? 'Cập nhật yêu cầu năng lực'
									: 'Thêm mới yêu cầu năng lực'
							}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeleteRequirement(itemDelete?.id)}
							title='Xoá yêu cầu năng lực'
							content={`Xác nhận xoá yêu cầu năng lực <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default RecruitmentRequirementPage;
