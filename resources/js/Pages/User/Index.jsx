import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, usePage, useForm, router } from "@inertiajs/react";
import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import TextInput from "@/Components/TextInput";

export default function Index({ auth }) {
    const { users } = usePage().props;
    const perpage = useRef(10);
    const willDelete = useRef();

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [query, setQuery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { delete: destroy, processing, reset } = useForm();
    const confirmUserDeletion = (id) => {
        willDelete.current = id;
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("user.destroy", willDelete.current), {
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
    const handleSearch = async () => {
        setIsLoading(true);
        await router.get(
            route("users.index"),
            {
                search: query,
                perpage: perpage.current,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };
    const handleReset = () => {
        setQuery("");
    };
    /*search record*/
    useEffect(() => {
        handleSearch();
        const debounceTimeout = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounceTimeout);
    }, [query]);
    /*Handle PerPage change*/
    const handlePerPageChange = (e) => {
        perpage.current = e.target.value;
        handleSearch();
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                            <div className="w-full md:w-1/2">
                                <form className="flex items-center">
                                    <div className="w-20">
                                        <select
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-5 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            name="perpage"
                                            id="perpage"
                                            onChange={handlePerPageChange}
                                            value={perpage.current}
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                fill="currentColor"
                                                viewbox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <TextInput
                                            type="text"
                                            id="simple-search"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            placeholder="Search"
                                            name="search"
                                            autoComplete="false"
                                            required=""
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="w-20">
                                        <button
                                            onClick={handleReset}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-5 p-[7px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="flex items-center flex-1 space-x-4">
                                <h5>
                                    <span className="text-gray-500">
                                        All Users:
                                    </span>
                                    <span className="dark:text-white">
                                        {users.total}
                                    </span>
                                </h5>
                            </div>
                            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                                <Link
                                    type="button"
                                    href={route("user.create")}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gray-950 hover:bg-gray-1000 focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-950 focus:outline-none dark:focus:ring-gray-800"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 mr-2"
                                        fill="currentColor"
                                        viewbox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            clip-rule="evenodd"
                                            fill-rule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        />
                                    </svg>
                                    Add new user
                                </Link>

                                <button
                                    type="button"
                                    className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-gray-950 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-950 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-950"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewbox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                    Export
                                </button>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-950 uppercase bg-gray-50 dark:bg-gray-950 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr className="" aria-colspan={5}>
                                        <td>Loading....</td>
                                    </tr>
                                ) : (
                                    users.data.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-950"
                                        >
                                            <td className="px-6 py-3">
                                                {index + users.from}
                                            </td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {user.name}
                                            </th>
                                            <td className="px-6 py-3">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-3">
                                                {moment(user.created_at).format(
                                                    "YYYY/MM/DD hh:mm:ss a"
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
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
                                                    onClick={() =>
                                                        confirmUserDeletion(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </DangerButton>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination className="mt-6" links={users} />
                    </div>
                </div>
            </div>
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-950">
                        Are you sure you want to delete your account?
                    </h2>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton className="ms-3" preserveScroll preserveState disabled={processing}>
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
