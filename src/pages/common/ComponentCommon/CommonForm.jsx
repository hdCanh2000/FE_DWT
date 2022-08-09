import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import validate from '../../employee/validate';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';

const CommonForm = ({
	className,
	show,
	onClose,
	item,
	handleSubmit,
	label,
	fields,
	options,
	...props
}) => {
	const formik = useFormik({
		initialValues: {
			code: item?.code || '',
			name: item?.name || '',
			email: item?.email || '',
			phone: item?.phone || '',
			address: item?.address || '',
			department: item?.department?.slug || '',
			password: '',
			confirmPassword: '',
			city: '',
			active: true,
		},
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
			<form>
				<Modal.Body className='px-4'>
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
				</Modal.Body>
				<Modal.Footer className='p-4'>
					<Button size='lg' variant='secondary' onClick={onClose}>
						Đóng
					</Button>
					<Button size='lg' variant='primary' type='submit' onClick={handleSubmit}>
						Xác nhận
					</Button>
				</Modal.Footer>
			</form>
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
	item: null,
	onClose: null,
	handleSubmit: null,
	label: '',
};

export default CommonForm;
