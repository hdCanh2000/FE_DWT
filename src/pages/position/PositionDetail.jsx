import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
// import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import CustomSelect from '../../components/form/CustomSelect';
import Checks from '../../components/bootstrap/forms/Checks';
import Input from '../../components/bootstrap/forms/Input';
// import Option from '../../components/bootstrap/Option';
// import { fetchKpiNormList } from '../../redux/slice/kpiNormSlice';

// const ErrorText = styled.span`
// 	font-size: 14px;
// 	color: #e22828;
// 	margin-top: 5px;
// `;

const PositionDetail = ({
	className,
	show,
	onClose,
	item,
	label,
	fields,
	options,
	// nv,
	...props
}) => {
	const formik = useFormik({
		initialValues: { ...item },
		enableReinitialize: true,
	});

	// const dispatch = useDispatch();
	// const [kpiNormId, setKpiNormId] = useState(item.kpiNormId || []);
	// const kpiNorms = useSelector((state) => state.kpiNorm.kpiNorms);

	// useEffect(() => {
	// 	dispatch(fetchKpiNormList());
	// }, [dispatch]);

	// xoá các key theo index
	// const handleRemoveKeyField = (e, index) => {
	// 	setKpiNormId((prev) => prev.filter((state) => state !== prev[index]));
	// };

	// const handleChangeKeysState = (index, event) => {
	// 	event.preventDefault();
	// 	event.persist();
	// 	setKpiNormId((prev) => {
	// 		return prev?.map((key, i) => {
	// 			if (i !== index) return key;
	// 			return {
	// 				...key,
	// 				[event.target.name]: event.target.value,
	// 				error: {
	// 					...key.error,
	// 					[event.target.name]:
	// 						event.target.value.length > 0
	// 							? null
	// 							: `Vui lòng nhập đầy đủ thông tin!`,
	// 				},
	// 			};
	// 		});
	// 	});
	// };

	// const handleAddFieldKey = () => {
	// 	const initState = {};
	// 	if (kpiNormId?.length <= 11) {
	// 		setKpiNormId((prev) => [...prev, initState]);
	// 	}
	// };

	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size='lg'
			scrollable
			centered
			// nv={nv}
			{...props}>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>{label}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<form>
					<div className='row'>
						<div className='col-md-12'>
							<div className='row g-4'>
								{fields?.map((field) => {
									if (field.type === 'singleSelect') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Select
														disabled
														ariaLabel={field.title || ''}
														list={field.options}
														name={field.id}
														size='lg'
														className='border border-2 rounded-0 shadow-none'
														value={formik.values[field.id]}
														defaultValue={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (field.type === 'select') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<CustomSelect
														disabled
														value={formik.values[field.id]}
														options={field.options}
														isMulti={!!field.isMulti}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (!field.isShow) {
										return null;
									}
									if (field.type === 'textarea') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Textarea
														readOnly
														rows={5}
														placeholder={`Nhập ${field.title}`}
														list={options}
														size='lg'
														name={field.id}
														className='border border-2 rounded-0 shadow-none'
														value={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									if (field.type === 'switch') {
										return (
											<React.Fragment key={field.id}>
												<FormGroup
													key={field.id}
													className='col-12'
													id={field.id}
													label={field.title}>
													<Checks
														readOnly
														id={field.id}
														type='switch'
														size='lg'
														label={
															Number(formik.values[field.id]) === 1
																? 'Đang hoạt động'
																: 'Không hoạt động'
														}
														onChange={formik.handleChange}
														checked={formik.values[field.id]}
													/>
												</FormGroup>
											</React.Fragment>
										);
									}
									return (
										<React.Fragment key={field.id}>
											<FormGroup
												className='col-12'
												id={field.id}
												label={field.title}>
												<Input
													disabled
													type={field.type || 'text'}
													name={field.id}
													value={formik.values[field.id] || ''}
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</React.Fragment>
									);
								})}
								{/* <div>
									{nv && (
										<>
											<hr />
											<FormGroup
												style={{ fontWeight: 500, color: '#6c757d' }}>
												Danh sách nhiệm vụ
											</FormGroup>
											{kpiNormId?.map((element, index) => {
												return (
													<div
														key={element.name}
														className='mt-4 d-flex align-items-center justify-content-between'>
														<div
															style={{
																width: '100%',
																marginRight: 10,
															}}>
															<FormGroup
																className='mr-2'
																id='kpiName'
																label='Tên nhiệm vụ'>
																<Select
																	disabled
																	name='kpiName'
																	required
																	size='lg'
																	className='border border-2 rounded-0 shadow-none'
																	placeholder='Chọn nhiệm vụ'
																	value={element?.kpiName}
																	onChange={(e) =>
																		handleChangeKeysState(
																			index,
																			e,
																		)
																	}>
																	{kpiNorms.map((key) => (
																		<Option
																			key={`${key.name}`}
																			value={`${key.name}`}>
																			{`${key?.name}`}
																		</Option>
																	))}
																</Select>
															</FormGroup>
															{element.error?.kpiName && (
																<ErrorText>
																	{element.error?.kpiName}
																</ErrorText>
															)}
														</div>
													</div>
												);
											})}
										</>
									)}
								</div> */}
							</div>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer className='p-4'>
				<Button size='lg' variant='secondary' onClick={onClose}>
					Đóng
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

PositionDetail.propTypes = {
	className: PropTypes.string,
	show: PropTypes.bool,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	options: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	item: PropTypes.object,
	// eslint-disable-next-line react/forbid-prop-types
	fields: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	validate: PropTypes.object,
	onClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	label: PropTypes.string,
	// nv: PropTypes.bool,
};
PositionDetail.defaultProps = {
	className: null,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	handleSubmit: null,
	label: '',
	// nv: false,
};

export default PositionDetail;
