import { l2OutputOracleABI } from '../../../constants/abi.js'
import type { Chain, PublicClient, ReadContractParameters, Transport } from 'viem'
import { readContract } from 'viem/actions'
import { type RawOrContractAddress, resolveAddress } from '../../../types/addresses.js'

const ABI = l2OutputOracleABI

export type GetSecondsToNextL2OutputParameters<
  TChain extends Chain | undefined = Chain | undefined,
  _chainId = TChain extends Chain ? TChain['id'] : number,
> = { latestL2BlockNumber: bigint; l2OutputOracle: RawOrContractAddress<_chainId> }

/**
 * Gets the number of seconds until the next L2 output is posted.
 *
 * @param {bigint} latestL2BlockNumber the latest L2 block number
 * @param {RawOrContractAddress} l2OutputOracle the address of the L2 Output Oracle
 *
 * @returns {Promise<bigint>} the number of seconds until the next L2 output is posted
 */
export async function getSecondsToNextL2Output<TChain extends Chain | undefined>(
  client: PublicClient<Transport, TChain>,
  {
    latestL2BlockNumber,
    l2OutputOracle,
  }: GetSecondsToNextL2OutputParameters<TChain>,
): Promise<bigint> {
  const address = resolveAddress(l2OutputOracle)
  const latestBlockNumber = await readContract(client, {
    abi: ABI,
    functionName: 'latestBlockNumber',
    address,
  } as ReadContractParameters<typeof ABI, 'latestBlockNumber'>)

  const interval = await readContract(client, {
    abi: ABI,
    functionName: 'SUBMISSION_INTERVAL',
    address,
  } as ReadContractParameters<typeof ABI, 'SUBMISSION_INTERVAL'>)

  const blockTime = await readContract(client, {
    abi: ABI,
    functionName: 'L2_BLOCK_TIME',
    address,
  } as ReadContractParameters<typeof ABI, 'L2_BLOCK_TIME'>)

  if (latestL2BlockNumber < latestBlockNumber) {
    throw new Error(`latestBlock ${latestBlockNumber} is great than latestL2BlockNumber ${latestL2BlockNumber}!`)
  }

  const blocksTillUpdate = interval - (latestL2BlockNumber - latestBlockNumber)
  // NOTE(Wilson): incase there is some problem
  // e.g. output posting has stalled or the wrong latestL2BlockNumber is passed
  // we do not return a negative number, as negative seconds to next output
  // does not make sense
  return blocksTillUpdate < 0n ? 0n : blocksTillUpdate * blockTime
}
