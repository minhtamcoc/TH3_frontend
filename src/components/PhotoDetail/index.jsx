import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import "./styles.css";

/*
  PhotoDetail:
  - Tries to fetch /api/photo/:photoId (single)
  - Fallback: fetch /api/photos and find by id (if available)
  - Displays photo, description, and comment list.
*/

function PhotoDetail() {
  const { photoId } = useParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(`https://vh455f-8081.csb.app/api/photo/${photoId}`);
        if (res.ok) {
          const p = await res.json();
          setPhoto(p);
          return;
        }
        // fallback: try photos endpoint that returns array and find by id
        const r2 = await fetch(`https://vh455f-8081.csb.app/api/photos`);
        if (r2.ok) {
          const arr = await r2.json();
          const found = Array.isArray(arr) ? arr.find(x => x._id === photoId) : null;
          if (found) setPhoto(found);
        }
      } catch (err) {
        console.error("Failed to fetch photo", err);
      }
    };
    if (photoId) fetchPhoto();
  }, [photoId]);

  if (!photo) {
    return <div style={{ padding: 20 }}>Photo not found or still loading...</div>;
  }

  return (
    <div className="photo-detail-root" style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <Card elevation={4}>
        <CardMedia component="img" image={photo.file || photo.url} alt={photo.name || "photo"} />
        <CardContent>
          <Typography variant="h6">{photo.name || ""}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{photo.description || ""}</Typography>

          <Typography variant="subtitle1" sx={{ mt:2, mb:1 }}>Comments</Typography>
          <List>
            {(photo.comments || []).map(c => (
              <ListItem key={c._id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={c.user && c.user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={c.comment || c.text} secondary={c.user && `${c.user.first_name} ${c.user.last_name}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default PhotoDetail;
