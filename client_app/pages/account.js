import React, { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'

import { client } from '../lib/sanityClient'
import Header from '../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../components/NFTCard'
import MyNFTCard from '../components/MyNFTCard'

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Account = () => {
  const { address, provider, connectWallet } = useWeb3()
  const [userData, setUserData] = useState({})
  const [myNfts, setMyNfts] = useState([])

  useEffect(() => {
    if (!address) return
    ;(async () => {
      const { ownedNfts } = await fetch(
        `https://eth-rinkeby.alchemyapi.io/v2/5I0n4vQzdcdN-QIMucwplKXeIBqiS4XT/getNFTs?owner=${address}`
      ).then((response) => response.json())

      console.log(ownedNfts)
      setMyNfts(ownedNfts)
    })()
  }, [address])

  const fetchUserData = async (sanityClient = client) => {
    const query = `*[_type == "users" && _id == "${address}"] {
        "imageUrl": profileImage.asset->url,
        "bannerImageUrl": bannerImage.asset->url,
        }`
    const userData = await sanityClient.fetch(query)

    console.log(userData, '######')

    await setUserData(userData[0])
  }

  useEffect(() => {
    fetchUserData()
  }, [address])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            userData?.bannerImageUrl
              ? userData.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              userData?.imageUrl
                ? userData.imageUrl
                : 'http://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}></div>
        <div className={style.midRow}>
          <div className={style.title}></div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            <span>{`${address.slice(0, 6)}...${address.slice(38)}`}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{userData?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap">
        {myNfts.map((nftItem, id) => (
          <MyNFTCard nftItem={nftItem} />
        ))}
      </div>
    </div>
  )
}

export default Account
