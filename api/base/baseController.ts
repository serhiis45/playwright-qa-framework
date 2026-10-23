import { APIRequestContext, APIResponse } from "@playwright/test";
import { z } from "zod";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type RequestOptions = Omit<
  NonNullable<Parameters<APIRequestContext["fetch"]>[1]>,
  "method"
>;

/**
 * @description abstract class RequestHolder to encapsulate request
 * @param request - request context
 * @param token - token for authorization
 */
export abstract class RequestHolder {
  constructor(
    protected request: APIRequestContext,
    protected token?: string,
  ) {}
}

/**
 * @description abstract class BaseController to define generic functions
 * for all API controller classes
 * @param isTestNegative - flag to check if test is negative
 * @param headers - headers for request
 * @function validate - function to validate response
 * @function isStatusOK - function to check if response is OK
 */
export abstract class BaseController extends RequestHolder {
  protected abstract isTestNegative: boolean;
  protected abstract headers: object;

  public setTestNegative(value: boolean): void {
    this.isTestNegative = value;
  }

  protected async isStatusOK({
    response,
    expectedStatus,
  }: {
    response: APIResponse;
    expectedStatus?: number;
  }) {
    const status = response.status();

    if (expectedStatus !== undefined) {
      if (status === expectedStatus) {
        return;
      }
      const body = await response.text();
      throw new Error(
        `Expected ${expectedStatus} but got ${status} for ${response.url()}\n${body}`,
      );
    }

    const isSuccess = status >= 200 && status < 300;
    const isClientError = status >= 400 && status < 500;
    const expected = this.isTestNegative ? "4xx" : "2xx";

    if (this.isTestNegative ? isClientError : isSuccess) {
      return;
    }

    const body = await response.text();
    throw new Error(
      `Expected ${expected} but got ${status} for ${response.url()}\n${body}`,
    );
  }

  protected async validate({
    schema,
    response,
  }: {
    schema: z.ZodType;
    response: unknown;
  }): Promise<void> {
    if (this.isTestNegative) {
      return;
    }

    const result = schema.safeParse(response);

    if (!result.success) {
      throw new Error(
        `Response validation failed:\n${z.prettifyError(result.error)}\n\nReceived:\n${JSON.stringify(response, null, 2)}`,
      );
    }
  }

  protected async send<S extends z.ZodType>({
    method,
    url,
    schema,
    expectedStatus,
    options = {},
  }: {
    method: HttpMethod;
    url: string;
    schema: S;
    expectedStatus?: number;
    options?: RequestOptions;
  }): Promise<z.infer<S>> {
    const response = await this.request.fetch(url, {
      ...options,
      method,
      headers: { ...this.headers, ...options.headers },
    });

    await this.isStatusOK({ response, expectedStatus });

    const text = await response.text();
    const json = text ? JSON.parse(text) : undefined;
    const isErrorStatus =
      expectedStatus !== undefined &&
      (expectedStatus < 200 || expectedStatus >= 300);
    if (!isErrorStatus) {
      await this.validate({ schema, response: json });
    }

    return json;
  }
}
