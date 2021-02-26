//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";
import { WebClient, LogLevel } from "@slack/web-api";
//We are initilizing a variable "SERVER_URL" component here, that is getting value
//variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

let CRON_SERVER_URL = process.env.REACT_APP_CRON_SERVER_URL;
let SlackToken = process.env.REACT_APP_Slack_Token;

export const addSchedule = async (emailtemplate_id, contactlist_id, date, timezone, time) => {
	//In try block, we will try to execute our logic if works fine.

	try {
		//Here we are passing that parameters in the body of post request.
		const response = await axios.post(
			`${SERVER_URL}slack-schedules`,
			{
				emailtemplate_id: emailtemplate_id,
				contactlist_id: contactlist_id,
				date: date,
				timezone: timezone,
				time: time,
				completed: false
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);
		//We are getting response back from server and storing in variable named as "data"
		const data = await response;
		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//here we are catching the error, and returning it.
		return error;
	}
};

//***this method will send a get request to get all getAllslackSchedules***
export const getAllSlackSchedules = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}slack-schedules`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//we are getting response back from server and storing in variable named as "data"
		const data = await response.data;

		//here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);

		//here we are catching the error, and returning it.
		return error;
	}
};

//***here we are sending a delete request and it will require an ID of a user***
export const deleteSlackSchedulesById = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}slack-schedules/${id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//We are getting response back from server and storing in variable named as "data"
		const data = await response.data;
		//Here we are returing our variable that we will listen from the components
		//By which this service is being called.So if we will get data back that would mean that a
		//User has successfully deleted
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

export const updateSlackSchedulesById = async (slackSchId, emailtemplate_id, contactlist_id, date, timezone, time) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = slackSchId;
		const response = await axios.put(
			`${SERVER_URL}slack-schedules/${id}`,
			{
				emailtemplate_id: emailtemplate_id,
				contactlist_id: contactlist_id,
				date: date,
				timezone: timezone,
				time: time
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);
		//We are getting response back from server and storing in variable named as "data"
		const data = await response;
		//Here we are returing our variable that we will listen from the components
		//by which this service is being called.
		return data;
	} catch (error) {
		//Here we are catching the error, and returning it.
		return error;
	}
};

export const refresh_cron = async () => {
	try {
		await axios.get(`${CRON_SERVER_URL}api/refresh-cron`);
	} catch (error) {
		console.log(error);
	}
};

// const client = new WebClient(SlackToken, {
// 	// LogLevel can be imported and used to make debugging simpler
// 	logLevel: LogLevel.DEBUG
// });

// export const getAllSlackMembers = async () => {
// 	try {
// 		// Call the users.list method using the WebClient
// 		const result = await client.users.list();
// 		if (result.ok === true) {
// 			let filtered_members = result.members.filter((rs) => rs.is_bot === false && rs.id != "USLACKBOT");
// 			let members_data = filtered_members.map((mm) => ({
// 				id: mm.id,
// 				userName: mm.real_name
// 				// image: mm.profile.image_original
// 			}));
// 			// console.log(members_data);
// 			return members_data;
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
