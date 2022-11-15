import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Modal, Button } from 'react-bootstrap';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import CustomSelect from '../../../components/form/CustomSelect';
import Select from '../../../components/bootstrap/forms/Select';
import NestedCommonForm from './NestedCommonForm';
// import Icon from '../../../components/icon/Icon';

const CommonForm = ({
	className,
	show,
	onClose,
	item,
	handleSubmit,
	onSubmitNestedForm,
	label,
	fields,
	options,
	validate,
	disabled,
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

	const [openNestedModal, setOpenNestedModal] = useState(false);
	// const [fieldsNestedModal, setFiledsNestedModal] = useState({
	// 	columns: [],
	// 	model: '',
	// });

	// const onOpenNestedModal = (columns, model) => {
	// 	setFiledsNestedModal({
	// 		columns,
	// 		model,
	// 	});
	// 	setOpenNestedModal(true);
	// };

	const onCloseNestedModal = () => {
		setOpenNestedModal(false);
	};

	return (
		<>
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
													disabled={disabled}
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
											<div className='d-flex align-items-end w-100'>
												<FormGroup
													className='w-100'
													key={field.id}
													id={field.id}
													label={field.title}>
													<CustomSelect
														disabled={disabled}
														placeholder={`${field.title}`}
														value={formik.values[field.id]}
														onChange={(value) => {
															formik.setFieldValue(field.id, value);
														}}
														isMulti={!!field.isMulti}
														options={field.options}
													/>
												</FormGroup>
												{/* {field.isShowNested && (
													<Icon
														color='dark'
														icon='Add'
														size='2x'
														className='cursor-pointer ms-2'
														onClick={() =>
															onOpenNestedModal(
																field.fields,
																field.id,
															)
														}
													/>
												)} */}
											</div>
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
											<FormGroup
												key={field.id}
												id={field.id}
												label={field.title}>
												<Textarea
													disabled={disabled}
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
											<FormGroup
												key={field.id}
												id={field.id}
												label={field.title}>
												<Checks
													disabled={disabled}
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
												<span className='error'>
													{formik.errors[field.id]}
												</span>
											)}
										</div>
									</div>
								);
							})}
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
			<NestedCommonForm
				onCloseNestedModal={onCloseNestedModal}
				openNestedModal={openNestedModal}
				// fields={fieldsNestedModal.columns}
				// model={fieldsNestedModal.model}
				onSubmitNestedForm={onSubmitNestedForm}
				label='Thêm mới'
			/>
		</>
	);
};

CommonForm.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
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
	onSubmitNestedForm: PropTypes.func,
	label: PropTypes.string,
	size: PropTypes.string,
};
CommonForm.defaultProps = {
	className: null,
	disabled: false,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	handleSubmit: null,
	onSubmitNestedForm: null,
	label: '',
	size: 'lg',
};

export default CommonForm;
