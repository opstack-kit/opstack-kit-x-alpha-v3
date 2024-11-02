import { l2OutputOracleABI } from '../../../constants/abi.js'
import type { Chain, PublicClient, Transport } from 'viem'
import { readContract } from 'viem/actions'
import { type RawOrContractAddress, resolveAddress } from '../../../types/addresses.js'

export type GetLatestProposedL2BlockNumberParameters<
  TChain extends Chain | undefined = Chain | undefined,
  _chainId = TChain extends Chain ? TChain['id'] : number,
> = { l2OutputOracle: RawOrContractAddress<_chainId> }

export type GetLatestProposedL2BlockNumberReturnType = {
  l2BlockNumber: bigint
}

/**
 * Gets the latest proposed L2 block number from the L2 Output Oracle.
 *
 * @param {RawOrContractAddress} l2OutputOracle the address of the L2 Output Oracle
 * @returns {GetLatestProposedL2BlockNumberReturnType} the latest proposed L2 block number
 */
export async function getLatestProposedL2BlockNumber<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  {
    l2OutputOracle,
  }: GetLatestProposedL2BlockNumberParameters<TChain>,
): Promise<GetLatestProposedL2BlockNumberReturnType> {
  const resolvedAddress = resolveAddress(l2OutputOracle)

  const l2BlockNumber = await readContract(client, {
    address: resolvedAddress,
    abi: l2OutputOracleABI,
    functionName: 'latestBlockNumber',
  })

  return { l2BlockNumber }
}
