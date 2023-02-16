/* eslint react/prop-types: 0 */
/* eslint-disable */
import { Button, Form, Input, InputNumber, Modal, Select, Upload, Checkbox } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { GrAttachment } from 'react-icons/gr';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { fetchReport } from '../../redux/slice/keyReportSlice';
import {
	createTargetLog,
	deleteTargetLog,
	createRecord,
	uploadFile,
} from '../../pages/dailyWorkTracking/services';
import axios from 'axios';
import { uploadFileToRemoteHost } from '../../pages/report/service';

// xlsx, csv, doc, docx, pdf, ai, psd, jpg, jpeg, png, txt
const ALLOWED_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'.pdf',
	'.xlsx',
	'text/csv',
	'.doc',
	'.docx',
	'.ai',
	'.psd',
	'.txt',
];
const ModalTargetLog = ({ isOpen, onOk, onCancel, logDay, target, reFetchTable, nameTable }) => {
	const dispatch = useDispatch();
	const [files, setFiles] = useState([]);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [valueRadio, setValueRadio] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch(fetchReport());
	}, []);

	const dataReport = useSelector((state) => state.report.reports);
	// const dataRecord = useSelector((state) => state.report.records);
	// console.log('dataReport', dataReport);

	const rolesString = window.localStorage.getItem('roles') || '[]';
	const roles = JSON.parse(rolesString);

	const isAdmin = roles.includes('admin') || roles.includes('manager');

	const currentTargetLog = useMemo(() => {
		const logDayFormat = logDay.format('YYYY-MM-DD');
		console.log('>>>', target);
		return (
			target?.TargetLogs?.find((item) => {
				if (item.reportDate) {
					return item.reportDate === logDayFormat;
				}
				return item.noticedDate === logDayFormat;
			}) || {}
		);
	}, [target, logDay]);

	const currentReport = useMemo(() => {
		const logDayFormat = logDay.format('YYYY-MM-DD');
		console.log('list report:', dataReport);
		return (
			dataReport.find((item) => {
				if (item.createdAt) {
					return item.createdAt === logDayFormat;
				}
				return item.noticedDate === logDayFormat;
			}) || {}
		);
	}, [dataReport, logDay]);

	useEffect(() => {
		console.log('currentTargetLog', currentTargetLog);
		console.log('currentReport', currentReport);
		if (_.isEmpty(currentTargetLog)) {
			form.resetFields();
			setFiles([]);
			setUploadedFiles([]);
		} else {
			form.setFieldsValue({
				quantity: currentTargetLog.quantity,
				status: currentTargetLog.status,
				note: currentTargetLog.note,
				report: currentReport.name,
			});
			const uploadedFilesFromApi = JSON.parse(currentTargetLog?.files || '[]');
			setUploadedFiles(uploadedFilesFromApi);
		}
	}, [currentTargetLog, form]);

	const handleFinish = async (values) => {
		console.log('form', values.status);
		console.log('target', currentTargetLog);
		try {
			setLoading(true);
			if (values.status === 'noticed') {
				const data = {
					...values,
					targetInfoId: target.id,
					id: currentTargetLog?.id,
				};
				data.noticedDate = logDay.format('YYYY-MM-DD');
				data.noticedStatus = 'noticed';
				await createTargetLog(data);
				await reFetchTable();
				onOk();
				return;
			}
			if (!values.quantity || !values.quantity || !values.note) {
				throw new Error('Vui lòng nhập đầy đủ thông tin');
			}
			if (values) {
				const dataRecord = {
					keyReportId: values.report,
					targetLogId: currentTargetLog.id,
					value: values.record,
				};
				if (!values.record || !values.report) {
					throw new Error('Vui lòng nhập đầy đủ thông tin');
				}
				await createRecord(dataRecord);
			}
			const data = {
				...values,
				targetInfoId: target.id,
				id: currentTargetLog?.id,
				reportDate: logDay.format('YYYY-MM-DD'),
			};
			// upload files
			const listUploaded = await Promise.all(
				files.map(async (file) => {
					try {
						const formData = new FormData();
						formData.append('files', file);
						const respData = await uploadFileToRemoteHost(formData);
						return respData.downloadLink;
					} catch (error) {
						return null;
					}
				}),
			);
			const listUploadedFiltered = listUploaded.filter((item) => !!item);
			data.files = JSON.stringify([...uploadedFiles, ...listUploadedFiltered]);
			await createTargetLog(data);
			await reFetchTable();
			onOk();
			toast(`Cập nhật báo cáo công việc ngày ${logDay.format('DD/MM/YYYY')} thành công`);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleFinishFailed = () => {
		toast('Vui lòng nhập đầy đủ thông tin');
	};
	const handleChooseFile = ({ file }) => {
		setFiles((prev) => [...prev, file]);
	};
	const handleRemoveUploadFile = (fileId) => {
		const removedFiles = files.filter((file) => file.uid !== fileId);
		setFiles(removedFiles);
	};
	const handleRemoveFiledUploaded = (fileName) => {
		const removedFiles = uploadedFiles.filter((file) => file !== fileName);
		setUploadedFiles(removedFiles);
	};
	const handleDelete = async () => {
		if (!currentTargetLog.id) {
			return;
		}
		try {
			await deleteTargetLog(currentTargetLog.id);
			await reFetchTable();
			onOk();
			toast.success('Xóa báo cáo thành công');
		} catch (error) {
			toast.error('Xóa báo cáo thất bại');
		}
	};
	return (
		<Modal forceRender open={isOpen} onOk={onOk} onCancel={onCancel} footer={null}>
			<div className='text-center mb-4'>
				<h4 className='my-2'>Báo cáo công việc </h4>
				<h4>Ngày {logDay.format('DD-MM-YYYY')}</h4>
			</div>
			<div>
				<Form
					name='targetLog'
					onFinishFailed={handleFinishFailed}
					onFinish={handleFinish}
					form={form}>
					<Form.Item name='note' label='Ghi chú'>
						<Input.TextArea />
					</Form.Item>
					<div className='d-flex justify-content-between mb-2'>
						<Form.Item name='quantity' label='Số luợng'>
							<InputNumber min={1} style={{ width: 120 }} />
						</Form.Item>
						<Form.Item
							name='status'
							label='Trạng thái'
							initialValue='inProgress'
							rules={[{ required: true, message: 'Hãy chọn trạng thái!' }]}>
							<Select
								style={{ width: 160 }}
								options={[
									{
										value: 'inProgress',
										label: 'Đã nhận',
									},
									{
										value: 'completed',
										label: 'Đã hoàn thành',
									},
									{
										value: 'noticed',
										label: 'Đã nhắc nhở',
										disabled: !isAdmin,
									},
								]}
							/>
						</Form.Item>
					</div>
					{nameTable === 'DailyWorkTracking' && currentTargetLog.id && (
						<>
							<div className='d-flex justify-content-between mb-2'>
								<Form.Item label='Đạt giá trị kinh doanh'>
									<Checkbox
										onClick={() => {
											setValueRadio(!valueRadio);
										}}
										checked={valueRadio}
										defaultChecked
										large
										value={valueRadio}
									/>
								</Form.Item>
							</div>
							{valueRadio === true && (
								<div className='d-flex justify-content-between mb-2'>
									<Form.Item name='report' label='Tiêu chí'>
										<Select
											placeholder='Hãy chọn tiêu chí!'
											// onChange={(value) => {
											// 	setDepartmentId(value);
											// 	setTargetSearchParams({
											// 		...targetSearchParams,
											// 		departmentId: value,
											// 	});
											// }}
											style={{ width: '100%' }}
											optionFilterProp='children'
											showSearch
											filterOption={(input, option) =>
												(option?.label.toLowerCase() ?? '').includes(
													input.toLowerCase(),
												)
											}
											options={_.map(dataReport, (item) => ({
												label: item.name,
												value: item.id,
											}))}
										/>
									</Form.Item>
									<Form.Item name='record' label='Giá trị'>
										<Input style={{ width: 160 }} />
									</Form.Item>
								</div>
							)}
						</>
					)}
					<Upload.Dragger
						accept={ALLOWED_TYPES.join(', ')}
						showUploadList={false}
						customRequest={handleChooseFile}
						className='p-2'
						multiple
						height={100}>
						<div className='mb-3'>PNG, JPG, WEBP or GIF. Max 10mb.</div>
						<Button icon={<AiOutlineCloudUpload style={{ marginRight: '10px' }} />}>
							Choose File
						</Button>
					</Upload.Dragger>

					{uploadedFiles.map((file) => (
						<div className='d-flex justify-content-between my-2' key={file}>
							<div className='d-flex align-items-center space-x-2'>
								<GrAttachment />
								<a href={file} target='_blank' className='mx-2' rel='noreferrer'>
									{file.split('/')[file.split('/')?.length - 1]}
								</a>
							</div>
							<div>
								<Button danger onClick={() => handleRemoveFiledUploaded(file)}>
									<BsTrash />
								</Button>
							</div>
						</div>
					))}

					{files.map((file) => (
						<div className='d-flex justify-content-between my-2' key={file.uid}>
							<div className='d-flex align-items-center space-x-2'>
								<GrAttachment />
								<span className='mx-2'>{file.name}</span>
							</div>
							<div>
								<Button danger onClick={() => handleRemoveUploadFile(file.uid)}>
									<BsTrash />
								</Button>
							</div>
						</div>
					))}
					<div className='d-flex justify-content-end mt-4'>
						<Button
							type='primary'
							htmlType='submit'
							className='mx-2'
							disabled={loading}>
							Lưu
						</Button>
						{isAdmin && !_.isEmpty(currentTargetLog) && (
							<Button danger onClick={handleDelete} className='mx-2'>
								Xóa báo cáo
							</Button>
						)}
						<Button onClick={onOk}>Đóng</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};
export default ModalTargetLog;
