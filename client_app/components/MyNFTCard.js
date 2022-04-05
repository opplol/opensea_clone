import { useEffect, useState } from 'react'
import Router from 'next/router'


const style = {
  wrapper: `bg-[#303339] flex-auto w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
}

const MyNFTCard = ({nftItem}) => {
  console.log(nftItem)
  const [collection, setCollection] = useState({})

  const fetchCollectionData = async () => {
    const fetchURL =
      'https://eth-rinkeby.alchemyapi.io/v2/5I0n4vQzdcdN-QIMucwplKXeIBqiS4XT'

    // Replace with the token address you want to query:

    var raw = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      headers: {
        'Content-Type': 'application/json',
      },
      params: [`${nftItem.contract.address}`],
    })

    var requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow',
    }

    // Make the request and print the formatted response:
    const {result} = await fetch(fetchURL, requestOptions).then((response) => response.json())
    setCollection(result)
  }

  useEffect(() => {
    fetchCollectionData()
  }, [nftItem])

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        const id = parseInt(nftItem.id.tokenId)
        console.log(id)
        Router.push({
          pathname: `/nfts/${id}`,
        })
      }}
    >
      <div className={style.imgContainer}>
        <img src={nftItem.media[0].gateway} alt={nftItem.title} className={style.nftImg} />
      </div>
      <div className={style.info}>
        <div className={style.infoLeft}>
          <div className={style.collectionName}>{collection?.name}</div>
          <div className={style.assetName}>{nftItem.title}</div>
        </div>
      </div>
    </div>
  ) 
}

export default MyNFTCard