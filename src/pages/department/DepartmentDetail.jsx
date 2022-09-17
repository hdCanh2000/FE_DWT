import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import CustomSelect from '../../components/form/CustomSelect';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Checks from '../../components/bootstrap/forms/Checks';
import Input from '../../components/bootstrap/forms/Input';

const DetailForm = ({
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
	...props
}) => {
	const formik = useFormik({
		initialValues: { ...item },
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values, { resetForm }) => {
			handleSubmit(values);
			resetForm();
		},
	});
	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size='lg'
			scrollable
			centered
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
                                                    disabled
														rows={5}
														ariaLabel={field.title}
														placeholder={`Nhập ${field.title}`}
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
                                                    disabled
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
													onChange={formik.handleChange}
													value={formik.values[field.id] || ''}
													size='lg'
													placeholder={`Nhập ${field.title}`}
													className='border border-2 rounded-0 shadow-none'
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													isTouched={formik.touched[field.id]}
												/>
											</FormGroup>
											<div className='text-danger mt-1'>
												{formik.errors[field.id] && (
													<span className='error'>
														{formik.errors[field.id]}
													</span>
												)}
											</div>
										</React.Fragment>
									);
								})}
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

DetailForm.propTypes = {
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
};
DetailForm.defaultProps = {
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
};

export default DetailForm;
