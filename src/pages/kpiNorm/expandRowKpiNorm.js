import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../components/icon/Icon';
import useDarkMode from '../../hooks/useDarkMode';
import Button from '../../components/bootstrap/Button';

const ExpandRowKpiNorm = ({
	data,
	floatNameData,
	isShow,
	handleOpenForm,
	handleOpenDelete,
	level,
}) => {
	const { darkModeStatus } = useDarkMode();
	if (isShow === false) {
		return null;
	}
	return (
		<table className='table table-modern mb-0' style={{ fontSize: 14 }}>
			<tbody>
				{data?.map((item) => (
					<React.Fragment key={item.id}>
						<tr>
							<td
								className='cursor-pointer'
								align={floatNameData}
								style={{ width: '18.2%', paddingLeft: '3%' }}>
								{item?.name}
							</td>
							<td align='left' style={{ width: '18.6%' }}>
								<Button
									className='d-flex align-items-center justify-content-center cursor-pointer m-auto'
									// onClick={(event) =>
									// 	handleEpandRow(event, item.id)
									// }
								>
									<Icon
										color='info'
										size='sm'
										// icon={`${
										// 	expandState[item.id]
										// 		? 'CaretUpFill'
										// 		: 'CaretDownFill'
										// }`}
										icon='CaretDownFill'
									/>
									<span
										className='mx-2'
										style={{
											color: '#0174EB',
										}}>
										{item?.items?.length || 0}
									</span>
								</Button>
							</td>
							<td
								className='cursor-pointer'
								align='center'
								style={{ width: '14.2%' }}>
								{item?.department?.label}
							</td>
							<td className='cursor-pointer' align='center' style={{ width: '8.2%' }}>
								{item?.unit}
							</td>
							<td className='cursor-pointer' align='center' style={{ width: '25%' }}>
								{item?.point}
							</td>
							<td
								align='center'
								style={
									level === '2'
										? { width: '17%', paddingRight: '4.4%' }
										: { width: '17%', paddingRight: '2.9%' }
								}>
								<Button
									isOutline={!darkModeStatus}
									color='success'
									isLight={darkModeStatus}
									className='text-nowrap mx-1'
									icon='Edit'
									onClick={() => handleOpenForm(item)}
								/>
								<Button
									isOutline={!darkModeStatus}
									color='danger'
									isLight={darkModeStatus}
									className='text-nowrap mx-1'
									icon='Trash'
									onClick={() => handleOpenDelete(item)}
								/>
							</td>
						</tr>
						<tr>
							<td
								colSpan='12'
								// style={{
								// 	padding: '5px 0 5px 50px',
								// 	borderRadius: '0.5rem',
								// }}
							>
								<ExpandRowKpiNorm
									isShow={isShow}
									floatNameData='left'
									data={item?.items}
									handleOpenForm={handleOpenForm}
									handleOpenDelete={handleOpenDelete}
								/>
							</td>
						</tr>
					</React.Fragment>
				))}
			</tbody>
		</table>
	);
};

ExpandRowKpiNorm.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types, react/require-default-props
	data: PropTypes.array.isRequired,
	handleOpenForm: PropTypes.func,
	handleOpenDelete: PropTypes.func,
	// eslint-disable-next-line react/no-unused-prop-types
	floatNameData: PropTypes.string,
	isShow: PropTypes.bool,
	level: PropTypes.string,
};
ExpandRowKpiNorm.defaultProps = {
	// eslint-disable-next-line react/default-props-match-prop-types
	data: [],
	// floatName: '',
	floatNameData: '',
	isShow: false,
	handleOpenForm: null,
	handleOpenDelete: null,
	level: '',
};

export default ExpandRowKpiNorm;
