import ApplicationLogo from "@/Components/ApplicationLogo";
import RightArrow from "../../../public/build/img/rightArrow.svg";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    LayoutDashboard,
    User2,
    BarChart2,
    ArrowRightLeft,
    LogOutIcon,
} from "lucide-react";
const navLinks = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        link: route("dashboard"),
        active: route().current("dashboard"),
    },
    {
        name: "Users",
        icon: User2,
        link: route("users.index"),
        active: route().current("users.index"),
    },
    {
        name: "Category",
        icon: ArrowRightLeft,
        link: "",
        active: "",
    },
    {
        name: "Transactions",
        icon: BarChart2,
        link: "",
        active: "",
    },
    {
        name: "Logout",
        icon: LogOutIcon,
        link: route("logout"),
        active: "",
    },
];
const varinats = {
    expended: { width: "20%" },
    nonExpended: { width: "5%" },
};
export default function NavigationBar(params) {
    const url = usePage();
    const [activeNavIndex, setActiveNavIndex] = useState(
        url.props.ziggy.location
    );
    const [isExpended, setIsExpended] = useState(true);
    return (
        <motion.div
            animate={isExpended ? "expended" : "nonExpended"}
            variants={varinats}
            className={
                "py-12 flex flex-col border border-r-1 w-1/5 h-screen sticky top-0" +
                (isExpended ? " px-10" : " px-4")
            }
        >
            <Link href={route("dashboard")}>
                <div className="logo-div flex space-x-3 item-center">
                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-950" />
                    <span className={isExpended ? "block" : "hidden"}>
                        Admin Panel
                    </span>
                </div>
            </Link>
            <div
                onClick={() => setIsExpended(!isExpended)}
                className="w-5 h-5 bg-gray-950 rounded-full absolute -right-[10.5px] top-20 flex items-center justify-center"
            >
                <img src={RightArrow} alt="icon" className="w-[5px]" />
            </div>
            <div className="mt-10 flex flex-col space-y-8">
                {navLinks.map((item, index) => (
                    <Link href={item.link} active={item.active}>
                        <div
                            key={index}
                            className={
                                "flex space-x-3 p-3 rounded" +
                                (activeNavIndex === item.link
                                    ? " bg-gray-950 text-white font-semibold"
                                    : "")
                            }
                            onClick={() => setActiveNavIndex(item.link)}
                        >
                            <item.icon />
                            <span className={isExpended ? "block" : "hidden"}>
                                {item?.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
