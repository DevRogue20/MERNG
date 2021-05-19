import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';


function DeleteButton({ postID, commentID, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentID ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy, result) {
            setConfirmOpen(false);
            if (!commentID) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY,

                });
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postID)
                    }
                });
            }
            if (callback) callback();
        },
        variables: {
            postID,
            commentID
        }
    })

    return (
        <>
            <Button
                as="div"
                color="red"
                floated="right"
                onClick={() => setConfirmOpen(true)} >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postID: ID!){
        deletePost(postID: $postID)
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postID: ID!, $commentID: ID!){
        deleteComment(postID: $postID, commentID: $commentID){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton