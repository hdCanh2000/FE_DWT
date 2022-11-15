import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';

const NestedCommonForm = ({
	className,
	onCloseNestedModal,
	openNestedModal,
	onSubmitNestedForm,
	label,
	fields,
	model,
	validate,
	size,
	...props
}) => {
	const formik = useFormik({
		initialValues: {},
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			onSubmitNestedForm(values, model);
			resetForm();
		},
	});

	// const [data, setData] = useState({});

	// const handleChange = (e) => {
	// 	const { value } = e.target;
	// 	setData({
	// 		...data,
	// 		[e.target.name]: value,
	// 	});
	// };

	// const handleClearValue = () => {
	// 	setData({});
	// };

	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={openNestedModal}
			onHide={onCloseNestedModal}
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
							return (
								<div
									key={field.id}
									className={field.col ? `col-${field.col}` : 'col-12'}>
									<FormGroup id={field.id} label={field.title}>
										<Input
											disabled={field?.isDisabled}
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
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer className='p-4'>
				<Button size='lg' variant='secondary' onClick={onCloseNestedModal}>
					Đóng
				</Button>
				<Button size='lg' variant='primary' type='submit' onClick={formik.handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

NestedCommonForm.propTypes = {
	className: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	columns: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	fields: PropTypes.array,
	// eslint-disable-next-line react/forbid-prop-types
	validate: PropTypes.object,
	model: PropTypes.string.isRequired,
	onCloseNestedModal: PropTypes.func.isRequired,
	openNestedModal: PropTypes.bool.isRequired,
	onSubmitNestedForm: PropTypes.func.isRequired,
	label: PropTypes.string,
	size: PropTypes.string,
};
NestedCommonForm.defaultProps = {
	className: null,
	columns: [],
	fields: [],
	validate: null,
	label: '',
	size: 'lg',
};

export default NestedCommonForm;
