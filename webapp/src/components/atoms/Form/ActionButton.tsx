import React from 'react'
import styles from './index.module.css'

interface ActionButtonProps {
  text?: string
  onClick?: () => void
  [key: string]: any
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick, ...rest }) => (
  <div className={[styles.actionButton, 'actionButton', rest.disabled ? 'disabled' : ''].join(' ')}>
    <button className={styles.inner} onClick={() => onClick?.()} {...rest}>{text}</button>
  </div>
)

export default ActionButton
