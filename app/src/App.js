import React from "react";
import {DrizzleContext} from "@drizzle/react-plugin";
import {Drizzle} from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import ThresholdReleaseComponent from "./ThresholdReleaseComponent";
import "./main.css";
import ThresholdRelease from "./contracts/ThresholdRelease.json";
import {BrowserRouter as Router, Route, Switch, useParams} from "react-router-dom";
import {XCircleIcon, InformationCircleIcon } from "@heroicons/react/outline";

const drizzle = new Drizzle(drizzleOptions);

const DrizzleThresholdRelease = () => {
    let {network, contractAddress} = useParams();
    if(!network) network = '0x4';
    if(!contractAddress) contractAddress = '0x01C295FD8Cb700112e07b4c854BC27cEEfD6b35b';

    return (
        <DrizzleContext.Provider drizzle={drizzle}>
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const {drizzle, drizzleState, initialized} = drizzleContext;

                    // TODO: Real loading element
                    if(!initialized)
                        return (
                            <div className="flex h-screen">
                                <div className="rounded-md bg-blue-50 p-4 container mx-auto my-auto">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 flex-1 md:flex md:justify-between">
                                            <p className="text-sm text-blue-700">Loading...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    else if (window.ethereum){
                        if (window.ethereum.chainId !== network || window.ethereum._state.accounts.length === 0) {
                            return (
                                <div className="flex h-screen">
                                    <div className="rounded-md bg-red-50 p-4 align-middle container mx-auto my-auto">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <h1 className="h-5 w-5">
                                                    <span role="img" aria-label="metamask fox">
                                                        🦊
                                                    </span>
                                                </h1>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">We can't find any Ethereum accounts!</h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <h4>
                                                        Please check and make sure
                                                        Metamask or your browser
                                                        Ethereum
                                                        wallet is pointed at the correct
                                                        network (Rinkeby) and your account is
                                                        unlocked. Refresh after taking action.
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            if (!drizzleState.contracts.ThresholdRelease) {
                                drizzle.addContract({
                                        contractName: "ThresholdRelease",
                                        web3Contract: new drizzle.web3.eth.Contract(
                                            ThresholdRelease.abi,
                                            contractAddress
                                        )
                                    }, []
                                );
                            }

                            if (drizzleState.contracts.ThresholdRelease?.initialized) {
                                return (
                                    <ThresholdReleaseComponent drizzle={drizzle} drizzleState={drizzleState}/>
                                )
                            }
                        }

                    }

                    return (
                        <div className="flex h-screen">
                            <div className="rounded-md bg-red-50 p-4 align-middle container mx-auto my-auto">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Web3 Instance not Found</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <h4>
                                                Please use the Chrome/Firefox/Brave
                                                extension MetaMask, or dedicated
                                                Ethereum browsers, and make sure
                                                to connect one of your accounts
                                                to the dapp.
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </DrizzleContext.Consumer>
        </DrizzleContext.Provider>
    )
}

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path={"/:network/:contractAddress"} children={<DrizzleThresholdRelease />}/>
                <Route children={<DrizzleThresholdRelease />}/>
            </Switch>
        </Router>
    );
}

export default App;
