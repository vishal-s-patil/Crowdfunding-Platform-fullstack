import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
// import { useSigner } from "@thirdweb-dev/react";
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();

  const { contract } = useContract("0x9D45648140C72cCAAc2f85AE6Ac8F6091545Bb7D");
  const { mutateAsync: createCampaign, isLoading } = useContractWrite(contract, "createCampaign")

  // const signer = useSigner();

  // console.log('signer', signer);

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({ args: [address, form.title, form.description, form.target, new Date(form.deadline).getTime(), form.image] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }))

    return parsedCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const userCampaigns = allCampaigns.filter(campaign => campaign.owner === address);
    console.log(userCampaigns);
    return userCampaigns;
  }

  const getDonations = async () => {
    return [];
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        getCampaigns,
        getUserCampaigns,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);