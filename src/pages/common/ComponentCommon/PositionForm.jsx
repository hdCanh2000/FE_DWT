import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
// import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import CustomSelect from '../../../components/form/CustomSelect';
import Select from '../../../components/bootstrap/forms/Select';
// import Option from '../../../components/bootstrap/Option';
// import Icon from '../../../components/icon/Icon';
// import { fetchKpiNormList } from '../../../redux/slice/kpiNormSlice';

// const ErrorText = styled.span`
// 	font-size: 14px;
// 	color: #e22828;
// 	margin-top: 5px;
// `;

const CommonForm = ({
	className,
	show,
	onClose,
	item,
	handleSubmit,
	label,
	fields,
	options,
	validate,
	// nv,
	...props
}) => {
	const formik = useFormik({
		initialValues: { ...item },
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values, { resetForm }) => {
			const result = {
				...values,
				// kpiName: kpiNormId.map((key) => {
				// 	return {
				// 		kpiName: key.kpiName,
				// 	};
				// }),
			};
			handleSubmit(result);
			resetForm();
		},
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
					<div className='row g-4'>
						{fields?.map((field) => {
							if (field.type === 'singleSelect') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup id={field.id} label={field.title}>
											<Select
												ariaLabel={field.title || ''}
												placeholder={`Chọn ${field.title}`}
												list={field.options}
												name={field.id}
												size='lg'
												className='border border-2 rounded-0 shadow-none'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values[field.id]}
												defaultValue={formik.values[field.id]}
												isValid={formik.isValid}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (field.type === 'select') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<CustomSelect
												placeholder={`Chọn ${field.title}`}
												value={formik.values[field.id]}
												onChange={(value) => {
													formik.setFieldValue(field.id, value);
												}}
												isMulti={!!field.isMulti}
												options={field.options}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (!field.isShow) {
								return null;
							}
							if (field.type === 'textarea') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<Textarea
												rows={3}
												ariaLabel={field.title}
												placeholder={`${field.title}`}
												list={options}
												size='lg'
												name={field.id}
												className='border border-2 rounded-0 shadow-none'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values[field.id]}
												isValid={formik.isValid}
											/>
										</FormGroup>
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							if (field.type === 'switch') {
								return (
									<div
										key={field.id}
										className={field.col ? `col-${field.col}` : 'col-12'}>
										<FormGroup key={field.id} id={field.id} label={field.title}>
											<Checks
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
										<div className='text-danger mt-1'>
											{formik.errors[field.id] && (
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							}
							return (
								<div
									key={field.id}
									className={field.col ? `col-${field.col}` : 'col-12'}>
									<FormGroup id={field.id} label={field.title}>
										<Input
											type={field.type || 'text'}
											name={field.id}
											onChange={formik.handleChange}
											value={formik.values[field.id] || ''}
											size='lg'
											placeholder={`${field.title}`}
											className='border border-2 rounded-0 shadow-none'
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
										/>
									</FormGroup>
									<div className='text-danger mt-1'>
										{formik.errors[field.id] && (
											<span className='error'>{formik.errors[field.id]}</span>
										)}
									</div>
								</div>
							);
						})}
						{/* <div>
							{nv && (
								<>
									<FormGroup>
										<Button variant='success' onClick={handleAddFieldKey}>
											Thêm nhiệm vụ
										</Button>
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
															name='kpiName'
															required
															size='lg'
															className='border border-2 rounded-0 shadow-none'
															placeholder='Chọn nhiệm vụ'
															value={element?.kpiName}
															onChange={(e) =>
																handleChangeKeysState(index, e)
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
												<FormGroup>
													<Button
														color='light'
														variant='light'
														style={{
															background: 'transparent',
															border: 0,
														}}
														size='lg'
														className='mt-4 h-100'
														onClick={(e) =>
															handleRemoveKeyField(e, index)
														}>
														<Icon icon='Trash' size='lg' />
													</Button>
												</FormGroup>
											</div>
										);
									})}
								</>
							)}
						</div> */}
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer className='p-4'>
				<Button size='lg' variant='secondary' onClick={onClose}>
					Đóng
				</Button>
				<Button size='lg' variant='primary' type='submit' onClick={formik.handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

CommonForm.propTypes = {
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
CommonForm.defaultProps = {
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

export default CommonForm;
