//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
// .. variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const storeTemplate = async (templatename, subject, shortmessage, longmessage, templatedesign) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//Here we are passing that parameters in the body of post request.
		const response = await axios.post(
			`${SERVER_URL}email-templates`,
			{
				templatename: templatename,
				subject: subject,
				shortmessage: shortmessage,
				longmessage: longmessage,
				templatedesign: templatedesign
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
export const getEmailTemplates = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}email-templates?_sort=id:desc`, {
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
//...server by "DELETE" request.
export const deleteEmailTemplate = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}email-templates/${id}`, {
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

// here we are developing a metod named as "updateTemplate" that gets email logs by the
//...server by "PUT" request.
export const updateEmailTemplate = async (
	id,
	templatename,
	subject,
	shortmessage,
	longmessage,
	templatedesigntoSend
) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.put(
			`${SERVER_URL}email-templates/${id}`,
			{
				templatename: templatename,
				subject: subject,
				shortmessage: shortmessage,
				longmessage: longmessage,
				templatedesign: templatedesigntoSend
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

//***this method will send a get request to get all employee-meta-fields***
export const getEployeesMetaFields = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}employee-meta-fields`, {
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
