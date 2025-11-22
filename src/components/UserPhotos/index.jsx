import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://vh455f-8081.csb.app/api/photosOfUser/${userId}`
        );
        setPhotos(await response.json());
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [userId]);

  console.log("Fetched photos:", photos);

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 2 }}>
        No photos found for this user
      </Typography>
    );
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {photos.map((photo) => (
        <Grid item xs={12} sm={6} key={photo._id}>
          <Card sx={{ maxWidth: 400, mx: "auto" }}>
            <CardMedia
              component="img"
              height="200"
              image={`/images/${photo.file_name}`}
              alt="User photo"
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong>{" "}
                {new Date(photo.date_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Comments:
              </Typography>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div key={comment._id} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Link
                        component={RouterLink}
                        to={`/user/${comment.user._id}`}
                        sx={{ textDecoration: "none", color: "primary.main" }}
                      >
                        {`${comment.user.first_name} ${comment.user.last_name}`}
                      </Link>
                      {" on "}
                      {new Date(comment.date_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {comment.comment}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserPhotos;
