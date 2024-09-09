import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  })

  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  // criando o cookie
  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7days // quanto tempo o cookie vai ficar disponível
    path: '/',
  })

  return res.status(201).json(user)
}
