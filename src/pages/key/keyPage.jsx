import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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
import { addKey, getAllKeys, updateKey } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';

const KeyPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	// const navigate = useNavigate();
	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [ keys, setKeys] = useState([]);
	useEffect(() => {
		async function getKey() {
			try {
				const response = await getAllKeys();
				const data = await response.data;
				setKeys(data);
			} catch (error) {
				setKeys([]);
			}
		}
		getKey();
	}, []);

	const columns = [
		{
			title: 'Tên chỉ số Key',
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
		// {
		// 	title: 'Value',
		// 	id: 'value',
		// 	key: 'value',
		// 	type: 'number',
		// 	align: 'left',
		// 	isShow: true,
		// },
		{
			title: 'Đơn vị',
			id: 'unit',
			key: 'unit',
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
						onClick={() => handleOpenActionForm(item)}
					/>
					{/* <Button
						isOutline={!darkModeStatus}
						color='primary'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='ArrowForward'
						onClick={() => navigate(`/phong-ban/${item.id}`)}
					/> */}
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
			value: data.value,
			unit: data.unit,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateKey(dataSubmit);
				const result = await response.data;
				const newKeys = [...keys];
				setKeys(
					newKeys.map((item) => (item.id === data.id ? { ...result } : item)),
				);
				handleClearValueForm();
				hanleCloseForm();
				handleShowToast(
					`Cập nhật chỉ số key!`,
					`Chỉ số key ${result.name} được cập nhật thành công!`,
				);
			} catch (error) {
				setKeys(keys);
				handleShowToast(`Cập nhật chỉ số key`, `Cập nhật chỉ số key không thành công!`);
			}
		} else {
			try {
				const response = await addKey(dataSubmit);
				const result = await response.data;
				const newKeys = [...keys];
				newKeys.push(result);
				setKeys(newKeys);
				handleClearValueForm();
				hanleCloseForm();
				handleShowToast(`Thêm chỉ số key`, `Chỉ số key ${result.name} được thêm thành công!`);
			} catch (error) {
				setKeys(keys);
				handleShowToast(`Thêm chỉ số key`, `Thêm Chỉ số key không thành công!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.kpi.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div className='row mb-4'>
							<div className='col-12'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='display-6 fw-bold py-3'>
										Danh sách chỉ số Key
									</div>
								</div>
							</div>
						</div>
						<div className='row mb-0'>
							<div className='col-12'>
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
												onClick={() => handleOpenActionForm(null)}>
												Tạo Key
											</Button>
										</CardActions>
									</CardHeader>
									<div className='p-4'>
										<TableCommon
											className='table table-modern mb-0'
											columns={columns}
											data={keys}
										/>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={openForm}
							onClose={hanleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'Cập nhật key' : 'Tạo key mới'}
							fields={columns}
							validate={validate}
						/>
					</>,
					['admin', 'manager'],
				)}
			</Page>
		</PageWrapper>
	);
};

export default KeyPage;