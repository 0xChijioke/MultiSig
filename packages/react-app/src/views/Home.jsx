/* eslint-disable prettier/prettier */
import { Container, Box, Flex, Stack, Button } from "@chakra-ui/react";
import React from "react";
import { Balance, Address, TransactionListItem, Owners } from "../components";
import QR from "qrcode.react";
import { List } from "antd";


export default function Home({
  contractAddress,
  localProvider,
  price,
  mainnetProvider,
  blockExplorer,
  executeTransactionEvents,
  contractName,
  readContracts,
  ownerEvents,
  signaturesRequired,
}) {
  
  return (
    <>
      <Container mt={7} alignItems={'center'}>
        <Stack transition="3s ease" align={'center'} boxShadow={'md'}  borderRadius={'30px'} py={"40px"} px={0} bgGradient='linear(to-l, black 70%, gray.800)'>
          <Flex color={'white'}>
            <Balance
              address={contractAddress ? contractAddress : ""}
              provider={localProvider}
              dollarMultiplier={price}
              size={64}
            />
          </Flex>
          <Flex pt={5}>
            <QR
              value={contractAddress ? contractAddress.toString() : ""}
              size="180"
              level="H"
              includeMargin
              renderAs="svg"
              imageSettings={{ excavate: false }}
            />
          </Flex>
          <Flex color={'gray.800'} p={6}>
            <Address
              address={contractAddress ? contractAddress : ""}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={20}
            />
          </Flex>
          <Flex>
        <Button variant={'outline'} color='white' borderColor={'gray'} rounded={6} onClick={()=>{
          window.location = "/create"
        }}>Propose Transaction</Button>
        </Flex>
        </Stack>
        <Box align='center' color={'white'}>
        <Owners ownerEvents={ownerEvents} signaturesRequired={signaturesRequired} mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} />
        </Box>
        
        <List
          bordered
          dataSource={executeTransactionEvents}
          renderItem={item => {
            return (
              <TransactionListItem
                item={Object.create(item)}
                mainnetProvider={mainnetProvider}
                blockExplorer={blockExplorer}
                price={price}
                readContracts={readContracts}
                contractName={contractName}
              />
            );
          }}
        />
      </Container>


    </>
  );
}
