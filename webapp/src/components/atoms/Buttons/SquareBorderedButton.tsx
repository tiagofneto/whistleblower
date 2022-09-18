import React, { PropsWithChildren } from 'react'
import style from './buttons.module.css'

export const SquareBorderedButton: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={[style.squareBorderedButton, 'squareBorderedButton'].join(' ')}>{children}</div>
)

export default SquareBorderedButton
