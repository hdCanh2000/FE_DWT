/* eslint-disable */
import { Button, Form, Input, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getAllUsers } from '../kpiNorm/services';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { GrAttachment } from 'react-icons/gr';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { uploadFile } from '../dailyWorkTracking/services';
import axios from 'axios';
import { createReport, uploadFileToRemoteHost } from './service';
import { removeAccents } from '../../utils/utils';

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
const ReportForm = ({ onSuccess }) => {
	const [form] = Form.useForm();
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const { data: listUsersData = { data: [] } } = useQuery('getAllUsers', () => getAllUsers());
	const listUsers = listUsersData.data;
	const handleRemoveUploadFile = (fileId) => {
		const removedFiles = files.filter((file) => file.uid !== fileId);
		setFiles(removedFiles);
	};
	const handleChooseFile = ({ file }) => {
		//replace space with _
		const originalName = file.name;
		const noSpaceFileName = originalName.replace(/\s/g, '_');
		//remove accents
		const removedAccentsFileName = removeAccents(noSpaceFileName);
		const myNewFile = new File([file], removedAccentsFileName, { type: file.type });
		//only upload 1 file
		setFiles([myNewFile]);
	};
	const handleFinishFail = (errorInfo) => {
		console.log('Failed:', errorInfo);
		toast.error('Thao tác không thành công');
	};
	const userId = window.localStorage.getItem('userId');
	const handleFinish = async (values) => {
		try {
			setLoading(true);
			//upload file
			if (files.length === 0) {
				toast.error('Vui lòng chọn file');
				return;
			}
			const formData = new FormData();
			//only upload 1 file
			formData.append('files', files[0]);
			const resp = await uploadFileToRemoteHost(formData);
			const fileLink = resp.downloadLink;
			//create report
			await createReport({
				...values,
				file: fileLink,
			});
			toast.success('Tạo biên bản thành công');
			form.resetFields();
			setFiles([]);
			await onSuccess();
		} catch (err) {
			console.log(err);
			toast.error('Thao tác không thành công');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form
			name='report-form'
			form={form}
			onFinish={handleFinish}
			onFinishFailed={handleFinishFail}>
			<h4 className='my-4 p-4'>Upload biên bản họp</h4>
			<Form.Item
				name='title'
				rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
				label='Tên biên bản'>
				<Input placeholder='Tên biên bản họp' />
			</Form.Item>

			<Upload.Dragger
				accept={ALLOWED_TYPES.join(', ')}
				showUploadList={false}
				customRequest={handleChooseFile}
				className='p-2'
				multiple={false}
				height={100}>
				<div className='mb-3'>Upload biên bản họp</div>
				<Button icon={<AiOutlineCloudUpload style={{ marginRight: '10px' }} />}>
					Choose File
				</Button>
			</Upload.Dragger>

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
			<Form.Item
				name='people'
				label='Người liên quan'
				rules={[{ required: true, message: 'Vui lòng chọn người liên quan' }]}>
				<Select
					showSearch
					optionFilterProp='children'
					filterOption={(input, option) => {
						if (!option.label) return false;
						return (option?.label.toLowerCase() ?? '').includes(input.toLowerCase());
					}}
					options={listUsers.map((item) => ({
						label: item?.name,
						value: item?.id,
					}))}
					mode='multiple'
					placeholder='Chọn người liên quan'
				/>
			</Form.Item>
			<Button
				type='primary'
				htmlType='submit'
				style={{ width: '100%' }}
				loading={loading}
				disabled={loading}>
				{loading ? 'Đang tạo biên bản' : 'Tạo biên bản'}
			</Button>
		</Form>
	);
};

export default ReportForm;
