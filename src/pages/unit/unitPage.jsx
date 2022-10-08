import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
import { getAllUnits, addUnit, updateUnit, deleteUnit } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';

const UnitPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const params = useParams();
	// const navigate = useNavigate();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [units, setUnits] = useState([]);
	const [deletes, setDeletes] = React.useState({});
	const [openConfirm, set0penConfirm] = React.useState(false);

	async function getUnit() {
		try {
			const response = await getAllUnits();
			const data = await response.data?.data;
			setUnits(data);
		} catch (error) {
			setUnits([]);
		}
	}

	useEffect(() => {
		getUnit();
	}, []);

	const handleOpenConfirm = (item) => {
		setDeletes({
			id: item.id,
			name: item.name,
		});
		set0penConfirm(true);
	};
	const handleCloseDeleteComfirm = () => {
		setDeletes({});
		set0penConfirm(false);
	};
	async function fetchUnits() {
		const res = await getAllUnits();
		setUnits(res.data.data);
	}
	const handleDelete = async (valueDelete) => {
		try {
			await deleteUnit(valueDelete?.id);
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thành công!`);
		} catch (error) {
			handleShowToast(`Xoá đơn vị`, `Xoá đơn vị thất bại!`);
		}
		fetchUnits(params?.id);
	};
	const columns = [
		{
			title: 'Mã đơn vị',
			id: 'code',
			key: 'code',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Tên đơn vị',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			// render: (item) => (
			// 	<Link className='text-underline' to={`/phong-ban/${item.id}`}>
			// 		{item.name}
			// 	</Link>
			// ),
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
						onClick={() => handleOpenActionForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenConfirm(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleOpenActionForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};

	const hanleCloseForm = () => {
		setOpenForm(false);
		setItemEdit(null);
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

	const handleClearValueForm = () => {
		setItemEdit(null);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			id: data?.id,
			name: data.name,
			code: data.code,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateUnit(dataSubmit);
				const result = await response.data;
				const newUnits = [...units];
				setUnits(newUnits.map((item) => (item.id === data.id ? { ...result } : item)));
				handleClearValueForm();
				hanleCloseForm();
				getUnit();
				handleShowToast(
					`Cập nhật đơn vị!`,
					`Đơn vị ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setUnits(units);
				handleShowToast(`Cập nhật đơn vị`, `Cập nhật đơn vị không thành công!`);
			}
		} else {
			try {
				const response = await addUnit(dataSubmit);
				const result = await response.data;
				const newUnits = [...units];
				newUnits.push(result);
				setUnits(newUnits);
				handleClearValueForm();
				hanleCloseForm();
				getUnit();
				handleShowToast(`Thêm đơn vị`, `Đơn vị ${result.data.name} được thêm thành công!`);
			} catch (error) {
				setUnits(units);
				handleShowToast(`Thêm đơn vị`, `Thêm đơn vị không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.unit.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div
							className='row mb-0'
							style={{ maxWidth: '60%', minWidth: '60%', margin: '0 auto' }}>
							<div className='col-12'>
								<Card className='w-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel icon='ReceiptLong' iconColor='primary'>
												<CardTitle>
													<CardLabel>Danh sách đơn vị tính</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='ReceiptLong'
													tag='button'
													onClick={() => handleOpenActionForm(null)}>
													Thêm mới
												</Button>
											</CardActions>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={units}
											/>
										</div>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={openForm}
							onClose={hanleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật đơn vị tính' : 'Tạo đơn vị mới tính'}
							fields={columns}
							validate={validate}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseDeleteComfirm}
					onConfirm={() => handleDelete(deletes)}
					title='Xoá đơn vị tính'
					content={`Xác nhận xoá đơn vị tính <strong>${deletes?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default UnitPage;
