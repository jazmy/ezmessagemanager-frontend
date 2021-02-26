//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
// .. variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

// here we are developing a metod named as "updateTemplate" that gets email logs by the
//...server by "PUT" request.
export const updateUserAccountByNameAndPassword = async (id, fullname, password) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.put(
			`${SERVER_URL}users/${id}`,
			{
				fullname: fullname,
				password: password
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

export const updateUserAccountName = async (id, fullname) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.put(
			`${SERVER_URL}users/${id}`,
			{
				fullname: fullname
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

export const aboutMe = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}users/me`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});
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

export const updateAvatar = async (id, avatar) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.put(
			`${SERVER_URL}users/${id}`,
			{
				avatar: avatar
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
