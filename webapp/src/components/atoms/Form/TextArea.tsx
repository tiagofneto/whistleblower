import React from 'react'
import styles from './index.module.css'

interface TextAreaProps {
  value?: string
  onChange?: (value: string) => void
  [key: string]: any
}

export const TextArea: React.FC<TextAreaProps> = ({ value, onChange, ...rest }) => (
  <textarea className={styles.textarea} value={value} onChange={ev => onChange?.(ev.currentTarget.value)} {...rest} />
)

export default TextArea
