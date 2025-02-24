import { withAuth } from "@/components/WithAuth.com";
import Link from "next/link";
import React from "react";

const Profile = () => {
  return (
    <div>
      <Link href="/upload">Super Secret Component</Link>
    </div>
  );
};

export default withAuth(Profile);
