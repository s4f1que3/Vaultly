import { Injectable } from "@nestjs/common";
import { IpRateLimitGuard } from "@rate-limit/ip-rate-limit.guard";

@Injectable()
export class AuthLimiter extends IpRateLimitGuard {
    constructor() {
        super("auth", 1, 3.5);
    }
}
