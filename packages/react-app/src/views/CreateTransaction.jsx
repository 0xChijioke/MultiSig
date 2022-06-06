import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { AddressInput, EtherInput, WalletConnectInput } from "../components";
import TransactionDetailsModal from "../components/MultiSig/TransactionDetailsModal";
import { parseExternalContractTransaction } from "../helpers";
import { useLocalStorage } from "../hooks";
import { ethers } from "ethers";
import { parseEther } from "@ethersproject/units";
import {
  Box,
  Image,
  NumberInput,
  InputGroup,
  Tooltip,
  Input,
  InputRightElement,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
} from "@chakra-ui/react";
import { AiOutlineCode } from "react-icons/ai";
import { webc } from "../image";

const axios = require("axios");

export default function CreateTransaction({
  poolServerUrl,
  contractName,
  contractAddress,
  mainnetProvider,
  localProvider,
  price,
  readContracts,
  userSigner,
  nonce,
  signaturesRequired,
}) {
  const history = useHistory();

  const [methodName, setMethodName] = useLocalStorage("methodName", "transferFunds");
  const [newSignaturesRequired, setNewSignaturesRequired] = useState(signaturesRequired);
  const [amount, setAmount] = useState("0");
  const [to, setTo] = useLocalStorage("to");
  const [customCallData, setCustomCallData] = useState("");
  const [parsedCustomCallData, setParsedCustomCallData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWalletConnectTransaction, setIsWalletConnectTransaction] = useState(false);

  const [hasEdited, setHasEdited] = useState(); //we want the signaturesRequired to update from the contract _until_ they edit it

  useEffect(() => {
    if (!hasEdited) {
      setNewSignaturesRequired(signaturesRequired);
    }
  }, [signaturesRequired]);
  
  const showModal = () => {
    const onOpen = true;
    setIsModalVisible(true);
  };

  const inputStyle = {
    marginTop: 25,
  };

  useEffect(() => {
    const getParsedTransaction = async () => {
      const parsedTransaction = await parseExternalContractTransaction(to, customCallData);
      setParsedCustomCallData(parsedTransaction);
    };

    getParsedTransaction();
  }, [customCallData]);

  const loadWalletConnectData = ({ to, value, data }) => {
    setTo(to);
    value ? setAmount(ethers.utils.formatEther(value)) : setAmount("0");
    setCustomCallData(data);
    setIsWalletConnectTransaction(true);
  };

  useEffect(() => {
    isWalletConnectTransaction && createTransaction();
    setIsWalletConnectTransaction(false);
  }, [isWalletConnectTransaction]);

  const createTransaction = async () => {
    try {
      //a little security in the frontend just because
      if (newSignaturesRequired < 1) {
        alert("signatures required must be >= 1");
      } else {
        setLoading(true);

        let callData;
        let executeToAddress;
        if (methodName == "transferFunds" || methodName == "customCallData" || methodName == "wcCallData") {
          callData = methodName == "transferFunds" ? "0x" : customCallData;
          executeToAddress = to;
        } else {
          callData = readContracts[contractName]?.interface?.encodeFunctionData(methodName, [
            to,
            newSignaturesRequired,
          ]);
          executeToAddress = contractAddress;
        }

        const newHash = await readContracts[contractName].getTransactionHash(
          nonce.toNumber(),
          executeToAddress,
          parseEther("" + parseFloat(amount).toFixed(12)),
          callData,
        );

        const signature = await userSigner?.signMessage(ethers.utils.arrayify(newHash));
        console.log("signature: ", signature);

        const recover = await readContracts[contractName].recover(newHash, signature);
        console.log("recover: ", recover);

        const isOwner = await readContracts[contractName].isOwner(recover);
        console.log("isOwner: ", isOwner);

        if (isOwner) {
          const res = await axios.post(poolServerUrl, {
            chainId: localProvider._network.chainId,
            address: readContracts[contractName]?.address,
            nonce: nonce.toNumber(),
            to: executeToAddress,
            amount,
            data: callData,
            hash: newHash,
            signatures: [signature],
            signers: [recover],
          });

          console.log("RESULT", res.data);
          setTimeout(() => {
            history.push("/pool");
            setLoading(false);
          }, 1000);
        } else {
          console.log("ERROR, NOT OWNER.");
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #a6a6a6",
          borderRadius: "10px",
          padding: 16,
          width: 400,
          margin: "auto",
          marginTop: 64,
        }}
      >
        <div style={{ margin: 8 }}>
          <Box textAlign={"center"} color={"white"}>
            <Select value={methodName} onChange={e => setMethodName(e.target.value)}>
              <option value="transferFunds">Send ETH</option>
              <option value="addSigner">Add Signer</option>
              <option value="removeSigner">Remove Signer</option>
              <option value="customCallData">Custom Call Data</option>
              <option value="wcCallData">WalletConnect </option>
            </Select>
          </Box>
          {methodName == "wcCallData" ? (
            <div style={inputStyle}>
              <WalletConnectInput
                chainId={localProvider?._network.chainId}
                address={contractAddress}
                loadWalletConnectData={loadWalletConnectData}
                mainnetProvider={mainnetProvider}
                price={price}
              />
            </div>
          ) : (
            <>
              <div style={inputStyle}>
                <AddressInput
                  my={6}
                  autoFocus
                  ensProvider={mainnetProvider}
                  placeholder={methodName == "transferFunds" ? "Recepient address" : "Owner address"}
                  value={to}
                  onChange={setTo}
                />
              </div>
              <div style={inputStyle}>
                {(methodName == "addSigner" || methodName == "removeSigner") && (
                  <NumberInput
                    placeholder="New # of signatures required"
                    value={newSignaturesRequired}
                    color="white"
                    colorScheme={"white"}
                    min={1}
                    onChange={value => {
                      setNewSignaturesRequired(value);
                      setHasEdited(true);
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
                {methodName == "customCallData" && (
                  <>
                    <InputGroup my={6}>
                      <Input
                        placeholder="Custom call data"
                        color={'white'}
                        value={customCallData}
                        onChange={e => {
                          setCustomCallData(e.target.value);
                        }}
                      />

                      <InputRightElement
                        onClick={showModal}
                        color='white'
                        children={
                          <Tooltip hasArrow label="Parse transaction data" bg="gray.600">
                            <AiOutlineCode size={25} color="white" />
                          </Tooltip>
                        }
                        width="4.5rem"
                      ></InputRightElement>
                    </InputGroup>

                    <TransactionDetailsModal
                      visible={isModalVisible}
                      txnInfo={parsedCustomCallData}
                      handleOk={() => setIsModalVisible(false)}
                      handleCancel={() => setIsModalVisible(false)}
                      mainnetProvider={mainnetProvider}
                      price={price}
                    />
                  </>
                )}
                {(methodName == "transferFunds" || methodName == "customCallData") && (
                  <EtherInput price={price} mode="USD" value={amount} onChange={setAmount} />
                )}
              </div>

              <Button colorScheme={"purple"} my={6} loading={loading} onClick={createTransaction}>
                Propose
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
