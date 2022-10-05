import React, { useEffect } from 'react';
import { TreeTable, TreeState } from 'cp-react-tree-table';
import PropTypes from 'prop-types';
import { arrayToTree } from 'performant-array-to-tree';
import { Button, Form, Modal } from 'react-bootstrap';
import './pickList.css';
import Icon from '../../../components/icon/Icon';

// eslint-disable-next-line no-unused-vars
const ListPickKpiNorm = ({ data, handleClose, show, setDataSubMission }) => {
	const [dataValue, setDataValue] = React.useState([]);
	const [treeValue, setTreeValue] = React.useState(
		TreeState.create(arrayToTree(data, { childrenField: 'children' })),
	);
	useEffect(() => {
		setTreeValue(TreeState.create(arrayToTree(data, { childrenField: 'children' })));
	}, [data]);
	const handleOnChange = (newValue) => {
		setTreeValue(newValue);
	};
	const handleCheckBox = (item) => {
		const newData = dataValue.filter((items) => items === item);
		if (newData.length === 0) {
			setDataValue([...dataValue, item]);
		} else {
			setDataValue(dataValue.filter((items) => items !== item));
		}
	};
	const handleSubmit = () => {
		setDataSubMission(dataValue);
		handleClose();
	};
	const renderIndexCell = (row) => {
		return (
			<div
				style={{
					paddingLeft: `${row.metadata.depth * 30}px`,
					minWidth: 360,
				}}
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
				<Form.Check
					type='checkbox'
					id={`default-${row}`}
					onClick={() => handleCheckBox(row.data)}
					label={row.data.name}
				/>
			</div>
		);
	};
	return (
		<Modal show={show} size='lg' onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Nhiệm vụ con</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<TreeTable value={treeValue} onChange={handleOnChange}>
					<TreeTable.Column
						// basis='180px'
						// grow='0'
						style={{ minWidth: 300 }}
						renderCell={renderIndexCell}
						renderHeaderCell={() => <span>Tên định mức</span>}
					/>
					<TreeTable.Column
						renderCell={(row) => (
							<span className='expenses-cell text-left'>{row.data.unit.name}</span>
						)}
						renderHeaderCell={() => <span className='t-left'>Đơn vị tính</span>}
					/>
					<TreeTable.Column
						renderCell={(row) => (
							<span className='expenses-cell text-right'>{row.data.manday}</span>
						)}
						renderHeaderCell={() => <span className='t-left'>Số ngày công</span>}
					/>
					{/* <TreeTable.Column
						renderCell={(row) => (
							<Input onChange={handleQuanlity}  />
						)}
						renderHeaderCell={() => <span className='t-left'>Số lượng</span>}
					/> */}
				</TreeTable>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleClose}>
					Đóng
				</Button>
				<Button variant='primary' onClick={handleSubmit}>
					lưu nhiệm vụ con
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
ListPickKpiNorm.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array,
	show: PropTypes.bool,
	handleClose: PropTypes.func,
	setDataSubMission: PropTypes.func,
	// initData: PropTypes.array,
};

ListPickKpiNorm.defaultProps = {
	data: [],
	handleClose: null,
	show: false,
	setDataSubMission: null,
	// initData: [],
};
export default ListPickKpiNorm;
