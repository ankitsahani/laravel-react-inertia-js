import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, usePage, useForm } from "@inertiajs/react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Index({ auth }) {
    const { users, flash } = usePage().props;

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const { delete: destroy, processing, reset } = useForm();
    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("user.destroy", e.currentTarget.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => "",
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users
                </h2>
            }
        >
            <Head title="Users" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Link
                            className="px-4 py-2 font-bold text-white bg-gray-950 rounded mx-5"
                            href={route("user.create")}
                        >
                            Create
                        </Link>
                        <p className="text-center px-4 py-2 font-bold">
                            Total Users :- {users.total}
                        </p>
                        <div className="p-6 text-gray-900">
                            <table className="table-auto hover:table-fixed min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                            #
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4">
                                                {index + users.from}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {moment(user.created_at).format(
                                                    "YYYY/MM/DD hh:mm:ss a"
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    className="px-6 py-2 font-bold text-white bg-gray-950 rounded mx-3"
                                                    href={route(
                                                        "user.edit",
                                                        user.id
                                                    )}
                                                >
                                                    Edit
                                                </Link>
                                                <DangerButton
                                                    onClick={
                                                        confirmUserDeletion
                                                    }
                                                >
                                                    Delete
                                                </DangerButton>
                                                <Modal
                                                    show={
                                                        confirmingUserDeletion
                                                    }
                                                    onClose={closeModal}
                                                >
                                                    <form
                                                        onSubmit={deleteUser}
                                                        className="p-6"
                                                        id={user.id}
                                                    >
                                                        <h2 className="text-lg font-medium text-gray-950">
                                                            Are you sure you
                                                            want to delete your
                                                            account?
                                                        </h2>
                                                        <div className="mt-6 flex justify-end">
                                                            <SecondaryButton
                                                                onClick={
                                                                    closeModal
                                                                }
                                                            >
                                                                Cancel
                                                            </SecondaryButton>

                                                            <DangerButton
                                                                className="ms-3"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Delete Account
                                                            </DangerButton>
                                                        </div>
                                                    </form>
                                                </Modal>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination className="mt-6" links={users.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
