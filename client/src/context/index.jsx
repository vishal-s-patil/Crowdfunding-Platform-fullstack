import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();

  const { contract } = useContract("0x6b7774625ba1560741c48a3693060765bd70ff3a");
  const { mutateAsync: createCampaign, isLoading } = useContractWrite(contract, "createCampaign")

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({ args: [address, form.title, form.description, form.target,new Date(form.deadline).getTime(),form.image] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);