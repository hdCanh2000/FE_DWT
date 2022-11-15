import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import { login } from './services';

const Login = () => {
	const { darkModeStatus } = useDarkMode();
	const [account, setAccount] = useState({
		email: '',
		password: '',
	});
	const [errorMessage, setErrorMessage] = useState('');

	const handleChange = (e) => {
		const { value } = e.target;
		setAccount({
			...account,
			[e.target.name]: value,
		});
	};

	// const navigate = useNavigate();
	const handleOnClick = async (e) => {
		e.preventDefault();
		try {
			const response = await login(account);
			const result = await response.data;
			localStorage.setItem('token', result.data.accessToken);
			localStorage.setItem('email', result.data.email);
			localStorage.setItem('name', result.data.name);
			localStorage.setItem('userId', result.data.userId);
			localStorage.setItem('roles', JSON.stringify(result.data.role));
			window.location.href = '/';
		} catch (error) {
			setErrorMessage('Tài khoản hoặc mật khẩu không chính xác!');
		}
	};
	return (
		<PageWrapper title='Đăng nhập'>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div
						className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'
						style={{ marginTop: '10%' }}>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}
									/>
								</div>
								<>
									<div className='text-center h1 fw-bold mt-5'>Chào mừng,</div>
									<div className='text-center h4 text-muted mb-5'>
										Đăng nhập để tiếp tục!
									</div>
								</>
								<form className='row g-4' onSubmit={handleOnClick}>
									<div className='col-12 mb-'>
										<FormGroup
											id='email'
											className='mb-3'
											isFloating
											label='Nhập email'>
											<Input autoComplete='email' onChange={handleChange} />
										</FormGroup>
										<FormGroup
											id='password'
											className='mb-3'
											isFloating
											label='Password'>
											<Input
												type='password'
												autoComplete='password'
												onChange={handleChange}
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										{errorMessage && (
											<span style={{ fontSize: 14, color: '#e22828' }}>
												{errorMessage}
											</span>
										)}
									</div>
									<div className='col-12'>
										<Button
											color='warning'
											type='submit'
											className='w-100 py-3'
											onClick={handleOnClick}
											onChange={handleChange}>
											Đăng nhập
										</Button>
									</div>
								</form>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Login;
