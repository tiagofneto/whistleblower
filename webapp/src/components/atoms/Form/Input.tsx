import React from 'react'
import styles from './index.module.css'

interface InputProps {
  value?: string
  onChange?: (value: string) => void
  [key: string]: any
}

export const Input: React.FC<InputProps> = ({ value, onChange, onClick, ...rest }) => (
  <div className={styles.buttonInput}>
    <input className={styles.input} value={value} onChange={ev => onChange?.(ev.currentTarget.value)} {...rest} />
  </div>
)

export default Input
