import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
	TreeGridComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-treegrid';
import _, { isEmpty } from 'lodash';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import DailyWorktrackingModal from './DailyWorktrackingModal';
import { getAllWorktrackMe } from './services';
import './style.css';
import { LIST_STATUS } from '../../utils/constants';

const createDataTree = (dataset) => {
	const hashTable = Object.create(null);
	dataset.forEach((aData) => {
		hashTable[aData.id] = { data: aData, children: [] };
	});
	const dataTree = [];
	dataset.forEach((aData) => {
		if (!_.isEmpty(aData.parentId)) {
			hashTable[aData.parentId].children.push(hashTable[aData.id]);
		} else {
			dataTree.push(hashTable[aData.id]);
		}
	});
	return dataTree;
};

const DailyWorkTrackingMe = () => {
	const dispatch = useDispatch();
	const [worktrack, setWorktrack] = useState({});
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());
	const [treeValue, setTreeValue] = React.useState([]);
	const id = localStorage.getItem('userId');
	useEffect(() => {
		async function fetchData() {
			getAllWorktrackMe().then((res) => {
				setWorktrack(res.data.data);
			});
		}
		fetchData();
	}, [dispatch, id, toggleForm]);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			const treeData = createDataTree(
				worktrack?.workTracks?.map((item) => {
					return {
						...item,
						deadline: item.deadline ? moment(item.deadline).format('DD-MM-YYYY') : '--',
						statusName: LIST_STATUS.find((st) => st.value === item.status)?.label,
						parentId: item.parent_id,
						department: {
							name: _.get(worktrack, 'department.name', '--'),
						},
					};
				}),
			);
			setTreeValue(treeData);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [worktrack]);
	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				<div
					className='row mb-0 h-100'
					style={{ maxWidth: '90%', minWidth: '90%', margin: '0 auto' }}>
					<div className='col-12'>
						<Card className='w-100'>
							{' '}
							<div style={{ margin: '24px 24px 0' }}>
								<CardHeader>
									<CardLabel icon='FormatListBulleted' iconColor='primary'>
										<CardTitle>
											<CardLabel>Danh sách nhiệm vụ</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='control-pane'>
										<div className='control-section'>
											<TreeGridComponent
												dataSource={treeValue}
												treeColumnIndex={0}
												className='cursor-pointer user-select-none'
												rowSelected={(item) => {
													handleOpenForm({
														...item.data.data,
														parent: worktrack?.workTracks?.find(
															(i) => i.id === item.data.data.parentId,
														),
													});
												}}
												childMapping='children'
												height='410'>
												<ColumnsDirective>
													<ColumnDirective
														field='data.kpiNorm.name'
														headerText='Tên nhiệm vụ'
														width='200'
													/>
													<ColumnDirective
														field='data.mission.name'
														headerText='Thuộc mục tiêu'
														width='90'
														textAlign='Left'
													/>
													<ColumnDirective
														field='data.deadline'
														headerText='Hạn hoàn thành'
														format='yMd'
														width='90'
														textAlign='Center'
													/>
													<ColumnDirective
														field='data.statusName'
														headerText='Trạng thái'
														width='100'
														textAlign='Center'
													/>
													<ColumnDirective
														field='data.quantity'
														headerText='Số lượng'
														width='90'
														textAlign='Right'
													/>
												</ColumnsDirective>
											</TreeGridComponent>
										</div>
									</div>
								</CardBody>
							</div>
						</Card>
					</div>
				</div>
				<DailyWorktrackingModal
					data={itemEdit}
					worktrack={worktrack}
					handleClose={handleCloseForm}
					show={toggleForm}
				/>
			</Page>
		</PageWrapper>
	);
};
export default DailyWorkTrackingMe;
