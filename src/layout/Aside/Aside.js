import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { demoPages } from '../../menu';
import Card from '../../components/bootstrap/Card';
import Logo from '../../assets/logos/logo.png';

const Aside = () => {
	return (
		<div className='position-fixed aside-head top-0 left-0' style={{ minWidth: 260 }}>
			<Card style={{ height: '100vh' }}>
				<div style={{ marginTop: '10px' }}>
					<Link to='/'>
						<img src={Logo} alt='logo' style={{ width: '60%', marginLeft: '18%' }} />
					</Link>
				</div>
				<Navigation menu={demoPages} id='aside-demo-pages' />
				<div className='p-3'>* Phiên bản thử nghiệm *</div>
			</Card>
		</div>
	);
};

export default Aside;
