import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import DashboardNew from "@/Components/Dashboard";

export default function Dashboard({ auth }) {
    const {totalUsers} = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
            permissions={auth.permissions}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <DashboardNew totalUsers={totalUsers}></DashboardNew>
        </AuthenticatedLayout>
    );
}
