import { optimismPortalABI } from '../../../constants/abi.js'
import type { Chain, Hex, PublicClient, ReadContractParameters, Transport } from 'viem'
import { readContract } from 'viem/actions'
import type { MessagePassedEvent } from '../../../index.js'
import { type RawOrContractAddress, resolveAddress } from '../../../types/addresses.js'

const ABI = optimismPortalABI
const FUNCTION_NAME = 'provenWithdrawals'

export type ReadProvenWithdrawalsParameters<
  TChain extends Chain | undefined = Chain | undefined,
  _chainId = TChain extends Chain ? TChain['id'] : number,
> = { withdrawalHash: MessagePassedEvent['withdrawalHash']; portal: RawOrContractAddress<_chainId> }

export type ProvenWithdrawal = {
  outputRoot: Hex
  timestamp: bigint
  l2OutputIndex: bigint
}

export type ReadProvenWithdrawalsReturnType = ProvenWithdrawal

// Convention: use `read` if this is just 1:1 with some contract function
/**
 * Reads a proven withdrawal from the Optimism Portal.
 *
 * @param {Hash} withdrawalHash the hash of the withdrawal
 * @param {RawOrContractAddress} portal the address of the portal
 *
 * @returns {Promise<ProvenWithdrawal>} the proven withdrawal
 */
export async function readProvenWithdrawals<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  {
    withdrawalHash,
    portal,
  }: ReadProvenWithdrawalsParameters<TChain>,
): Promise<ReadProvenWithdrawalsReturnType> {
  const values = await readContract(client, {
    abi: ABI,
    functionName: FUNCTION_NAME,
    address: resolveAddress(portal),
    args: [withdrawalHash],
    chain: client.chain,
  } as ReadContractParameters<typeof ABI, typeof FUNCTION_NAME>)

  const provenWithdrawal = {
    outputRoot: values[0],
    timestamp: values[1],
    l2OutputIndex: values[2],
  }

  if (provenWithdrawal.timestamp === 0n) {
    throw new Error(`Withdrawal with hash ${withdrawalHash} is not proven`)
  }

  return provenWithdrawal
}
