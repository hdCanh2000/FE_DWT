import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { isEmpty } from 'lodash';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Icon from '../../components/icon/Icon';
import './style.css';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import DailyWorktrackingModal from './DailyWorktrackingModal';
import { getAllWorktrackByUserId } from './services';

const DailyWorkTrackingMe = () => {
	const dispatch = useDispatch();

	const [worktrack, setWorktrack] = useState([]);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [treeValue, setTreeValue] = React.useState([]);

	useEffect(() => {
		if (!isEmpty(worktrack) && id) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(worktrack, { childrenField: 'children' })),
				),
			);
		}
	}, [worktrack, id]);

	const id = localStorage.getItem('userId');
	useEffect(() => {
		async function fetchData() {
			getAllWorktrackByUserId(id).then((res) => {
				setWorktrack(
					res.data.data.map((item) => {
						return {
							...item,
							label: item.name,
							value: item.id,
							text: item.name,
							parentId: item.parent_id,
						};
					}),
				);
			});
		}
		fetchData();
	}, [dispatch, id]);

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
				onDoubleClick={() =>
					handleOpenForm({
						...row.data,
						parent: worktrack.find((item) => item.id === row.data.parentId),
					})
				}
				className={
					row.metadata.hasChildren
						? 'with-children d-flex align-items-center cursor-pointer user-select-none'
						: 'without-children cursor-pointer user-select-none'
				}>
				{row.metadata.hasChildren ? (
					<Icon
						color='success'
						type='button'
						size='lg'
						icon={row.$state.isExpanded ? 'ArrowDropDown' : 'ArrowRight'}
						className='d-block bg-transparent'
						style={{ fontSize: 25 }}
						onClick={row.toggleChildren}
					/>
				) : (
					''
				)}

				<span>{row.data?.kpiNorm?.name || ''}</span>
			</div>
		);
	};

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	return (
		<PageWrapper title='Công việc hàng ngày'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<div className='d-flex justify-content-between align-items-center'>
							<div className='display-6 fw-bold py-3'>Báo cáo công việc</div>
						</div>
					</div>
				</div>
				<div className='row mb-0 h-100'>
					<div className='col-12'>
						<Card className='w-100'>
							<CardHeader>
								<CardLabel icon='AccountCircle' iconColor='primary'>
									<CardTitle>
										<CardLabel>Danh sách nhiệm vụ</CardLabel>
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								{worktrack?.length > 0 ? (
									<TreeTable value={treeValue} onChange={handleOnChange}>
										<TreeTable.Column
											style={{ minWidth: 300 }}
											renderCell={renderIndexCell}
											renderHeaderCell={() => <span>Tên nhiệm vụ</span>}
										/>
										<TreeTable.Column
											renderCell={(row) => (
												<span className='expenses-cell text-left'>
													{row.data?.mission?.name || 'Không'}
												</span>
											)}
											renderHeaderCell={() => <span>Thuộc mục tiêu</span>}
										/>
										<TreeTable.Column
											renderCell={(row) => (
												<span className='expenses-cell text-left'>
													{row.data?.quantity || ''}
												</span>
											)}
											renderHeaderCell={() => (
												<span className='t-left'>Số lượng</span>
											)}
										/>
										<TreeTable.Column
											renderCell={(row) => (
												<span className='expenses-cell text-left'>
													{moment(`${row.data.deadline}`).format(
														'DD-MM-YYYY',
													) || ''}
												</span>
											)}
											renderHeaderCell={() => <span>Hạn hoàn thành</span>}
										/>
										<TreeTable.Column
											renderCell={(row) => (
												<span className='expenses-cell text-right'>
													{row.data?.kpiNorm?.manday || ''}
												</span>
											)}
											renderHeaderCell={() => (
												<span className='t-left'>Số ngày công</span>
											)}
										/>
									</TreeTable>
								) : (
									<h1 className='text-center py-4'>
										Hiện chưa có công việc nào!
									</h1>
								)}
							</CardBody>
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
