/* eslint-disable prettier/prettier */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  components: {
    Modal: {
        // 1. We can update the base styles
        baseStyle: {
          bgColor: 'black', 
          colorScheme: 'black',
        },
        // 2. We can add a new button size or extend existing
        sizes: {
        //   xl: {
        //     h: '56px',
        //     fontSize: 'lg',
        //     px: '32px',
        //   },
        },
        // 3. We can add a new visual variant
        // variants: {
        //   'with-shadow': {
        //     bg: 'red.400',
        //     boxShadow: '0 0 2px 2px #efdfde',
        //   },
        //   // 4. We can override existing variants
        //   solid: (props) => ({
        //     bg: props.colorMode === 'dark' ? 'red.300' : 'red.500',
        //   }),
        // },
      },
    },
})


const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App subgraphUri={subgraphUri} />
      </BrowserRouter>
    </ChakraProvider>

  </ApolloProvider>,
  document.getElementById("root"),
);
