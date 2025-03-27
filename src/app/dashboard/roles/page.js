"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RolesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/roles/view");
  }, [router]);

  return null;
};

export default RolesPage;
