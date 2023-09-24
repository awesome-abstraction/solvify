import { GateFiDisplayModeEnum, GateFiSDK } from "@gatefi/js-sdk";
import { useRef, useEffect } from "react"

export const UnlimitComponent = ({ walletAddress, initialAmount }) => {
  const embedInstanceSDK = useRef(null);

  useEffect(() => {
    createEmbedSdkInstance(walletAddress, initialAmount)
    return () => {
      embedInstanceSDK.current?.destroy();
      embedInstanceSDK.current = null;
    };
  }, [walletAddress, initialAmount]);

  const createEmbedSdkInstance = (walletAddress, initialAmount) => {
    console.log("int", initialAmount)
    embedInstanceSDK.current = new GateFiSDK({
      merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
      displayMode: GateFiDisplayModeEnum.Embedded,
      nodeSelector: "#embed",
      isSandbox: true,
      walletAddress: walletAddress,
      walletLock: true,
      fiatAmountLock: true,
      cryptoAmountLock: true,
      fiatCurrencyLock: true,
      cryptoCurrencyLock: true,
      successUrl: "http://localhost:3000?onramp=true",
      defaultFiat: {
        currency: "USD"
      },
      defaultCrypto: {
        currency: "ETH",
        amount: initialAmount
      },
    })
  };

  return (
    <div id="embed" style={{ width: "100%"}} />
  )
}