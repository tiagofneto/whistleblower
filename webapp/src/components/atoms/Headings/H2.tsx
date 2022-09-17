import React, { PropsWithChildren } from 'react'
import style from './headings.module.css'

export const H2: React.FC<PropsWithChildren> = ({ children }) => (
  <h2 className={style.h2}>{children}</h2>
)

export default H2
