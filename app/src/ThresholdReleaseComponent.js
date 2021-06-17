/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Fragment, useEffect, useState} from "react";
import {Box, Button, Card, Flex, Heading, Tooltip, Modal, Progress, Field, Form} from 'rimble-ui';
import {CheckIcon, ChevronDownIcon, CurrencyDollarIcon, LinkIcon, PencilIcon, InformationCircleIcon, InboxInIcon, FingerPrintIcon} from '@heroicons/react/solid'
import {Menu, Transition} from '@headlessui/react'
import Web3 from "web3";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default ({drizzle, drizzleState}) => {
    // destructure drizzle and drizzleState from props
    let {lastDonor, lastDonation, message, changeMessage, threshold, remainingWei, charityAddress, title, description} = drizzle.contracts.ThresholdRelease.methods;
    let {toBN, toWei, fromWei} = Web3.utils;
    let contract = drizzleState.contracts.ThresholdRelease

    const [isOpen, setIsOpen] = useState(false);
    let [keyStore, setKeyStore] = useState({});
    let [newMessage, setNewMessage] = useState("");
    let [newDonation, setNewDonation] = useState("");

    // TODO: Fix this mess, find the correct way to do it
    let titleValue = contract.title[keyStore?.titleDataKey]?.value;
    let descriptionValue = contract.description[keyStore?.descriptionDataKey]?.value;
    let thresholdValue = contract.threshold[keyStore?.thresholdDataKey]?.value;
    let charityAddressValue = contract.charityAddress[keyStore?.charityAddressDataKey]?.value;

    let remainingWeiValue = contract.remainingWei[keyStore?.remainingWeiDataKey]?.value;
    let lastDonorValue = contract.lastDonor[keyStore?.donorDataKey]?.value;
    let lastDonationValue = contract.lastDonation[keyStore?.donationDataKey]?.value;
    let messageValue = contract.message[keyStore?.messageDataKey]?.value;

    let progress = (thresholdValue - remainingWeiValue) / thresholdValue

    const donate = () => {
        if(canChangeMessage()) {
            changeMessage.cacheSend(newMessage, {value: toWei(newDonation, "ether"), from: drizzleState.accounts[0]});
        } else {
            //This is a hack, need to find the correct way to do this
           drizzle.contracts.ThresholdRelease.web3.eth.sendTransaction({from: drizzleState.accounts[0], value: toWei(newDonation, "ether"), to: drizzle.contracts.ThresholdRelease.options.address})
        }
        updateView();
    }

    // There is surely a better way to do this?
    const updateView = () => {
        setKeyStore({
            donorDataKey: lastDonor.cacheCall(),
            donationDataKey: lastDonation.cacheCall(),
            messageDataKey: message.cacheCall(),
            remainingWeiDataKey: remainingWei.cacheCall(),
            charityAddressDataKey: charityAddress.cacheCall(),
            thresholdDataKey: threshold.cacheCall(),
            titleDataKey: title.cacheCall(),
            descriptionDataKey: description.cacheCall(),
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
    })


    const validEtherValue = (inputValue) => {
        try {
            toWei(inputValue, "ether")
            return true;
        } catch (e) {
            return false;
        }
    }

    const canChangeMessage = () => {
        return validEtherValue(newDonation) && toBN(toWei(newDonation, 'ether')).gt(toBN(lastDonationValue));
    }

    return (
        <div className="min-h-screen flex">
            <div className="m-4 flex flex-col flex-grow justify-between">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {titleValue}
                        </h2>
                        <h2 className="text-xl leading-7 text-gray-900 sm:text-xl sm:truncate">
                            {descriptionValue}
                        </h2>
                        <div className="flex flex-col mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <FingerPrintIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                             aria-hidden="true"/>
                                Charity Address: {charityAddressValue}
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <InboxInIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                    aria-hidden="true"/>
                                Total Received: {((thresholdValue - remainingWeiValue) / 1e18).toFixed(18)} Ξ
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                    aria-hidden="true"/>
                                Goal: {(thresholdValue / 1e18).toFixed(18)} Ξ
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-5 lg:mt-0 lg:ml-4">
                    <span className="hidden ml-3 sm:block">
                        <a href="https://rinkeby.etherscan.io/address/0x01c295fd8cb700112e07b4c854bc27ceefd6b35b/">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <LinkIcon className="w-5 h-5 mr-2 -ml-1 text-gray-500" aria-hidden="true"/>
                                View Contract
                            </button>
                        </a>
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
                <div className={"text-center"}>
                    <p className="text-5xl place-self-center">{messageValue}</p>
                    <div className={"flex flex-row space-x-2 justify-center"}>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                aria-hidden="true"/>
                            Last Donation: {(lastDonationValue / 1e18).toFixed(18)} Ξ
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <PencilIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true"/>
                            Left By: {lastDonorValue}
                        </div>
                    </div>
                </div>
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

                        <Box p={4}>
                            <Heading.h3>Donate</Heading.h3>
                            <Form validated={() => validEtherValue(newDonation)}>
                                <Field label={"Donation Amount (ETH)"} validated={validEtherValue(newDonation)}>
                                    <Form.Input required placeholder={lastDonationValue ? fromWei(toBN(lastDonationValue), 'ether') : ""} value={newDonation}
                                                onChange={(e) => setNewDonation(e.target.value)}/>
                                </Field>
                                <Tooltip message={"To be able to set the message, you must donate more than the last donor."} placement="right">
                                    <Field label={"Your Message"} validated={false}>
                                        <Form.Input required placeholder="New Message" disabled={!canChangeMessage()} value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}/>
                                    </Field>
                                </Tooltip>
                            </Form>
                            <Button.Outline onClick={() => setNewDonation(fromWei(toBN(lastDonationValue), 'ether'))}>Set Donation to Last Donor's Amount</Button.Outline>
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
                <div className={"flex items-stretch flex-col"}>
                    <div className="flex justify-center items-center mb-2 text-sm text-gray-500">
                        {progress * 100}% Complete
                        <InformationCircleIcon className="flex-shrink-0 ml-1.5 h-5 w-5 text-gray-400"
                                               aria-hidden="true"/>
                    </div>
                    <Progress value={progress} className="w-full"/>
                </div>
            </div>
        </div>
    );
};
