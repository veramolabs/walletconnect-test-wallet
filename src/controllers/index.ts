import { WalletController, getWalletController } from "./wallet";
import { StoreController, getStoreController } from "./store";
import { createAgent, ConfiguredAgent } from "./agent";

interface IAppControllers {
  store: StoreController;
  wallet: WalletController;
  agent: ConfiguredAgent;
}

let controllers: IAppControllers | undefined;

export function setupAppControllers(): IAppControllers {
  const wallet = getWalletController();
  const store = getStoreController();
  const agent = createAgent(wallet.getAccounts(), wallet.mnemonic);
  controllers = { store, wallet, agent };
  return controllers;
}

export function getAppControllers(): IAppControllers {
  let _controllers = controllers;
  if (!_controllers) {
    _controllers = setupAppControllers();
  }
  return _controllers;
}
