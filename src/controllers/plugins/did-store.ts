import { IIdentifier, IKey } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";

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
