import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Form from 'react-bootstrap/Form';
import { Button, Modal } from 'react-bootstrap';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Checks from '../../components/bootstrap/forms/Checks';
import CustomSelect from '../../components/form/CustomSelect';
import Select from '../../components/bootstrap/forms/Select';

const KPINormForm = ({
	className,
	show,
	onClose,
	item,
	handleSubmit,
	label,
	fields,
	options,
	validate,
	disable,
	size,
	...props
}) => {
	const formik = useFormik({
		initialValues: { ...item },
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			handleSubmit(values);
			resetForm();
		},
	});
	const [showForm, setShowForm] = useState(1);

	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size={size}
			scrollable
			centered
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
												placeholder={`${field.title}`}
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
												placeholder={`${field.title}`}
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
						<div className='d-flex align-items-center'>
							{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
							<label className='form-label me-4 mb-0'>Định mức KPI:</label>
							<div className='ml-2 d-flex'>
								<Form.Check
									type='radio'
									id='show1'
									name='check'
									label='Thang điểm'
									className='me-2'
									defaultChecked
									value={1}
									onChange={() => setShowForm(1)}
								/>
								<Form.Check
									type='radio'
									id='show2'
									name='check'
									label='Tổng điểm'
									onChange={() => setShowForm(2)}
								/>
							</div>
						</div>
						<div className='mb-4'>
							{showForm === 1 && (
								<div className='row g-4'>
									<div className='col-3'>
										<FormGroup id='kpivalue' label='Thang điểm'>
											<Input
												type='number'
												name='kpivalue'
												onChange={formik.handleChange}
												value={formik.values.kpivalue || ''}
												size='lg'
												placeholder='Thang điểm'
												className='border border-2 rounded-0 shadow-none'
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
									</div>
									<div className='col-6'>
										<FormGroup
											id='descriptionkpivalue'
											label='Tương đương với kết quả'>
											<Input
												type='text'
												name='descriptionkpivalue'
												onChange={formik.handleChange}
												value={formik.values.descriptionkpivalue || ''}
												size='lg'
												placeholder='Tương đương với kết quả'
												className='border border-2 rounded-0 shadow-none'
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
									</div>
									<div className='col-3'>
										<FormGroup id='quantity' label='Số lượng'>
											<Input
												type='number'
												name='quantity'
												onChange={formik.handleChange}
												value={formik.values.quantity || ''}
												size='lg'
												placeholder='Số lượng'
												className='border border-2 rounded-0 shadow-none'
												onBlur={formik.handleBlur}
											/>
										</FormGroup>
									</div>
								</div>
							)}
						</div>
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

KPINormForm.propTypes = {
	className: PropTypes.string,
	disable: PropTypes.string,
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
	size: PropTypes.string,
};
KPINormForm.defaultProps = {
	className: null,
	disable: null,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	handleSubmit: null,
	label: '',
	size: 'lg',
};

export default KPINormForm;
