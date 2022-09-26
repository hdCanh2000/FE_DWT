import React from 'react';
import Card from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../menu';
import TableWorkTrack from './tableWorkTracking';

const dailyWorkTracking = () => {
	return (
		<PageWrapper title={demoPages.jobsPage.subMenu.dailyWorkTracking.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Công việc hằng ngày</div>
						</div>
					</div>
				</div>
				<div className='row mb-0' style={{ height: '100%' }}>
					<div className='col-12'>
						<Card className='w-100 h-100'>
							<div className='p-4'>
								<div className='col-12'>
									<table
										className='table table-modern mb-0'
										style={{ fontSize: 14 }}>
										<thead>
											<tr>
												<th>Tên định mức KPI</th>
												<th className='text-center'>Phòng ban</th>
												<th className='text-center'>Đơn vị tính</th>
												<th className='text-center'>
													Điểm KPI trên 1 đơn vị
												</th>
												<th className='text-center'>Hành động</th>
											</tr>
										</thead>
										{/* <tbody>
											</tbody> */}
									</table>
								</div>
							</div>
							<div className='row p-4'>
								<div className='col-6'>
									<TableWorkTrack />
								</div>
								<div className='col-6'>
                                <TableWorkTrack />
								</div>
							</div>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
export default dailyWorkTracking;
