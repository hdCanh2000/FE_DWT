import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { demoPages } from '../../menu';
import Card from '../../components/bootstrap/Card';
import Logo from '../../assets/logos/logo.png';
// import Button from '../../components/bootstrap/Button';

const Aside = () => {
	// const [isShow, setIsShow] = React.useState(true);
	// const handleOpen = () => {
	// 	setIsShow(!isShow);
	// };
	return (
		<div className='position-fixed aside-head top-0 left-0' style={{ maxWidth: 260 }}>
			<Card className='mt-4' style={{ height: '100vh' }}>
				<div style={{ marginTop: '10px' }}>
					<Link to='/'>
						<img src={Logo} alt='logo' style={{ width: '60%', marginLeft: '18%' }} />
					</Link>
					{/* <Button
						icon='LastPage'
						style={{ border: '1px solid #DCDCDC' }}
						onClick={handleOpen}
					/> */}
				</div>
				<Navigation menu={demoPages} id='aside-demo-pages' />
				<div className='p-3'>* Đây chỉ là phiên bản thử nghiệm *</div>
			</Card>
		</div>
	);
};

export default Aside;
