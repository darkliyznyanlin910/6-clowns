import { clerkClient } from "@clerk/nextjs"
import type { ICustomMetadata } from "~/types/customMetadata"

const getOrgId = async (userId: string) => {
  const {publicMetadata} = await clerkClient.users.getUser(userId)
  const { orgId } = publicMetadata as ICustomMetadata
  return orgId
}

export default getOrgId