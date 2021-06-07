import React, {useEffect, useState} from "react";
import { newContextComponents } from "@drizzle/react-components";
import { Card, EthAddress, Text, Heading, Button, Modal, Flex, Box, Input } from 'rimble-ui';
const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
    let [donater, setDonater] = useState("");
    let [donation, setDonation] = useState(0);
    let [currentMessage, setMessage] = useState("");
    let [newMessage, setNewMessage] = useState("");
    let [newDonation, setNewDonation] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    let {lastDonater, lastDonation, message, changeMessage} = drizzle.contracts.CharityAuctionThreshold.methods;

    const donate = () => {
        changeMessage(newMessage).call({value: newDonation});
        updateView();
    }

    const updateView = () => {
        lastDonater().call().then(res => setDonater(res));
        lastDonation().call().then(res => setDonation(res));
        message().call().then(res => setMessage(res));
    }

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    useEffect(() => {
        updateView();
    }, [])

  return (
    <div className="App">
      <Card className="section">
        <Heading as={"h2"}>Charity Auction</Heading>
        <Text.p>
            To change the string, donate a higher amount than the last donater. All proceeds go to the address the owner set as beneficiary of the contract.
        </Text.p>
          <Text fontWeight={"bold"}>Last Message: </Text>
          <Text.p>{currentMessage}</Text.p>
          <Text fontWeight={"bold"}>Last Donater: </Text>
          <EthAddress address={donater}/>
          <Text fontWeight={"bold"}>Last Donation: </Text>
          <Text.p>{donation}</Text.p>
          <Button onClick={openModal}>Donate (and change the string!)</Button>
          <Modal isOpen={isOpen}>
              <Card width={"420px"} p={0}>
                  <Button.Text
                      icononly
                      icon={"Close"}
                      color={"moon-gray"}
                      position={"absolute"}
                      top={0}
                      right={0}
                      mt={3}
                      mr={3}
                      onClick={closeModal}
                  />

                  <Box p={4} mb={3}>
                      <Heading.h3>Donate</Heading.h3>
                      <Input required={true} placeholder={donation + 1} value={newDonation} onChange={(e) => setNewDonation(e.target.value)}/>
                      <Input required={true} placeholder="New Message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  </Box>

                  <Flex
                      px={4}
                      py={3}
                      borderTop={1}
                      borderColor={"#E8E8E8"}
                      justifyContent={"flex-end"}
                  >
                      <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                      <Button ml={3} onClick={() => changeMessage(newMessage).call({value: newDonation}).then(res => console.log(res))}>Confirm</Button>
                  </Flex>
              </Card>
          </Modal>
      </Card>
    </div>
  );
};
