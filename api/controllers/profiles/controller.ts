import { BaseController } from "../../base/baseController";
import { CONFIG } from "../../../config/env";
import { GetMeSchema } from "../../schemas";

const { API_BASE_URL } = CONFIG;

export class ProfilesController extends BaseController {
  public isTestNegative = false;
  protected headers = {
    Authorization: `Bearer ${this.token}`,
  };

  private BASE_PATH = `${API_BASE_URL}/profiles`;

  public async getMe() {
    return this.send({
      method: "GET",
      url: `${this.BASE_PATH}/me`,
      schema: GetMeSchema,
    });
  }
}
