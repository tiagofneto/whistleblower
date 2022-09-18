import React from 'react'
import styles from './index.module.css'

interface InputProps {
  value?: string
  onChange?: (value: string) => void
  onClick?: () => void
  [key: string]: any
}

export const ButtonInput: React.FC<InputProps> = ({ value, onChange, onClick, ...rest }) => (
  <div className={styles.buttonInput}>
    <input className={styles.buttonInputInput} value={value} onChange={ev => onChange?.(ev.currentTarget.value)} {...rest} />
    <button className={styles.buttonInputButton} onClick={() => onClick?.()} >Pay</button>
  </div>
)

export default ButtonInput
