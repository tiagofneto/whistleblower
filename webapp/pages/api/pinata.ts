import pinataSDK from '@pinata/sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PINATA_KEY, PINATA_SECRET } from 'src/constants'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response = await uploadText(req.body)
  res.status(200).json(response)
}

const pinata = pinataSDK(PINATA_KEY, PINATA_SECRET)

export async function uploadText(content: string) {
  const payload = {
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
    .pinJSONToIPFS(payload, {})
    .then((result) => {
      console.log(result)
      return result
    }).catch((err) => {
      console.log(err)
    })
}
