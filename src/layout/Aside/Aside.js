import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { demoPages } from '../../menu';
import Card from '../../components/bootstrap/Card';
import Logo from '../../assets/logos/logo.png';

const Aside = () => {
	return (
		<div className='position-fixed aside-head top-0 left-0' style={{ maxWidth: 260 }}>
			<Link to='/'>
				<img src={Logo} alt='logo' style={{ width: '80%', marginLeft: '10%' }} />
			</Link>
			<Card className='mt-4' style={{ height: '100vh' }}>
				<Navigation menu={demoPages} id='aside-demo-pages' />
				<div className='p-3'>* Đây chỉ là phiên bản thử nghiệm *</div>
			</Card>
		</div>
	);
};

export default Aside;
