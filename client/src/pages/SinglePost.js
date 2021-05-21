import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Form, Grid, Image, Icon, Label, Popup } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';


function SinglePost(props) {
    const postID = props.match.params.postID;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const [comment, setComment] = useState('');

    console.log(postID);

    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postID
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postID,
            body: comment
        }
    });

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } =
            getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            className="single-post-image"
                            src='https://semantic-ui.com/images/avatar/large/jenny.jpg'
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card className="single-post-card" fluid>
                            <Card.Content>
                                <Card.Header style={{ color: "teal " }}>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()} ago </Card.Meta>
                                <Card.Description style={{ color: "teal " }}>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}>
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postID={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card >
                        {user && (
                            <Card fluid className="comment-card">
                                <Card.Content>
                                    <h2 style={{ color: "teal" }}>Post a Comment</h2>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment} >Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card className="comment-card" fluid key={comment.id} centered style={{ color: "teal" }}>
                                <Card.Content>
                                    <Image
                                        className="comment-image"
                                        size="mini"
                                        floated="left"
                                        src="https://semantic-ui.com/images/avatar/large/jenny.jpg"
                                    />
                                    <Card.Header style={{ color: "teal" }}>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()} ago </Card.Meta>
                                    <Card.Description style={{ color: "teal " }}>{comment.body}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postID={id} commentID={comment.id} />
                                    )}
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postID: ID!, $body: String!){
        createComment(postID: $postID, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postID: ID!) {
        getPost(postID: $postID){
            id body createdAt username likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

export default SinglePost