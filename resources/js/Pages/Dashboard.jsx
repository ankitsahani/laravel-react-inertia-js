import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DashboardNew from "@/Components/Dashboard";
import { usePage } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    const {totalUsers} = usePage().props;
    return (
        <AuthenticatedLayout
            user={auth.user}
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
