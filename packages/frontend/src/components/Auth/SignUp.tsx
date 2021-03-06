import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from './Container';
import Link from '../ui/Link';
import GithubButton from './GithubButton';
import { useMutation, graphql } from 'react-relay/hooks';
import { SignUpMutation } from './__generated__/SignUpMutation.graphql';
import Form from '../forms/Form';
import Input from '../forms/Input';
import SubmitButton from '../forms/SubmitButton';

export default function SignUp() {
    const navigate = useNavigate();
    const location = useLocation();

    const [commit, isInFlight] = useMutation<SignUpMutation>(graphql`
        mutation SignUpMutation(
            $username: String!
            $name: String!
            $email: String!
            $password: String!
        ) {
            signUp(username: $username, name: $name, email: $email, password: $password) {
                ok
            }
        }
    `);

    const onFinish = (values: Record<string, string>) => {
        commit({
            variables: {
                username: values.username,
                name: values.name,
                email: values.email,
                password: values.password,
            },
            onCompleted() {
                navigate('/');
            },
        });
    };

    const state = (location.state ?? {}) as Record<string, string>;

    return (
        <Container
            title="Create a new account"
            subtitle={
                <span>
                    Or <Link to="/auth/sign-in">sign in to your existing account.</Link>
                </span>
            }
        >
            <Form
                defaultValues={{
                    name: state.name ?? '',
                    email: state.email ?? '',
                }}
                autoComplete="on"
                className="space-y-6"
                onSubmit={onFinish}
                disabled={isInFlight}
            >
                <Input
                    label="Username"
                    autoComplete="username"
                    name="username"
                    register={{ required: true }}
                    autoFocus
                />
                <Input label="Name" autoComplete="name" name="name" register={{ required: true }} />
                <Input
                    label="Email"
                    autoComplete="email"
                    name="email"
                    register={{ required: true }}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    register={{ required: true }}
                />

                <SubmitButton fullWidth>Sign Up</SubmitButton>
                <GithubButton />
            </Form>
        </Container>
    );
}
