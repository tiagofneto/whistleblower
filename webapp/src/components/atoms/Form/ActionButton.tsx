import React from 'react'
import styles from './index.module.css'

interface ActionButtonProps {
  text?: string
  onClick?: () => void
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => (
  <div className={styles.actionButton}>
    <button className={styles.inner} onClick={() => onClick?.()} >{text}</button>
  </div>
)

export default ActionButton
