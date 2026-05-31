"use client";

import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { ANCHOR_ABI, ANCHOR_ADDRESS } from '../lib/contract';
import { parseEther } from 'viem';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAnchorRead(functionName: string, args: any[] = []) {
  return useReadContract({
    address: ANCHOR_ADDRESS,
    abi: ANCHOR_ABI,
    functionName,
    args,
  });
}

export function useAnchorWrite() {
  const { writeContract, writeContractAsync, data, isPending, error, isSuccess } = useWriteContract();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeContract: (functionName: string, args: any[] = [], value?: string) => {
      return writeContract({
        address: ANCHOR_ADDRESS,
        abi: ANCHOR_ABI,
        functionName,
        args,
        ...(value ? { value: parseEther(value) } : {}),
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeContractAsync: async (functionName: string, args: any[] = [], value?: string) => {
      return writeContractAsync({
        address: ANCHOR_ADDRESS,
        abi: ANCHOR_ABI,
        functionName,
        args,
        ...(value ? { value: parseEther(value) } : {}),
      });
    },
    data,
    isPending,
    error,
    isSuccess,
  };
}

export function useJobCount() {
  return useAnchorRead('jobCount');
}

export function useGetJob(jobId: number | bigint) {
  return useAnchorRead('getJob', [jobId]);
}

// Helpers for specific writes
export function useCreateJob() {
  const { writeContractAsync, isPending, error, isSuccess } = useAnchorWrite();
  return {
    createJob: async (freelancer: string, deadline: number | bigint, ethValue: string) => {
      return writeContractAsync('createJob', [freelancer, deadline], ethValue);
    },
    isPending,
    error,
    isSuccess
  };
}

export function useApproveWork() {
  const { writeContractAsync, isPending, error, isSuccess } = useAnchorWrite();
  return {
    approveWork: async (jobId: number | bigint) => {
      return writeContractAsync('approveWork', [jobId]);
    },
    isPending,
    error,
    isSuccess
  };
}

export function useRaiseDispute() {
  const { writeContractAsync, isPending, error, isSuccess } = useAnchorWrite();
  return {
    raiseDispute: async (jobId: number | bigint) => {
      return writeContractAsync('raiseDispute', [jobId]);
    },
    isPending,
    error,
    isSuccess
  };
}

export function useClaimRefund() {
  const { writeContractAsync, isPending, error, isSuccess } = useAnchorWrite();
  return {
    claimRefund: async (jobId: number | bigint) => {
      return writeContractAsync('claimRefund', [jobId]);
    },
    isPending,
    error,
    isSuccess
  };
}

// Event Listeners
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useListenJobCreated(onEvent: (logs: any) => void) {
  useWatchContractEvent({
    address: ANCHOR_ADDRESS,
    abi: ANCHOR_ABI,
    eventName: 'JobCreated',
    onLogs: onEvent,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useListenWorkApproved(onEvent: (logs: any) => void) {
  useWatchContractEvent({
    address: ANCHOR_ADDRESS,
    abi: ANCHOR_ABI,
    eventName: 'WorkApproved',
    onLogs: onEvent,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useListenDisputeRaised(onEvent: (logs: any) => void) {
  useWatchContractEvent({
    address: ANCHOR_ADDRESS,
    abi: ANCHOR_ABI,
    eventName: 'DisputeRaised',
    onLogs: onEvent,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useListenRefundClaimed(onEvent: (logs: any) => void) {
  useWatchContractEvent({
    address: ANCHOR_ADDRESS,
    abi: ANCHOR_ABI,
    eventName: 'RefundClaimed',
    onLogs: onEvent,
  });
}
