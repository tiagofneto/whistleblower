import React from 'react'
import { Box, BoxAnnotation, SquareBorderedButton } from 'src/components'
import styles from './index.module.css'

export const Article: React.FC = () => {
  const message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis accumsan ante, vel auctor orci. Etiam sed arcu malesuada, interdum est eu, vestibulum lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus sed sapien maximus, mollis urna quis, sollicitudin ligula. Donec quis urna lorem. Nulla facilisis nunc quis tortor fringilla sodales. Vestibulum at dictum ante. Proin sem nisl, cursus ut faucibus pretium, tristique sed mi. Nullam ac finibus tellus.'
  const tags = [
    'corruption',
    'money_loundering',
  ]
  return (
    <article className={styles.article}>
      <div className='anchor'>
        <Box>{message}</Box>
        <BoxAnnotation size='large'>0x123..45</BoxAnnotation>
        <BoxAnnotation size='small'>01.13.37</BoxAnnotation>

      </div>
      <div className='col'>
        {tags.map(tag => <SquareBorderedButton key={tag}>#{tag}</SquareBorderedButton>)}
      </div>
    </article>
  )
}

export default Article
