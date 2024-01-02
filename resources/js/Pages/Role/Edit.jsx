import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Edit({ auth }) {
    const { permission_groups,role } = usePage().props;
    const [checkPermissionAll, setCheckPermissionAll] = useState(false);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        setPermissions(permission_groups);
    }, [permission_groups]);

    const handleCheckPermissionAll = () => {
        const updatedPermissions = permissions.map((group) => ({
            ...group,
            isChecked: !checkPermissionAll,
            permissions: group.permissions.map((permission) => ({
                ...permission,
                isChecked: !checkPermissionAll,
            })),
        }));
        // Update the permissions field in data with the new checked values
        const newpermissions = updatedPermissions.map((g) => g.permissions.filter((p) => p.isChecked)).flat()
        setData(
            "permissions",
            newpermissions.map((p) => p.name).flat()
        );
        
        setPermissions(updatedPermissions);
        setCheckPermissionAll(!checkPermissionAll);
    };
    const handleCheckSubparentAll = (groupId) => {
        const updatedPermissions = permissions.map((group) => {
            if (group.id === groupId) {
                return {
                    ...group,
                    permissions: group.permissions.map((permission) => ({
                        ...permission,
                        isChecked: !group.isChecked,
                    })),
                    isChecked: !group.isChecked,
                };
            }

            return group;
        });
        // Update the permissions field in data with the new checked values
        const newpermissions = updatedPermissions.map((g) => g.permissions.filter((p) => p.isChecked)).flat();
        setData(
            "permissions",
            newpermissions.map((p) => p.name).flat()
        );
        setPermissions(updatedPermissions);
        setCheckPermissionAll(
            updatedPermissions.every((group) => group.isChecked)
        );
    };

    const handleCheckboxChange = (groupId, permissionId) => {
        const updatedPermissions = permissions.map((group) => {
            if (group.id === groupId) {
                const updatedGroup = {
                    ...group,
                    permissions: group.permissions.map((permission) => {
                        if (permission.id === permissionId) {
                            return {
                                ...permission,
                                isChecked: !permission.isChecked,
                            };
                        }
                        return permission;
                    }),
                    isChecked: group.permissions.every(
                        (permission) => permission.isChecked
                    ),
                };
                return updatedGroup;
            }

            return group;
        });
        const newpermissions = updatedPermissions.map((g) => g.permissions.filter((p) => p.isChecked)).flat()
        // Update the permissions field in data with the new checked values
        setData(
            "permissions",
            newpermissions.map((p) => p.name).flat()
        );
        setPermissions(updatedPermissions);
        setCheckPermissionAll(
            updatedPermissions.every((group) => group.isChecked)
        );
    };
    const { data, setData, put, errors } = useForm({
        name: role.name || "",
        permissions: []
    });
    function handleSubmit(e) {
        e.preventDefault();
        put(route("role.update", role.id), data);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            permissions={auth.permissions}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />
            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Roles Edit
                </h2>
                <div className="my-0 font-semibold text-gray-700 dark:text-gray-200">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            htmlFor="name"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                            placeholder="John"
                                            label="Name"
                                            name="name"
                                            value={role.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <span className="text-red-600">
                                            {errors.name}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            htmlFor="checkPermissionAll"
                                        >
                                            All
                                            <input
                                                type="checkbox"
                                                checked={checkPermissionAll}
                                                onChange={
                                                    handleCheckPermissionAll
                                                }
                                                className="w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <tbody>
                                        {permissions.map((group, i) => (
                                            <tr
                                                key={group.id}
                                                className="bg-white dark:bg-gray-800 dark:border-gray-950"
                                            >
                                                <th
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                >
                                                    <h2 className="mt-2 mb-4 font-semibold text-gray-900 dark:text-white">
                                                        {group.name}
                                                        <input
                                                            type="checkbox"
                                                            value={
                                                                group.isChecked
                                                            }
                                                            checked={
                                                                group.isChecked
                                                            }
                                                            onChange={() =>
                                                                handleCheckSubparentAll(
                                                                    group.id
                                                                )
                                                            }
                                                            className="w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />
                                                    </h2>
                                                </th>
                                                <th>
                                                    <ul className="mt-3 w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                        {group?.permissions?.map(
                                                            (permission, i) => (
                                                                <li
                                                                    className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                >
                                                                    <div className="flex items-center ps-3">
                                                                        <input
                                                                            id={
                                                                                "permission" +
                                                                                permission.id
                                                                            }
                                                                            value={
                                                                                permission.name
                                                                            }
                                                                            type="checkbox"
                                                                            name="permissions[]"
                                                                            checked={
                                                                                permission.isChecked
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setData(
                                                                                    "permissions",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                                handleCheckboxChange(
                                                                                    group.id,
                                                                                    permission.id
                                                                                );
                                                                            }}
                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={
                                                                                "permission" +
                                                                                permission.id
                                                                            }
                                                                            key={
                                                                                permission.id
                                                                            }
                                                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                                        >
                                                                            {
                                                                                permission.name
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </th>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-gray-950 hover:bg-gray-950 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-950 dark:focus:ring-gray-950"
                                    >
                                        Save
                                    </button>
                                    <Link
                                        className="ml-2 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                        href={route("roles.index")}
                                    >
                                        Back
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
