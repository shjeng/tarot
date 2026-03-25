import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    requestId: string;
    ip: string;
    method: string;
    endpoint: string; // path만 저장 (예: "/api/tarot/spread")
    userId: string | null;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
