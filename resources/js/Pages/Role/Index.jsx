import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, Head, usePage, useForm, router } from "@inertiajs/react";
import moment from "moment/moment";
import { useRef, useState } from "react";
import TextInput from "@/Components/TextInput";

export default function Index({ auth }) {
    const { roles } = usePage().props;
    const perpage = useRef();
    const willDelete = useRef();

    const [confirmingRoleDeletion, setConfirmingRoleDeletion] = useState(false);
    const [query, setQuery] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { delete: destroy, processing, reset } = useForm();
    const confirmRoleDeletion = (id) => {
        willDelete.current = id;
        setConfirmingRoleDeletion(true);
    };

    const deleteRole = (e) => {
        e.preventDefault();
        destroy(route("role.destroy", willDelete.current), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => "",
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingRoleDeletion(false);
        reset();
    };
    const handleSearch = async (query, perpage) => {
        setIsLoading(true);
        await router.get(
            route("roles.index"),
            {
                search: query,
                perpage: perpage,
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
    /*Handle PerPage change*/
    const handlePerPageChange = (e) => {
        perpage.current = e.target.value;
        handleSearch(query, e.target.value);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Roles
                </h2>
                <div className="my-0 font-semibold text-gray-700 dark:text-gray-200">
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
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"
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
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                                handleSearch(e.target.value, perpage.current);
                                            }}
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
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
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
                                        All Roles:
                                    </span>
                                    <span className="dark:text-white">
                                        {roles.total}
                                    </span>
                                </h5>
                            </div>
                            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                                <Link
                                    type="button"
                                    href={route("role.create")}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-gray-950 hover:bg-gray-1000 focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-950 focus:outline-none dark:focus:ring-gray-800"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        />
                                    </svg>
                                    Add new role
                                </Link>

                                <button
                                    type="button"
                                    className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-gray-950 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-950 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-950"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
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
                                    roles.data.map((role, index) => (
                                        <tr
                                            key={role.id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-950"
                                        >
                                            <td className="px-6 py-3">
                                                {index + roles.from}
                                            </td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {role.name}
                                            </th>
                                            <td className="px-6 py-3">
                                                {moment(role.created_at).format(
                                                    "YYYY/MM/DD hh:mm:ss a"
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <Link
                                                    className="px-6 py-2 font-bold text-white bg-gray-950 rounded mx-3"
                                                    href={route(
                                                        "role.edit",
                                                        role.id
                                                    )}
                                                >
                                                    Edit
                                                </Link>
                                                <DangerButton
                                                    onClick={() =>
                                                        confirmRoleDeletion(
                                                            role.id
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
                        <Pagination className="mt-6" links={roles} />
                    </div>
                </div>
            </div>
            <Modal show={confirmingRoleDeletion} onClose={closeModal}>
                <form onSubmit={deleteRole} className="p-6">
                    <h2 className="text-lg font-medium text-gray-950">
                        Are you sure you want to delete this role?
                    </h2>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="ms-3"
                            preserveScroll
                            preserveState
                            disabled={processing}
                        >
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
