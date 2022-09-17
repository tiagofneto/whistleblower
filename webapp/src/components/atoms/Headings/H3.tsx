import React, { PropsWithChildren } from 'react'
import style from './headings.module.css'

export const H3: React.FC<PropsWithChildren> = ({ children }) => (
  <h3 className={style.h3}>{children}</h3>
)

export default H3
