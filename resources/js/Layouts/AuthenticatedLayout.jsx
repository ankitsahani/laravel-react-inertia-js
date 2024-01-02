import NavigationBar from "@/Components/NavigationBar";
import Nav from "@/Components/Nav";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function Authenticated({ user, permissions, header, children }) {
    
    const { flash } = usePage().props;
    useEffect(() => {
        // Check if there is a success flash message
        if (flash.success) {
            // Show a success toast
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <div className="w-full flex">
            {/* Navigation Bar */}
            <NavigationBar permissions={permissions}></NavigationBar>
            <div className="relative flex flex-1 flex-col">
                <Nav user={user}></Nav>
                <Toaster position="top-right" reverseOrder={false} />
                {/* Main Bar */}
                <main className="grow">{children}</main>
            </div>
        </div>
    );
}
