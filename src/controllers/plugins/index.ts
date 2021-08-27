import { Wallet } from "ethers";
import { IIdentifier, IKey } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";
import { AbstractKeyStore } from "@veramo/key-manager";

export class DIDStore implements AbstractDIDStore {
  private addresses: string[];

  constructor(args: { addresses: string[] }) {
    this.addresses = args.addresses;
  }

  public async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    return {
      did,
      provider: "did:ethr",
      services: [],
      keys: [
        {
          kid: did.replace("did:ethr:", ""),
          type: "Secp256k1",
          kms: "local",
          publicKeyHex: "",
        } as IKey,
      ],
    } as IIdentifier;
  }

  public async list(): Promise<IIdentifier[]> {
    return await Promise.all(
      this.addresses.map(async address => {
        return this.get({ did: `did:ethr:0x${address}`, alias: "", provider: "" });
      }),
    );
  }

  public async import(args: IIdentifier): Promise<boolean> {
    return false;
  }

  public async delete(args: { did: string }): Promise<boolean> {
    return false;
  }
}

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
          kid: address,
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
