import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText, Box, Chip, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

/*
  Enhanced UserList:
  - Shows two count bubbles per user:
    - Green: number of photos the user has (fetched from /api/photosOfUser/:id)
    - Red: number of comments authored by the user (tries /api/commentsOfUser/:id, fallback: count in photos)
  - Clicking red bubble navigates to /comments/:userId
*/

function UserList() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({}); // { userId: { photos: n, comments: m } }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://vh455f-8081.csb.app/api/user/list");
        if (!response.ok) {
          console.error("Failed to fetch user list");
          return;
        }
        const data = await response.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // For each user, fetch photos count and comment count
    users.forEach((user) => {
      const userId = user._id;
      // photos count
      fetch(`https://vh455f-8081.csb.app/api/photosOfUser/${userId}`)
        .then((r) => r.ok ? r.json() : [])
        .then((photos) => {
          setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), photos: Array.isArray(photos) ? photos.length : 0 } }));
        })
        .catch(() => {
          setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), photos: 0 } }));
        });

      // comments count: try dedicated endpoint first
      fetch(`https://vh455f-8081.csb.app/api/commentsOfUser/${userId}`)
        .then(async (r) => {
          if (r.ok) {
            const comments = await r.json();
            setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), comments: Array.isArray(comments) ? comments.length : 0 } }));
          } else {
            // fallback: fetch user's photos and count comments authored by user
            const resp = await fetch(`https://vh455f-8081.csb.app/api/photosOfUser/${userId}`);
            if (!resp.ok) {
              setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), comments: 0 } }));
              return;
            }
            const photos = await resp.json();
            // sum comments where comment.user._id === userId (or comment.user === userId)
            let cnt = 0;
            if (Array.isArray(photos)) {
              photos.forEach(p => {
                if (Array.isArray(p.comments)) {
                  p.comments.forEach(c => {
                    if (c.user && (c.user._id === userId || c.user === userId)) cnt++;
                  })
                }
              })
            }
            setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), comments: cnt } }));
          }
        })
        .catch(async () => {
          // network error fallback: same as above
          try {
            const resp = await fetch(`https://vh455f-8081.csb.app/api/photosOfUser/${userId}`);
            const photos = resp.ok ? await resp.json() : [];
            let cnt = 0;
            if (Array.isArray(photos)) {
              photos.forEach(p => {
                if (Array.isArray(p.comments)) {
                  p.comments.forEach(c => {
                    if (c.user && (c.user._id === userId || c.user === userId)) cnt++;
                  })
                }
              })
            }
            setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), comments: cnt } }));
          } catch (e) {
            setCounts((prev) => ({ ...prev, [userId]: { ...(prev[userId]||{}), comments: 0 } }));
          }
        });
    });
  }, [users]);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} className="userlist-root">
      {users.map((user) => {
        const c = counts[user._id] || {};
        return (
          <div key={user._id}>
            <ListItem
              component={Link}
              to={`/user/${user._id}`}
              sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, display: "flex", alignItems: "center", gap: 1, px: 1 }}
            >
              <Avatar alt={`${user.first_name}`} src={user.avatar} sx={{ mr: 1 }} />
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label={typeof c.photos === "number" ? c.photos : "..."} size="small" sx={{ bgcolor: "#e8f5e9", color: "#256029", fontWeight: 700 }} />
                <Chip
                  label={typeof c.comments === "number" ? c.comments : "..."}
                  size="small"
                  component={Link}
                  to={`/comments/${user._id}`}
                  sx={{ bgcolor: "#ffebee", color: "#9a0712", fontWeight: 700, textDecoration: "none" }}
                />
              </Box>
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );
}

export default UserList;
