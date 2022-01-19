import { ThemeProvider } from 'styled-components'
import { theme } from '@/theme'
import Header from '@/components/atoms/header'

function MyApp ({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
