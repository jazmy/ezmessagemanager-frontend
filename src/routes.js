import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "src/layouts/DashboardLayout";
import MainLayout from "src/layouts/MainLayout";
import LoginView from "src/views/auth/LoginView";
import RegisterView from "src/views/auth/RegisterView";
import AccountView from "src/views/account/AccountView";
import EmployeeListView from "src/views/employee/EmployeeListView";
import EmployeeMetaData from "src/views/employeemetadata/EmployeeMetaData";
import TagsListView from "src/views/tags/TagsListView";
import MailsListView from "src/views/mails/MailsListView";
import MailsDesignerView from "src/views/mailsdesigner/MailsDesignerView";
import ContactListView from "src/views/contactList/contactListView";
import MdRUDListView from "src/views/maildesignerRUD/mdRUDListView";
import EmployeeContactDetailsView from "src/views/employeecontactsdetailsview/EmployeeContactDetailsView";
import EmployeeDetailView from "src/views/employeedetails/EmployeeDetailView";
import EmailScheduleDetailsView from "src/views/emailschedules/EmailSchedulesDetailsView";
import SlackScheduleDetailsView from "src/views/slackSchedules/SlackSchedulesDetailsView";
import NotFoundView from "src/views/errors/NotFoundView";

//here are are actullay telling our app that on which url, which compoenent should we display!

const routes = [
	{
		path: "app",
		element:
			localStorage.getItem("x-auth-token") ? <DashboardLayout /> :
			<Navigate to="/login" />,
		children: [
			{ path: "account", element: <AccountView /> },
			{ path: "employees", element: <EmployeeListView /> },
			{ path: "mail-logs", element: <MailsListView /> },
			{ path: "tags", element: <TagsListView /> },
			{ path: "designer", element: <MailsDesignerView /> },
			{ path: "contact-list", element: <ContactListView /> },
			{ path: "email-schedules", element: <EmailScheduleDetailsView /> },
			{ path: "slack-schedules", element: <SlackScheduleDetailsView /> },
			{ path: "employee-metadata", element: <EmployeeMetaData /> },
			{ path: "contact-list/details/:id", element: <EmployeeContactDetailsView /> },
			{ path: "employee-details/:id", element: <EmployeeDetailView /> },
			{ path: "templates", element: <MdRUDListView /> }
		]
	},
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{ path: "login", element: <LoginView /> },
			{ path: "register", element: <RegisterView /> },
			{
				path: "/",
				element:
					localStorage.getItem("x-auth-token") ? <Navigate to="app/employees" /> :
					<Navigate to="/login" />
			},
			{ path: "*", element: <Navigate to="/404" /> }
		]
	}
];
export default routes;
