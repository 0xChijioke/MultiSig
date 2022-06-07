import React, { useState, useEffect } from "react";
import { Button, List, Text, ListItem } from "@chakra-ui/react";

import { Address, Balance, Blockie } from "..";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { FaEllipsisH } from "react-icons/fa";
import { ethers } from "ethers";
import { parseEther } from "@ethersproject/units";
import { parseExternalContractTransaction } from "../../helpers";

const axios = require("axios");

export default function TransactionListItem({
  item,
  mainnetProvider,
  blockExplorer,
  price,
  readContracts,
  contractName,
  children,
}) {
  //console.log("coming in item:", item);
  item = item.args ? item.args : item;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [txnData, setTxnData] = useState({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!txnData[item.hash]) {
      try {
        const parsedData = item.data != "0x" ? readContracts[contractName].interface.parseTransaction(item) : null;
        //console.log("SET",JSON.stringify(item),JSON.stringify(parsedData))
        const newData = {};
        newData[item.hash] = parsedData;
        setTxnData({ ...txnData, ...newData });
      } catch (argumentError) {
        const getParsedTransaction = async () => {
          const parsedTransaction = await parseExternalContractTransaction(item.to, item.data);
          const newData = {};
          newData[item.hash] = parsedTransaction;
          setTxnData({ ...txnData, ...newData });
        };
        getParsedTransaction();
      }
    }
  }, [item]);

  const txDisplay = () => {
    const toSelf = item?.to == readContracts[contractName].address;

    if (toSelf && txnData[item.hash]?.functionFragment?.name == "addSigner") {
      return (
        <>
          <Text fontSize="16px" fontWeight="bold">
            Add Signer
          </Text>
          {ethers.utils.isAddress(txnData[item.hash]?.args[0]) && (
            <Address
              address={txnData[item.hash]?.args[0]}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={16}
            />
          )}
          <span style={{ fontSize: 16 }}>with threshold {txnData[item.hash]?.args[1]?.toNumber()}</span>
          <>{children}</>
        </>
      );
    } else if (toSelf && txnData[item.hash]?.functionFragment?.name == "removeSigner") {
      return (
        <>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>Remove Signer</span>
          {ethers.utils.isAddress(txnData[item.hash]?.args[0]) && (
            <Address
              address={txnData[item.hash]?.args[0]}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={16}
            />
          )}
          <span style={{ fontSize: 16 }}>with threshold {txnData[item.hash]?.args[1]?.toNumber()}</span>
          <>{children}</>
        </>
      );
    } else if (!txnData[item.hash]?.functionFragment?.name) {
      return (
        <>
          <Text fontWeight="bold">Transfer</Text>
          <Balance
            balance={item.value ? item.value : parseEther("" + parseFloat(item.amount).toFixed(12))}
            dollarMultiplier={price}
          />
          to
          <Address
            px="5px"
            address={item.to}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            fontSize={16}
          />
          <>{children}</>
        </>
      );
    } else if (txnData[item.hash]?.signature != "") {
      //console.log("CALL",txnData)

      return (
        <>
          <span style={{ fontSize: 16, fontWeight: "bold" }}>Call</span>
          <span style={{ fontSize: 16 }}>
            {txnData[item.hash]?.signature}
            <Button style={{ margin: 4 }} disabled={!txnData[item.hash]} onClick={showModal}>
              <FaEllipsisH />
            </Button>
          </span>
          <span style={{ fontSize: 16 }}>on</span>
          <Address address={item.to} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
          <>{children}</>
        </>
      );
    } else {
      return (
        <>
          <div>
            <i>Unknown transaction type...If you are reading this please screenshot and send to @austingriffith</i>
          </div>
          {ethers.utils.isAddress(txnData?.args[0]) && (
            <Address
              address={txnData.args[0]}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              fontSize={16}
            />
          )}
          <Balance
            balance={item.value ? item.value : parseEther("" + parseFloat(item.amount).toFixed(12))}
            dollarMultiplier={price}
          />
          <>{children}</>
          <Button disabled={!txnData[item.hash]} onClick={showModal}>
            <FaEllipsisH />
          </Button>
          <div
            style={{
              fontSize: 12,
              opacity: 0.5,
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <p>
              <b>Event Name :&nbsp;</b>
              {txnData ? txnData[item.hash].functionFragment?.name : "Transfer Funds"}&nbsp;
            </p>
            <p>
              <b>To:&nbsp;</b>
              <Address address={item.to} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={12} />
            </p>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <TransactionDetailsModal
        visible={isModalVisible}
        txnInfo={txnData[item.hash]}
        handleOk={() => setIsModalVisible(false)}
        handleCancel={() => setIsModalVisible(false)}
        mainnetProvider={mainnetProvider}
        price={price}
      />
      {
        <ListItem
          w={{ base: "100%", lg: "800px" }}
          align="center"
          justifyContent={"center"}
          key={item.hash}
          style={{
            position: "relative",
            display: "flex",
            //flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <>
            <a style={{ padding: "5px" }} href={blockExplorer + "tx/" + item.hash} target="_blank">
              <b>#{typeof item.nonce === "number" ? item.nonce : item.nonce.toNumber()}</b>
            </a>
            {txDisplay()}
            <Blockie padding='5px' size={2} scale={8} address={item.hash} />
          </>
        </ListItem>
      }
    </>
  );
}
