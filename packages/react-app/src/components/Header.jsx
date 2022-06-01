/* eslint-disable prettier/prettier */
import React from "react";
import { Text, Flex } from "@chakra-ui/react";


// displays a page header

export default function Header(props) {
  return (
    <>
    <Flex
      m='20px'
      justifyContent= "space-between"
      alignItems= "center">
       <Text 
          fontWeight={700}>👛 Frens Locker
        </Text>
        
      {props.children}
    </Flex>
    </>
  );
}
