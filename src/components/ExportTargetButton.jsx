/* eslint react/prop-types: 0 */
import React from 'react';
import { toast } from 'react-toastify';
import { exportTargets } from '../pages/dailyWorkTracking/services';
import Button from './bootstrap/Button';

const ExportTargetButton = ({ params = {} }) => {
	const [loading, setLoading] = React.useState(false);
	const handleExport = async () => {
		try {
			setLoading(true);
			const resp = await exportTargets(params);
			const link = document.createElement('a');
			link.href = resp.downloadLink;
			link.setAttribute('download', resp.fileName);
			document.body.appendChild(link);
			link.click();
			link.remove();
			toast.success('Xuất file thành công');
		} catch (err) {
			toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
		} finally {
			setLoading(false);
		}
	};
	return (
		<Button
			color='primary'
			icon='FileDownload'
			tag='button'
			onClick={handleExport}
			isDisable={loading}>
			{loading ? 'Đang tải xuống' : 'Xuất excel'}
		</Button>
	);
};

export default ExportTargetButton;
