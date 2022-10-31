import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';
import changePass from '../../layout/Header/services';
import { handleLogout } from '../../utils/utils';

const ChangePass = () => {
	const [validate, setValidate] = React.useState();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

	const handleSubmit = async (data) => {
		const reponse = await changePass(data);
		handleValidate(reponse.data.data);
	};

	const handleValidate = (data) => {
		if (data === 'Password must be at least 4 characters !!!') {
			setValidate({ newPassword: 'Vui lòng nhập mật khẩu mới trên 4 kí tự !' });
		}
		if (data === 'Wrong Current Password !') {
			setValidate({ oldPassword: 'Mật khẩu hiện tại không đúng !' });
		}
		if (data === 'Confirm password wrong !') {
			setValidate({ newPassword2: 'Nhập mật khẩu xác nhận không đúng !' });
		}
		if (data === 'Same old password') {
			setValidate({ newPassword: 'Mật khẩu bị trùng !', oldPassword: 'Mật khẩu bị trùng !' });
		}
		if (data === true) {
			setValidate({});
			handleLogout();
			toast.success('Đổi mật khẩu thành công!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 1000,
			});
			setTimeout(() => {
				navigate('/dang-nhap');
			}, 1000);
		}
	};
	const formik = useFormik({
		initialValues: {
			oldPassword: '',
			newPassword: '',
			newPassword2: '',
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});
	return (
		<Card
			className='rounded-2'
			tag='form'
			onSubmit={formik.handleSubmit}
			style={{ width: '40%', margin: '0 auto' }}>
			<CardHeader>
				<CardLabel icon='Lock'>
					<CardTitle>Đổi mật khẩu</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<div>
					<div className='row g-4'>
						<FormGroup className='col-lg-12' id='oldPassword' label='Mật khẩu cũ'>
							<Input
								type='password'
								onChange={formik.handleChange}
								value={formik.values.oldPassword}
							/>
						</FormGroup>
						<div className='text-danger mt-1'>
							{validate?.oldPassword && (
								<span style={{ color: 'red' }}>{validate?.oldPassword}</span>
							)}
						</div>
						<div className='w-100 m-0' />
						<FormGroup className='col-lg-12' id='newPassword' label='Mật khẩu mới'>
							<Input
								type='password'
								onChange={formik.handleChange}
								value={formik.values.newPassword}
							/>
						</FormGroup>
						{validate?.newPassword && (
							<span style={{ color: 'red' }}>{validate?.newPassword}</span>
						)}
						<div className='w-100 m-0' />
						<FormGroup
							className='col-lg-12'
							id='newPassword2'
							label='Nhập lại mật khẩu mới'>
							<Input
								type='password'
								onChange={formik.handleChange}
								value={formik.values.newPassword2}
							/>
						</FormGroup>
						{validate?.newPassword2 && (
							<span style={{ color: 'red' }}>{validate?.newPassword2}</span>
						)}
					</div>
				</div>
			</CardBody>
			<CardFooter>
				<CardFooterRight>
					<Button type='submit' color='info' icon='Save'>
						Xác nhận
					</Button>
				</CardFooterRight>
			</CardFooter>
		</Card>
	);
};

export default ChangePass;
