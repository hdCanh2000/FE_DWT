import React from 'react';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import styles from './addform.module.css';

const AddTaskPage = () => {
	return (
		<PageWrapper title='Thêm nhiệm vụ'>
			<Page container='fluid'>
				<div className='row mx-4 px-4'>
					<div className='col-12'>
						<div className={styles.wrapper}>
							{/* 1. Nhiem vu  */}
							<div className={styles.inner}>
								<div className={styles['item-title']}>
									<h1>1. Nhiệm vụ</h1>
								</div>
								<div className={styles['item-name']}>
									<div>
										<span>1.1. Tên nhiệm vụ</span>
										<div className='col-12'>
											<FormGroup color='red' id='name'>
												<Input
													// onChange={handleChange}
													// value={task?.name || ''}
													name='name'
													ariaLabel='Tên công việc'
													// ref={nameRef}
													required
													placeholder='Tên công việc'
													size='lg'
													className='border border-2 rounded-0 shadow-none'
												/>
											</FormGroup>
										</div>
									</div>
								</div>
								<div className={styles.item}>
									<div className={styles['item-title']}>
										<h1>1. Nhiệm vụ</h1>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AddTaskPage;
