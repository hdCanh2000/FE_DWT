import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import TableCommon from '../common/ComponentCommon/TableCommon';
import Card, { CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Popovers from '../../components/bootstrap/Popovers';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { getAllDepartmentWithUser } from './services';
import { getAllPosition } from '../position/services';
import { fetchEmployeeList } from '../../redux/slice/employeeSlice';

const EmployeePage = ({ header }) => {
	const dispatch = useDispatch();
	const users = useSelector((state) => state.employee.employees);
	const [departments, setDepartments] = React.useState([]);
	const [positions, setPositions] = React.useState([]);

	useEffect(() => {
		const fecth = async () => {
			const response = await getAllDepartmentWithUser();
			const result = await response.data;
			setDepartments(
				[...result].map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id,
					};
				}),
			);
		};
		fecth();
	}, []);
	useEffect(() => {
		const fecth = async () => {
			const response = await getAllPosition();
			const result = await response.data;
			setPositions(
				[...result].map((item) => {
					return {
						...item,
						label: item.name,
						value: item.id,
					};
				}),
			);
		};
		fecth();
	}, []);

	useEffect(() => {
		dispatch(fetchEmployeeList());
	}, [dispatch]);

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
			title: 'Mã NV',
			id: 'code',
			key: 'code',
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
		{
			title: 'Email',
			id: 'email',
			key: 'email',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'Phòng ban',
			id: 'department',
			key: 'department',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.department?.name || ''} </span>,
			options: departments,
			isMulti: false,
		},
		{
			title: 'Vị trí làm việc',
			id: 'position',
			key: 'position',
			type: 'select',
			align: 'left',
			isShow: true,
			render: (item) => <span>{item?.position?.name || ''}</span>,
			options: positions,
			isMulti: false,
		},
		{
			title: 'Địa chỉ',
			id: 'address',
			key: 'address',
			type: 'textarea',
			align: 'center',
			isShow: false,
			render: (item) => (
				<Popovers desc={item?.address} trigger='hover'>
					<div
						style={{
							maxWidth: 150,
							WebkitLineClamp: '2',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
						}}>
						{item?.address}
					</div>
				</Popovers>
			),
		},
		{
			title: 'Ngày sinh',
			id: 'dateOfBirth',
			key: 'dateOfBirth',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Ngày tham gia',
			id: 'dateOfJoin',
			key: 'dateOfJoin',
			type: 'date',
			align: 'center',
			isShow: false,
			format: (value) => value && `${moment(`${value}`).format('DD-MM-YYYY')}`,
		},
		{
			title: 'Vai trò',
			id: 'role',
			key: 'role',
			type: 'singleSelect',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Quản lý' : 'Nhân viên'),
			options: [
				{
					id: 1,
					text: 'Quản lý',
					label: 'Quản lý',
					value: 1,
				},
				{
					id: 2,
					text: 'Nhân viên',
					label: 'Nhân viên',
					value: 0,
				},
			],
		},
		{
			title: 'Trạng thái',
			id: 'status',
			key: 'status',
			type: 'switch',
			align: 'center',
			isShow: true,
			format: (value) => (value === 1 ? 'Đang hoạt động' : 'Không hoạt động'),
		},
	];
	return (
		<div className='col-lg-9 col-md-6'>
			{header === false &&
				verifyPermissionHOC(
					<div className='row mb-4'>
						<div className='col-12'>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='display-6 fw-bold py-3'>Danh sách nhân sự</div>
							</div>
						</div>
					</div>,
					['admin', 'manager'],
				)}

			{verifyPermissionHOC(
				<div className='row mb-0'>
					<div className='col-12'>
						<Card className='w-100'>
							<CardHeader>
								<CardLabel icon='AccountCircle' iconColor='primary'>
									<CardTitle>
										<CardLabel>Danh sách nhân sự</CardLabel>
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<div className='p-4 col-lg-12'>
								<TableCommon
									className='table table-modern mb-0'
									columns={columns}
									data={users}
								/>
							</div>
						</Card>
					</div>
				</div>,
				['admin', 'manager'],
			)}
		</div>
	);
};
EmployeePage.propTypes = {
	header: PropTypes.bool,
};
EmployeePage.defaultProps = {
	header: false,
};

export default EmployeePage;
