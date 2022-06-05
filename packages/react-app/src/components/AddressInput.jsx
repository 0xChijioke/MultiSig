import React, { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import QrReader from "react-qr-reader";
import { Input, InputGroup, InputRightElement, InputLeftElement } from "@chakra-ui/react";
import { MdOutlineQrCodeScanner } from "react-icons/md";

import Blockie from "./Blockie";

const isENS = (address = "") => address.endsWith(".eth") || address.endsWith(".xyz");

// probably we need to change value={toAddress} to address={toAddress}

/** 
  ~ What it does? ~

  Displays an address input with QR scan option

  ~ How can I use? ~

  <AddressInput
    autoFocus
    ensProvider={mainnetProvider}
    placeholder="Enter address"
    value={toAddress}
    onChange={setToAddress}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
**/
export default function AddressInput(props) {
  const { ensProvider, onChange } = props;
  const [value, setValue] = useState(props.value);
  const [scan, setScan] = useState(false);

  const currentValue = typeof props.value !== "undefined" ? props.value : value;
  const ens = useLookupAddress(props.ensProvider, currentValue);

  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined") {
        let address = newValue;
        if (isENS(address)) {
          try {
            const possibleAddress = await ensProvider.resolveName(address);
            if (possibleAddress) {
              address = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setValue(address);
        if (typeof onChange === "function") {
          onChange(address);
        }
      }
    },
    [ensProvider, onChange],
  );

  return (
    <div>
      {scan ? (
        <div
          style={{
            zIndex: 256,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
          }}
          onClick={() => {
            setScan(false);
          }}
        >
          <QrReader
            delay={250}
            resolution={1200}
            onError={e => {
              console.log("SCAN ERROR", e);
              setScan(false);
            }}
            onScan={newValue => {
              if (newValue) {
                console.log("SCAN VALUE", newValue);
                let possibleNewValue = newValue;
                if (possibleNewValue.indexOf("/") >= 0) {
                  possibleNewValue = possibleNewValue.substr(possibleNewValue.lastIndexOf("0x"));
                  console.log("CLEANED VALUE", possibleNewValue);
                }
                setScan(false);
                updateAddress(possibleNewValue);
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        ""
      )}
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children={<Blockie address={currentValue} size={8} scale={3} />}
        />
        <Input
          id="0xAddress" // name it something other than address for auto fill doxxing
          name="0xAddress" // name it something other than address for auto fill doxxing
          autoFocus={props.autoFocus}
          color="white"
          w={"100%"}
          borderColor='gray'
          placeholder={props.placeholder ? props.placeholder : "address"}
          value={ethers.utils.isAddress(currentValue) && !isENS(currentValue) && isENS(ens) ? ens : currentValue}
          onChange={e => {
            updateAddress(e.target.value);
          }}
        />
        <InputRightElement
          children={<MdOutlineQrCodeScanner color="white" />}
          onClick={() => {
            setScan(!scan);
          }}
        />
      </InputGroup>
    </div>
  );
}
