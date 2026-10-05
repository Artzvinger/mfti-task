import type { z, ZodType } from 'zod';

import { HttpError } from '../errors/HttpError';

export function parse<S extends ZodType>(
    schema: S,
    data: unknown,
    message: string,
): z.output<S> {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
        throw new HttpError(400, message, parsed.error.flatten());
    }

    return parsed.data;
}
