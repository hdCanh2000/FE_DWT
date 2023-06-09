/* eslint react/prop-types: 0 */
/* eslint-disable */
import { Button, Form, Input, InputNumber, Modal, Select, Upload } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { GrAttachment } from 'react-icons/gr';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { createDailyWorkLog, } from '../../pages/dailyWorkTracking/services';
import axios from 'axios';

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
const ModalDailyWorkLog = ({ isOpen, onOk, onCancel, logDay, dailyWork, reFetchTable }) => {
	const [files, setFiles] = useState([]);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const rolesString = window.localStorage.getItem('roles') || '[]';
	const roles = JSON.parse(rolesString);

	const isAdmin = roles.includes('admin');

	const currentDailyWorkLog = useMemo(() => {
		const logDayFormat = logDay.format('YYYY-MM-DD');
		return (
			dailyWork?.DailyWorkLogs?.find((item) => {
				if (item.reportDate) {
					return item.reportDate === logDayFormat;
				}
				return item.noticedDate === logDayFormat;
			}) || {}
		);
	}, [dailyWork, logDay]);
	useEffect(() => {
		if (_.isEmpty(currentDailyWorkLog)) {
			form.resetFields();
			setFiles([]);
			setUploadedFiles([]);
		} else {
			form.setFieldsValue({
				quantity: currentDailyWorkLog.quantity,
				status: currentDailyWorkLog.status,
				note: currentDailyWorkLog.note,
			});
			const uploadedFilesFromApi = JSON.parse(currentDailyWorkLog?.files || '[]');
			setUploadedFiles(uploadedFilesFromApi);
		}
	}, [currentDailyWorkLog, form]);

	const handleFinish = async (values) => {
		try {
			setLoading(true);
			if (values.status === 'noticed') {
				const data = { ...values, dailyWorkId: dailyWork.id, id: currentDailyWorkLog?.id };
				data.noticedDate = logDay.format('YYYY-MM-DD');
				data.noticedStatus = 'noticed';
				await createDailyWorkLog(data);
				await reFetchTable();
				onOk();
				return;
			}
			if (!values.quantity || !values.quantity || !values.note) {
				throw new Error('Vui lòng nhập đầy đủ thông tin');
			}
			const data = {
				...values,
				dailyWorkId: dailyWork.id,
				id: currentDailyWorkLog?.id,
				reportDate: logDay.format('YYYY-MM-DD'),
			};
			// upload files
			const listUploaded = await Promise.all(
				files.map(async (file) => {
					try {
						const formData = new FormData();
						formData.append('files', file);
						formData.append('userId', dailyWork?.user?.id);
						formData.append('departmentId', dailyWork?.user?.department?.id);
						const resp = await axios.post(
							'https://report.sweetsica.com/api/report/upload',
							formData,
						);
						const respData = resp.data;
						return respData.downloadLink;
					} catch (error) {
						return null;
					}
				}),
			);
			const listUploadedFiltered = listUploaded.filter((item) => !!item);
			data.files = JSON.stringify([...uploadedFiles, ...listUploadedFiltered]);
			await createDailyWorkLog(data);
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
	return (
		<Modal forceRender open={isOpen} onOk={onOk} onCancel={onCancel} footer={null}>
			<div className='text-center mb-4'>
				<h4 className='my-2'>Báo cáo tiêu chí ngày </h4>
				<h4>Ngày {logDay.format('DD-MM-YYYY')}</h4>
			</div>
			<div>
				<Form
					name='daily-work-log'
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
						<Button onClick={onOk}>Đóng</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};
export default ModalDailyWorkLog;
