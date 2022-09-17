import React, { PropsWithChildren } from 'react'
import style from './buttons.module.css'

export const RoundButton: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={style.roundButton}>{children}</div>
)

export default RoundButton
