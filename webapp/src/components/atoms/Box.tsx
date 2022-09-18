import React, { PropsWithChildren } from 'react'
import styles from './index.module.css'

export const Box: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={[styles.box, 'box'].join(' ')}>
    {children}
  </div>
)

export default Box
