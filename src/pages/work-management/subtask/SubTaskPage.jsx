import React from 'react';
import { Badge } from 'react-bootstrap';
import workCountData from '../../../common/data/workCountData';
import CardAlert from '../../../components/CardAlert/CardAlert';
import CommonAvatarTeam from '../../../components/common/CommonAvatarTeam';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import { demoPages } from '../../../menu';
import TaskProgressTable from '../task-management/TaskProgressTable';

// eslint-disable-next-line react/prop-types
// const RenderWorkCount = ({ id, label, number, status }) => {
// 	const _status =
// 		(status === 1 && 'success') ||
// 		(status === 2 && 'warning') ||
// 		(status === 3 && 'danger') ||
// 		(status === 4 && 'info');
// 	return (
// 		<div className='col-xl-3 col-md-6 col-sm-12'>
// 			<Card key={id} className={`pt-1 pb-1 bg-l10-${_status}`}>
// 				<CardBody>
// 					<div className='row g-3 align-items-center'>
// 						<div className='col d-flex align-items-center'>
// 							<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
// 								<div>
// 									<div className='fw-bold fs-6 mb-0'>{`${label}: ${number}`}</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</div>
// 	);
// };

const SubTaskPage = () => {
	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.dauViec.text}>
			<SubHeader>
				<SubHeaderLeft>
					<strong className='fs-5'>Chào Bảo</strong>
					<SubheaderSeparator />
					<span>
						Bạn đang họp cùng{' '}
						<Badge color='info' isLight>
							2 phòng ban
						</Badge>{' '}
						với tổng cộng{' '}
						<Badge color='success' isLight>
							5 công việc
						</Badge>
						liên quan đến bạn.
					</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<CommonAvatarTeam>
						<strong>Các thành viên</strong> đội bạn
					</CommonAvatarTeam>
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div className='row'>
					{workCountData.map((item) => (
						<div className='col-xl-3 col-md-6 col-sm-12'>
							<CardAlert key={item.id} item={item} />
						</div>
					))}
				</div>
				<div className='row h-100'>
					<div className='col-12 h-100'>
						<TaskProgressTable />
					</div>
				</div>
			</Page>
		</PageWrapper>
		// <PageWrapper title={demoPages.quanLyCongViec.subMenu.dauViec.text}>
		// 	<Page container='fluid'>
		// 		<div className='row mt-4'>
		// 			{workCountData.map((item) => (
		// 				<div className='col-xl-3 col-md-6 col-sm-12'>
		// 					<CardAlert key={item.id} {...item} />
		// 				</div>
		// 			))}
		// 		</div>
		// 		<div className='row h-100'>
		// 			<div className='col-12 h-100'>
		// 				<TaskProgressTable isFluid />
		// 			</div>
		// 		</div>
		// 	</Page>
		// </PageWrapper>
	);
};

export default SubTaskPage;
