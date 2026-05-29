import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'bcd2b11e02f64f8c71a96c04a96ea9cf';

export const config = getDefaultConfig({
  appName: 'Anchor Protocol',
  projectId,
  chains: [base, baseSepolia],
  ssr: true,
  // WalletConnect v2 requires explicit metadata for reliable deeplinking
  // This ensures mobile wallets and extensions properly identify the connection request
  appDescription: 'Trustless escrow on Base',
  appUrl: 'https://anchor-escrow.vercel.app', 
  appIcon: 'https://anchor-escrow.vercel.app/favicon.ico',
});
