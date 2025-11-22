import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import models from "../../modelData/models";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://vh455f-8081.csb.app/api/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        //console.log('User data:', data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);
  //const user = models.userModel(userId);

  if (!user) {
    return (
      <Typography variant="h6" color="error" sx={{ p: 2 }}>
        User not found
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {`${user.first_name} ${user.last_name}`}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Description:</strong> {user.description}
        </Typography>
        <Link
          component={RouterLink}
          to={`/photos/${userId}`}
          variant="body1"
          sx={{ mt: 2, display: "inline-block" }}
        >
          View Photos
        </Link>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
