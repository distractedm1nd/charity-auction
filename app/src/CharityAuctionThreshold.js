import React, {useEffect, useState} from "react";
import { Card, EthAddress, Text, Heading, Button, Modal, Flex, Box, Input, Progress } from 'rimble-ui';

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
    let {lastDonor, lastDonation, message, changeMessage, threshold, remainingWei} = drizzle.contracts.CharityAuctionThreshold.methods;
    let contract = drizzleState.contracts.CharityAuctionThreshold

    const [isOpen, setIsOpen] = useState(false);
    let [keyStore, setKeyStore] = useState({});
    let [newMessage, setNewMessage] = useState("");
    let [newDonation, setNewDonation] = useState("");

    let thresholdValue = contract.threshold[keyStore?.thresholdDataKey]?.value;
    let remainingWeiValue = contract.remainingWei[keyStore?.remainingWei]?.value;
    let lastDonorValue = contract.lastDonor[keyStore?.donorDataKey]?.value;
    let lastDonationValue = contract.lastDonation[keyStore?.donationDataKey]?.value;
    let messageValue = contract.message[keyStore?.messageDataKey]?.value;

    const donate = () => {
        changeMessage.cacheSend(newMessage, {value: newDonation});
        updateView();
    }

    const updateView = () => {
        setKeyStore({
            donorDataKey: lastDonor.cacheCall(),
            donationDataKey: lastDonation.cacheCall(),
            messageDataKey: message.cacheCall(),
            remainingWeiDataKey: remainingWei.cacheCall(),
            thresholdDataKey: threshold.cacheCall(),
        });
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
        <Progress value={(thresholdValue - remainingWeiValue) / thresholdValue} style={{width: "100%"}}/>
        <Text.p>
            To change the string, donate a higher amount than the last donor. All proceeds go to the address the owner set as beneficiary of the contract.
        </Text.p>
          <Text fontWeight={"bold"}>Last Message: </Text>
          <Text.p>{messageValue}</Text.p>
          <Text fontWeight={"bold"}>Last Donor: </Text>
          <EthAddress address={lastDonorValue}/>
          <Text fontWeight={"bold"}>Last Donation: </Text>
          <Text.p>{lastDonationValue}</Text.p>
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
                      <Input required={true} placeholder="100" value={newDonation} onChange={(e) => setNewDonation(e.target.value)}/>
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
                      <Button ml={3} onClick={donate}>Confirm</Button>
                  </Flex>
              </Card>
          </Modal>
      </Card>
    </div>
  );
};
