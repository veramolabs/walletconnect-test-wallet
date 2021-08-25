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
  }
  return params;
}

export async function signDidRequests(payload: any, state: IAppState, setState: any) {
  const { connector } = state;

  let errorMsg = "";
  let result = null;

  if (connector) {
    switch (payload.method) {
      case "did_creds_store":
        // const verifiableCredential = payload.params[0];
        if (payload.params[0]) {
          result = "Credential saved!";
        } else {
          errorMsg = "No credential!";
        }
        break;

      default:
        break;
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
