/* eslint-disable prettier/prettier */
import React, { useEffect } from "react";

import { Address } from "..";
import { Flex, Heading, List, ListItem, ListIcon, Spinner } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";



export default function Owners({ ownerEvents, signaturesRequired, mainnetProvider, blockExplorer }) {
  const owners = new Set();
  const prevOwners = new Set();
  ownerEvents.forEach(ownerEvent => {
    if (ownerEvent.args.added) {
      owners.add(ownerEvent.args.owner);
      prevOwners.delete(ownerEvent.args.owner);
    } else {
      prevOwners.add(ownerEvent.args.owner);
      owners.delete(ownerEvent.args.owner);
    }
  });

  const own = [...owners];
  const pown = [...prevOwners];
  return (
    <Flex direction={"column"} color={"white"} align={"center"}>
      <Heading fontSize={18} py={6} color={"white"}>
        Signatures Required: {signaturesRequired ? signaturesRequired.toNumber() : <Spinner /> }
      </Heading>

      <List>
        <Heading fontSize={20} py={6} color={"white"}>
          Owners
        </Heading>

        {own.map((ownerAddress, i) => (
          <ListItem as={Flex} direction="row" align="center" key={i}>
            <ListIcon as={MdCheckCircle} color="green.300" />
            <Address address={ownerAddress} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={18} />
          </ListItem>
        ))}
      </List>

      {!pown.length == 0 ?
      <List>
        <Heading fontSize={20} py={6} color={"white"}>
          Previous Owners
        </Heading>
        {pown.map((prevOwnerAddress, i) => (
          <ListItem key={i}>
            <Address
              address={prevOwnerAddress}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={24}
            />
          </ListItem>
        ))}
      </List>
      : null }
    </Flex>
  );
}
