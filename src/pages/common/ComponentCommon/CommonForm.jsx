import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';

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
	...props
}) => {
	const formik = useFormik({
		initialValues: { ...item },
		enableReinitialize: true,
		validate,
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
								{fields.slice(1)?.map((field) => {
									if (field.type === 'select') {
										return (
											<FormGroup
												key={field.id}
												className='col-12'
												id={field.id}
												label={field.title}>
												<Select
													ariaLabel={field.title}
													placeholder={`Chọn ${field.title}`}
													list={options}
													required
													name={field.id}
													className='border border-2 rounded-0 shadow-none'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values[field.id]}
													isValid={formik.isValid}
												/>
											</FormGroup>
										);
									}
									if (!field.isShow) {
										return '';
									}
									if (field.type === 'textarea') {
										return (
											<FormGroup
												key={field.id}
												className='col-12'
												id={field.id}
												label={field.title}>
												<Textarea
													rows={5}
													ariaLabel={field.title}
													placeholder={`Nhập ${field.title}`}
													list={options}
													required
													size='lg'
													name={field.id}
													className='border border-2 rounded-0 shadow-none'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values[field.id]}
													isValid={formik.isValid}
												/>
											</FormGroup>
										);
									}
									if (field.type === 'switch') {
										return (
											<FormGroup
												key={field.id}
												className='col-12'
												id={field.id}
												label={field.title}>
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
										);
									}
									return (
										<FormGroup
											key={field.id}
											className='col-12'
											id={field.id}
											label={field.title}>
											<Input
												type={field.type || 'text'}
												name={field.id}
												onChange={formik.handleChange}
												value={formik.values[field.id] || ''}
												required
												size='lg'
												placeholder={`Nhập ${field.title}`}
												className='border border-2 rounded-0 shadow-none'
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched[field.id]}
												invalidFeedback={formik.errors[field.id]}
											/>
										</FormGroup>
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
	validate: PropTypes.func,
	onClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	label: PropTypes.string,
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
};

export default CommonForm;
