'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from '../atoms/Button';
import { useTranslation } from '@/providers/language-provider';
import { buildDataUrl } from '@/lib/utils';
import Image from 'next/image';

export function CustomConnectButton() {
  const { t } = useTranslation();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        if (!ready) {
          return (
            <Button color="yellow" disabled>
              {t('nav.loading')}...
            </Button>
          );
        }

        if (!account) {
          return (
            <Button color="yellow" onClick={openConnectModal}>
              {t('nav.connectWallet')}
            </Button>
          );
        }

        if (chain?.unsupported) {
          return (
            <Button color="red" onClick={openChainModal}>
              {t('nav.wrongNetwork')}
            </Button>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button color="blue" onClick={openChainModal}>
              {chain?.name}
            </Button>
            <div className="flex items-center gap-2">
              <Button color="purple" onClick={openAccountModal} className="flex items-center gap-2">
                <Image
                  src={buildDataUrl(account.address)}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {account.displayName}
              </Button>
            </div>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton; 