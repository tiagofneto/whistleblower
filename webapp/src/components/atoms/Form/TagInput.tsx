import React from 'react'
import styles from './index.module.css'

interface InputProps {
  value?: string
  onChange?: (value: string) => void
  [key: string]: any
}

export const TagInput: React.FC<InputProps> = ({ value = '', onChange, ...rest }) => (
  <input className={styles.tagInput} value={`#${value}`} onChange={ev => onChange?.(ev.currentTarget.value.slice(1))} size={4} {...rest} />
)

export default TagInput
