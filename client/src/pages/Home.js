import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);
    const { user } = useContext(AuthContext);

    return (
        <Grid className="grid" container centered columns={1}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading posts..</h1>
                ) : (
                    <Transition.Group>
                        {posts &&
                            posts.map((post) => (
                                <Grid.Column key={post.id} style={{ marginBottom: 30 }}>
                                    <PostCard post={post} />
                                </Grid.Column>
                            ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    );

}

export default Home;