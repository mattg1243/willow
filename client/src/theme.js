import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      green: '#03b126',
      grey: '#58A4B0',
      // colors for dark theme
      dark: {
        purple: "#63326E",
        red: '#EC4E20'
      }
    }
  }
})