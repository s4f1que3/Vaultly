import { Injectable } from "@nestjs/common";
import { IpRateLimitGuard } from "./ip-rate-limit.guard";

@Injectable()
export class GeneralLimiter extends IpRateLimitGuard {
    constructor() {
        super("general", 50, 1);
    }
}
