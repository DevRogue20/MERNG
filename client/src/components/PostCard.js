import React, { useContext } from 'react';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';


function PostCard({
    post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {
    const { user } = useContext(AuthContext);

    return (
        <Card fluid className="post-card" color="teal">
            <Card.Content>
                <Image floated='right' size='mini' src='https://semantic-ui.com/images/avatar/large/jenny.jpg' />
                <Card.Header style={{ color: "teal" }}>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)} ago </Card.Meta>
                <Card.Description style={{ color: "teal" }}>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }}/>
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='blue' basic>
                        <Icon name='comments' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                        {commentCount}
                    </Label>
                </Button>
                {user && user.username === username && <DeleteButton postID={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard;
