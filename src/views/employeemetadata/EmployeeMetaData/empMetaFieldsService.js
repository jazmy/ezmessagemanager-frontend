//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
//variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const addAnempMetaFields = async (field_name) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//Here we are passing that parameters in the body of post request.
		const response = await axios.post(
			`${SERVER_URL}employee-meta-fields`,
			{
				field_name: field_name
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
		//here we are catching the error, and returning it.
		return error;
	}
};

//***this method will send a get request to get all employee-meta-fields***
export const getEployeesMetaFields = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}employee-meta-fields?_sort=id:desc`, {
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
export const deleteEployeeMetaFields = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}employee-meta-fields/${id}`, {
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

export const updateAnempMetaFields = async (empMetaFieldsId, field_name) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = empMetaFieldsId;
		const response = await axios.put(
			`${SERVER_URL}employee-meta-fields/${id}`,
			{
				field_name: field_name
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
