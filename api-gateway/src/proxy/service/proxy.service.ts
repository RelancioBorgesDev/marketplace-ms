import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { serviceConfig } from 'src/config/gateway.config';

interface UserInfo {
  userId: string;
  email: string;
  role: string;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: unknown,
    headers?: Record<string, string>,
    userInfo?: UserInfo,
  ) {
    const service = serviceConfig[serviceName];
    const url = `${service.url}${path}`;
    this.logger.log(`Proxying ${method} request to ${serviceName} at ${url}`);

    try {
      const enhancedHeaders = {
        ...headers,
        'x-user-id': userInfo?.userId,
        'x-user-role': userInfo?.role,
        'x-user-email': userInfo?.email,
      };

      const response = await firstValueFrom(
        this.httpService.request({
          method: method.toLowerCase() as HttpMethod,
          url,
          data,
          headers: enhancedHeaders,
          timeout: service.timeout,
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(`Failed to proxy request to ${serviceName}`, error);
      throw error;
    }
  }

  async getServiceHealth(serviceName: keyof typeof serviceConfig) {
    try {
      const service = serviceConfig[serviceName];
      const response = await firstValueFrom(
        this.httpService.get(`${service.url}/health`, {
          timeout: service.timeout,
        }),
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      this.logger.error(`Failed to get health of ${serviceName}`, error);
      return { status: 'unhealthy', error: 'Service unavailable' };
    }
  }
}
