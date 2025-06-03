"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "../atoms/Button";
import { useTranslation } from "@/providers/language-provider";
import { buildDataUrl } from "@/lib/utils";
import { switchToDevnet } from "@/lib/network-utils";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

export function CustomConnectButton() {
  const { t } = useTranslation();

  const handleConnectWithDevnet = async (openConnectModal: () => void) => {
    try {
      // First try to add/switch to devnet
      await switchToDevnet();

      // Then open the connect modal
      openConnectModal();
    } catch (error) {
      console.error("Failed to switch to devnet:", error);

      // Show toast with error
      toast({
        title: "Error de red",
        description:
          "No se pudo agregar o cambiar a la red GUCO Devnet. Asegúrate de tener MetaMask instalado.",
        variant: "destructive",
      });

      // Still open connect modal in case user wants to connect anyway
      openConnectModal();
    }
  };

  const handleSwitchToDevnet = async () => {
    try {
      await switchToDevnet();

      toast({
        title: "Red cambiada",
        description: "Conectado exitosamente a GUCO Devnet",
      });
    } catch (error) {
      console.error("Failed to switch to devnet:", error);

      toast({
        title: "Error de red",
        description:
          "No se pudo cambiar a la red GUCO Devnet. Esta aplicación solo funciona en GUCO Devnet.",
        variant: "destructive",
      });
    }
  };

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
              {t("nav.loading")}...
            </Button>
          );
        }

        if (!account) {
          return (
            <Button
              color="yellow"
              onClick={() => handleConnectWithDevnet(openConnectModal)}
            >
              {t("nav.connectWallet")}
            </Button>
          );
        }

        if (chain?.unsupported) {
          return (
            <Button color="red" onClick={handleSwitchToDevnet}>
              Cambiar a GUCO Devnet
            </Button>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                color="purple"
                onClick={openAccountModal}
                className="flex items-center gap-2"
              >
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
