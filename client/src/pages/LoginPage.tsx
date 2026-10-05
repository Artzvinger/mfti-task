import {
    Navigate,
} from 'react-router';

import LoginForm from '../components/LoginForm';

import type { User } from '../types/sample';

type LoginPageProps = {
    user: User | null;
    error: string;
    onLogin: (
        username: string,
        password: string,
    ) => Promise<void>;
};

function LoginPage({
                       user,
                       error,
                       onLogin,
                   }: LoginPageProps) {
    if (user) {
        return (
            <Navigate
                to="/samples"
                replace
            />
        );
    }

    return (
        <LoginForm
            error={error}
            onLogin={onLogin}
        />
    );
}

export default LoginPage;