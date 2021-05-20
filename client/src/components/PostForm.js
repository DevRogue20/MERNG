import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {

    const [errors, setErrors] = useState({});
    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY,
            })
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [
                        result.data.createPost,
                        ...data.getPosts,
                    ],
                },
            })
            values.body = ''
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}  className="post-form">
                <Form.Field>
                    <h2 className="create-header">Create A Post:</h2>
                    <Form.Input
                        width={8}
                        className="post-text"
                        placeholder="Say something..."
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal" style={{ marginBottom: 30 }}>
                        Submit
                </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes {
                id username createdAt
            }
            likeCount
            comments {
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm;