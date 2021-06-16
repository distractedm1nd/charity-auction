import React from "react";
import {DrizzleContext} from "@drizzle/react-plugin";
import {Drizzle} from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import ThresholdReleaseComponent from "./ThresholdReleaseComponent";
import "./main.css";
import ThresholdRelease from "./contracts/ThresholdRelease.json";
import {BrowserRouter as Router, Route, Switch, useParams} from "react-router-dom";

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
                        return "Loading..."
                    else if (!window.ethereum) {
                        //TODO: Styles/real component
                        return (
                            <main className="container loading-screen">
                                <div className="pure-g">
                                    <div className="pure-u-1-1">
                                        <h1>⚠️</h1>
                                        <h3>
                                            Please use the Chrome/FireFox
                                            extension MetaMask, or dedicated
                                            Ethereum browsers, and make sure
                                            to connect one of your accounts
                                            to the dapp.
                                        </h3>
                                    </div>
                                </div>
                            </main>
                        )
                    }
                    else {
                        if (window.ethereum.chainId !== network) {
                            return (
                                <main className="container loading-screen">
                                    <div className="pure-g">
                                        <div className="pure-u-1-1">
                                            <h1>🦊</h1>
                                            <h3>
                                                <strong>{"We can't find any Ethereum accounts!"}</strong>
                                                Please check and make sure
                                                Metamask or your browser
                                                Ethereum
                                                wallet is pointed at the correct
                                                network (Rinkeby) and your account is
                                                unlocked. Refresh after taking action.
                                            </h3>
                                        </div>
                                    </div>
                                </main>
                            );
                        }

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

                    // TODO: Real component
                    return (
                        <main className="container loading-screen">
                            <div className="pure-g">
                                <div className="pure-u-1-1">
                                    <h1>⚠️</h1>
                                    <h3>
                                        Please use the Chrome/FireFox
                                        extension MetaMask, or dedicated
                                        Ethereum browsers, and make sure
                                        to connect one of your accounts
                                        to the dapp.
                                    </h3>
                                </div>
                            </div>
                        </main>
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
