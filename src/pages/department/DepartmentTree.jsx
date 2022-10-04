// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { arrayToTree } from 'performant-array-to-tree';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import Icon from '../../components/icon/Icon';
import CommonForm from '../common/ComponentCommon/CommonForm';
import Button from '../../components/bootstrap/Button';

const organizationLevelOptions = [
	{
		label: 'Khối',
		value: 1,
	},
	{
		label: 'Công ty',
		value: 4,
	},
	{
		label: 'Phòng ban',
		value: 2,
	},
	{
		label: 'Đội nhóm',
		value: 3,
	},
];

const DepartmentTree = () => {
	const dispatch = useDispatch();
	const department = useSelector((state) => state.department.departments);
	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);
	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const [toggle, setToggle] = useState(true);

	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(department, { childrenField: 'children' })),
	);

	useEffect(() => {
		setTreeValue(TreeState.create(arrayToTree(department, { childrenField: 'children' })));
	}, [department]);

	const columns = [
		{
			title: 'Tên phòng ban',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 8,
		},
		{
			title: 'Mã',
			id: 'slug',
			key: 'slug',
			type: 'text',
			align: 'left',
			isShow: true,
			col: 4,
		},
		{
			title: 'Trực thuộc',
			id: 'parentId',
			key: 'parentId',
			type: 'select',
			align: 'center',
			options: department,
			isShow: true,
			isMulti: false,
			col: 8,
		},
		{
			title: 'Cấp tổ chức',
			id: 'organizationLevel',
			key: 'organizationLevel',
			type: 'select',
			align: 'center',
			options: organizationLevelOptions,
			isShow: true,
			isMulti: false,
			col: 4,
		},
		{
			title: 'Mô tả',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
	];

	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};

	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
					fontSize: 14,
				}}
				// onClick={row.toggleChildren}
				onDoubleClick={() =>
					handleOpenForm({
						...row.data,
						parentId: department.find((item) => item.id === row.data.parentId),
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
						icon={row?.$state?.isExpanded ? 'ArrowDropDown' : 'ArrowRight'}
						className='d-block bg-transparent'
						style={{ fontSize: 25 }}
						onClick={row.toggleChildren}
					/>
				) : (
					''
				)}

				<span>{row.data.name || ''}</span>
			</div>
		);
	};

	const toggleExpand = () => {
		setToggle(!toggle);
		if (toggle) {
			setTreeValue(TreeState.expandAll(treeValue));
		} else {
			setTreeValue(TreeState.collapseAll(treeValue));
		}
	};

	return (
		<>
			<div className='d-flex align-items-center justify-content-start'>
				<Button
					color='info'
					icon={toggle ? 'ExpandMore' : 'ExpandLess'}
					tag='button'
					size='lg'
					onClick={toggleExpand}>
					{toggle ? 'Hiển thị tất cả' : 'Ẩn tất cả'}
				</Button>
			</div>
			<TreeTable value={treeValue} onChange={handleOnChange}>
				<TreeTable.Column
					style={{ minWidth: 300 }}
					renderCell={renderIndexCell}
					renderHeaderCell={() => <span />}
				/>
			</TreeTable>
			<CommonForm
				show={toggleForm}
				onClose={handleCloseForm}
				item={itemEdit}
				label={itemEdit?.id ? 'Cập nhật phòng ban' : 'Thêm mới phòng ban'}
				fields={columns}
				disable='true'
			/>
		</>
	);
};

export default DepartmentTree;
