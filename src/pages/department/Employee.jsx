import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableCommon from '../common/ComponentCommon/TableCommon';
import {
	fetchEmployeeList,
	fetchEmployeeListByDepartment,
	changeCurrentPage,
} from '../../redux/slice/employeeSlice';
import { fetchPositionList } from '../../redux/slice/positionSlice';

const EmployeePage = ({ dataDepartment }) => {
	const dispatch = useDispatch();

	const users = useSelector((state) => state.employee.employees);
	const currentPage = useSelector((state) => state.employee.currentPage);
	const pagination = useSelector((state) => state.employee.pagination);
	const positions = useSelector((state) => state.position.positions);

	const setCurrentPage = (page) => {
		dispatch(changeCurrentPage(page));
	};

	const handleChangeCurrentPage = (searchValue) => {
		setCurrentPage(searchValue.page);
	};

	useEffect(() => {
		dispatch(fetchPositionList());
	}, [dispatch]);

	useEffect(() => {
		if (dataDepartment.id && dataDepartment.parentId !== null) {
			const query = {};
			query.text = '';
			query.page = currentPage;
			query.limit = 100;
			dispatch(fetchEmployeeListByDepartment(dataDepartment.id, query));
		} else {
			const query = {};
			query.text = '';
			query.page = currentPage;
			query.limit = 10;
			dispatch(fetchEmployeeList(query));
		}
	}, [dispatch, dataDepartment.id, dataDepartment.parentId, currentPage]);

	const columns = [
		{
			title: 'Họ và tên',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'SĐT',
			id: 'phone',
			key: 'phone',
			type: 'text',
			align: 'center',
			isShow: false,
		},
		// {
		// 	title: 'Phòng ban',
		// 	id: 'department',
		// 	key: 'department',
		// 	type: 'select',
		// 	align: 'left',
		// 	isShow: true,
		// 	render: (item) => <span>{item?.department?.name || ''} </span>,
		// 	options: departments,
		// 	isMulti: false,
		// },
		{
			title: 'Vị trí làm việc',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'center',
			isShow: true,
			render: (item) => (
				<span>
					{item?.position?.name
						? `${item?.position?.name} (${item?.department?.name})`
						: '--'}
				</span>
			),
			options: positions,
			isMulti: false,
		},
		{
			title: 'Vai trò',
			id: 'role',
			key: 'role',
			type: 'singleSelect',
			isShow: true,
			format: (value) =>
				// eslint-disable-next-line no-nested-ternary
				value === 'manager' ? 'Quản lý' : value === 'user' ? 'Nhân viên' : 'Admin',
			options: [
				{
					id: 1,
					text: 'Quản lý',
					label: 'Quản lý',
					value: 'manager',
				},
				{
					id: 2,
					text: 'Nhân viên',
					label: 'user',
					value: 0,
				},
			],
		},
	];

	return (
		<div className='col-lg-12 col-md-6'>
			<div className='row mb-4'>
				<div className='col-12'>
					<div className='d-flex justify-content-between align-items-center'>
						<div style={{ fontSize: '20px' }} className='fw-bold py-3'>
							Danh sách nhân sự{' '}
							{dataDepartment?.name ? ` của ${dataDepartment?.name}` : ''}
						</div>
					</div>
				</div>
			</div>
			<div className='row mb-0'>
				<div className='col-12'>
					<div className='p-4 col-lg-12'>
						<TableCommon
							className='table table-modern mb-0'
							columns={columns}
							data={users}
							onChangeCurrentPage={handleChangeCurrentPage}
							currentPage={parseInt(currentPage, 10)}
							totalItem={pagination?.totalRows}
							total={pagination?.total}
							setCurrentPage={setCurrentPage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
EmployeePage.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	dataDepartment: PropTypes.object || PropTypes.bool,
};
EmployeePage.defaultProps = {
	dataDepartment: null || true,
};

export default EmployeePage;
