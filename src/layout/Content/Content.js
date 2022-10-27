import React, { Suspense } from 'react';
import ContentRoutes from './ContentRoutes';
import Loading from '../../components/Loading/Loading';

const _loading = <Loading />;

const Content = () => {
	return (
		<main className='content'>
			<Suspense fallback={_loading}>
				<ContentRoutes />
			</Suspense>
		</main>
	);
};

export default Content;
