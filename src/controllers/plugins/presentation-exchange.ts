import {
  IAgentContext,
  IPluginMethodMap,
  VerifiableCredential,
  IDataStore,
  IAgentPlugin,
} from "@veramo/core";
// import { PresentationDefinition, PresentationSubmission, VerifiableCredential as PEVerifiableCredential } from "@sphereon/pe-models";
// import { PEJS, NonEmptyArray, Checked } from "@sphereon/pe-js";
import { IKeyValueStorage } from "keyvaluestorage";

export interface IGetVerifiableCredentialsFromPresentationDefinitionArgs {
  presentationDefinition: any; // PresentationDefinition;
}

export interface IValidatePresentationAgainstPresentationDefinitionArgs {
  presentationDefinition: any; // PresentationDefinition;
  presentationSubmission: any; // PresentationSubmission;
}

export interface IPresentationExchange extends IPluginMethodMap {
  getVerifiableCredentialsFromPresentationDefinition(
    args: IGetVerifiableCredentialsFromPresentationDefinitionArgs,
    context: IAgentContext<IDataStore>,
  ): Promise<VerifiableCredential[]>;
  validatePresentationAgainstPresentationDefinition(
    args: IValidatePresentationAgainstPresentationDefinitionArgs,
    context: IAgentContext<{}>,
  ): Promise<any>;
  // ): Promise<NonEmptyArray<Checked>>;
}

export class PresentationExchange implements IAgentPlugin {
  public readonly methods: IPresentationExchange;
  private storage: IKeyValueStorage;

  constructor(storage: IKeyValueStorage) {
    this.storage = storage;

    this.methods = {
      getVerifiableCredentialsFromPresentationDefinition: this.getVerifiableCredentialsFromPresentationDefinition.bind(
        this,
      ),
      validatePresentationAgainstPresentationDefinition: this.validatePresentationAgainstPresentationDefinition.bind(
        this,
      ),
    };
  }

  public async getVerifiableCredentialsFromPresentationDefinition(
    args: IGetVerifiableCredentialsFromPresentationDefinitionArgs,
    context: IAgentContext<IDataStore>,
  ): Promise<VerifiableCredential[]> {
    const credentials: VerifiableCredential[] = (await this.storage.getItem("credentials")) || [];
    // const pejs = new PEJS();
    // const matches = pejs.selectFrom(
    //   args.presentationDefinition,
    //   credentials as PEVerifiableCredential[],
    //   "did:example:123",
    // );
    return credentials;
  }

  public async validatePresentationAgainstPresentationDefinition(
    args: IValidatePresentationAgainstPresentationDefinitionArgs,
    context: IAgentContext<{}>,
  ): Promise<any> {
    throw Error("not implemented");
  }
}
