// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response = await uploadText(req.body)
  res.status(200).json(response)
}


import pinataSDK from '@pinata/sdk'
import { PINATA_KEY, PINATA_SECRET } from 'src/constants'
import { v4 as uuidv4 } from 'uuid'

const pinata = pinataSDK(PINATA_KEY, PINATA_SECRET)

export async function uploadText(content: string) {
  const obj = {
    version: '2.0.0',
    metadata_id: uuidv4(),
    description: 'Anonymous post on lens',
    content,
    locale: 'en',
    tags: ['tag1', 'tag2'],
    type: 'TEXT_ONLY',
    attributes: [],
    image: '',
  }

  return pinata
    .pinJSONToIPFS(obj, {})
    .then((result) => {
      //handle results here
      console.log(result)
      return result
    }).catch((err) => {
      //handle error here
      console.log(err)
    })
}
