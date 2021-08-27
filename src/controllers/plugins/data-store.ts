import {
  IAgentPlugin,
  IDataStore,
  IDataStoreGetMessageArgs,
  IDataStoreGetVerifiableCredentialArgs,
  IDataStoreGetVerifiablePresentationArgs,
  IDataStoreSaveMessageArgs,
  IDataStoreSaveVerifiableCredentialArgs,
  IDataStoreSaveVerifiablePresentationArgs,
  IMessage,
  VerifiableCredential,
  VerifiablePresentation,
  schema,
  IDataStoreDeleteVerifiableCredentialArgs,
} from "@veramo/core";
import { IKeyValueStorage } from "keyvaluestorage";

export class DataStore implements IAgentPlugin {
  public readonly methods: IDataStore;
  public readonly schema = schema.IDataStore;
  private storage: IKeyValueStorage;

  constructor(storage: IKeyValueStorage) {
    this.storage = storage;

    this.methods = {
      dataStoreSaveMessage: this.dataStoreSaveMessage.bind(this),
      dataStoreGetMessage: this.dataStoreGetMessage.bind(this),
      dataStoreDeleteVerifiableCredential: this.dataStoreDeleteVerifiableCredential.bind(this),
      dataStoreSaveVerifiableCredential: this.dataStoreSaveVerifiableCredential.bind(this),
      dataStoreGetVerifiableCredential: this.dataStoreGetVerifiableCredential.bind(this),
      dataStoreSaveVerifiablePresentation: this.dataStoreSaveVerifiablePresentation.bind(this),
      dataStoreGetVerifiablePresentation: this.dataStoreGetVerifiablePresentation.bind(this),
    };
  }

  public async dataStoreSaveMessage(args: IDataStoreSaveMessageArgs): Promise<string> {
    throw Error("Not implemented");
  }

  public async dataStoreGetMessage(args: IDataStoreGetMessageArgs): Promise<IMessage> {
    throw Error("Not implemented");
  }

  public async dataStoreDeleteVerifiableCredential(
    args: IDataStoreDeleteVerifiableCredentialArgs,
  ): Promise<boolean> {
    throw Error("Not implemented");
  }

  public async dataStoreSaveVerifiableCredential(
    args: IDataStoreSaveVerifiableCredentialArgs,
  ): Promise<string> {
    const credentials: VerifiableCredential[] = (await this.storage.getItem("credentials")) || [];
    await this.storage.setItem("credentials", credentials.concat(args.verifiableCredential));
    // FIXME return hash
    return "ok";
  }

  public async dataStoreGetVerifiableCredential(
    args: IDataStoreGetVerifiableCredentialArgs,
  ): Promise<VerifiableCredential> {
    throw Error("Not implemented");
  }

  public async dataStoreSaveVerifiablePresentation(
    args: IDataStoreSaveVerifiablePresentationArgs,
  ): Promise<string> {
    throw Error("Not implemented");
  }

  public async dataStoreGetVerifiablePresentation(
    args: IDataStoreGetVerifiablePresentationArgs,
  ): Promise<VerifiablePresentation> {
    throw Error("Not implemented");
  }
}
