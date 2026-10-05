import {
    Navigate,
    Outlet,
} from 'react-router';

import type { User } from '../types/sample';

type RequireAuthProps = {
    user: User | null;
};

function RequireAuth({
                         user,
                     }: RequireAuthProps) {
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RequireAuth;