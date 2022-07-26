import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Badge from '../../../components/bootstrap/Badge';
import CommonAvatarTeam from '../../../components/common/CommonAvatarTeam';
import CardAlert from '../../../components/CardAlert/CardAlert';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Icon from '../../../components/icon/Icon';
import Progress from '../../../components/bootstrap/Progress';
import AddTaskForm from './AddTaskForm';

// eslint-disable-next-line react/prop-types
const Item = ({ name, teamName, attachCount, taskCount, percent, dueDate }) => {
	const navigate = useNavigate();
	const handleOnClickToProjectPage = useCallback(
		() => navigate(`../${demoPages.projectManagement.subMenu.itemID.path}/1`),
		[navigate],
	);
	return (
		<div className='col-md-6 col-xl-4 col-sm-12'>
			<Card stretch onClick={handleOnClickToProjectPage} className='cursor-pointer'>
				<CardHeader>
					<CardLabel icon='Ballot'>
						<CardTitle>{name}</CardTitle>
						<CardSubTitle>{teamName}</CardSubTitle>
					</CardLabel>
					<CardActions>
						<small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
							{dueDate}
						</small>
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className='row g-2 mb-3'>
						<div className='col-auto'>
							<Badge color='light' isLight>
								<Icon icon='AttachFile' /> {attachCount}
							</Badge>
						</div>
						<div className='col-auto'>
							<Badge color='light' isLight>
								<Icon icon='TaskAlt' /> {taskCount}
							</Badge>
						</div>
					</div>
					<div className='row'>
						<div className='col-md-6'>
							{percent}%
							<Progress isAutoColor value={percent} height={10} />
						</div>
						<div className='col-md-6 d-flex justify-content-end'>
							<AvatarGroup>
								<Avatar
									srcSet={USERS.GRACE.srcSet}
									src={USERS.GRACE.src}
									userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
									color={USERS.GRACE.color}
								/>
								<Avatar
									srcSet={USERS.SAM.srcSet}
									src={USERS.SAM.src}
									userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
									color={USERS.SAM.color}
								/>
								<Avatar
									srcSet={USERS.CHLOE.srcSet}
									src={USERS.CHLOE.src}
									userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
									color={USERS.CHLOE.color}
								/>

								<Avatar
									srcSet={USERS.JANE.srcSet}
									src={USERS.JANE.src}
									userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
									color={USERS.JANE.color}
								/>
								<Avatar
									srcSet={USERS.JOHN.srcSet}
									src={USERS.JOHN.src}
									userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
									color={USERS.JOHN.color}
								/>
								<Avatar
									srcSet={USERS.RYAN.srcSet}
									src={USERS.RYAN.src}
									userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
									color={USERS.RYAN.color}
								/>
							</AvatarGroup>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

const TaskListPage = () => {
	const dataWork = [
		{
			id: 1,
			label: 'Công việc của tôi',
			number: null,
			status: 1,
		},
		{
			id: 2,
			label: 'Công việc tôi giao',
			number: null,
			status: 2,
		},
		{
			id: 3,
			label: 'Công việc được giao',
			number: null,
			status: 3,
		},
		{
			id: 4,
			label: 'Công việc chờ duyệt',
			number: null,
			status: 4,
		},
	];

	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const handleUpcomingEdit = () => {
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};

	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.danhSach.text}>
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
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Danh sách công việc</div>
					</div>
					<div className='col-md-6 col-xl-4 col-sm-12'>
						<Card stretch>
							<CardHeader className='bg-transparent'>
								<CardLabel>
									<CardTitle tag='h4' className='h5'>
										Phòng Digital Marketing
									</CardTitle>
									<CardSubTitle tag='h5' className='h6 text-muted'>
										Có một cuộc họp vào lúc 12 giờ trưa.
									</CardSubTitle>
								</CardLabel>
								<CardActions>
									<Button
										icon='ArrowForwardIos'
										aria-label='Read More'
										hoverShadow='default'
										// color={darkModeStatus && 'dark'}
										// onClick={handleOnClickToEmployeeListPage}
									/>
								</CardActions>
							</CardHeader>
							<CardBody>
								<AvatarGroup>
									<Avatar
										srcSet={USERS.GRACE.srcSet}
										src={USERS.GRACE.src}
										userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
										color={USERS.GRACE.color}
									/>
									<Avatar
										srcSet={USERS.SAM.srcSet}
										src={USERS.SAM.src}
										userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
										color={USERS.SAM.color}
									/>
									<Avatar
										srcSet={USERS.CHLOE.srcSet}
										src={USERS.CHLOE.src}
										userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
										color={USERS.CHLOE.color}
									/>

									<Avatar
										srcSet={USERS.JANE.srcSet}
										src={USERS.JANE.src}
										userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
										color={USERS.JANE.color}
									/>
									<Avatar
										srcSet={USERS.JOHN.srcSet}
										src={USERS.JOHN.src}
										userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
										color={USERS.JOHN.color}
									/>
									<Avatar
										srcSet={USERS.RYAN.srcSet}
										src={USERS.RYAN.src}
										userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
										color={USERS.RYAN.color}
									/>
								</AvatarGroup>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-6 col-xl-4 col-sm-12'>
						<Card stretch>
							<CardHeader className='bg-transparent'>
								<CardLabel>
									<CardTitle tag='h4' className='h5'>
										Phòng Brand Marketing
									</CardTitle>
									<CardSubTitle tag='h5' className='h6 text-muted'>
										Có một cuộc họp vào lúc 12 giờ trưa.
									</CardSubTitle>
								</CardLabel>
								<CardActions>
									<Button
										icon='ArrowForwardIos'
										aria-label='Read More'
										hoverShadow='default'
										// color={darkModeStatus && 'dark'}
										// onClick={handleOnClickToEmployeeListPage}
									/>
								</CardActions>
							</CardHeader>
							<CardBody>
								<AvatarGroup>
									<Avatar
										srcSet={USERS.GRACE.srcSet}
										src={USERS.GRACE.src}
										userName={`${USERS.GRACE.name} ${USERS.GRACE.surname}`}
										color={USERS.GRACE.color}
									/>
									<Avatar
										srcSet={USERS.SAM.srcSet}
										src={USERS.SAM.src}
										userName={`${USERS.SAM.name} ${USERS.SAM.surname}`}
										color={USERS.SAM.color}
									/>
									<Avatar
										srcSet={USERS.CHLOE.srcSet}
										src={USERS.CHLOE.src}
										userName={`${USERS.CHLOE.name} ${USERS.CHLOE.surname}`}
										color={USERS.CHLOE.color}
									/>

									<Avatar
										srcSet={USERS.JANE.srcSet}
										src={USERS.JANE.src}
										userName={`${USERS.JANE.name} ${USERS.JANE.surname}`}
										color={USERS.JANE.color}
									/>
									<Avatar
										srcSet={USERS.JOHN.srcSet}
										src={USERS.JOHN.src}
										userName={`${USERS.JOHN.name} ${USERS.JOHN.surname}`}
										color={USERS.JOHN.color}
									/>
									<Avatar
										srcSet={USERS.RYAN.srcSet}
										src={USERS.RYAN.src}
										userName={`${USERS.RYAN.name} ${USERS.RYAN.surname}`}
										color={USERS.RYAN.color}
									/>
								</AvatarGroup>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-12 col-xl-4 col-sm-12'>
						<Card stretch>
							<CardBody className='d-flex align-items-center justify-content-center'>
								<Button
									color='info'
									size='lg'
									isLight
									className='w-100 h-100'
									icon='AddCircle'
									onClick={handleUpcomingEdit}>
									Thêm mới
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className='row my-4'>
					{dataWork.map((item) => {
						return (
							<div className='col-xl-3 col-md-6 col-sm-12' key={item.id}>
								<CardAlert item={item} />
							</div>
						);
					})}
				</div>
				<div className='row mt-3'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>Công việc phòng tôi</div>
					</div>
					<Item
						name='Theme'
						teamName='Facit Team'
						dueDate='Còn 3 ngày nữa'
						attachCount={6}
						taskCount={24}
						percent={65}
						data-tour='project-item'
					/>
					<Item
						name='Plugin'
						teamName='Code Team'
						dueDate='Còn 3 ngày nữa'
						attachCount={1}
						taskCount={4}
						percent={70}
					/>
					<Item
						name='Website'
						teamName='Facit Team'
						dueDate='Còn 3 ngày nữa'
						attachCount={12}
						taskCount={34}
						percent={78}
					/>
					<Item
						name='UI Design'
						teamName='Omtanke Taem'
						dueDate='Còn 3 ngày nữa'
						attachCount={4}
						taskCount={18}
						percent={43}
					/>
					<Item
						name='Theme'
						teamName='Facit Theme'
						dueDate='Còn 3 ngày nữa'
						attachCount={2}
						taskCount={12}
						percent={30}
					/>
					<div className='col-md-12 col-xl-4 col-sm-12'>
						<Card stretch>
							<CardBody className='d-flex align-items-center justify-content-center'>
								<Button
									color='info'
									size='lg'
									isLight
									className='w-100 h-100'
									icon='AddCircle'
									onClick={handleUpcomingEdit}>
									Thêm mới
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
				<AddTaskForm
					setUpcomingEventsEditOffcanvas={setUpcomingEventsEditOffcanvas}
					upcomingEventsEditOffcanvas={upcomingEventsEditOffcanvas}
					handleUpcomingEdit={handleUpcomingEdit}
					titleModal='Thêm công việc'
				/>
			</Page>
		</PageWrapper>
	);
};

export default TaskListPage;
