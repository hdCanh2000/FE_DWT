import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Card from '../../components/bootstrap/Card';
import Login from '../../pages/presentation/auth/Login';
import contents from '../../routes/contentRoutes';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
	const token = localStorage.getItem('token');
	return token !== null ? element : <Navigate to='/dang-nhap' replace />;
};

const ContentRoutes = () => {
	return (
		<div style={{ width: '100%' }}>
			<Routes>
				{contents.map((page) => (
					<Route
						key={page.path}
						path={page.path}
						exact={page.exact}
						element={<ProtectedRoute element={page.element} />}
					/>
				))}
				<Route path='/dang-nhap' element={<Login />} />
				<Route path='*' element={<PAGE_404 />} />
			</Routes>
			<Card style={{ textAlign: 'center', width: '100%' }} className='p-3'>
				Copyright © 2020 tbht. All rights reserved. - Designed by Thái IT
			</Card>
		</div>
	);
};

export default ContentRoutes;
