import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Edit({ auth }) {
    const { user } = usePage().props;

    const { data, setData, post, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        pic: "",
    });
    console.log(data);
    const [file, setFile] = useState(
        user.pic ? "http://localhost:8000/storage/users/" + user.pic : "http://localhost:8000/default.png"
    );
    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
        setData("pic", e.target.files[0]);
    }
    function handleSubmit(e) {
        e.preventDefault();
        post(route("user.update", user.id), data);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Edit
                </h2>
            }
        >
            <Head title="Users" />

            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Users
                </h2>
                <div className="my-6 font-semibold text-gray-700 dark:text-gray-200">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form
                                name="createForm"
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <div className="mb-6">
                                    <label
                                        className="block text-sm font-medium text-gray-900 dark:text-white"
                                        htmlFor="pic"
                                    >
                                        Upload file
                                    </label>
                                    <input
                                        type="file"
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        id="pic"
                                        name="pic"
                                        onChange={handleChange}
                                    />
                                    <p
                                        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                        id="file_input_help"
                                    >
                                        SVG, PNG, JPG or GIF (MAX. 800x400px).
                                    </p>
                                    <div className="max-w-sm">
                                        <img
                                            src={file}
                                            alt="img"
                                            className="h-auto rounded-lg"
                                        />
                                    </div>
                                    <span className="text-red-600">
                                        {errors.pic}
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Name
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            type="text"
                                            id="name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                            placeholder="John"
                                            name="name"
                                            value={data.name}
                                        />
                                        <span className="text-red-600">
                                            {errors.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        type="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                                        placeholder="john.doe@company.com"
                                        label="email"
                                        name="email"
                                        value={data.email}
                                    />
                                    <span className="text-red-600">
                                        {errors.email}
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <button
                                        type="submit"
                                        className="text-white bg-gray-950 hover:bg-gray-950 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-950 dark:focus:ring-gray-950"
                                    >
                                        Submit
                                    </button>
                                    <Link
                                        className="ml-2 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-3 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                        href={route("users.index")}
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
