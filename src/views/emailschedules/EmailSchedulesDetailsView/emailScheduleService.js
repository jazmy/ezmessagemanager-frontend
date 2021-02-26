//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
//variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;
let CRON_SERVER_URL = process.env.REACT_APP_CRON_SERVER_URL;

export const addSchedule = async (contactlist_id, emailtemplate_id, date, timezone, time) => {
	//In try block, we will try to execute our logic if works fine.

	try {
		//Here we are passing that parameters in the body of post request.
		const response = await axios.post(
			`${SERVER_URL}email-schedules`,
			{
				contactlist_id: contactlist_id,
				emailtemplate_id: emailtemplate_id,
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

//***this method will send a get request to get all getAllEmailSchedules***
export const getAllEmailSchedules = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}email-schedules`, {
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
export const deleteEmailSchedulesById = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}email-schedules/${id}`, {
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

export const updateEmailSchedulesById = async (emailSchId, contactlist_id, emailtemplate_id, date, timezone, time) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = emailSchId;
		const response = await axios.put(
			`${SERVER_URL}email-schedules/${id}`,
			{
				contactlist_id: contactlist_id,
				emailtemplate_id: emailtemplate_id,
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
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

export const updateAnEmployeeForBulkTags = async (empId, tagsToStore) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = empId;
		const response = await axios.put(
			`${SERVER_URL}Employees/${id}`,
			{
				tags: tagsToStore
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
		console.log(error);
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
