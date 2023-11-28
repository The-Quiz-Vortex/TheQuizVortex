import React, { useEffect, useState } from "react";
import { getUserByUsername } from "../../services/users.services.ts";
import { AppUser } from "../../common/interfaces.ts";

interface UserDetailsProps {
  username: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ username }) => {
  const [userDetails, setUserDetails] = useState<AppUser | null>(null);

  useEffect(() => {
    // Fetch user details when the component mounts
    getUserByUsername(username).then((user) => setUserDetails(user.val()));
  }, [username]);

  return (
    <div>
      <h2>User Details - {username}</h2>
      {userDetails && (
        <div>
          <p>First Name: {userDetails.firstName}</p>
          <p>Last Name: {userDetails.lastName}</p>
          <p>Email: {userDetails.email}</p>
          <p>Phone Number: {userDetails.phoneNumber}</p>
          <p>Role: {userDetails.role}</p>
          {/* Add more user details as needed */}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
