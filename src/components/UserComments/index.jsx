import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";

/*
  UserComments view:
  - Fetches comments for a user from /api/commentsOfUser/:userId
  - For each comment shows small thumbnail of the photo and the comment text
  - Clicking on the comment or photo navigates to /photo/:photoId (PhotoDetail)
*/

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`https://vh455f-8081.csb.app/api/commentsOfUser/${userId}`);
        if (!res.ok) {
          console.error("Failed to fetch comments");
          setComments([]);
          return;
        }
        const data = await res.json();
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments", err);
        setComments([]);
      }
    };
    if (userId) fetchComments();
  }, [userId]);

  return (
    <div className="user-comments-root">
      <Typography variant="h5" sx={{ mb: 2 }}>Comments by user</Typography>
      <Grid container spacing={2}>
        {comments.map((c) => (
          <Grid item xs={12} sm={6} key={c._id}>
            <Card elevation={4} className="comment-card">
              <CardActionArea onClick={() => {
                if (c.photo && c.photo._id) {
                  navigate(`/photo/${c.photo._id}`);
                }
              }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={c.photo && (c.photo.file || c.photo.url)} 
                  alt="thumbnail"
                  className="comment-thumb"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {c.comment || c.text || ""}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p:2 }}>
            No comments found for this user.
          </Typography>
        )}
      </Grid>
    </div>
  );
}

export default UserComments;
