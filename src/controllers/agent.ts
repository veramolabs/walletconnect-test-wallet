import {
  createAgent as _createAgent,
  IDIDManager,
  TAgent,
  IResolver,
  IKeyManager,
  IDataStore,
} from "@veramo/core";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { DIDManager } from "@veramo/did-manager";
import { KeyManager } from "@veramo/key-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { CredentialIssuer, ICredentialIssuer } from "@veramo/credential-w3c";
import { Resolver } from "did-resolver";
import { KeyManagementSystem } from "@veramo/kms-local";
import { DIDStore } from "./plugins/did-store";
import { KeyStore } from "./plugins/key-store";
import { DataStore } from "./plugins/data-store";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
import { getResolver as webDidResolver } from "web-did-resolver";
import KeyValueStorage from "keyvaluestorage";

export type ConfiguredAgent = TAgent<
  IDIDManager & IKeyManager & IResolver & ICredentialIssuer & IDataStore
>;

const options = {};
const storage = new KeyValueStorage(options);

export const createAgent = (addresses: string[], mnemonic: string): ConfiguredAgent => {
  return _createAgent<IDIDManager & IKeyManager & IResolver & ICredentialIssuer & IDataStore>({
    plugins: [
      new KeyManager({
        store: new KeyStore({ addresses, mnemonic }),
        kms: {
          local: new KeyManagementSystem(),
        },
      }),
      new DIDManager({
        defaultProvider: "did:ethr",
        providers: {
          "did:ethr": new EthrDIDProvider({
            defaultKms: "local",
            network: "mainnet",
            rpcUrl: "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_PROJECT_ID,
            gas: 1000001,
            ttl: 60 * 60 * 24 * 30 * 12 + 1,
          }),
        },
        store: new DIDStore({ addresses }),
      }),
      new DIDResolverPlugin({
        resolver: new Resolver({
          ...ethrDidResolver({ infuraProjectId: process.env.REACT_APP_INFURA_PROJECT_ID }),
          ...webDidResolver(),
        }),
      }),
      new CredentialIssuer(),
      new DataStore(storage),
    ],
  });
};
