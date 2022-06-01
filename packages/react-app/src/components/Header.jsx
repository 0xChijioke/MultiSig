/* eslint-disable prettier/prettier */
import React from "react";
import { Text, Flex } from "@chakra-ui/react";


// displays a page header

export default function Header(props) {
  return (
    <>
    <Flex
      p='20px'
      justifyContent= "space-between"
      transition={'all .25s ease-in-out'}
      alignItems= "center">
       <Text 
          color={'white'}
          fontSize={{sm: 'md', lg: '2xl'}}
          fontWeight={700}> MultiSig
        </Text>
        
      {props.children}
    </Flex>
    </>
  );
}
