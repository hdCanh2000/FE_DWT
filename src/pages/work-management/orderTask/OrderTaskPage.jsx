/* eslint-disable react-hooks/exhaustive-deps */
import React, {} from 'react';
import { Row, Col } from 'antd';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import TableListTarget from './TableListTarget';
import TableListTargetInfos from './TableListTargetInfos';

const OrderTaskPage = () => {
	const [updateFlag, setUpdateFlag] = useState(0);
	const [assignedTableParams, setAssignedTableParams] = useState({
		q: '',
	});
	const [assignedTableSearch, setAssignedTableSearch] = useState('');

	const [unAssignedTableParams, setUnAssignedTableParams] = useState({
		q: '',
	});
	const [unAssignedTableSearch, setUnAssignedTableSearch] = useState('');
	const [openConfirmCancelAssignTask, setOpenConfirmCancelAssignTask] = useState(false);
	const [cancelAssignTaskId, setCancelAssignTaskId] = useState(null);
	const [currentTarget, setCurrentTarget] = useState(null);
	const [openOrderTaskModal, setOpenOrderTaskModal] = useState(false);
	const {
		data: assignedTargets = [],
		isLoading: loadingSignedTargets,
		isError: errorSignedTargets,
		refetch: refetchSignedTargets,
	} = useQuery(['getListTarget', assignedTableParams], ({ queryKey }) =>
		getListTarget({ ...queryKey[1], status: 'assigned' }),
	);
	const assignedTaskData = useMemo(() => {
		return assignedTargets.map((item, index) => ({
			...item,
			key: index + 1,
			stt: assignedTargets.length - index,
			deadlineText: item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : '',
			statusText: item.status === 'inProgress' ? 'Đang làm' : 'Đã hoàn thành',
			userName: item.user ? item.user.name : '',
			kpiValue: `${item?.manDay || '_'} MD`,
			positionText: item.position ? item.position.name : '',
		}));
	}, [assignedTargets]);

	const {
		data: unAssignedTargets = [],
		isLoading: loadingUnSignedTargets,
		isError: errorUnSignedTargets,
		refetch: refetchUnSignedTargets,
	} = useQuery(['getListTargetUnAssigned', unAssignedTableParams], ({ queryKey }) =>
		getListTarget({ ...queryKey[1] }),
	);

	const userId = localStorage.getItem('userId');

	const { data: user = { department_id: null, role: '' } } = useQuery(
		['getUserDetail', userId],
		({ queryKey }) => getUserDetail(queryKey[1]),
	);

	useEffect(() => {
		if (!user) return;
		if (!user.department_id) return;
		if (user.role !== 'manager') return;

		setAssignedTableParams({ ...assignedTableParams, departmentId: user.department_id });
		setUnAssignedTableParams({ ...unAssignedTableParams, departmentId: user.department_id });
	}, [user]);

	const unAssignedTaskData = useMemo(() => {
		console.log(unAssignedTargets)
		return unAssignedTargets.map((item, index) => ({
			...item,
			key: index + 1,
			unitText: item?.unit?.name,
			positionText: item.position ? item.position.name : '',
		}));
	}, [unAssignedTargets]);
	const handleDeleteAssignedTask = async () => {
		if (!cancelAssignTaskId) return;
		try {
			await updateTarget(cancelAssignTaskId, { userId: null });
			await refetchSignedTargets();
			await refetchUnSignedTargets();
			toast.success('Hủy giao nhiệm vụ thành công');
		} catch (err) {
			toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
		} finally {
			setOpenConfirmCancelAssignTask(false);
			setCancelAssignTaskId(null);
		}
	};
	const handleSearchAssignedTask = (value) => {
		setAssignedTableParams({
			...assignedTableParams,
			q: value,
		});
	};
	const handleSearchUnAssignedTask = (value) => {
		setUnAssignedTableParams({
			...unAssignedTableParams,
			q: value,
		});
	};

	return (
		<PageWrapper title='Giao việc'>
			<Page container='fluid'>
				<Row gutter={24}>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Lịch sử giao việc</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<TableListTargetInfos updateFlag={updateFlag} />
							</CardBody>
						</Card>
					</Col>
					<Col span={12}>
						<Card>
							<CardHeader>
								<CardTitle>
									<CardLabel>Danh sách định mức</CardLabel>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<TableListTarget onUpdateTargetInfo={setUpdateFlag} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Page>
		</PageWrapper>
	);
};
export default OrderTaskPage;
