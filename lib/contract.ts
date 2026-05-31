import AnchorJSON from './Anchor.json'  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ANCHOR_ABI = AnchorJSON.abi as unknown as readonly any[]

export const ANCHOR_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;