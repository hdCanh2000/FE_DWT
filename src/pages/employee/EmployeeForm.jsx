import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Select from '../../components/bootstrap/forms/Select';
import CustomSelect from '../../components/form/CustomSelect';
import Checks from '../../components/bootstrap/forms/Checks';
import Input from '../../components/bootstrap/forms/Input';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Button from '../../components/bootstrap/Button';

const EmployeeForm = ({
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
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			handleSubmit(values);
			resetForm();
		},
	});
	const [isOpen, setIsOpen] = React.useState(false);
	const handleOpen = () => {
		setIsOpen(!isOpen);
	};
	return (
		<Modal
			className={classNames(className, 'p-4')}
			show={show}
			onHide={onClose}
			size='xl'
			scrollable
			centered
			{...props}>
			<Modal.Header closeButton className='p-4'>
				<Modal.Title>{label}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='px-4'>
				<form>
					<div className='row g-4'>
						<div className='col-12'>
							<Card className='w-100'>
								<CardHeader>
									<CardLabel iconColor='primary'>
										<CardTitle>
											<CardLabel>Thông tin cơ bản</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<div className='p-4 row'>
									{fields?.map((field) => {
										if (field.id === 'name') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
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
															<span className='error'>
																{formik.errors[field.id]}
															</span>
														)}
													</div>
												</div>
											);
										}
										if (field.id === 'sex') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
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
										if (field.id === 'code') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
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
															<span className='error'>
																{formik.errors[field.id]}
															</span>
														)}
													</div>
												</div>
											);
										}
										if (field.id === 'email') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
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
										}
										if (field.id === 'department') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
													<FormGroup
														key={field.id}
														id={field.id}
														label={field.title}>
														<CustomSelect
															placeholder={`Chọn ${field.title}`}
															value={formik.values[field.id]}
															onChange={(value) => {
																formik.setFieldValue(
																	field.id,
																	value,
																);
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
										if (field.id === 'position') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
													<FormGroup
														key={field.id}
														id={field.id}
														label={field.title}>
														<CustomSelect
															placeholder={`Chọn ${field.title}`}
															value={formik.values[field.id]}
															onChange={(value) => {
																formik.setFieldValue(
																	field.id,
																	value,
																);
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

										if (field.id === 'role') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
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
										if (field.id === 'status') {
											return (
												<div
													key={field.id}
													className={
														field.col ? `col-${field.col}` : 'col-12'
													}>
													<FormGroup
														key={field.id}
														id={field.id}
														label={field.title}>
														<Checks
															id={field.id}
															type='switch'
															size='lg'
															label={
																Number(formik.values[field.id]) ===
																1
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
										return '';
									})}
								</div>
							</Card>
							<Card className='w-100'>
								<CardHeader onClick={handleOpen} style={{ cursor: 'pointer' }}>
									<CardLabel iconColor='primary'>
										<CardTitle>
											<CardLabel>Thông tin chi tiết</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardActions
										style={{
											border: '1px solid #9fa6ac',
											borderRadius: '9px',
										}}>
										<Button
											icon={isOpen ? 'KeyboardArrowUp' : 'KeyboardArrowDown'}
											tag='button'
										/>
									</CardActions>
								</CardHeader>
								<div className='p-4 row'>
									{isOpen &&
										fields?.map((field) => {
											if (field.id === 'phone') {
												return (
													<div
														key={field.id}
														className={
															field.col
																? `col-${field.col}`
																: 'col-12'
														}>
														<FormGroup
															id={field.id}
															label={field.title}>
															<Input
																type={field.type || 'text'}
																name={field.id}
																onChange={formik.handleChange}
																value={
																	formik.values[field.id] || ''
																}
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
											}

											if (field.id === 'address') {
												return (
													<div
														key={field.id}
														className={
															field.col
																? `col-${field.col}`
																: 'col-12'
														}>
														<FormGroup
															key={field.id}
															id={field.id}
															label={field.title}>
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
											if (field.id === 'dateOfBirth') {
												return (
													<div
														key={field.id}
														className={
															field.col
																? `col-${field.col}`
																: 'col-12'
														}>
														<FormGroup
															id={field.id}
															label={field.title}>
															<Input
																type={field.type || 'text'}
																name={field.id}
																onChange={formik.handleChange}
																value={
																	formik.values[field.id] || ''
																}
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
											}
											if (field.id === 'dateOfJoin') {
												return (
													<div
														key={field.id}
														className={
															field.col
																? `col-${field.col}`
																: 'col-12'
														}>
														<FormGroup
															id={field.id}
															label={field.title}>
															<Input
																type={field.type || 'text'}
																name={field.id}
																onChange={formik.handleChange}
																value={
																	formik.values[field.id] || ''
																}
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
											}
											return '';
										})}
								</div>
							</Card>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer style={{ background: '#F8F8F8' }}>
				<Button size='lg' variant='secondary' color='danger' onClick={onClose}>
					Đóng
				</Button>
				<Button
					style={{ marginRight: '10px' }}
					size='lg'
					variant='primary'
					type='submit'
					color='primary'
					onClick={formik.handleSubmit}>
					Xác nhận
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

EmployeeForm.propTypes = {
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
EmployeeForm.defaultProps = {
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

export default EmployeeForm;
