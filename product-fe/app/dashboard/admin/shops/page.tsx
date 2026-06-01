"use client";

import dynamic from "next/dynamic";

const AdminShopsClient = dynamic(
    () => import("./AdminShopsClient"),
    { ssr: false }
);

export default function AdminShopsPage() {
    return <AdminShopsClient />;
}
