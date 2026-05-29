import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  phantomWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'bcd2b11e02f64f8c71a96c04a96ea9cf';

export const config = getDefaultConfig({
  appName: 'Anchor Protocol',
  projectId,
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,  // Detects extension on desktop; deeplinks metamask:// on mobile
        phantomWallet,   // Detects extension on desktop; deeplinks phantom:// on mobile
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        walletConnectWallet, // QR code fallback
        rainbowWallet,
      ],
    },
  ],
  ssr: true, // required for Next.js app router
});
