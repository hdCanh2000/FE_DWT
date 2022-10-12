/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import Icon from '../../components/icon/Icon';
import { fetchWorktrackList } from '../../redux/slice/worktrackSlice';

const Expand = ({ idUser }) => {
	const dispatch = useDispatch();

	const worktrack = useSelector((state) => state.worktrack.worktracks);

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(worktrack, { childrenField: 'children' })),
	);

	useEffect(() => {
		if (!isEmpty(worktrack)) {
			setTreeValue(
				TreeState.expandAll(
					TreeState.create(arrayToTree(worktrack, { childrenField: 'children' })),
				),
			);
		}
	}, [worktrack]);

	useEffect(() => {
		dispatch(fetchWorktrackList(idUser));
	}, [dispatch]);

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
				// onClick={row.toggleChildren}
				// onDoubleClick={() =>
				// 	handleOpenForm({
				// 		...row.data,
				// 		parent: kpiNorm.find((item) => item.id === row.data.parentId),
				// 	})
				// }
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
		<TreeTable value={treeValue} onChange={handleOnChange}>
			<TreeTable.Column
				style={{ minWidth: 300 }}
				renderCell={renderIndexCell}
				renderHeaderCell={() => <span>Tên nhiệm vụ</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>
						{row.data?.department?.name || ''}
					</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Phòng ban</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>
						{row.data?.position?.name || ''}
					</span>
				)}
				renderHeaderCell={() => <span>Vị trí</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-left'>{row.data?.unit?.name || ''}</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Đơn vị tính</span>}
			/>
			<TreeTable.Column
				renderCell={(row) => (
					<span className='expenses-cell text-right'>{row.data?.manday || ''}</span>
				)}
				renderHeaderCell={() => <span className='t-left'>Số ngày công</span>}
			/>
		</TreeTable>
	);
};

Expand.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	idUser: PropTypes.array.isRequired,
};
Expand.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	subtasks: null,
};

export default Expand;
