import React, { PropsWithChildren } from 'react'
import styles from './index.module.css'

interface BoxAnnotationProps {
  size: 'small' | 'large'
}

export const BoxAnnotation: React.FC<PropsWithChildren<BoxAnnotationProps>> = ({ size, children }) => (
  <div className={[styles.boxAnnotation, styles[size]].join(' ')}>
    {children}
  </div>
)

export default BoxAnnotation
