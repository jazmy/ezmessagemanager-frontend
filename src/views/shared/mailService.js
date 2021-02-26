//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
// .. variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

//***Here we are developing a metod named as "sendAnEmail" that accepts 4 parameters and
//pass to the server by "POST" request.***

export const sendAnEmail = async (receipts_emails, from, subject, text, htmlgen) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//Here we are passing that parameters in the body of post request.
		const response = await axios.post(
			`${SERVER_URL}send-email`,
			{
				receipts_emails: receipts_emails,
				from: from,
				subject: subject,
				text: text,
				htmlgen: htmlgen,
				token: localStorage.getItem("x-auth-token")
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
		//Here we are catching the error, and returning it.
		return error;
	}
};

// here we are developing a metod named as "getEmailLogs" that gets email logs by the
//...server by "Get" request.
export const getEmailLogs = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}Email-Logs?_sort=id:desc`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});
		//We are getting response back from server and storing in variable named as "data"
		const data = await response.data;
		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

// here we are developing a metod named as "getEmailLogs" that gets email logs by the
//...server by "delete" request.
export const deleteEmailLogs = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}Email-Logs/${id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});
		//We are getting response back from server and storing in variable named as "data"
		const data = await response.data;
		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};
