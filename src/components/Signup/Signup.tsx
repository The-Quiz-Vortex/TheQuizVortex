import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext.tsx';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupValidation } from './signup.validation.ts';
import { createUserByUsername } from '../../services/users.services.ts';
import { registerUser } from '../../services/auth.services.ts';


export default function Signup() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
        },
    });

    interface Values {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
    }

    const onSubmit = async (values: Values) => {
        try {
            setLoading(true);
            const response = await registerUser(values.email, values.password);
            await createUserByUsername(
                values.firstName,
                values.lastName,
                response.user.uid,
                values.username,
                response.user.email ?? '',
            );
            setUser({ user: response });
            navigate('/');
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Signup</h1>
        </div>
    )
}