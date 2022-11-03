/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Card, Modal } from 'react-bootstrap';
import './style.scss';
// import { useRowSelect, useTable } from 'react-table';

// eslint-disable-next-line prettier/prettier, react/prop-types
const DetailPendingWorkTrack =({ data, show, handleClose })=>{
	return (
		<Modal
			show={show}
			onHide={handleClose}
			aria-labelledby='contained-modal-title-vcenter'
			size='xl'
			keyboard={false}
			centered>
			<Modal.Header closeButton className='text-center pb-0'>
				<Modal.Title className='text-center w-100'>
					{/* eslint-disable-next-line react/prop-types */}
					Báo cáo công việc : {data?.kpiNorm?.name}
				</Modal.Title>
			</Modal.Header>
			<table className='tables'>
				<thead style={{ display: 'block' }}>
					<tr>
						<th style={{ width: '200px' }}>Ngày thực hiện</th>
						<th style={{ width: '616px', textAlign: 'center' }}>Công việc thực hiện</th>
						<th style={{ width: '200px' }}>Trạng thái công việc</th>
					</tr>
				</thead>
				<tbody className='overflow-scroll' style={{ display: 'block', height: '600px' }}>
					{data?.workTrackLogs &&
						data?.workTrackLogs?.map((item) => (
							<tr>
								<td style={{ width: '200px' }}>{item?.date}</td>
								<td style={{ width: '616px', textAlign: 'center' }}>
									{item?.note}
								</td>
								<td style={{ width: '200px' }}>
									{item?.status === 'completed' && 'Đã hoàn thành'}
									{item?.status === 'inProgress' && 'Đã nhận'}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</Modal>
	);
};
export default DetailPendingWorkTrack;
