import React from 'react';
import styles from './loading.module.css';

const Loading = () => {
	return (
		<div className={styles.overlay}>
			<div className={styles.overlay__inner}>
				<div className={styles.overlay__content}>
					<span className={styles.spinner} />
				</div>
			</div>
		</div>
	);
};

export default Loading;
