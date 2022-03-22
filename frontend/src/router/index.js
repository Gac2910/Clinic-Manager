import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Patients from "@/views/Patients";
import Doctors from "@/views/Doctors";
import Appointments from "@/views/Appointments";
import User from "@/views/User";
import AllUsers from "@/views/AllUsers";

global.baseURL = 'http://localhost:8888';

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/Patients",
		name: "Patients",
		component: Patients
	},
	{
		path: "/Doctors",
		name: "Doctors",
		component: Doctors
	},
	{
		path: "/Appointments",
		name: "Appointments",
		component: Appointments
	},
	{
		path: "/User",
		name: "User",
		component: User
	},
	{
		path: "/AllUsers",
		name: "AllUsers",
		component: AllUsers
	}
];

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
});

export default router