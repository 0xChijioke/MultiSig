import React, { useEffect } from "react";
import { Select, Spin, Collapse } from "antd";
import { Address } from "..";
import { Flex, Heading, List, ListItem, ListIcon, Box } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const { Panel } = Collapse;

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
  return (
    <Flex direction={"column"} color={"white"} align={"center"}>
      <Heading fontSize={20} py={6} color={"white"}>
        Signatures Required: {signaturesRequired ? signaturesRequired.toNumber() : <Spin></Spin>}
      </Heading>

      <List>
        <Heading fontSize={20} py={6} color={"white"}>
          Owners
        </Heading>

        {own.map((ownerAddress, i) => (
          <ListItem as={Flex} direction="row" align="center" key={i}>
            <ListIcon as={MdCheckCircle} color="green.500" />
            <Address address={ownerAddress} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={18} />
          </ListItem>
        ))}
      </List>
      <Collapse
        collapsible={prevOwners.size == 0 ? "disabled" : ""}
        style={{ maxWidth: 400, margin: "auto", marginTop: 10 }}
      >
        <Panel header="Previous Owners" key="1">
          <List
            dataSource={[...prevOwners]}
            renderItem={prevOwnerAddress => {
              return (
                <List.Item key={"owner_" + prevOwnerAddress}>
                  <Address
                    address={prevOwnerAddress}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize={24}
                  />
                </List.Item>
              );
            }}
          />
        </Panel>
      </Collapse>
    </Flex>
  );
}
