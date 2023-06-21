import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();

  const { contract } = useContract("0x9D45648140C72cCAAc2f85AE6Ac8F6091545Bb7D");
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