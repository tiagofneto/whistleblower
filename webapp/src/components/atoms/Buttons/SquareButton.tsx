import React, { PropsWithChildren } from 'react'
import style from './buttons.module.css'

export const SquareButton: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={style.squareButton}>{children}</div>
)

export default SquareButton
