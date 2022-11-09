import React from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import _ from 'lodash';
import { toast } from 'react-toastify';
import Button from '../../components/bootstrap/Button';
import { CardFooter, CardFooterRight } from '../../components/bootstrap/Card';
import UserImageWebp from '../../assets/img/wanna/wanna6.webp';
import UserImage from '../../assets/img/wanna/wanna6.png';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Avatar from '../../components/Avatar';
import { getUserById } from '../employee/services';
import './styles.scss';
import CustomSelect from '../../components/form/CustomSelect';
import updateInformation from './services';
import Icon from '../../components/icon/Icon';
import validate from './validate';

const ChangeInformation = () => {
	const user = window.localStorage;

	const [newUser, setNewUser] = React.useState({});
	const [isEdit, setIsEdit] = React.useState(true);

	const fetch = async () => {
		const data = await getUserById(user?.userId);
		const newData = _.get(data, 'data.data', {});
		setNewUser(newData);
	};
	React.useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = async (data) => {
		const newData = {
			...data,
			sex: valueSex?.value,
			dateOfBirth: moment(data?.dateOfBirth).format('MM/DD/YYYY'),
		};
		try {
			await updateInformation(newData);
			toast.success('Cập nhật thông tin thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			fetch();
			handleOpenEdit();
		} catch (error) {
			toast.success('Cập nhật thông tin thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			throw error;
		}
	};

	const [valueSex, setValueSex] = React.useState();

	React.useEffect(() => {
		setValueSex({ value: newUser?.sex, label: newUser?.sex === 'male' ? 'Nam' : 'Nữ' });
	}, [newUser]);

	const handleChangeSelect = (data) => {
		setValueSex(data);
	};

	const formik = useFormik({
		initialValues: {
			...newUser,
			department: newUser?.department?.name,
			position: newUser?.position?.name,
		},
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (value) => {
			handleSubmit(value);
		},
	});

	const handleOpenEdit = () => {
		setIsEdit(!isEdit);
	};

	return (
		<div
			style={{ minWidth: '95%', margin: '0 auto', minHeight: '45vh', fontSize: '1.5rem' }}
			id='information'>
			<div className='row g-5 m-2'>
				<div className='col-12'>
					<div className='d-flex align-items-center'>
						<div className='flex-shrink-0'>
							<Avatar
								srcSet={UserImageWebp}
								src={UserImage}
								className='rounded-circle'
							/>
						</div>
						<div className='flex-grow-1 ms-3'>
							<div className='h2 fw-bold'>
								{newUser?.name} - {newUser?.code}{' '}
								{isEdit && (
									<Icon
										onClick={() => handleOpenEdit()}
										icon='edit'
										color='primary'
										style={{ cursor: 'pointer' }}
									/>
								)}
							</div>
							<div className='h5 text-muted'>{newUser?.email}</div>
							<div className='h5 text-muted'>{newUser?.role}</div>
						</div>
					</div>
				</div>
				<div className='row g-4' style={{ marginLeft: '11rem', width: '85%' }}>
					<div className='col-6'>
						<FormGroup id='name' label='Họ tên'>
							<Input
								disabled={isEdit}
								initialValues={newUser?.name}
								onChange={formik.handleChange}
								value={formik.values.name}
							/>
						</FormGroup>
						{formik?.errors?.name && (
							<span style={{ color: 'red' }}>{formik?.errors?.name}</span>
						)}
					</div>
					<div className='col-6'>
						<FormGroup id='sex' label='Giới tính'>
							<CustomSelect
								disabled={isEdit}
								onChange={(e) => handleChangeSelect(e)}
								value={valueSex}
								options={[
									{ label: 'Nam', value: 'male' },
									{ label: 'Nữ', value: 'female' },
								]}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='dateOfBirth' label='Ngày sinh'>
							<Input
								disabled={isEdit}
								type='date'
								onChange={formik.handleChange}
								value={moment(formik.values.dateOfBirth).format('YYYY-MM-DD')}
							/>
						</FormGroup>
						{formik?.errors?.dateOfBirth && (
							<span style={{ color: 'red' }}>{formik?.errors?.dateOfBirth}</span>
						)}
					</div>
					<div className='col-6'>
						<FormGroup id='phone' label='Số điện thoại'>
							<Input
								disabled={isEdit}
								type='tel'
								onChange={formik.handleChange}
								value={formik.values.phone}
							/>
						</FormGroup>
						{formik?.errors?.phone && (
							<span style={{ color: 'red' }}>{formik?.errors?.phone}</span>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='address' label='Địa chỉ'>
							<Input
								disabled={isEdit}
								onChange={formik.handleChange}
								value={formik.values.address}
							/>
						</FormGroup>
						{formik?.errors?.address && (
							<span style={{ color: 'red' }}>{formik?.errors?.address}</span>
						)}
					</div>
					<div className='col-6'>
						<FormGroup id='department' label='Phòng ban'>
							<Input
								disabled
								onChange={formik.handleChange}
								value={formik.values.department}
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='position' label='Vị trí làm việc'>
							<Input
								onChange={formik.handleChange}
								value={formik.values.position}
								disabled
							/>
						</FormGroup>
					</div>
				</div>
			</div>
			{!isEdit && (
				<CardFooter>
					<CardFooterRight>
						<Button
							type='submit'
							color='info'
							icon='Save'
							onClick={formik.handleSubmit}>
							Xác nhận
						</Button>
					</CardFooterRight>
				</CardFooter>
			)}
		</div>
	);
};

export default ChangeInformation;
