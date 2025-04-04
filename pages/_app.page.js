import { ThemeProvider } from 'styled-components'
import { theme } from '@/theme'
import Header from '@/components/atoms/header'
import { useRouter } from 'next/router'

function MyApp ({ Component, pageProps }) {
  const { pathname } = useRouter()
  console.log(pathname)
  return (
    <ThemeProvider theme={theme}>
      {!pathname.includes('/admin') && <Header />}
      <Component {...pageProps} />
      <style jsx global>{`
        .firebase-emulator-warning {
          display: none !important;
        }
      `}</style>
    </ThemeProvider>
  )
}

export default MyApp
