/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import './style.css';
import Icon from '../../components/icon/Icon';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';

const TaskList = ({ userId }) => {
	const dispatch = useDispatch();
	const worktracks = useSelector((state) => state.worktrack.worktracks);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));

	useEffect(() => {
		dispatch(fetchWorktrackList(userId));
	}, [dispatch, userId]);

	const [treeValue, setTreeValue] = React.useState(TreeState.create(worktracks));

	useEffect(() => {
		setTreeValue(TreeState.create(worktracks));
	}, [worktracks]);

	// const [treeValue, setTreeValue] = React.useState(
	// 	TreeState.create(arrayToTree(worktracks, { childrenField: 'children' })),
	// );

	// useEffect(() => {
	// 	setTreeValue(TreeState.create(arrayToTree(worktracks, { childrenField: 'children' })));
	// }, [worktracks]);

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
				onDoubleClick={() => handleOpenForm(row.data)}
				className={
					row.metadata.hasChildren
						? 'with-children d-flex align-items-center cursor-pointer'
						: 'without-children cursor-pointer'
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

				<span>{row.data?.kpiNorm?.name}</span>
			</div>
		);
	};

	// console.log(worktracks);
	// console.log(treeValue);
	return (
		<TreeTable value={treeValue} onChange={handleOnChange}>
			<TreeTable.Column
				// basis='180px'
				// grow='0'
				style={{ minWidth: 300 }}
				renderCell={renderIndexCell}
				renderHeaderCell={() => <span>Tên nhiệm vụ</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-right'>{row.data?.manday}</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Số lượng</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>{row.data?.position?.name}</span>
				)}
				renderHeaderCell={() => <span>Hạn hoàn thành</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>{row.data?.department?.name}</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Số ngày công</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>{row.data?.unit?.name}</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Đơn vị tính</span>}
			/>
		</TreeTable>
	);
};

TaskList.propTypes = {
	userId: PropTypes.string,
};
TaskList.defaultProps = {
	userId: null,
};

export default TaskList;
