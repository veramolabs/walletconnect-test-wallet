import { Wallet } from "ethers";
import { AbstractKeyStore } from "@veramo/key-manager";
import { IKey } from "@veramo/core";

export class KeyStore implements AbstractKeyStore {
  private addresses: string[];
  private mnemonic: string;

  constructor(args: { addresses: string[]; mnemonic: string }) {
    this.addresses = args.addresses;
    this.mnemonic = args.mnemonic;
  }

  public async getKeys(addresses: string[], mnemonic: string): Promise<IKey[]> {
    return await Promise.all(
      addresses.map(async address => {
        const hdWallet = Wallet.fromMnemonic(mnemonic);

        return {
          kid: address.slice(2),
          privateKeyHex: hdWallet.privateKey,
          publicKeyHex: hdWallet.publicKey,
          type: "Secp256k1",
          kms: "local",
        } as IKey;
      }),
    );
  }

  public async get(args: { kid: string }): Promise<IKey> {
    const keys = await this.getKeys(this.addresses, this.mnemonic);
    const key = keys.find(key => key.kid === args.kid);
    if (!key) {
      throw Error("Key not found");
    }
    return key;
  }

  public async import(args: IKey): Promise<boolean> {
    return false;
  }

  public async delete(args: { kid: string }): Promise<boolean> {
    return false;
  }
}
