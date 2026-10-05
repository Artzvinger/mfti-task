import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    loginSchema,
} from '../schemas/sample';

import type { z } from 'zod';

type LoginFormData = z.infer<
    typeof loginSchema
>;

type LoginFormProps = {
    onLogin: (
        username: string,
        password: string,
    ) => Promise<void>;
    error: string;
};

function LoginForm({
                       onLogin,
                       error,
                   }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormData>({
        resolver: zodResolver(
            loginSchema,
        ),
    });

    async function onSubmit(
        data: LoginFormData,
    ) {
        await onLogin(
            data.username,
            data.password,
        );
    }

    return (
        <div className="login">
            <form
                className="login-form"
                onSubmit={handleSubmit(
                    onSubmit,
                )}
            >
                <h1>Вход</h1>

                <div className="form-field">
                    <label htmlFor="username">
                        Логин
                    </label>

                    <input
                        id="username"
                        {...register(
                            'username',
                        )}
                    />

                    {errors.username && (
                        <p className="error">
                            {
                                errors
                                    .username
                                    .message
                            }
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="password">
                        Пароль
                    </label>

                    <input
                        id="password"
                        type="password"
                        {...register(
                            'password',
                        )}
                    />

                    {errors.password && (
                        <p className="error">
                            {
                                errors
                                    .password
                                    .message
                            }
                        </p>
                    )}
                </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={
                        isSubmitting
                    }
                >
                    Войти
                </button>
            </form>
        </div>
    );
}

export default LoginForm;