import React from 'react';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import Board from './Board';

const DetailTaskDepartmentPage = () => {
	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.chiTietCongViecPhongBan.text}>
			<Page container='fluid'>
				<div className='row mt-2 mb-4'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>
							Công việc phòng ban chi tiếtttt
						</div>
					</div>
				</div>
				<div className='row'>
					<Board />
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DetailTaskDepartmentPage;
