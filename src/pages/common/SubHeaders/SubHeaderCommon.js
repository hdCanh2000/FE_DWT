import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';

const SubHeaderCommon = () => {
	const navigate = useNavigate();
	return (
		<SubHeader className='top-0'>
			<SubHeaderLeft>
				<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
					Quay lại
				</Button>
			</SubHeaderLeft>
		</SubHeader>
	);
};

export default SubHeaderCommon;
