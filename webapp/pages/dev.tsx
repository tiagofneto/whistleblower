import type { NextPage } from 'next'
import { Box, H2, H3, Message, MetaMaskCard, ReadBlockchainExample, RoundButton, SquareButton } from 'src/components'
import BoxAnnotation from 'src/components/atoms/BoxAnnotation'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <h1 className={styles.title}>
          Component gallery
        </h1>

        <hr />{/* ------------------------------------------------------------------------------------------------------- */}

        <H2>Blockchain integration</H2>

        <MetaMaskCard />

        <ReadBlockchainExample />

        <hr />{/* ------------------------------------------------------------------------------------------------------- */}

        <H2>Buttons</H2>

        <div style={{ display: 'flex' }}>
          <SquareButton>Post</SquareButton>
          <SquareButton>Docs</SquareButton>
        </div>

        <div style={{ display: 'flex' }}>
          <RoundButton>#lorem</RoundButton>
          <RoundButton>#ipsum</RoundButton>
        </div>

        <hr />{/* ------------------------------------------------------------------------------------------------------- */}

        <H2>Text elements</H2>

        <H2>Heading 2</H2>
        <H3>Heading 3</H3>

        <hr />{/* ------------------------------------------------------------------------------------------------------- */}

        <H2>Post</H2>

        <Box>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis accumsan ante, vel auctor orci. Etiam sed arcu malesuada, interdum est eu, vestibulum lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus sed sapien maximus, mollis urna quis, sollicitudin ligula. Donec quis urna lorem. Nulla facilisis nunc quis tortor fringilla sodales. Vestibulum at dictum ante. Proin sem nisl, cursus ut faucibus pretium, tristique sed mi. Nullam ac finibus tellus.</Box>
        <BoxAnnotation size='small'>01.13.37</BoxAnnotation>
        <BoxAnnotation size='large'>anonymous</BoxAnnotation>
        <BoxAnnotation size='large'>0x123..45</BoxAnnotation>

        <Message />

      </main>
    </div>
  )
}

export default Home
