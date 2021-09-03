import { IAppState } from "../App";
import { IRequestRenderParams, IRpcEngine } from "../helpers/types";
import { getAppControllers } from "../controllers";

export function filterDidRequests(payload: any) {
  return payload.method.startsWith("did_");
}

export async function routeDidRequests(payload: any, state: IAppState, setState: any) {
  if (!state.connector) {
    return;
  }

  const requests = state.requests;
  requests.push(payload);
  await setState({ requests });
}

export function renderDidRequests(payload: any): IRequestRenderParams[] {
  let params: IRequestRenderParams[] = [];
  switch (payload.method) {
    case "did_creds_store":
      params = [
        { label: "Method", value: payload.method },
        { label: "Verifiable Credential", value: JSON.stringify(payload.params[0]) },
      ];
      break;
    case "did_creds_issue":
      params = [
        { label: "Method", value: payload.method },
        { label: "Payload", value: JSON.stringify(payload.params[0]) },
        { label: "VerificationMethod", value: JSON.stringify(payload.params[1]) },
      ];
      break;
    case "did_creds_present":
      params = [
        { label: "Method", value: payload.method },
        { label: "Payload", value: JSON.stringify(payload.params[0]) },
      ];
      break;
  }
  return params;
}

export async function signDidRequests(payload: any, state: IAppState, setState: any) {
  const { connector } = state;
  const { agent } = getAppControllers();

  let errorMsg = "";
  let result = null;

  if (connector) {
    try {
      switch (payload.method) {
        case "did_creds_store":
          if (payload.params[0]) {
            result = await agent.dataStoreSaveVerifiableCredential({
              verifiableCredential: payload.params[0],
            });
            console.log({ result });
          } else {
            errorMsg = "No credential!";
          }
          break;
        case "did_creds_issue":
          if (payload.params[0]) {
            result = await agent.createVerifiableCredential({
              credential: payload.params[0],
              proofFormat: "jwt",
            });
            console.log({ result });
          } else {
            errorMsg = "No payload!";
          }
          break;
        case "did_creds_present":
          if (payload.params[0]) {
            const credentials = await agent.getVerifiableCredentialsFromPresentationDefinition({
              presentationDefinition: payload.params[0],
            });
            if (credentials.length > 0) {
              const identifiers = await agent.didManagerFind();
              const presentation = await agent.createVerifiablePresentation({
                proofFormat: "jwt",
                presentation: {
                  "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://identity.foundation/presentation-exchange/submission/v1",
                  ],
                  presentation_submission: {
                    id: "accd5adf-1dbf-4ed9-9ba2-d687476126cb",
                    definition_id: "31e2f0f1-6b70-411d-b239-56aed5321884",
                    descriptor_map: [
                      {
                        id: "867bfe7a-5b91-46b2-9ba4-70028b8d9cc8",
                        format: "ldp_vp",
                        path: "$.verifiableCredential[0]",
                      },
                    ],
                  },
                  holder: identifiers[0].did,
                  type: ["VerifiablePresentation", "PresentationSubmission"],
                  verifiableCredential: [credentials[0]],
                },
              });
              result = presentation;
            } else {
              errorMsg = "No credentials";
            }
          } else {
            errorMsg = "No payload!";
          }
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
      errorMsg = e.message;
    }

    if (result) {
      connector.approveRequest({
        id: payload.id,
        result,
      });
    } else {
      let message = "JSON RPC method not supported";
      if (errorMsg) {
        message = errorMsg;
      }
      if (!getAppControllers().wallet.isActive()) {
        message = "No Active Account";
      }
      connector.rejectRequest({
        id: payload.id,
        error: { message },
      });
    }
  }
}

const did: IRpcEngine = {
  filter: filterDidRequests,
  router: routeDidRequests,
  render: renderDidRequests,
  signer: signDidRequests,
};

export default did;
