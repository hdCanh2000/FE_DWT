import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';

const SubHeaderCommonRight = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('email');
		localStorage.removeItem('name');
		localStorage.removeItem('roles');
		navigate('/dang-nhap');
	};
	return (
		<SubHeader>
			<SubHeaderLeft> </SubHeaderLeft>
			<SubHeaderRight>
				<Button color='info' isLink icon='ArrowForward' onClick={() => handleLogout()}>
					Đăng xuất
				</Button>
			</SubHeaderRight>
		</SubHeader>
	);
};

export default SubHeaderCommonRight;
