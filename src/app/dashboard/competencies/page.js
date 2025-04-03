"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard.module.scss";

export default function CompetenciesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the view competencies page
    router.push("/dashboard/competencies/view");
  }, [router]);

  return <div>Redirecting...</div>;
}
