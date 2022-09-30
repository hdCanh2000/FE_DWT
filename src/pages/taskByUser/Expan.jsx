// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
// import Button from '../../components/bootstrap/Button';
import { formatColorPriority } from '../../utils/constants';
// import Icon from '../../components/icon/Icon';
import Progress from '../../components/bootstrap/Progress';
import useDarkMode from '../../hooks/useDarkMode';
import getTaskByUser from './services';

const minWidth100 = {
	minWidth: 100,
};
const Expand = ({ idUser }) => {
	const { themeStatus } = useDarkMode();
	const [taskByUser, setTaskByUser] = useState([]);
	useEffect(() => {
		const fecth = async () => {
			const reponse = await getTaskByUser(idUser);
			const result = await reponse.data;
			setTaskByUser(result);
		};
		fecth();
	}, [idUser]);
	return (
		<table className='table table-modern'>
			<thead>
				<tr>
					<th>Tên công việc</th>
					<th>Hình thức</th>
					<th className='text-center'>Hạn ngày hoàn thành</th>
					<th className='text-center'>Tiến độ</th>
					<th className='text-center'>Độ ưu tiên</th>
				</tr>
			</thead>
			<tbody>
				{taskByUser?.map((subTaskItem) => (
					<tr key={subTaskItem.id}>
						<td>{subTaskItem?.name}</td>
						<td>{subTaskItem?.userId === idUser ? 'Phụ trách chính' : 'Liên quan'}</td>
						<td className='text-center'>
							{moment(`${subTaskItem.deadlineDate}`).format('DD-MM-YYYY')}
						</td>
						<td className='text-center' style={minWidth100}>
							<div className='d-flex align-items-center'>
								<div className='flex-shrink-0 me-3'>{`${
									subTaskItem.progress || 0
								}%`}</div>
								<Progress
									className='flex-grow-1'
									isAutoColor
									value={subTaskItem.progress || 0}
									style={{ height: 10 }}
								/>
							</div>
						</td>
						<td className='text-center'>
							<div className='d-flex align-items-center justify-content-center'>
								<span
									style={{ paddingRight: '1rem', paddingLeft: '1rem' }}
									className={classNames(
										'badge',
										'border border-2',
										[`border-${themeStatus}`],
										'bg-success',
										'pt-2 pb-2 me-2',
										`bg-${formatColorPriority(subTaskItem.priority)}`,
									)}>
									<span className=''>{`Cấp ${subTaskItem.priority}`}</span>
								</span>
							</div>
						</td>
					</tr>
				))}
				{/* <tr>
					<td colSpan={12}>
						<Button
							className='d-flex align-items-center cursor-pointer'
							style={{ paddingLeft: 0 }}>
							<Icon size='lg' icon='PlusCircle' />
							<span className='mx-2'>Thêm công việc của nhân viên</span>
						</Button>
					</td>
				</tr> */}
			</tbody>
		</table>
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
