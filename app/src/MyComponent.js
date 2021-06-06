import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import logo from "./logo.png";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
  return (
    <div className="App">

      <div className="section">
        <h2>Active Account</h2>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
      </div>

      <div className="section">
        <h2>Charity Auction</h2>
        <p>
          This shows a simple ContractData component with no arguments, along
          with a form to set its value.
        </p>
        <p>
          <strong>Last Message: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="CharityAuctionThreshold"
            method="message"
          />
        </p>
          <p>
              <strong>Last Donater: </strong>
              <ContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract="CharityAuctionThreshold"
                  method="lastDonater"
              />
          </p>
          <p>
              <strong>Last Donation: </strong>
              <ContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract="CharityAuctionThreshold"
                  method="lastDonation"
              />
          </p>
        <ContractForm drizzle={drizzle} contract="CharityAuctionThreshold" method="changeMessage" sendArgs={{value: "5000000000000000000"}} />
      </div>
    </div>
  );
};
