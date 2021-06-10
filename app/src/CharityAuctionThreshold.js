import React, {Fragment, useEffect, useState} from "react";
import {Box, Button, Card, EthAddress, Flex, Heading, Input, Modal, Progress, Text} from 'rimble-ui';
import {CalendarIcon, CheckIcon, ChevronDownIcon, CurrencyDollarIcon, LinkIcon,} from '@heroicons/react/solid'
import {Menu, Transition} from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default ({drizzle, drizzleState}) => {
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
            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Example Charity
                        <Progress value={(thresholdValue - remainingWeiValue) / thresholdValue} className="ml-4"/>
                    </h2>
                    <div className="flex flex-col mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"/>
                            Last Donation: {(lastDonationValue / 1e18).toFixed(18)} Ξ
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                            Closing on January 9, 2020
                        </div>
                    </div>
                </div>
                <div className="flex mt-5 lg:mt-0 lg:ml-4">
                    <span className="hidden ml-3 sm:block">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <LinkIcon className="w-5 h-5 mr-2 -ml-1 text-gray-500" aria-hidden="true"/>
                            View Contract
                        </button>
                    </span>

                    <span className="sm:ml-3">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={openModal}
                        >
                            <CheckIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true"/>
                            Donate
                        </button>
                    </span>

                    {/* Dropdown */}
                    <Menu as="span" className="relative ml-3 sm:hidden">
                        {({open}) => (
                            <>
                                <Menu.Button
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    More
                                    <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-500" aria-hidden="true"/>
                                </Menu.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        static
                                        className="absolute right-0 w-48 py-1 mt-2 -mr-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                        <Menu.Item>
                                            {({active}) => (
                                                <a
                                                    href="#"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                >
                                                    View Contract
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </>
                        )}
                    </Menu>
                </div>
            </div>
            <Card className="section">
                <Heading as={"h1"}>{messageValue}</Heading>
                <Text fontWeight={"bold"}>Last Donor: </Text>
                <EthAddress address={lastDonorValue}/>
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
                            <Input required={true} placeholder="100" value={newDonation}
                                   onChange={(e) => setNewDonation(e.target.value)}/>
                            <Input required={true} placeholder="New Message" value={newMessage}
                                   onChange={(e) => setNewMessage(e.target.value)}/>
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
