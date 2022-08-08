import React from 'react';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';

const EmployeePage = () => {
	return (
		<PageWrapper title={demoPages.mucTieu.text}>
			<Page container='fluid'>
				<div className='row mt-4 mb-4'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Danh sách nhân viên</div>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
