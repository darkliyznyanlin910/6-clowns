import { clerkClient } from "@clerk/nextjs"
import { ICustomMetadata } from "~/types/customMetadata"

const getOrgId = async (userId: string) => {
  const {privateMetadata} = await clerkClient.users.getUser(userId)
  const { orgId } = privateMetadata as ICustomMetadata
  return orgId
}

export default getOrgId