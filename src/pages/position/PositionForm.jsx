import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Button, Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import Checks from '../../components/bootstrap/forms/Checks';
import CustomSelect from '../../components/form/CustomSelect';
import Select from '../../components/bootstrap/forms/Select';
import { addPosition, updatePosition } from './services';
import { fetchPositionList } from '../../redux/slice/positionSlice';

const PositionForm = ({
	className,
	show,
	onClose,
	item,
	label,
	fields,
	options,
	validate,
	disabled,
	size,
	...props
}) => {
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const text = searchParams.get('text') || '';
	const currentPage = useSelector((state) => state.position.currentPage);

	const handleSubmit = async (data) => {
		const dataSubmit = {
			id: parseInt(data.id, 10),
			name: data.name,
			code: data?.code,
			address: data?.address,
			description: data?.description,
			department_id: parseInt(data?.department_id, 10),
			position_levels_id: parseInt(data?.position_levels_id, 10),
			manager: parseInt(data?.manager, 10),
			requirement_id: data?.requirements?.map((items) => items.id),
		};
		if (data.id) {
			try {
				const response = await updatePosition(dataSubmit);
				await response.data;
				toast.success('Cập nhật vị trí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = currentPage;
				query.limit = 10;
				dispatch(fetchPositionList(query));
				onClose();
			} catch (error) {
				toast.error('Cập nhật vị trí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		} else {
			try {
				const response = await addPosition(dataSubmit);
				await response.data;
				toast.success('Thêm vị trí thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				const query = {};
				query.text = text;
				query.page = 1;
				query.limit = 10;
				dispatch(fetchPositionList(query));
				onClose();
			} catch (error) {
				toast.error('Thêm vị trí không thành công!', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 1000,
				});
				throw error;
			}
		}
	};
	const formik = useFormik({
		initialValues: { ...item },
		validationSchema: validate,
		enableReinitialize: true,
		onSubmit: (values) => {
			handleSubmit(values);
			// resetForm();
		},
	});
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
										<FormGroup key={field.id} id={field.id} label={field.title}>
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
										<FormGroup key={field.id} id={field.id} label={field.title}>
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
											disabled={disabled}
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

PositionForm.propTypes = {
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
	label: PropTypes.string,
	size: PropTypes.string,
};
PositionForm.defaultProps = {
	className: null,
	disabled: false,
	show: false,
	columns: [],
	options: [],
	fields: [],
	validate: null,
	item: null,
	onClose: null,
	label: '',
	size: 'lg',
};

export default PositionForm;
