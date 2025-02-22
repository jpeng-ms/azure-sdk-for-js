/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { Policies } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { FrontDoorManagementClient } from "../frontDoorManagementClient";
import { PollerLike, PollOperationState, LroEngine } from "@azure/core-lro";
import { LroImpl } from "../lroImpl";
import {
  WebApplicationFirewallPolicy,
  PoliciesListNextOptionalParams,
  PoliciesListOptionalParams,
  PoliciesListResponse,
  PoliciesGetOptionalParams,
  PoliciesGetResponse,
  PoliciesCreateOrUpdateOptionalParams,
  PoliciesCreateOrUpdateResponse,
  PoliciesDeleteOptionalParams,
  PoliciesListNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing Policies operations. */
export class PoliciesImpl implements Policies {
  private readonly client: FrontDoorManagementClient;

  /**
   * Initialize a new instance of the class Policies class.
   * @param client Reference to the service client
   */
  constructor(client: FrontDoorManagementClient) {
    this.client = client;
  }

  /**
   * Lists all of the protection policies within a resource group.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param options The options parameters.
   */
  public list(
    resourceGroupName: string,
    options?: PoliciesListOptionalParams
  ): PagedAsyncIterableIterator<WebApplicationFirewallPolicy> {
    const iter = this.listPagingAll(resourceGroupName, options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listPagingPage(resourceGroupName, options, settings);
      }
    };
  }

  private async *listPagingPage(
    resourceGroupName: string,
    options?: PoliciesListOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<WebApplicationFirewallPolicy[]> {
    let result: PoliciesListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(resourceGroupName, options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(
        resourceGroupName,
        continuationToken,
        options
      );
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    resourceGroupName: string,
    options?: PoliciesListOptionalParams
  ): AsyncIterableIterator<WebApplicationFirewallPolicy> {
    for await (const page of this.listPagingPage(resourceGroupName, options)) {
      yield* page;
    }
  }

  /**
   * Lists all of the protection policies within a resource group.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param options The options parameters.
   */
  private _list(
    resourceGroupName: string,
    options?: PoliciesListOptionalParams
  ): Promise<PoliciesListResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, options },
      listOperationSpec
    );
  }

  /**
   * Retrieve protection policy with specified name within a resource group.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param policyName The name of the Web Application Firewall Policy.
   * @param options The options parameters.
   */
  get(
    resourceGroupName: string,
    policyName: string,
    options?: PoliciesGetOptionalParams
  ): Promise<PoliciesGetResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, policyName, options },
      getOperationSpec
    );
  }

  /**
   * Create or update policy with specified rule set name within a resource group.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param policyName The name of the Web Application Firewall Policy.
   * @param parameters Policy to be created.
   * @param options The options parameters.
   */
  async beginCreateOrUpdate(
    resourceGroupName: string,
    policyName: string,
    parameters: WebApplicationFirewallPolicy,
    options?: PoliciesCreateOrUpdateOptionalParams
  ): Promise<
    PollerLike<
      PollOperationState<PoliciesCreateOrUpdateResponse>,
      PoliciesCreateOrUpdateResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<PoliciesCreateOrUpdateResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = new LroImpl(
      sendOperation,
      { resourceGroupName, policyName, parameters, options },
      createOrUpdateOperationSpec
    );
    const poller = new LroEngine(lro, {
      resumeFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Create or update policy with specified rule set name within a resource group.
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param policyName The name of the Web Application Firewall Policy.
   * @param parameters Policy to be created.
   * @param options The options parameters.
   */
  async beginCreateOrUpdateAndWait(
    resourceGroupName: string,
    policyName: string,
    parameters: WebApplicationFirewallPolicy,
    options?: PoliciesCreateOrUpdateOptionalParams
  ): Promise<PoliciesCreateOrUpdateResponse> {
    const poller = await this.beginCreateOrUpdate(
      resourceGroupName,
      policyName,
      parameters,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * Deletes Policy
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param policyName The name of the Web Application Firewall Policy.
   * @param options The options parameters.
   */
  async beginDelete(
    resourceGroupName: string,
    policyName: string,
    options?: PoliciesDeleteOptionalParams
  ): Promise<PollerLike<PollOperationState<void>, void>> {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<void> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = new LroImpl(
      sendOperation,
      { resourceGroupName, policyName, options },
      deleteOperationSpec
    );
    const poller = new LroEngine(lro, {
      resumeFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs
    });
    await poller.poll();
    return poller;
  }

  /**
   * Deletes Policy
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param policyName The name of the Web Application Firewall Policy.
   * @param options The options parameters.
   */
  async beginDeleteAndWait(
    resourceGroupName: string,
    policyName: string,
    options?: PoliciesDeleteOptionalParams
  ): Promise<void> {
    const poller = await this.beginDelete(
      resourceGroupName,
      policyName,
      options
    );
    return poller.pollUntilDone();
  }

  /**
   * ListNext
   * @param resourceGroupName Name of the Resource group within the Azure subscription.
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    resourceGroupName: string,
    nextLink: string,
    options?: PoliciesListNextOptionalParams
  ): Promise<PoliciesListNextResponse> {
    return this.client.sendOperationRequest(
      { resourceGroupName, nextLink, options },
      listNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const listOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/frontDoorWebApplicationFirewallPolicies",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WebApplicationFirewallPolicyList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion2],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/FrontDoorWebApplicationFirewallPolicies/{policyName}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WebApplicationFirewallPolicy
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion2],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.policyName
  ],
  headerParameters: [Parameters.accept],
  serializer
};
const createOrUpdateOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/FrontDoorWebApplicationFirewallPolicies/{policyName}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.WebApplicationFirewallPolicy
    },
    201: {
      bodyMapper: Mappers.WebApplicationFirewallPolicy
    },
    202: {
      bodyMapper: Mappers.WebApplicationFirewallPolicy
    },
    204: {
      bodyMapper: Mappers.WebApplicationFirewallPolicy
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  requestBody: Parameters.parameters4,
  queryParameters: [Parameters.apiVersion2],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.policyName
  ],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const deleteOperationSpec: coreClient.OperationSpec = {
  path:
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/FrontDoorWebApplicationFirewallPolicies/{policyName}",
  httpMethod: "DELETE",
  responses: { 200: {}, 201: {}, 202: {}, 204: {} },
  queryParameters: [Parameters.apiVersion2],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.policyName
  ],
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WebApplicationFirewallPolicyList
    },
    default: {
      bodyMapper: Mappers.ErrorResponse
    }
  },
  queryParameters: [Parameters.apiVersion2],
  urlParameters: [
    Parameters.$host,
    Parameters.subscriptionId,
    Parameters.resourceGroupName,
    Parameters.nextLink
  ],
  headerParameters: [Parameters.accept],
  serializer
};
